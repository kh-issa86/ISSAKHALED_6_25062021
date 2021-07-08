const jwt = require('jsonwebtoken');
require('dotenv').config()

// In this middleware:

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // we extract the token from the Authorization header of the incoming request. It will also contain the keyword Bearer.
    const decodedToken = jwt.verify(token, process.env.KEYTOKEN);// then we use the verify function to decode our token. If this is not valid, an error will be generated;
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {// if the request contains a user ID, we compare it to the one extracted from the token. If they are different, we generate an error;
      throw 'Invalid user ID';
    } else {
      next();// otherwise, everything works and our user is authenticated. We pass the execution using the next () function.

    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};