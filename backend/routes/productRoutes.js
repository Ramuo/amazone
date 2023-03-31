import express from 'express';
import {
    getProducts,
    createProduct,
    getAdmin,
    getProductBySearch,
    getProductByCategories,
    getProductById,
    getProductBySlug,
  
} from '../controllers/productController.js';
import {protect, isAdmin} from '../middleware/authMiddleware.js'  



//Initialize router
const router = express.Router(); 

//ROUTES:
router.route('/').get(getProducts).post(protect, isAdmin, createProduct)
router.route('/categories').get(getProductByCategories)  
router.route('/admin').get(protect, isAdmin, getAdmin) 
router.route('/search').get(getProductBySearch) 
router.route('/:id').get(getProductById)
router.route('/slug/:slug').get(getProductBySlug) 
 


export default router;