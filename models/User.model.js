const mongoose = require('mongoose')

const userDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'mentor', 'student'],
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

const userModel = mongoose.model('user', userDataSchema)

module.exports = userModel