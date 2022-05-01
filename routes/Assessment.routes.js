const AssessmentController = require('../controllers/Assessment.controller')
const authorizeUser = require('../middleware/Authorization.midlleware')
const upload = require('../middleware/Upload.middleware')

const assessmentRoute = require('express').Router()

assessmentRoute
    .post('/', authorizeUser, AssessmentController.newAssessment)
    .post('/submit', authorizeUser, upload.single('file'), AssessmentController.submitAssessment)
    .put('/feedback', authorizeUser, AssessmentController.giveFeedback)
    .get('/own-submission-list', authorizeUser, AssessmentController.ownSubmitList)
    .get('/all-submission-list', authorizeUser, AssessmentController.submissionList)



module.exports = assessmentRoute