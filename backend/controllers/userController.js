import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/token.js'

// @desc Auth user & gettoken
// @route Post /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)

        throw new Error('Invalid email or password')
    }
})



// @desc register a new user
// @route Post /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already Exists')
    }

    const user = await User.create({
        name,
        email,
        password
    })


    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid User data')
    }
})


// @desc Get user profile
// @route GEt /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    res.send('Success')
})


// @desc update user profile
// @route put /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    res.send('Success')
})

// @desc Get all users
// @route GEt /api/users
// @access Private/admin

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// @desc delete user
// @route delete /api/users/:id
// @access Private/admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({
            message: 'User removed'
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc Get user by id
// @route GEt /api/users/:id
// @access Private/admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


// @desc update any user
// @route put /api/users/:id
// @access Private/admin

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    res.send('Success')
})

export { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser }
