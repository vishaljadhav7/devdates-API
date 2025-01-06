const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyUser = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // If no token is provided from either source
    if (!token) {
      throw new Error('Token not provided in cookies or headers');
    }

    // Verify token
    const decodedMessage = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decodedMessage;

    // Fetch user from the database
    const userInfo = await User.findById(_id);
    if (!userInfo) {
      throw new Error('User not found');
    }

    // Attach user info to the request object
    req.userInfo = userInfo;

    next();

  } catch (error) {
    console.error('Token Verification Error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Unauthorized: ' + error.message,
    });
  }
};

module.exports = verifyUser;
