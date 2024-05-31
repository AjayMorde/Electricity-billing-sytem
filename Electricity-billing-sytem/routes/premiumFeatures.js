const express = require('express');
const router = express.Router();
const premiumFeatures = require('../controllers/payment');

const userautheticate = require('../middleware/auth');


router.get('/showLeaderBoard', userautheticate.authenticate, premiumFeatures.getUserLeaderBoard);
module.exports = router;