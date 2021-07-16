// import packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/User");
require("dotenv").config();

// Fonction Signup

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Password hashing by Bcrypt
      .then(
        hash => {
          // E-mail encryption in the database
          key = process.env.HASH_KEY;
          cipher = crypto.createCipher('aes192', key)
          cipher.update(req.body.email, 'binary', 'hex')
          encodedString = cipher.final('hex')
          const user = new User({
              email: encodedString,
              password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };

// Fonction Login

exports.login = (req, res, next) => {
  // E-mail encryption in order to compare it with the one in the database
  key = process.env.HASH_KEY;
  cipher = crypto.createCipher('aes192', key)
  cipher.update(req.body.email, 'binary', 'hex')
  encodedString = cipher.final('hex')
// Compare the encrypted email with the one in the database
User.findOne({ email: encodedString })
  .then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
   // Bcrypt compares the hash of the password here
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            // Authentification Token for 24h
            { userId: user._id },
            process.env.KEYTOKEN,
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};
