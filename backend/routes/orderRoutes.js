import express from 'express';
import {
    addOrderItems,
    getOrderById,
    updateOrderToDelivered,
    toPay,
    getSummary,
    getOrderDetails,
    getOrders,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, isAdmin} from '../middleware/authMiddleware.js';


//Initialize router
const router = express.Router();

 
//ROUTES:
router.route('/').post(protect, addOrderItems).get(protect, isAdmin, getOrders)
router.route('/summary').get(protect, isAdmin, getSummary); 
router.route('/mine').get(protect, getOrderDetails); 
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, toPay);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);
router.route('/:id').delete(protect, isAdmin, deleteOrder);





export default router;