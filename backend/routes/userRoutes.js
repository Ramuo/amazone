import express from 'express'
import {
    signinUser,
    signupUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js';
import {protect, isAdmin} from '../middleware/authMiddleware.js'


//Initialize route
const router = express.Router();


//ROUTES:
router.route('/').get(protect, isAdmin, getUsers)
router.route('/signin').post(signinUser)
router.route('/signup').post(signupUser)
router.route('/profile').put(protect, updateUserProfile)
router
    .route('/:id')
    .delete(protect, isAdmin, deleteUser )
    .get(protect, isAdmin, getUserById )
    .put(protect, isAdmin, updateUser )


 


export default router

