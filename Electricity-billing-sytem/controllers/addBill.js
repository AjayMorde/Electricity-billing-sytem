const Expense = require('../models/bill');
const Users = require('../models/user');
const sequelize = require('../connections/database');

const addExpense = async(req, res) => {
    const t = await sequelize.transaction(); // create a new database transaction 
    // console.log('========>t is ',t)
    function isValidData(data) {
        if (data == undefined || data.length === 0)
            return true;
        else {
            return false;
        }

    }


    try {
        const amount = req.body.Amount; // from here i extracts  all properties 
        const description = req.body.Description;
        const category = req.body.Category;
        const expenseDate = req.body.ExpenseDate;
        const payment = req.body.Payment;

        if (isValidData(amount) || isValidData(description) || isValidData(category)) {
            await t.rollback(); //roll back the transaction if err occur
            return res.status(400).json({ msg: 'add parameters' })
        }

        const expenseValues = await Expense.create({ // here i create a new expense record in my database
                amount: amount,
                description: description,
                category: category,
                expenseDate: expenseDate,
                payment: payment,
                UserId: req.user.id
            }, { transaction: t }) //  these operations should be executed within the transaction 

        const totalExpenses = req.user.totalExpenses + Number(amount);
        console.log('--------------maswooo----------', req.user.name);
        const [updatedRowCount] = await Users.update({ totalExpenses: totalExpenses }, { where: { id: req.user.id }, transaction: t });
        if (updatedRowCount !== 1) { // here this will exactly one row user record  updated. 
            throw new Error('user update failed');
        }
        await t.commit(); //that will be making all the changes permanent in the database.



        res.status(200).json({ Success: expenseValues });
    } catch (err) {
        console.log(err);
        await t.rollback(); //roll back the transaction if err occur
        res.status(500).json({ failed: "Error Occurred" });
    }
}

module.exports = { addExpense }