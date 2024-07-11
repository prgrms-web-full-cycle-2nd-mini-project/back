const { body, param } = require('express-validator');

const tripIdValidate = param('tripId').isLength({ min: 24, max: 24 }).withMessage('존재하지 않는 여행입니다.');
const titleValidate = body('title').notEmpty().withMessage('제목을 입력해주세요.');
const dateValidate = body('date').notEmpty().isDate().withMessage('날짜를 입력해주세요.');
const locationValidate = body('location').notEmpty().withMessage('장소를 입력해주세요.');
const xCoordinateValidate = body('xCoordinate').notEmpty().isNumeric().withMessage('x좌표를 입력해주세요.');
const yCoordinateValidate = body('xCoordinate').notEmpty().isNumeric().withMessage('y좌표를 입력해주세요.');

const tripDataValidate = [
    titleValidate,
    dateValidate,
    locationValidate,
    xCoordinateValidate,
    yCoordinateValidate
];

module.exports = { tripIdValidate, titleValidate, dateValidate, tripDataValidate };