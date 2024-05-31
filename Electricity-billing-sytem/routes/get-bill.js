const express = require('express');
const router = express.Router();
const userautheticate = require('../middleware/auth');
const routes = require('../controllers/getBills');
router.get('/expense', userautheticate.authenticate, routes.getAllExpense)

module.exports = router