const express = require('express');
const router = express.Router();

const TimetableControllers = require('../../controllers/timetable');

// @route   GET api/timetable/faculties
// @args    NONE
// @access  Public
// @desc    Get all faculties
router.get('/faculties', TimetableControllers.getFaculties);

// @route   GET api/timetable/types
// @args    "faculty" - faculty name
// @access  Public
// @desc    Get education types for given faculty
router.get('/types', TimetableControllers.getTypes);

// @route   GET api/timetable/levels
// @args    "faculty" - faculty name, "type" - education type
// @access  Public
// @desc    Get education levels for given faculty & education type
router.get('/levels', TimetableControllers.getLevels);

// @route   GET api/timetable/years
// @args    "faculty" - faculty name, "type" - education type, "level" - education level
// @access  Public
// @desc    Get possible enrollment years for given faculty, education type & education level
router.get('/years', TimetableControllers.getYears);

// @route   GET api/timetable/programs
// @args    "faculty" - faculty name, "type" - education type, "level" - education level, "year" = enrollment year
// @access  Public
// @desc    Get education programs, subprograms and groups for given faculty, education type, level & enrollment year
router.get('/programs', TimetableControllers.getPrograms);

// @route   GET api/timetable/all
// @args    NONE
// @access  Public
// @desc    Get all timetable in a single json
router.get('/all', TimetableControllers.getAll);

// @route   GET api/timetable/all
// @args    NONE
// @access  Public
// @desc    Get all timetable in a single json
router.get('/all_cached', TimetableControllers.getAllCached);

// @route   GET api/timetable/group
// @args    "groupURL" - group URL, begins with /static
// @access  Public
// @desc    Get timetable for a specified group url
router.get('/group', TimetableControllers.getGroupTimetable);

module.exports = router;