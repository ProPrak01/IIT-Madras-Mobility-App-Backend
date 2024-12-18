const mongoose = require('mongoose');

const monumentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    }
});

const Monument = mongoose.model('Monument', monumentSchema);

module.exports = Monument;