const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./db');
const cors = require('cors');

app.use(express.json());
dotenv.config();
connectDB();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    optionsSuccessStatus: 204,
    credentials: true,
};
app.use(cors(corsOptions));

const userRouter = require('./routes/users.router');
const tripRouter = require('./routes/trips.router');
const scheduleRouter = require('./routes/schedules.router');

app.use('/users', userRouter);
app.use('/trips', tripRouter);
app.use('/trips', scheduleRouter);

app.listen(process.env.PORT, () => console.log(`Server listen on port ${process.env.PORT}`));

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = StatusCodes.NOT_FOUND;

    next(error);
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errMsg = err.message || '서버 내부 오류 발생';
    console.error(`에러 발생: ${err.name}`);
    console.error(`에러 메시지: ${err.message}`);
    console.error(`에러 스택: ${err.stack}`);
    return res.status(statusCode).json({ message: errMsg });
})