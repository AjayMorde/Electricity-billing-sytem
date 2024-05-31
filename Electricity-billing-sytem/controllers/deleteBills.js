const Expense = require('../models/bill');
const Users = require('../models/user');
const sequelize = require('../connections/database');


const deleteExpense = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;


        if (expenseId == undefined || expenseId.length === 0) {
            return res.status(400).json({ success: false });
        }
        const expense = await Expense.findByPk(expenseId);
        await Users.update({
            totalExpenses: req.user.totalExpenses - expense.amount,
        }, { where: { id: req.user.id } }, { transaction: t });


        let destroy = await Expense.destroy({ where: { id: expenseId, UserId: req.user.id } }, { transaction: t });

        if (destroy === 0) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'expense not match to the user'
            });
        }

        return res.status(200).json({ success: true, message: 'Deleted Successfully' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ failed: "Error Occurred" });
    }
}

module.exports = { deleteExpense }