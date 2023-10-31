// authMiddleware.js
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.USER_JWT_SECRET

function userAuth(req, res, next) {
  const token = req.header('x-access-token'); // You may choose a different way to pass the token in the request header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' });
  }


  try {
    const decoded = jwt.verify(token, jwtSecret); // Verify token
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // If the token is valid and the user is an admin, store the user ID in the request for later use
    req.user= decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = userAuth;
