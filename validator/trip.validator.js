const { param } = require('express-validator');

const tripIdValidate = param('tripId').isLength({ min: 24, max: 24 }).withMessage('존재하지 않는 여행입니다.');

module.exports = { tripIdValidate };