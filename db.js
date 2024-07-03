const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.DB_URI;
const connectDB = () => {
    mongoose.connect(uri);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB 연결 성공')
    })
}

module.exports = connectDB;