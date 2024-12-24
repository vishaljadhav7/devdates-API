const express = require('express');
const messageRouter = express.Router();
const {sendMessage, getMessages} = require('../controllers/message.controller')
const verifyUser = require('../middlewares/auth');

messageRouter.post('/send-message/:receiverId',verifyUser, sendMessage);
messageRouter.get('/get-message/:receiverId',verifyUser ,getMessages);


module.exports = messageRouter ;