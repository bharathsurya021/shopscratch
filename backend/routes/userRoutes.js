import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js'
import { protect, checkIsAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(protect, checkIsAdmin, getUsers)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/register').post(registerUser)
router.route('/:id')
    .delete(protect, checkIsAdmin, deleteUser)
    .get(protect, checkIsAdmin, getUserById)
    .put(protect, checkIsAdmin, updateUser)


export default router