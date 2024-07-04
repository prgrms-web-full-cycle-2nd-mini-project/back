const express = require('express');
const { validateToken } = require('../authorization');
const { createSchedule } = require('../controllers/schedule.controller');
const router = express.Router();

router.post(
    '/',
    [validateToken],
    createSchedule
);

module.exports = router;