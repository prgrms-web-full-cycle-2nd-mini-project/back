const { StatusCodes } = require('http-status-codes');
const { createUser, loginUser } = require('../services/users.service');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        await createUser(name, email, password);
        return res.status(StatusCodes.CREATED).end();
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.cookie('token', token, { httpOnly: true });
        return res.status(StatusCodes.OK).json({ email });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login
}