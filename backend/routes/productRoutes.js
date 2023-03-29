import express from 'express';
import {
    getProducts,
    getProductBySearch,
    getProductByCategories,
    getProductById,
    getProductBySlug,
  
} from '../controllers/productController.js'; 



//Initialize router
const router = express.Router(); 

//ROUTES:
router.route('/').get(getProducts)
router.route('/categories').get(getProductByCategories)  
router.route('/search').get(getProductBySearch) 
router.route('/:id').get(getProductById)
router.route('/slug/:slug').get(getProductBySlug) 
 


export default router;