const Order = require('../model/Order');
const sendEmail = require('../utils/sendEmail');

const createOrder = async (req, res) => {
    try{
        const {items, totalPrice, address, paymentId } = req.body;

        if(!items || items.length === 0 || !totalPrice || !address )
            return res.status(400).json({ message: 'Invalid order data' });
        else {
            const order = new Order({
                user: req.user._id,
                items,
                totalPrice,
                address,
                paymentId
            });
            await order.save();

            const message = `Dear ${req.user.name},\n\nYour order has been placed successfully. Your order ID is ${order._id}.\nTotal Amount: $${order.totalPrice}\nShipping Address: ${order.address}\nThank you for shopping with us!`;

            await sendEmail(req.user.email, 'Order Confirmation', message);
            res.status(201).json({message:'Order Created Successfully'});
        } 
    }catch (error) {
        res.status(500).json({message:'Error Creating Order'});
    }
};

const myOrders = async (req, res) => {
    try{
        const order = await Order.find({user: req.user._id}).populate('products.productId', 'name price');     
        console.log(order);   
        console.log("-----------------------------------")   // Entire array
        console.log(order[0]);   
        
        res.json(order);
        
    }catch (error) {
        res.status(500).json({ message:'Error fetching order' });
    }
};


const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    }catch (error) {
        res.status(500).json({message:'Error fetching orders'});
    }
};


const updateOrderStatus = async (req, res) => {
    try{
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if(order){
            order.status = status;
            await order.save();
            res.json({ message: 'order status updated', order });
        }
        else{
            res.status(404).json({message: 'order not found'})
        }
    }catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
};


module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};