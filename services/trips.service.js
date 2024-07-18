const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const Trip = require("../models/trips.model");
const { findOne } = require("../models/users.model");

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
        const sortCondition = plan === 'true' ? 1 : -1;
        const trips = await Trip.find(
            { $and: [{ owner: userId }, { date: dateCondition }] },
            { owner: 0, __v: 0 }
        ).populate({ path: 'schedules', select: 'isChecked' }).sort({ date: sortCondition });

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

        // if (!response.trips.length) {
        //     throw new CustomError(
        //         '조회할 여행 목록이 없습니다.',
        //         StatusCodes.NOT_FOUND
        //     )
        // };

        return response;
    } catch (err) {
        throw new CustomError(
            err.message || '여행 목록을 조회할 수 없습니다.',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const insertTrip = async ({ title, date, location, xCoordinate, yCoordinate, userId }) => {
    try {
        const today = new Date();

        const tripCount = await Trip.find(
            { $and: [{ owner: userId }, { date: { $gte: today } }] },
            { owner: 0, __v: 0 }
        ).populate({ path: 'schedules', select: 'isChecked' }).sort({ date: 1 });

        if (tripCount.length >= 5) {
            throw new CustomError(
                '계획 중인 여행은 5개까지만 추가할 수 있습니다.',
                StatusCodes.BAD_REQUEST
            )
        }

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
            { $and: [{ owner: userId }, { date: { $gte: today } }] },
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
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const selectTripDetail = async (tripId) => {
    try {
        const trip = await Trip.findById(tripId)
            .populate({ path: 'schedules', options: { sort: { 'startTime': 1 } } });

        if (!trip) {
            throw new CustomError(
                '존재하지 않는 여행입니다.',
                StatusCodes.BAD_REQUEST
            );
        }

        const formattedSchedule = trip.schedules.map(s => {
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

        const formattedTrip = {
            id: trip.id,
            title: trip.title,
            date: trip.date,
            location: trip.location,
            xCoordinate: trip.xCoordinate,
            yCoordinate: trip.yCoordinate,
            schedules: formattedSchedule
        }

        return formattedTrip;
    } catch (err) {
        throw new CustomError(
            err.message || '여행 상세 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const updateTripTitle = async (tripId, title) => {
    try {
        const trip = await Trip.findByIdAndUpdate(tripId, { title: title });
        if (!trip) {
            throw new CustomError(
                '존재하지 않는 여행입니다.',
                StatusCodes.NOT_FOUND
            );
        }
    } catch (err) {
        throw new CustomError(
            err.message || '여행 제목 수정 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const updateTrip = async ({ tripId, title, date, location, xCoordinate, yCoordinate }) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            {
                title: title,
                date: date,
                location: location,
                xCoordinate: xCoordinate,
                yCoordinate: yCoordinate
            }
        );

        if (!trip) {
            throw new CustomError(
                '존재하지 않는 여행입니다.',
                StatusCodes.NOT_FOUND
            );
        }
    } catch (err) {
        throw new CustomError(
            err.message || '여행 수정 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const deleteTrip = async (tripId) => {
    try {
        const trip = await Trip.findByIdAndDelete(tripId);
        if (!trip) {
            throw new CustomError(
                '존재하지 않는 여행입니다.',
                StatusCodes.NOT_FOUND
            )
        }
    } catch (err) {
        throw new CustomError(
            err.message || '여행 삭제 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

module.exports = { selectTrips, insertTrip, selectTripDetail, updateTripTitle, updateTrip, deleteTrip };