const AssessmentController = require('../controllers/Assessment.controller')
const authorizeUser = require('../middleware/Authorization.middleware')
const upload = require('../middleware/Upload.middleware')

const assessmentRoute = require('express').Router()

assessmentRoute
    .post('/create', authorizeUser, AssessmentController.newAssessment)
    .put('/update/:id', authorizeUser, AssessmentController.updateAssessment)
    .delete('/delete/:id', authorizeUser, AssessmentController.deleteAssessment)
    .post('/submit', authorizeUser, upload.single('file'), AssessmentController.submitAssessment)
    .put('/feedback/:id', authorizeUser, AssessmentController.giveFeedback)
    .get('/own-submission-list', authorizeUser, AssessmentController.ownSubmitList)
    .get('/all-submission-list', authorizeUser, AssessmentController.submissionList)

module.exports = assessmentRoute