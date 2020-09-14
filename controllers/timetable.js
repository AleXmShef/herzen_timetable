const TimetableServices = require('../services/timetable');

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
        for (const faculty of faculties) {
            console.log("processing \"" + faculty.faculty + "\" faculty");
            let types = (await TimetableServices.getTypes(faculty.faculty)).types;
            for (const type of types) {
                console.log("processing \"" + type.type + "\" type");
                let levels = (await TimetableServices.getLevels(faculty.faculty, type.type)).levels;
                for (const level of levels) {
                    console.log("processing \"" + level.level + "\" level");
                    let program_links = await TimetableServices.getProgramLinks(faculty.faculty, type.type, level.level);
                    let programs = (await TimetableServices.getPrograms(program_links)).programs;
                    levels[levels.indexOf(level)].programs = programs;
                }
                types[types.indexOf(type)].levels = levels;
            }
            faculties[faculties.indexOf(faculty)].types = types;
        }
        timetable.faculties = faculties;
        res.status(200).json(timetable);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getGroupTimetable = async function(req, res) {
    let groupURL = req.query.groupURL;
    if(!groupURL)
        res.status(500).json({status: 500, message: 'No group URL specified'});
    try {
        let timetable = await TimetableServices.getGroupTimetable(groupURL);
        res.status(200).json(timetable);
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
    getGroupTimetable
}