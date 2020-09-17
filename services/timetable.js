const parser = require('html-to-json-data');
const { group, text, attr , href} = require('html-to-json-data/definitions');
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

const getGroupTimetable = async function (groupURL) {
    try {
        const timetable_raw = await TimetableRequests.getGroup(groupURL);
        const timetable_parsed = parser(timetable_raw.data, {
            rows: group('.schedule tbody + tbody tr', {
                info_columns: group('th', {
                    text: text(':self'),
                    attr: attr(':self', 'class')
                }),
                group_columns: group('td', {
                    text: text(':self'),
                    links: group('strong a', {
                        link: href(':self', '')
                    })
                })
            })
        });
        let timetable_processed = {days: []};
        let current_day = -1;
        let current_hour = -1;
        let current_week = -1;
        timetable_parsed.rows.forEach(row => {
            const parseClasses = function (day, hour, week, group) {
                let str = row.group_columns[group].text;
                let iterator = 0;
                while(true) {
                    if(str.length < 2)
                        break;
                    if(str === '—') {
                        timetable_processed.days[current_day].hours[current_hour].weeks[current_week].classes.push({
                            type: "empty"
                        });
                        break;
                    }
                    let class_name = str.substring(0, str.search(/\[/));
                    str = str.slice(str.search(/\[/), str.length);

                    let class_type = str.substring(0, str.search(/]/) + 1);
                    str = str.slice(str.search(/]/) + 2, str.length);

                    let class_dates_raw = str.substring(0, str.search(/\)/) + 1);
                    class_dates_raw = class_dates_raw.substring(1, class_dates_raw.length - 1);
                    if(class_dates_raw.includes('студ'))
                        class_dates_raw = class_dates_raw.substring(0, class_dates_raw.search(/, [0-9]* студ/));
                    let class_dates = [];
                    class_dates.push({dates_raw: class_dates_raw});
                    class_dates_raw = class_dates_raw.split(',');
                    class_dates_raw.forEach(date => {
                        if(date.includes('—') || date.includes('-')) {
                            let borders = date.split(/[—-]/);
                            let begin = borders[0].split('.');
                            begin = new Date(2020, parseInt(begin[1]) - 1, parseInt(begin[0])).getTime();
                            let end = borders[1].split('.');
                            end = new Date(2020, parseInt(end[1]) - 1, parseInt(end[0])).getTime();
                            class_dates.push({
                                type: 'interval',
                                begin: begin,
                                end: end
                            })
                        }
                        else {
                            let _date = date.split('.');
                            _date = new Date(2020, parseInt(_date[1]) - 1, parseInt(_date[0])).getTime();
                            class_dates.push({
                                type: 'singular',
                                date: _date
                            })
                        }
                    })
                    str = str.slice(str.search(/\)/) + 2, str.length);

                    let class_teacher = str.substring(0, str.search(/,/));
                    str = str.slice(str.search(/,/) + 2, str.length);

                    let class_place = 0;

                    if(str.search(/[а-я0-9][а-я]*[А-Я]/) > -1) {
                        let match = str.match(/[а-я0-9][а-я]*[А-Я]/);
                        let index = match.index + match[0].length - 1;
                        class_place = str.substring(0, index);
                        str = str.slice(index, str.length);
                    }
                    else {
                        if(str.search(/идео-лекция/) > -1)
                            str = "В" + str;
                        class_place = str;
                        str = "";
                    }
                    let moodle_link = "none";
                    if(row.group_columns[group].links && row.group_columns[group].links[iterator])
                        moodle_link = row.group_columns[group].links[iterator].link;
                    timetable_processed.days[current_day].hours[current_hour].weeks[current_week].classes.push({
                        class: class_name,
                        type: class_type,
                        moodle_link: moodle_link,
                        dates: class_dates,
                        teacher: class_teacher,
                        place: class_place
                    })
                    iterator++;
                }
            }
            for(const column of row.info_columns) {
                if(column.attr === "dayname") {
                    timetable_processed.days.push({
                        day: column.text,
                        hours: []
                    });
                    current_day++;
                    current_hour = -1;
                    break;
                }
                else if(column.text.match(/:/)) {
                    let temp = column.text;
                    temp = temp.split(" — ");
                    for(let i = 0; i < temp.length; i++) {
                        let temp2 = temp[i].split(":")
                        for(let j = 0; j < temp2.length; j++) {
                            if(temp2[j].length < 2)
                                temp2[j] = "0" + temp2[j];
                        }
                        temp[i] = temp2[0] + ":" + temp2[1];
                    }
                    temp = temp[0] + " — " + temp[1];

                    timetable_processed.days[current_day].hours.push({
                        timespan: temp,
                        weeks: [{
                            classes: []
                        }]
                    })
                    current_hour++;
                    current_week = 0;
                    parseClasses(current_day, current_hour, current_week, 0);
                }
                else if(column.text === "Н") {
                    timetable_processed.days[current_day].hours[current_hour].weeks.push({
                        classes: []
                    })
                    current_week++;
                    parseClasses(current_day, current_hour, current_week, 0);
                }
            }
        })
        return timetable_processed;
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
    getPrograms,
    getGroupTimetable
}