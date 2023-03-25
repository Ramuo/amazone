import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js'



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



export {
    addOrderItems,
    getOrderById,
    toPay,
    getOrderDetails,
    
}