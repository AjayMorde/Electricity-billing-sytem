const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('./userLogin');

const purchasepremium = async(req, res) => {
    try {

        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });




        const amount = 122250;
        const order = await rzp.orders.create({ amount, currency: "INR" }); //this is for creating a new payment order
        console.log('=========================================================================>', order);

        await req.user.createOrder({ orderid: order.id, status: 'PENDING' }); // savbe user order id in db and now keep a status is pensing

        res.status(201).json({ order, key_id: rzp.key_id });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'something went wrong', error });
    }
};

const updateTransactionStatus = async(req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id, status } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } }) //2
        if (status === 'FAILED') {
            await order.update({ status: 'FAILED' });
            return res.status(202).json({ Success: true, message: "Transaction Failed" });
        }
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
        const promise2 = req.user.update({ ispremiumuser: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: true, message: "Transaction Successful", token: userController.generateAccessToken(userId, undefined, true) });
        }).catch((error) => {
            throw new Error(error)
        })



    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}