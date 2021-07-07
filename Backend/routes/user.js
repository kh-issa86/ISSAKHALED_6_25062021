// import packages
const express = require('express');
const userCtrl = require('../controllers/user');

// Initialize the router
const router = express.Router();

// Define the routes 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;