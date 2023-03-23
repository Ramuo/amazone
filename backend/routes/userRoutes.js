import express from 'express'
import {
    signinUser
} from '../controllers/userController.js';


//Initialize route
const router = express.Router();


//ROUTES:
router.route('/signin').post(signinUser)




export default router

