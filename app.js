const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./db');

app.use(express.json());
dotenv.config();
connectDB();

const userRouter = require('./routes/users.router');
const tripRouter = require('./routes/trips.router');
const scheduleRouter = require('./routes/schedules.router');

app.use('/users', userRouter);
app.use('/trips', tripRouter);
app.use('/trips/:tripId/schedules', scheduleRouter);

app.listen(process.env.PORT, () => console.log(`Server listen on port ${process.env.PORT}`));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errMsg = err.message || '서버 내부 오류 발생';
    console.error(`에러 발생: ${err.name}`);
    console.error(`에러 메시지: ${err.message}`);
    console.error(`에러 스택: ${err.stack}`);
    return res.status(statusCode).json({ message: errMsg });
})