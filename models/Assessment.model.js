const mongoose = require('mongoose')

const assessmentDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    mentor: {
        type: String,
        required: true,
    },
    mentorId:{
        type:String,
    },
    deadline: {
        type: Date,
        required: true,
    },
    submitList: [{
        type: mongoose.Types.ObjectId,
        ref: 'submitAssessment'
    }]
}, {
    timestamps: true,
    versionKey: false
})

const assessmentModel = mongoose.model("assessment", assessmentDataSchema)
module.exports = assessmentModel