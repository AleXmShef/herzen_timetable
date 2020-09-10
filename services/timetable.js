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

module.exports = {
    getFaculties,
    getTypes,
    getLevels
}