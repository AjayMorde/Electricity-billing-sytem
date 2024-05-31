const Expense = require('../models/bill');

const getAllExpense = async(req, res) => {
    try {
        const data = await Expense.findAll({ where: { UserId: req.user.id } }); // only those expense which id of that Expense match with User uid        

        res.status(200).json({ data: data })
    } catch (err) {
        console.log(err);
        res.status(400).json({ failed: "Error Occurred" });
    }
}

module.exports = { getAllExpense }