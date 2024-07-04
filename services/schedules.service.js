const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const Schedule = require("../models/schedules.model");
const Trip = require("../models/trips.model");
const { getLocalTime } = require("../utils/format");
const { default: mongoose } = require("mongoose");

const insertSchedule = async ({ tripId, todo, location, xCoordinate, yCoordinate, startTime, endTime }) => {
    try {
        const newSchedule = new Schedule({
            todo, location, xCoordinate, yCoordinate,
            startTime: getLocalTime(startTime),
            endTime: getLocalTime(endTime),
            isChecked: false
        });
        await newSchedule.save();

        const trip = await Trip.findById(tripId);
        trip.schedules.push(newSchedule.id);
        await trip.save();

        const schedules = await Trip.findOne(
            { _id: tripId }, { schedules: 1 }
        ).populate({
            path: 'schedules',
            select: 'id todo location xCoordinate yCoordinate startTime endTime isChecked',
            options: { sort: { 'startTime': 1 } }
        });

        return schedules.schedules.map(s => {
            return {
                id: s._id,
                todo: s.todo,
                location: s.location,
                xCoordinate: s.xCoordinate,
                yCoordinate: s.yCoordinate,
                startTime: s.startTime,
                endTime: s.endTime,
                isChecked: s.isChecked
            }
        });
    } catch (err) {
        throw new CustomError(
            err.message || '여행 생성 실패',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

module.exports = { insertSchedule };