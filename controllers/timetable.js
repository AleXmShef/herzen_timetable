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
    let faculty = req.body.faculty;
    if(!faculty)
        res.status(500).json({status: 500, message: 'No faculty specified'});
    try {
        const types = await TimetableServices.getTypes(faculty);
        res.status(200).json(types);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const getLevels = async function (req, res) {
    let faculty = req.body.faculty;
    let type = req.body.type;
    if(!faculty || !type)
        res.status(500).json({status: 500, message: 'No faculty or type specified'});
    try {
        const levels = await TimetableServices.getLevels(faculty, type);
        res.status(200).json(levels);
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

module.exports = {
    getFaculties,
    getTypes,
    getLevels
}