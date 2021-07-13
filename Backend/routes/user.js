// import packages
const express = require("express");
const userCtrl = require("../controllers/user");

// Initialize the router
const router = express.Router();
const verifyPassword = require("../models/password");

// Define the routes
router.post("/signup", verifyPassword, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
