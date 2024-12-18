const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tripSchema = new Schema({
    monuments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monument',
        required: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purpose: {
        type: String,
        required: false,
    },
    mode:{
        type: String,
        required: false,
    }
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
