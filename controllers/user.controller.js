const { StatusCodes } = require('http-status-codes');
const { createUser, loginUser, findUser } = require('../services/users.service');

const checkAuth = (req, res) => {
    try {
        return res.status(StatusCodes.OK).json({ message: 'Authenticated' });
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
}

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await createUser(email, password);

        return res.status(StatusCodes.CREATED).end();
    } catch (err) {
        next(err);
    }
}

const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const isExistedEmail = await findUser(email);
        const status = isExistedEmail ? StatusCodes.BAD_REQUEST : StatusCodes.OK;
        const msg = isExistedEmail ? '이미 사용된 이메일입니다.' : '사용 가능한 이메일입니다.';

        return res.status(status).json({ message: msg });
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

const logout = (req, res, next) => {
    try {
        res.clearCookie('token', { httpOnly: true });
        return res.status(StatusCodes.RESET_CONTENT).json({ message: '로그아웃 되었습니다.' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkAuth,
    register,
    checkEmail,
    login,
    logout
}