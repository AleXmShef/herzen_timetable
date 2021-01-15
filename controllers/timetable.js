const TimetableServices = require('../services/timetable');
const fs = require('fs');

const getFaculties = async function (req, res) {
    try {
        const faculties = await TimetableServices.getFaculties();
        res.status(200).json(faculties);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getTypes = async function (req, res) {
    let faculty = req.query.faculty;
    if(!faculty) {
        res.status(500).json({status: 500, message: 'No faculty specified'});
        return;
    }
    try {
        const types = await TimetableServices.getTypes(faculty);
        res.status(200).json(types);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getLevels = async function (req, res) {
    let faculty = req.query.faculty;
    let type = req.query.type;
    if(!faculty || !type) {
        res.status(500).json({status: 500, message: 'No faculty or type specified'});
        return;
    }
    try {
        const levels = await TimetableServices.getLevels(faculty, type);
        res.status(200).json(levels);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getPrograms = async function (req, res) {
    let faculty = req.query.faculty;
    let type = req.query.type;
    let level = req.query.level;
    if(!faculty || !type || !level) {
        res.status(500).json({status: 500, message: 'No faculty or type or level specified'});
        return;
    }
    try {
        const group_links = await TimetableServices.getProgramLinks(faculty, type, level);
        const programs = await TimetableServices.getPrograms(group_links);

        res.status(200).json(programs);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getAll = async function (req, res) {
    try {
        let timetable = {};
        let faculties = (await TimetableServices.getFaculties()).faculties;
        let fac_percent = 100/faculties.length;
        let completion_percent = 0;
        console.log("Completed " + completion_percent + "%");
        for (const faculty of faculties) {
            let types = (await TimetableServices.getTypes(faculty.faculty)).types;
            let types_percent = fac_percent/types.length;
            for (const type of types) {
                let levels = (await TimetableServices.getLevels(faculty.faculty, type.type)).levels;
                let levels_percent = types_percent/levels.length;
                for (const level of levels) {
                    let program_links = await TimetableServices.getProgramLinks(faculty.faculty, type.type, level.level);
                    let programs = (await TimetableServices.getPrograms(program_links)).programs;
                    levels[levels.indexOf(level)].programs = programs;
                    completion_percent += levels_percent;
                    console.log("Completed " + (Math.round((completion_percent + Number.EPSILON) * 100) / 100) + "%");
                }

                types[types.indexOf(type)].levels = levels;
            }
            faculties[faculties.indexOf(faculty)].types = types;
        }
        timetable.faculties = faculties;
        fs.writeFileSync('timetable.json', JSON.stringify(timetable));
        res.status(200).json(timetable);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getAllCached = async function (req, res) {
    try {
        const timetable = fs.readFileSync('timetable.json', 'utf8');
        res.status(200).json(JSON.parse(timetable));
    } catch (e) {
        console.log(e);
    }
}

const getGroupTimetable = async function(req, res) {
    let groupURL = req.query.groupURL;
    if(!groupURL) {
        res.status(500).json({status: 500, message: 'No group URL specified'});
        return;
    }
    try {
        let timetable = await TimetableServices.getGroupTimetable(groupURL);
        res.status(200).json(timetable);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getGroupTimetable_forCurrentWeek = async function(req, res) {
    let groupID = req.query.groupID;
    let subgroup = req.query.subgroup;
    if(!subgroup) subgroup = 0;
    if(!groupID) {
        res.status(500).json({status: 500, message: 'No group ID specified'});
        return;
    }
    try {
        let timetable_legacy = await TimetableServices.getGroupTimetable(`/static/schedule_view.php?id_group=${groupID}&sem=2`);
        let timetable_parsed = TimetableServices.parseGroupTimetableForCurrentWeek(timetable_legacy, subgroup);
        res.status(200).json(timetable_parsed);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }

}

module.exports = {
    getFaculties,
    getTypes,
    getLevels,
    getPrograms,
    getAll,
    getAllCached,
    getGroupTimetable,
    getGroupTimetable_forCurrentWeek
}