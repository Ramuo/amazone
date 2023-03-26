import express from 'express'
import {
    signinUser,
    signupUser,
    updateUserProfile,
} from '../controllers/userController.js';
import {protect} from '../middleware/authMiddleware.js'


//Initialize route
const router = express.Router();


//ROUTES:
router.route('/signin').post(signinUser)
router.route('/signup').post(signupUser)
router.route('/profile').put(protect, updateUserProfile)




export default router

