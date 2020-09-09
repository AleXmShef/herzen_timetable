const express = require('express');
const router = express.Router();
const axios = require('axios');
const parser = require('html-to-json-data');
const { group, text, number, href, src, uniq, attr } = require('html-to-json-data/definitions');
const fs = require('fs')

// @route   GET api/timetable/faculty
// @args    NONE
// @access  Public
// @desc    Get all faculties
router.get('/faculty', async (req, res) => {
    try {
        const faculties_raw = await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
        const faculties_processed = await parser(faculties_raw.data, {
            faculties: group('.body div h3', {
                faculty: text('a')
            })
        });
        if(!faculties_processed) {
            res.status(500).json({error: "Cannot fetch any data"});
        }
        res.json(faculties_processed);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// @route   GET api/timetable/type
// @args    "faculty" - faculty name
// @access  Public
// @desc    Get education types for given faculty
router.get('/type', async (req, res) => {
    if(!req.body.faculty) {
        console.log(req.body);
        return res.status(400).json({message: "No faculty specified"});
    }
    try {
        const types_raw = await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
        const types_processed = await parser(types_raw.data, {
            types: group(`h3:contains(${req.body.faculty}) + div h4`, {
                type: text(':self'),
            })
        });
        if(!types_processed) {
            res.status(500).json({error: "Cannot fetch any data"});
        }
        res.json(types_processed);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }

});

// @route   GET api/timetable/level
// @args    "faculty" - faculty name, "type" - education type
// @access  Public
// @desc    Get education levels for given faculty & education type
router.get('/level', async (req, res) => {
    if(!req.body.faculty || !req.body.type) {
        console.log(req.body);
        return res.status(400).json({message: "Invalid data"});
    }
    try {
        const levels_raw = await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
        const levels_processed = await parser(levels_raw.data, {
            levels: group(`h3:contains(${req.body.faculty}) + div h4:contains(${req.body.type}) + ul li`, {
                level: text(':self'),
            })
        });
        if(!levels_processed) {
            res.status(500).json({error: "Cannot fetch any data"});
        }
        let levels = [];
        const candidates = levels_processed.levels;
        candidates.forEach(candidate => {
            const bachelor_re = /бакалавриат/;
            const masters_re = /магистратура/;

            if(bachelor_re.test(candidate.level) && levels.length < 1)
                levels.push({level: "бакалавриат"})
            if(masters_re.test(candidate.level) && levels.length < 2)
                levels.push({level: "магистратура"})
        })
        levels = {levels: levels};
        res.json(levels);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// @route   GET api/timetable/program
// @args    "faculty" - faculty name, "type" - education type, "level" - education level
// @access  Public
// @desc    Get education programs for given faculty, education type & level
router.get('/program', async (req, res) => {
    if(!req.body.faculty || !req.body.type || !req.body.level) {
        console.log(req.body);
        return res.status(400).json({message: "Invalid data"});
    }
    try {
        const program_links_raw = await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
        const program_links_processed = await parser(program_links_raw.data, {
            programs: group(`h3:contains(${req.body.faculty}) + div h4:contains(${req.body.type}) + ul li:contains(${req.body.level})`, {
                link: attr('button', 'onclick'),
            })
        });
        let programs = [];
        program_links_processed.programs.forEach(program => {
            const re = /'*'/
            let res = program.link.toString().split(re);
            programs.push(res[1]);
        });
        for (let i = 0; i < programs.length; i++) {
            const program_raw = await axios.get('https://guide.herzen.spb.ru' + programs[i]);
            const program_processed = await parser(program_raw.data, {
                program: text('table tr td:contains(Направление) + td + td + td')
            })
            programs[i] = program_processed;
        }
        res.json({programs: programs});
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

// @route   GET api/timetable/all
// @args    NONE
// @access  Public
// @desc    Get all timetable in a single json
router.get('/all', async (req, res) => {
    try {
        let timetable = {};
        const faculties_raw = await axios.get('https://guide.herzen.spb.ru/static/schedule.php');
        const faculties_processed = await parser(faculties_raw.data, {
            faculties: group('.body div h3', {
                faculty: text('a')
            })
        });
        let faculties = faculties_processed.faculties;
        for (let i = 0; i < faculties.length; i++) {
            const types_processed = await parser(faculties_raw.data, {
                types: group(`h3:contains(${faculties[i].faculty}) + div h4`, {
                    type: text(':self'),
                })
            });
            let types = types_processed.types;
            for(let j = 0; j < types.length; j++) {
                const levels_processed = await parser(faculties_raw.data, {
                    levels: group(`h3:contains(${faculties[i].faculty}) + div h4:contains(${types[j].type}) + ul li`, {
                        level: text(':self'),
                    })
                });
                let levels = [];
                const candidates = levels_processed.levels;
                candidates.forEach(candidate => {
                    const bachelor_re = /бакалавриат/;
                    const masters_re = /магистратура/;

                    if(bachelor_re.test(candidate.level) && levels.length < 1)
                        levels.push({level: "бакалавриат"})
                    if(masters_re.test(candidate.level) && levels.length < 2)
                        levels.push({level: "магистратура"})
                })
                for(let k = 0; k < levels.length; k++) {
                    const programs_processed = await parser(faculties_raw.data, {
                        programs: group(`h3:contains(${faculties[i].faculty}) + div h4:contains(${types[j].type}) + ul li:contains(${levels[k].level})`, {
                            link: attr('button', 'onclick'),
                        })
                    });
                    let programs = [];
                    let subprograms_yearly_links = [];
                    programs_processed.programs.forEach(program => {
                        const re = /'*'/
                        let res = program.link.toString().split(re);
                        subprograms_yearly_links.push(res[1]);
                    });
                    for (let l = 0; l < subprograms_yearly_links.length; l++) {
                        const program_raw = await axios.get('https://guide.herzen.spb.ru' + subprograms_yearly_links[l]);
                        const program_processed = await parser(program_raw.data, {
                            program: text('table tr td:contains(Направление) + td + td + td')
                        })
                        const subprogram_processed = await parser(program_raw.data, {
                            subprogram: text('table tr:contains(Направление) + tr td + td + td + td')
                        })
                        let group_raw = await parser(program_raw.data, {
                            year: text('table tr td:contains(Группа) + td + td + td')
                        })
                        group_raw = group_raw.year.split('/');
                        const year_processed = "20" + group_raw[1];
                        const group_processed = group_raw[0];
                        if(!programs.some(program => program.program === program_processed.program)) {
                            programs.push({
                                program: program_processed.program,
                                subprograms: [
                                    {
                                        subprogram: subprogram_processed.subprogram,
                                        years: [
                                            {
                                                year: year_processed,
                                                groups: [
                                                    {
                                                        group: group_processed,
                                                        link: subprograms_yearly_links[l]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                        else if(!(programs[programs.findIndex(program => program.program === program_processed.program)].
                        subprograms.some(subprogram => subprogram.subprogram === subprogram_processed.subprogram))) {
                            programs[programs.findIndex(program => program.program === program_processed.program)].subprograms.push({
                                subprogram: subprogram_processed.subprogram,
                                years: [
                                    {
                                        year: year_processed,
                                        groups: [
                                            {
                                                group: group_processed,
                                                link: subprograms_yearly_links[l]
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                        else if (!(programs[programs.findIndex(program => program.program === program_processed.program)].
                            subprograms[programs[programs.findIndex(program => program.program === program_processed.program)].subprograms.findIndex(subprogram => subprogram.subprogram === subprogram_processed.subprogram)].
                            years.some(year => year.year === year_processed))
                        ) {
                            programs[programs.findIndex(program => program.program === program_processed.program)].
                                subprograms[programs[programs.findIndex(program => program.program === program_processed.program)].subprograms.findIndex(subprogram => subprogram.subprogram === subprogram_processed.subprogram)].years.push({
                                year: year_processed,
                                groups: [
                                    {
                                        group: group_processed,
                                        link: subprograms_yearly_links[l]
                                    }
                                ]
                            })
                        }
                        else {
                            programs[programs.findIndex(program => program.program === program_processed.program)].
                                subprograms[programs[programs.findIndex(program => program.program === program_processed.program)].subprograms.findIndex(subprogram => subprogram.subprogram === subprogram_processed.subprogram)].
                            years[programs[programs.findIndex(program => program.program === program_processed.program)].
                                subprograms[programs[programs.findIndex(program => program.program === program_processed.program)].subprograms.findIndex(subprogram => subprogram.subprogram === subprogram_processed.subprogram)].years.findIndex(year => year.year === year_processed)].groups.push({
                                group: group_processed,
                                link: subprograms_yearly_links[l]
                            })
                        }
                        console.log(faculties[i].faculty + "\n" +
                                    types[j].type + "\n" +
                                    levels[k].level + "\n" +
                                    program_processed.program + "\n" +
                                    subprogram_processed.subprogram + "\n" +
                                    year_processed + "\n" +
                                    group_processed
                        );
                    }
                    levels[k].programs = programs;
                }
                types[j].levels = levels;
            }
            faculties[i].types = types;
        }
        timetable.timetable = faculties;
        const __data = JSON.stringify(timetable);
        fs.writeFileSync('timetable.json', __data);
        res.json(timetable);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});



module.exports = router;