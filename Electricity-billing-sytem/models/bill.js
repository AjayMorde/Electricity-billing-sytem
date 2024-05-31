const Sequelize = require('sequelize');
const sequelize = require('../connections/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    unique: true,
    primaryKey: true,

  },
  amount: Sequelize.FLOAT,
  payment: {
    type: Sequelize.STRING, 
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false
  },
  expenseDate: {
    type: Sequelize.DATE, 
    allowNull: false
  },
});


module.exports = Expense
