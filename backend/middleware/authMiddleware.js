import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token
    const bearerToken = req.headers.authorization
    if (bearerToken && bearerToken.startsWith('Bearer')) {
        try {
            token = bearerToken.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(401)
            throw new Error('Not authorized,token failed')
        }
    }

    if (!token) {
        res.status(401)

        throw new Error('Not authorized, no token')
    }
})

const checkIsAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as admin')

    }
}

export { protect, checkIsAdmin }