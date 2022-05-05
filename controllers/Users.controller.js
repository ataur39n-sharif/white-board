const Joi = require("joi")
const userModel = require("../models/User.model")

const usersController = {
    /* 
        all user list
    */
    allUserList: async (req, res) => {
        try {
            const list = await userModel.find({})
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
        update user details
    */
    updateUserDetails: async (req, res) => {
        try {
            if (req.role !== 'admin') {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. "
                })
            }
            const id = req.params.id
            const { name, email, password } = req.body

            //expected data schema
            const dataSchema = Joi.object({
                id: Joi.string().required(),
                name: Joi.string(),
                email: Joi.string(),
                password: Joi.string()
            })

            // valid data with schema
            const verifyData = dataSchema.validate({ name, email, password, id })

            if (verifyData.error) {
                return res.status(400).json({
                    success: false,
                    error: verifyData.error.details
                })
            }

            const updateData = await userModel.findOneAndUpdate({ _id: verifyData.value.id }, {
                ...verifyData.value
            })

            return res.status(200).json({
                success: true,
                response: "Successfully updated. "
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = usersController