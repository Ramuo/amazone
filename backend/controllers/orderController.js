import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';




// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
  
      const order = await newOrder.save();

      res.status(201).json({ message: 'Nouvelle commande créée', order });
});

// @desc    To get users & orders summarry 
// @route   GET /api/orders/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.aggregate([
    {
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const productCategories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });

});
// @desc    To get the order details
// @route   GET /api/orders/mine
// @access  Private
const getOrderDetails = asyncHandler(async (req, res) => {
  const orders = await Order.find({user: req.user._id});

  res.send(orders);
});


// @desc    Get an order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler (async (req, res) => {
  const order = await Order.findById(req.params.id)

  if(order){
    order.isDelivered = true
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder)
  }else{
    res.status(404)
    throw new Error('Commande introuvable');
  }
});

// @desc    To pay order
// @route   GET /api/orders/:id/pay
// @access  Private
const toPay = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if(order){
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json({message: 'Order Paid', order: updatedOrder});
  }else{
    res.status(404).json({message: 'Order Not found'});
  }
})
 
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  
  const orders = await Order.find().populate('user', 'name');

  res.json(orders)
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if(order){
    await order.deleteOne();
    res.json({message: 'Commande supprimée'})
  }else{
    res.status(404)
    throw new Error('Commande introuvable')
  }
  
});



export {
    addOrderItems,
    getOrderById,
    updateOrderToDelivered,
    toPay,
    getSummary,
    getOrderDetails,
    getOrders,
    deleteOrder 
}