const jwt = require('jsonwebtoken')
const user = require('../models/user.model')

const verifyUser = async (req, res, next) => {
  try {
    const {token} = req.cookies

    if(!token) throw new Error('invalid token')

    const decodedMessage = await jwt.verify(token, process.env.SECRET_KEY); 
    const {_id} = decodedMessage;

    const userInfo = await user.findById(_id);
    if(!userInfo) throw new Error('user not found');
    req.userInfo = userInfo;
    
    next();
    
  } catch (error) {
    res.status(400).json({
        message : "Error " + error.message
    })
  }
}

module.exports = verifyUser