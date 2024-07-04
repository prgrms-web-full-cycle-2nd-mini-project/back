const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const Schedule = require("../models/schedules.model");
const Trip = require("../models/trips.model");
const { getLocalTime } = require("../utils/format");
const { default: mongoose } = require("mongoose");

const insertSchedule = async ({ tripId, todo, location, xCoordinate, yCoordinate, startTime, endTime }) => {
    try {
        const db = mongoose.connection;
        const session = await db.startSession();
        session.startTransaction();

        const newSchedule = new Schedule({
            todo, location, xCoordinate, yCoordinate,
            startTime: getLocalTime(startTime),
            endTime: getLocalTime(endTime),
            isChecked: false
        });
        (await newSchedule.save()).$session(session);

        await Trip.updateOne(
            { id: tripId },
            { $push: { schedules: newSchedule.id } }
        ).session(session);

        const schedules = await Trip.findOne(
            { id: tripId }, { schedules: 1 }
        ).populate({
            path: 'schedules',
            select: 'id todo location xCoordinate yCoordinate startTime endTime isChecked',
            options: { sort: { 'startTime': 1 } }
        }).session(session);

        await session.commitTransaction();
        session.endSession();

        return schedules.schedules;

    } catch (err) {
        throw new CustomError(
            err.message || '여행 생성 실패',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

module.exports = { insertSchedule };