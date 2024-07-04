const express = require('express');
const { getTrips, createTrip, getTripDetail } = require('../controllers/trip.controller');
const { validateToken } = require('../authorization');
const router = express.Router();

router.get(
    '/',
    [validateToken],
    getTrips
);

router.post(
    '/',
    [validateToken],
    createTrip
);

router.get(
    '/:tripId',
    [validateToken],
    getTripDetail
)

// router.put(
//     '/:tripId',
//     [validateToken],
//     updateTrip
// );

// router.delete(
//     '/:tripId',
//     [validateToken],
//     deleteTrip
// );

module.exports = router;