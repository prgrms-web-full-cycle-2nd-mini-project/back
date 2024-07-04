const { StatusCodes } = require('http-status-codes');
const { getLoginedId } = require('../authorization');
const { selectTrips, insertTrip, selectTripDetail } = require('../services/trips.service');

const getTrips = async (req, res, next) => {
    try {
        const { plan, page } = req.query;
        const userId = getLoginedId(req);

        const trips = await selectTrips({ plan, page, userId });

        return res.status(StatusCodes.OK).json(trips);
    } catch (err) {
        next(err);
    }
}

const createTrip = async (req, res, next) => {
    try {
        const { title, date, location, xCoordinate, yCoordinate } = req.body;
        const userId = getLoginedId(req);
        const trips = await insertTrip({ title, date, location, xCoordinate, yCoordinate, userId });

        return res.status(StatusCodes.CREATED).json(trips);
    } catch (err) {
        next(err);
    }
}

const getTripDetail = async (req, res, next) => {
    try {
        const { tripId } = req.params;
        const tripDetail = await selectTripDetail(tripId);

        return res.status(StatusCodes.OK).json(tripDetail);
    } catch (err) {
        next(err);
    }
}

module.exports = { getTrips, createTrip, getTripDetail };