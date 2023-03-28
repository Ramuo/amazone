import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js';


//@desc     Fetch all product
//@route    GET /api/products/
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products)
});
//@desc     Fetch by categories
//@route    GET /api/products/category
//@access   Public
const getProductByCategory = asyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    
    res.send(categories);
});


//@desc     Fetch single product
//@route    GET /api/products/:id
//@access   Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product)
    } else {
        res.status(404).json({message: 'Product not found'})
    }
});

//@desc     Fetch product by slug
//@route    GET /api/products/slug/:slug
//@access   Public
const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
        res.send(product);
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
});

export {
    getProducts,
    getProductById,
    getProductBySlug, 
    getProductByCategory,
};