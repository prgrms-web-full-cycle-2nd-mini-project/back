const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    todo: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    xCoordinate: {
        type: Number,
        required: true
    },
    yCoordinate: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isChecked: {
        type: Boolean,
        required: true
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;