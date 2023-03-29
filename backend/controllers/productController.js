
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js';


//@desc     Fetch all product
//@route    GET /api/products/
//@access   Public
const getProducts = asyncHandler(async (req, res) => { 
    const products = await Product.find({});

    res.json(products)
});
//@desc     Fetch by search
//@route    GET /api/products/search
//@access   Public
const PAGE_SIZE = 3;
const getProductBySearch = asyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
        ? {
            name: {
            $regex: searchQuery,
            $options: 'i',
            },
        }
        : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
        price && price !== 'all'
            ? {
                // 1-50
                price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1]),
                },
            }
            : {};
        
    const sortOrder =
        order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };
            
    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
        })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);
        
    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
        });
        
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
        });
});

//@desc     Fetch by categories
//@route    GET /api/products/category
//@access   Public
const getProductByCategories = asyncHandler(async (req, res) => {
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
    getProductBySearch,
    getProductByCategories,
};