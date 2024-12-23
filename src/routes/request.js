const express = require('express');
const requestRouter = express.Router();

const verifyUser = require('../middlewares/auth')
const User = require('../models/user.model')
const ConnectionInvite = require('../models/connectionInvite.model'); 

const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');



requestRouter.post('/send/:status/:toUserId', verifyUser, async (req, res) => {
    try {
        const {status, toUserId} = req.params;
        const fromUserId = req.userInfo._id;

        if(!["interested" , "ignored"].includes(status)){
            throw new Error("invalid status")
        }
      
        const doesReceiverIdExist = await User.findById({_id : toUserId})

        if(!doesReceiverIdExist){
            throw new Error("user does not exist")
        }

        const existingRequests  = await ConnectionInvite.findOne({
            $or : 
            [
                {fromUserId, toUserId}, 
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })

        if(existingRequests){
            throw new Error("connection already exist")
        }
       
        const newConnectionRequest = new ConnectionInvite({
            fromUserId,
            toUserId,
            status 
        })
      

        await newConnectionRequest.save();
        
        const message = req.userInfo._id + " is " + status + " in " + toUserId;

        const serverResponse = new ApiResponse(200, newConnectionRequest, message)
        res.status(200).json(serverResponse)

    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    }

})

requestRouter.post("/review/:status/:requestId", verifyUser, async (req, res) => {
    try {
        const loggedInUser = req.userInfo;
        const {status, requestId} = req.params;
        
        if(!["accepted", "rejected"].includes(status)){
            throw new Error("invalid status")
        }
       
        const existingConnectionRequest = await ConnectionInvite.findOne({
            _id : requestId,
            toUserId: loggedInUser._id,
            status : "interested"
        })

        if(!existingConnectionRequest){
            throw new Error("connection request not found")
        }
         
        existingConnectionRequest.status = status

        await existingConnectionRequest.save();

        const message = "connection status updated with " + existingConnectionRequest.status 

        res.status(200).json(new ApiResponse(200, null, message))

    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    }
})

module.exports = requestRouter