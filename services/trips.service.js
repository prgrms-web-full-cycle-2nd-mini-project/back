const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const Trip = require("../models/trips.model");

const selectTrips = async ({ plan, page, userId }) => {
    try {
        const response = {
            trips: [],
            pagination: {
                totalPage: 1,
                currentPage: parseInt(page)
            }
        }
        const today = new Date();

        const dateCondition = plan === 'true' ? { $gte: today } : { $lt: today };
        const trips = await Trip.find(
            { $and: [{ owner: userId }, { date: dateCondition }] },
            { owner: 0, __v: 0 }
        ).populate({ path: 'schedules', select: 'isChecked' }).sort({ date: 1 });

        response.trips = trips.slice(8 * (page - 1), 8 * page).map(trip => {
            let completedCount = 0;
            trip.schedules.forEach(s => s.isChecked ? completedCount++ : '');

            return {
                id: trip._id,
                title: trip.title,
                date: trip.date,
                location: trip.location,
                completedCount: completedCount,
                totalCount: trip.schedules.length
            }
        });
        response.pagination.totalPage = Math.ceil(trips.length / 8);

        if (!response.trips.length) {
            throw new CustomError(
                '조회할 여행 목록이 없습니다.',
                StatusCodes.NOT_FOUND
            )
        };

        return response;
    } catch (err) {
        throw new CustomError(
            err.message || '여행 목록을 조회할 수 없습니다.',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const insertTrip = async ({ title, date, location, xCoordinate, yCoordinate, userId }) => {
    try {
        const newTrip = new Trip({
            title,
            date,
            location,
            xCoordinate,
            yCoordinate,
            owner: userId,
            schedules: []
        });
        await newTrip.save();

        const trips = await Trip.find(
            { $and: [{ owner: userId }, { date: { $gte: new Date() } }] },
            { owner: 0, __v: 0 }
        ).populate({ path: 'schedules', select: 'isChecked' }).sort({ date: 1 });

        return trips.map(trip => {
            let completedCount = 0;
            trip.schedules.forEach(s => s.isChecked ? completedCount++ : '');

            return {
                id: trip._id,
                title: trip.title,
                date: trip.date,
                location: trip.location,
                completedCount: completedCount,
                totalCount: trip.schedules.length
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

module.exports = { selectTrips, insertTrip };