const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const Schedule = require("../models/schedules.model");
const Trip = require("../models/trips.model");
const { convertUTC } = require("../utils/format");

const insertSchedule = async ({ tripId, todo, location, xCoordinate, yCoordinate, startTime, endTime }) => {
    try {
        const newSchedule = new Schedule({
            todo, location, xCoordinate, yCoordinate,
            startTime: convertUTC(startTime),
            endTime: convertUTC(endTime),
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
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const checkScheduleInTrip = async (tripId, scheduleId) => {
    try {
        const isExist = await Trip.findOne({
            $and: [
                { _id: tripId },
                { schedules: scheduleId }
            ]
        });

        if (!isExist) {
            throw new CustomError(
                '존재하지 않는 일정입니다.',
                StatusCodes.NOT_FOUND
            );
        }
    } catch (err) {
        throw new CustomError(
            err.message || '여행 일정 체크 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

const updateSchedule = async ({
    tripId, scheduleId, todo,
    location, xCoordinate, yCoordinate,
    startTime, endTime, isChecked
}) => {
    try {
        await checkScheduleInTrip(tripId, scheduleId);

        const schedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            {
                todo: todo,
                location: location,
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate,
                startTime: convertUTC(startTime),
                endTime: convertUTC(endTime),
                isChecked: isChecked
            }
        );

        if (!schedule) {
            throw new CustomError(
                '존재하지 않는 일정입니다.',
                StatusCodes.NOT_FOUND
            );
        }

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
            err.message || '일정 수정 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const deleteSchedule = async (tripId, scheduleId) => {
    try {
        await checkScheduleInTrip(tripId, scheduleId);

        const trip = await Trip.findByIdAndUpdate(tripId, { $pull: { schedules: scheduleId } });
        const schedule = await Schedule.findByIdAndDelete(scheduleId);
        if (!schedule || !trip) {
            throw new CustomError(
                '존재하지 않는 일정입니다.',
                StatusCodes.NOT_FOUND
            );
        }


    } catch (err) {
        throw new CustomError(
            err.message || '일정 삭제 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

module.exports = { insertSchedule, updateSchedule, deleteSchedule };