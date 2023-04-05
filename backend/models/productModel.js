import mongoose from 'mongoose';


// REVIEWS SCHEMA
const reviewSchema = mongoose.Schema({
    name: {type: String, 
        required: true
    },
    rating: {type: Number, 
        required: true
    },
    comment: {type: String, 
        required: true
    },
}, {timestamps: true});

// PRODUCT SCHEMA
const productSchema = mongoose.Schema({
    //To ref admin  know created wich product
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name:{
        type: String, 
        required: true,
        unique: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    images:[String],
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    numReviews: {
        type: Number,
        required: true
    },
    reviews: [reviewSchema],
}, {
    timestamps: true
});


const Product = mongoose.model('Product', productSchema);

export default Product;