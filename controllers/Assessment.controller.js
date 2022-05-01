const Joi = require("joi")
    .extend(require('@joi/date'));
const assessmentModel = require("../models/Assessment.model");
const submitAssessmentModel = require("../models/SubmitAssessment.model");

const AssessmentController = {
    /* 
        create a new assessment
    */
    newAssessment: async (req, res) => {
        try {
            //without mentor or admin no one can post assessment
            if (req.role === 'mentor' || req.role === 'admin') {

                const { title, description, deadline } = req.body;
                //expected data schema
                const dataSchema = Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    mentor: Joi.string().required(),
                    mentorId: Joi.string(),
                    deadline: Joi.date().greater(Date.now()).format('YYYY-MM-DD').required()
                })
                //valid req data with data schema
                const verifyData = dataSchema.validate({
                    title,
                    description,
                    mentor: req.name,
                    deadline,
                    mentorId: req.userId
                })
                if (verifyData.error) {
                    return res.status(400).json({
                        success: false,
                        error: verifyData.error.details,
                    })
                }
                const newDoc = await assessmentModel.create(verifyData.value)
                return res.status(200).json({
                    success: true,
                    response: newDoc
                })
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorize access. !'
                })
            }

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        submit an assessment
    */
    submitAssessment: async (req, res) => {
        try {
            const { link, assessmentId } = req.body;
            const file = req.file || undefined
            const fileUrl = process.env.SITE_URL + '/uploads/' + file?.filename
            //expected data schema
            const dataSchema = Joi.object({
                assessmentId: Joi.string(),
                studentId: Joi.string(),
                file: Joi.string(),
                link: file ? Joi.string().optional() : Joi.string().required(),
                dateOfSubmit: Joi.date().required()
            })
            //valid data with schema
            const verifyData = dataSchema.validate({
                assessmentId,
                studentId: req.userId.toString(),
                file: file && fileUrl,
                link,
                dateOfSubmit: Date.now()
            })
            if (verifyData.error) {
                return res.status(400).json({
                    success: false,
                    error: verifyData.error.details
                })
            }

            //check deadline remaining have or throw error
            const assessmentDetails = await assessmentModel.findOne({ _id: verifyData.value.assessmentId })
            if (verifyData.value.dateOfSubmit > new Date(assessmentDetails.deadline)) {
                return res.status(400).json({
                    success: false,
                    message: 'Deadline is over.'
                })
            }
            const newSubmit = await submitAssessmentModel.create(verifyData.value)

            //update submit list of assessment database
            const update = await assessmentModel.findOneAndUpdate({ _id: assessmentId }, {
                $push: {
                    submitList: [newSubmit._id]
                }
            })

            return res.status(200).json({
                success: true,
                response: "Successfully submitted. ",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        give feedback of students submission
    */
    giveFeedback: async (req, res) => {
        try {
            //without mentor or admin no one can give student's submission feedback
            if (req.role === 'student') {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorize access. !'
                })
            }

            const { submissionId, marks, remarks } = req.body;

            //expected data schema
            const dataSchema = Joi.object({
                marks: Joi.number().required().integer().min(0).max(100),
                remarks: Joi.string().required(),
            })

            //valid data with schema
            const verifyData = dataSchema.validate({ marks, remarks })
            if (verifyData.error) {
                return res.status(400).json({
                    success: false,
                    error: verifyData.error.details
                })
            }

            const updateWithFeedback = await submitAssessmentModel.findOneAndUpdate({ _id: submissionId }, {
                grades: {
                    marks: verifyData.value.marks,
                    remarks: verifyData.value.remarks
                }
            })

            return res.status(200).json({
                success: true,
                response: 'SuccessFull',
                updateWithFeedback
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        all submission list
    */
    submissionList: async (req, res) => {
        try {
            if (req.role === 'student') {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. "
                })
            }
            const list = await submitAssessmentModel.find({})
            return res.status(200).json({
                success: true,
                response: list
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        get student's own submit list
    */
    ownSubmitList: async (req, res) => {
        try {
            const userId = req.userId
            const ownList = await submitAssessmentModel.find({ studentId: userId })
            return res.status(200).json({
                success: true,
                response: ownList
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = AssessmentController