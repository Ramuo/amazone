import express from 'express';
import {
    addOrderItems,
    getOrderById,
    toPay,
    getOrderDetails
} from '../controllers/orderController.js';
import { protect} from '../middleware/authMiddleware.js';


//Initialize router
const router = express.Router();


//ROUTES:
router.route('/').post(protect, addOrderItems)
router.route('/mine').get(protect, getOrderDetails);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, toPay);




export default router;