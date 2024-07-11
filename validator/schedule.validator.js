const { body, param } = require('express-validator');

const scheduleIdValidate = param('scheduleId').isLength({ min: 24, max: 24 }).withMessage('존재하지 않는 일정입니다.');
const locationValidate = body('location').notEmpty().withMessage('장소를 입력해주세요.');
const xCoordinateValidate = body('xCoordinate').notEmpty().isNumeric().withMessage('x좌표를 입력해주세요.');
const yCoordinateValidate = body('yCoordinate').notEmpty().isNumeric().withMessage('y좌표를 입력해주세요.');
const isCheckedValidate = body('isChecked').notEmpty().isBoolean().withMessage('체크 여부를 입력해주세요.');

const isValidDateTime = (value) => {
    const date = new Date(value);
    if (date == 'Invalid Date') {
        throw new Error('시간을 제대로 입력해주세요.');
    }
    return true;
}


const startTimeValidate = body('startTime').custom(isValidDateTime);
const endTimeValidate = body('endTime').custom(isValidDateTime);


const createScheduleValidator = [
    locationValidate,
    xCoordinateValidate,
    yCoordinateValidate,
    startTimeValidate,
    endTimeValidate
];

const updateScheduleValidator = [...createScheduleValidator, isCheckedValidate];

module.exports = { scheduleIdValidate, isCheckedValidate, createScheduleValidator, updateScheduleValidator };