const { StatusCodes } = require('http-status-codes');
const { insertSchedule, updateSchedule, deleteSchedule, updateCheck } = require('../services/schedules.service');
const { accessAuthorization } = require('../authorization');

const createSchedule = async (req, res, next) => {
    try {
        await accessAuthorization(req);
        const { tripId } = req.params;
        const { todo, location, xCoordinate, yCoordinate, startTime, endTime } = req.body;
        const schedules = await insertSchedule({
            tripId,
            todo,
            location,
            xCoordinate,
            yCoordinate,
            startTime,
            endTime
        });

        return res.status(StatusCodes.CREATED).json(schedules);
    } catch (err) {
        next(err);
    }
}

const changeSchedule = async (req, res, next) => {
    try {
        await accessAuthorization(req);
        const { tripId, scheduleId } = req.params;
        const { todo, location, xCoordinate, yCoordinate, startTime, endTime, isChecked } = req.body;
        const schedules = await updateSchedule({
            tripId, scheduleId, todo,
            location, xCoordinate, yCoordinate,
            startTime, endTime, isChecked
        });

        return res.status(StatusCodes.OK).json(schedules);
    } catch (err) {
        next(err);
    }
}

const changeCheck = async (req, res, next) => {
    try {
        await accessAuthorization(req);
        const { tripId, scheduleId } = req.params;
        const { isChecked } = req.body;
        await updateCheck(tripId, scheduleId, isChecked);

        return res.status(StatusCodes.OK).end();
    } catch (err) {
        next(err);
    }
}

const removeSchedule = async (req, res, next) => {
    try {
        await accessAuthorization(req);
        const { tripId, scheduleId } = req.params;
        await deleteSchedule(tripId, scheduleId);

        return res.status(StatusCodes.OK).end();
    } catch (err) {
        next(err);
    }
}

module.exports = { createSchedule, changeSchedule, changeCheck, removeSchedule }