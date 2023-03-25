import express from 'express'
import {
    signinUser,
    signupUser,
} from '../controllers/userController.js';


//Initialize route
const router = express.Router();


//ROUTES:
router.route('/signin').post(signinUser)
router.route('/signup').post(signupUser)




export default router

