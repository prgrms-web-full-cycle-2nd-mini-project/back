const { StatusCodes } = require('http-status-codes');
const { insertSchedule } = require('../services/schedules.service');

const createSchedule = async (req, res, next) => {
    try {
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

module.exports = { createSchedule }