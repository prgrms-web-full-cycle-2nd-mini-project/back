const express = require('express');
const { getTrips, createTrip, getTripDetail, changeTrip, removeTrip } = require('../controllers/trip.controller');
const { validateToken } = require('../authorization');
const { tripIdValidate, tripDataValidate, dateValidate } = require('../validator/trip.validator');
const { validate } = require('../validator/validate');
const router = express.Router();

router.get(
    '/',
    [validateToken],
    getTrips
);

router.post(
    '/',
    [validateToken, ...tripDataValidate, validate],
    createTrip
);

router.get(
    '/:tripId',
    [validateToken, tripIdValidate, validate],
    getTripDetail
)

router.put(
    '/:tripId',
    [validateToken, tripIdValidate, ...tripDataValidate, validate],
    changeTrip
);

router.delete(
    '/:tripId',
    [validateToken, tripIdValidate, validate],
    removeTrip
);

module.exports = router;