const bcrypt = require("bcryptjs")
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const userModel = require("../models/User.model")

const AuthController = {
    /* 
        Register user
    */
    register: async (req, res) => {
        try {
            const { name, email, password, role } = req.body
            //expected data schema
            const dataSchema = Joi.object({
                name: Joi.string(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                role: Joi.string().valid('admin', 'mentor', 'student').required()
            })
            //validate data with expected data schema
            const verifyData = dataSchema.validate({ name, email, password, role })
            //if data not matched with schema throw error
            if (verifyData.error) {
                return res.status(400).json({
                    success: false,
                    error: verifyData.error.details
                })
            }

            //check user already exist or not . if have end registration process.
            const existingUser = await userModel.findOne({ email: verifyData.value.email })
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exist."
                })
            }
            //hash password
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(verifyData.value.password, salt)
            const newUser = await userModel.create({ ...verifyData.value, password: hashPass })

            return res.status(200).json({
                success: true,
                response: "Successfully created account."
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        Log in user
    */
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            //expected data schema
            const dataSchema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required()
            })
            //valid request data with schema
            const verifyData = dataSchema.validate({ email, password })
            if (verifyData.error) {
                return res.status(400).json({
                    success: false,
                    error: verifyData.error.details
                })
            }
            const user = await userModel.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password'
                })
            }
            //compare password
            const verify = bcrypt.compareSync(password, user.password)
            console.log(verify)
            if (!verify) {
                return res.status(500).json({
                    success: false,
                    message: 'Invalid email or password. '
                })
            }
            const accessToken = jwt.sign({ name: user?.name, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "24h" })

            return res.status(200).json({
                success: true,
                token: `Ataur ${accessToken}`
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    /* 
        Remove user
    */
    removeUser: async (req, res) => {
        try {
            if (req.role !== 'admin') {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. "
                })
            }
            const { email } = req.body;
            const deleteUser = await userModel.deleteOne({ email })
            return res.status(200).json({
                success: true,
                response: 'Successfully user deleted.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = AuthController