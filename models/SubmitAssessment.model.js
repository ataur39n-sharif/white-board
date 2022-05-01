const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    assessmentId: {
        type: String,
        required: true,
    },
    studentId:{
        type:String,
        required:true,
    },
    file: {
        type: String,
    },
    link: {
        type: String,
    },
    dateOfSubmit: {
        type: Date,
        default: Date.now()
    },
    grades: {
        type: new mongoose.Schema({
            marks: {
                type: Number
            },
            remarks: {
                type: String,
            }
        }, {
            _id: false,
            versionKey: false
        }),
        default: {
            marks: null,
            remarks: "Not checked yet ."
        }
    }
}, {
    timestamps: true,
    versionKey: false
})

const submitAssessmentModel = mongoose.model('submitAssessment', dataSchema)
module.exports = submitAssessmentModel