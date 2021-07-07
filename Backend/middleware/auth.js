const jwt = require('jsonwebtoken');

// In this middleware:
// Since many problems can occur, we put everything inside a try ... catch block;
// we extract the token from the Authorization header of the incoming request. It will also contain the keyword Bearer.
// We therefore use the split function to retrieve everything after the space in the header. Any errors generated here will be displayed in the catch block;
// then we use the verify function to decode our token. If this is not valid, an error will be generated;
// we extract the user ID from our token;
// if the request contains a user ID, we compare it to the one extracted from the token. If they are different, we generate an error;
// otherwise, everything works and our user is authenticated. We pass the execution using the next () function.

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'h&^%yut876&^76');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};