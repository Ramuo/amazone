import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import {errorHandler, notFound} from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Connect to the database
connectDB();

// Initialize de express app
const app = express();


//SET UP THE BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//ROUTES
app.get('/', (req, res) => {
  res.send('API is running....')
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);


//ERROR MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

//PORT
const PORT = process.env.PORT || 5000;


// Set up the server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

