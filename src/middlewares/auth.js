const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyUser = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    }


    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }


    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token not provided in cookies or headers',
      });
    }

 
    let decodedMessage;
    try {
      decodedMessage = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or malformed token',
      });
    }

    const { _id } = decodedMessage;


    const userInfo = await User.findById(_id);
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.userInfo = userInfo;
    next();

  } catch (error) {
    console.error('Token Verification Middleware Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: ' + error.message,
    });
  }
};

module.exports = verifyUser;
