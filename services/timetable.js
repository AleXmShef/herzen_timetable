const parser = require('html-to-json-data');
const { group, text, number, href, src, uniq, attr } = require('html-to-json-data/definitions');
const fs = require('fs');

const TimetableRequests = require('../requests/timetable');

const getFaculties = async function() {
    try {
        const faculties_raw = await TimetableRequests.getGlobal();
        const faculties_processed = await parser(faculties_raw.data, {
            faculties: group('.body div h3', {
                faculty: text('a')
            })
        });
        if(!faculties_processed) {
            throw Error('Error while parsing faculties');
        }
        return faculties_processed;
    } catch (e) {
        console.log(e);
        throw Error('Error while fetching faculties');
    }
}

const getTypes = async function(faculty) {
    try {
        const types_raw = await TimetableRequests.getGlobal();
        const types_processed = await parser(types_raw.data, {
            types: group(`h3:contains(${faculty}) + div h4`, {
                type: text(':self'),
            })
        });
        if(!types_processed) {
            throw Error('Error while parsing types');
        }
        return types_processed;
    } catch (e) {
        console.log(e);
        throw Error('Error while fetching types');
    }
}

const getLevels = async function(faculty, type) {
    try {
        const levels_raw = await TimetableRequests.getGlobal();
        const levels_processed = await parser(levels_raw.data, {
            levels: group(`h3:contains(${faculty}) + div h4:contains(${type}) + ul li`, {
                level: text(':self'),
            })
        });
        if(!levels_processed) {
            throw Error('Error while parsing levels')
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
        return levels;
    } catch (e) {
        console.log(e);
        throw Error('Error while fetching levels');
    }
}

const getProgramLinks = async function(faculty, type, level) {
    try {
        const program_links_raw = await TimetableRequests.getGlobal();
        const program_links_parced = await parser(program_links_raw.data, {
            programs: group(`h3:contains(${faculty}) + div h4:contains(${type}) + ul li:contains(${level})`, {
                link: attr('button', 'onclick'),
            })
        });
        let program_links_processed = [];
        program_links_parced.programs.forEach(program => {
            const re = /'*'/
            let link = program.link.toString().split(re);
            program_links_processed.push(link[1]);
        })
        return program_links_processed;
    } catch (e) {
        console.log(e);
        throw Error('Error while fetching program links');
    }
}

const getPrograms = async function(group_links) {
    try {
        let groups_raw = await TimetableRequests.getGroups(group_links);
        let groups_processed = [];
        for (const group_raw of groups_raw) {
            groups_processed.push(await parser(group_raw.data, {
                program: text('table tr td:contains(Направление) + td + td + td'),
                subprogram: text('table tr:contains(Направление) + tr td + td + td + td'),
                group: text('table tr td:contains(Группа) + td + td + td'),
                link: group_links[groups_raw.indexOf(group_raw)]
            }));
            let temp = groups_processed[groups_raw.indexOf(group_raw)].group.split('/');
            groups_processed[groups_raw.indexOf(group_raw)].group = temp[0];
            groups_processed[groups_raw.indexOf(group_raw)].year = '20' + temp[1];
        }
        let programs = [];
        groups_processed.forEach(group_processed=> {
            let programIndex = programs.findIndex(program => program.program === group_processed.program);
            if(programIndex !== -1) {
                let subprogramIndex = programs[programIndex].subprograms.findIndex(subprogram => subprogram.subprogram === group_processed.subprogram);
                if(subprogramIndex !== -1) {
                    let yearIndex = programs[programIndex].subprograms[subprogramIndex].years.findIndex(year => year.year === group_processed.year);
                    if(yearIndex !== -1) {
                        programs[programIndex].subprograms[subprogramIndex].years[yearIndex].groups.push({
                            group: group_processed.group,
                            link: group_links[groups_processed.indexOf(group_processed)]
                        })
                    }
                    else {
                        programs[programIndex].subprograms[subprogramIndex].years.push({
                            year: group_processed.year,
                            groups: [{
                                group: group_processed.group,
                                link: group_links[groups_processed.indexOf(group_processed)]
                            }]
                        })
                    }
                }
                else {
                    programs[programIndex].subprograms.push({
                        subprogram: group_processed.subprogram,
                        years: [{
                            year: group_processed.year,
                            groups: [{
                                group: group_processed.group,
                                link: group_links[groups_processed.indexOf(group_processed)]
                            }]
                        }]
                    })
                }
            }
            else {
                programs.push({
                    program: group_processed.program,
                    subprograms: [{
                        subprogram: group_processed.subprogram,
                        years: [{
                            year: group_processed.year,
                            groups: [{
                                group: group_processed.group,
                                link: group_links[groups_processed.indexOf(group_processed)]
                            }]
                        }]
                    }]
                })
            }

        })
        return {programs: programs};
    } catch (e) {
        console.log(e);
        throw Error('Error while fetching timetable');
    }
}

module.exports = {
    getFaculties,
    getTypes,
    getLevels,
    getProgramLinks,
    getPrograms
}