const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
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
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    schedules: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Schedule'
        }
    ]
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;