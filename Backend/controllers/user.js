
// import packages
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/User");


// Fonction Signup
// In this signup function:
// we call the hash function of bcrypt in our password and ask it to "hash" the password 10 times.
// The higher the value, the longer the function will run, and the more secure the hash will be.
// this is an asynchronous function that returns a Promise in which we receive the generated hash;
// in our then block, we create a user and save it to the database, returning a success response on success,
// and errors with the error code in case of failure;


exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de Login
// we use jsonwebtoken's sign function to encode a new token;
// this token contains the user's ID as a payload (the data encoded in the token);
// we use a secret temporary development string RANDOM_SECRET_KEY to encode our token
// (to be replaced by a much longer random string for production);
// we set the validity period of the token to 24 hours. The user will therefore have to reconnect after 24 hours;
// we send the token back to the front-end with our response.

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'h&^%yut876&^76',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
