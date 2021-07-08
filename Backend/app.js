// import packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config()
const path = require('path');

// Add routes for identification & authentication
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// initialize the app variable which will contain 'express'
const app = express();


// Connection to the MongoDB database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_MP}@${process.env.DB_NAME}.nnoff.mongodb.net/sopekocko?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// This part configures and authorizes Multi-Origin requests; defines Headers & Methods
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});


// Define the json function as global middleware for the application
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Registration of the router for all requests made to / api / sauces / user.
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Used to export the created application (in this case, it becomes accessible for server.js)
module.exports = app;