import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import {errorHandler, notFound} from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import  orderRoutes from  './routes/orderRoutes.js'

dotenv.config();

// Connect to the database
connectDB();

// Initialize de express app
const app = express();
 

//SET UP THE BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
});

//ROUTES
app.get('/', (req, res) => {
  res.send('API is running....')
});
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);


//TO SERVE FRONTEND
if(process.env.NODE_ENV === 'production'){
  //Set build folder as static
  app.use(express.static(path.join(__dirname, '../frontend/build')))


  app.get('*', (req, res) => res.sendFile(__dirname, '../', 'frontend', 'build', 'index.html'))
}else{
  // to create a route
  app.get('/', (req , res)=> {
      res.status(200).json({message: 'Welcome to our e-commerce shop'})
  })
}


//ERROR MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

//PORT
const PORT = process.env.PORT || 5000;


// Set up the server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

