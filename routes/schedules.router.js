const express = require('express');
const { validateToken } = require('../authorization');
const { createSchedule, changeSchedule, removeSchedule } = require('../controllers/schedule.controller');
const router = express.Router();

router.post(
    '/:tripId/schedules',
    [validateToken],
    createSchedule
);

router.put(
    '/:tripId/schedules/:scheduleId',
    [validateToken],
    changeSchedule
);

router.delete(
    '/:tripId/schedules/:scheduleId',
    [validateToken],
    removeSchedule
);

module.exports = router;