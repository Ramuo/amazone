
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js';


//@desc     Fetch all product
//@route    GET /api/products/
//@access   Public
const getProducts = asyncHandler(async (req, res) => { 
    const products = await Product.find({});

    res.json(products)
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'sample name ' + Date.now(),
        slug: 'sample-name-' + Date.now(),
        image: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description',
    })
  
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  })

const PAGE_SIZE = 3;
//@desc     Admin fetch products & pagination
//@route    GET /api/products/admin
//@access   Private
const getAdmin = asyncHandler(async (req, res) => { 
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments();

    res.json({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
      });
});


//@desc     Fetch by search
//@route    GET /api/products/search
//@access   Public
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
    createProduct,
    getProductById,
    getProductBySlug,
    getAdmin, 
    getProductBySearch,
    getProductByCategories,
};