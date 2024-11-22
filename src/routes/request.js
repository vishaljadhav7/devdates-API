const express = require('express');
const requestRouter = express.Router();

const verifyUser = require('../middlewares/auth')
const User = require('../models/user.model')
const ConnectionRequest = require('../models/connectionRequest.model') 

requestRouter.post('/request/send/:status/:toUserId', verifyUser, async (req, res) => {
    try {
        const {status, toUserId} = req.params;
        const fromUserId = req.userInfo._id;

        if(!["interested" ,  "ignored"].includes(status)){
            throw new Error("invalid status")
        }
      
        const doesReceiverIdExist = await User.findById({_id : toUserId})

        if(!doesReceiverIdExist){
            throw new Error("user does not exist")
        }

        const existingRequests  = await ConnectionRequest.findOne({
            $or : 
            [
                {fromUserId, toUserId}, 
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })

        if(existingRequests){
            throw new Error("connection already exist")
        }
       
        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status 
        })
      

        await newConnectionRequest.save()

        res.status(200).json({
            message : req.userInfo._id + " is " + status + " in " + toUserId,
            connection : newConnectionRequest
        })
    } catch (error) {
        res.status(400).json({
            message : "Error " + error.message
        })
    }

})

module.exports = requestRouter