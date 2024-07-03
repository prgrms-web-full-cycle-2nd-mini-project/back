const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/user.controller');
const { emailValidate, passwordValidate } = require('../validator/user.validator');
const { validate } = require('../validator/validate');

router.post(
    '/register',
    [emailValidate, passwordValidate, validate],
    register
);

router.post(
    '/login',
    [emailValidate, passwordValidate, validate],
    login
);

module.exports = router;