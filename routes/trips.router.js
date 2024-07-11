const express = require('express');
const { getTrips, createTrip, getTripDetail, changeTrip, removeTrip, changeTripTitle } = require('../controllers/trip.controller');
const { validateToken } = require('../authorization');
const { tripIdValidate, tripDataValidate, dateValidate, titleValidate } = require('../validator/trip.validator');
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
    '/:tripId/title',
    [validateToken, tripIdValidate, titleValidate, validate],
    changeTripTitle
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