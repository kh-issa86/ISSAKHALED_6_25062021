// import packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
require("dotenv").config();

// Fonction Signup

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // we call the hash function of bcrypt in our password and ask it to "hash" the password 10 times.
    // this is an asynchronous function that returns a Promise in which we receive the generated hash;
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save() // we create a user and save it to the database, returning a success response on success,
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error })); // and errors with the error code in case of failure;
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de Login

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              // we use jsonwebtoken's sign function to encode a new token;
              { userId: user._id }, // this token contains the user's ID as a payload (the data encoded in the token);
              process.env.KEYTOKEN,
              { expiresIn: "24h" } // we set the validity period of the token to 24 hours. The user will therefore have to reconnect after 24 hours;
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
