const { StatusCodes } = require("http-status-codes");
const { CustomError } = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { passwordEncryption, getHashPassword } = require('../utils/Encryption');
const User = require("../models/users.model");

dotenv.config();

const findUser = async (email) => {
    try {
        const foundUser = await User.findOne({ email: email });
        return foundUser;
    } catch (err) {
        throw new CustomError(
            err.message || '사용자를 찾을 수 없습니다.',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        )
    }
}

const createUser = async (email, password) => {
    try {
        const foundUser = await findUser(email);
        if (foundUser) {
            throw new CustomError(
                '이미 사용된 이메일입니다.',
                StatusCodes.BAD_REQUEST
            )
        }

        const { salt, hashPassword } = passwordEncryption(password);
        const user = new User({
            email: email,
            password: hashPassword,
            salt: salt
        });
        await user.save();
    } catch (err) {
        throw new CustomError(
            err.message || '사용자 생성 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const createToken = (email) => {
    const token = jwt.sign({
        email: email
    }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '7d',
        issuer: 'minjin'
    })

    return token;
}

const loginUser = async (email, password) => {
    try {
        const foundUser = await findUser(email);
        if (foundUser) {
            const hashPassword = getHashPassword(password, foundUser.salt);
            if (foundUser.password === hashPassword) {
                const token = createToken(email);

                return token;
            }
        }

        throw new CustomError(
            '아이디 또는 비밀번호가 일치하지 않습니다.',
            StatusCodes.UNAUTHORIZED
        );
    } catch (err) {
        throw new CustomError(
            err.message || '로그인 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

module.exports = {
    createUser,
    loginUser
};