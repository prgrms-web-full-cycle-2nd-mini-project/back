const express = require('express');
const { validateToken } = require('../authorization');
const { createSchedule, changeSchedule, removeSchedule } = require('../controllers/schedule.controller');
const { tripIdValidate } = require('../validator/trip.validator');
const { createScheduleValidator, scheduleIdValidate, updateScheduleValidator } = require('../validator/schedule.validator');
const { validate } = require('../validator/validate');
const router = express.Router();

router.post(
    '/:tripId/schedules',
    [validateToken, tripIdValidate, createScheduleValidator, validate],
    createSchedule
);

router.put(
    '/:tripId/schedules/:scheduleId',
    [validateToken, tripIdValidate, scheduleIdValidate, updateScheduleValidator, validate],
    changeSchedule
);

router.delete(
    '/:tripId/schedules/:scheduleId',
    [validateToken, tripIdValidate, scheduleIdValidate],
    removeSchedule
);

module.exports = router;