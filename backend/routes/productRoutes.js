import express from 'express';
import {
    getProducts,
    getProductById,
    getProductBySlug
} from '../controllers/productController.js';



//Initialize router
const router = express.Router();

//ROUTES:
router.route('/').get(getProducts) 
router.route('/:id').get(getProductById) 
router.route('/slug/:slug').get(getProductBySlug) 




export default router;