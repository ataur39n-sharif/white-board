const jwt = require("jsonwebtoken")
const userModel = require("../models/User.model")

const authorizeUser = async (req, res, next) => {
    try {
        if (!req.headers['authorization']) {
            return res.status(401).json({
                success: false,
                message: 'Access denied.!'
            })
        }
        const token = req.headers['authorization'].split(' ')[1]
        //verify token with secret
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifyToken) {
            return res.status(401).json({
                success: false,
                message: 'Access denied.'
            })
        }
        const user = await userModel.findOne({ email: verifyToken.email })
        if (verifyToken && user) {
            req.userId = user._id.toString();
            req.email = user.email;
            req.role = user.role;
            req.name = user.name
            next()
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
module.exports = authorizeUser