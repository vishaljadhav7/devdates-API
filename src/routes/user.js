const express = require('express');
const userRouter = express.Router();

const verifyUser = require('../middlewares/auth');
const ConnectionInvite = require('../models/connectionInvite.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const SAFE_DATA = "firstName lastName photoURL age gender about skills";

userRouter.get("/request/received", verifyUser, async (req, res) => {
    try {
        const loggedInUser = req.userInfo;

        const allConnectionRequests = await ConnectionInvite.find({
            toUserId : loggedInUser._id,
            status : "interested",
        })
        .populate("fromUserId", SAFE_DATA);

        // const message = req.userInfo._id + " is " + status + " in " + toUserId;

        const serverResponse = new ApiResponse(200, allConnectionRequests, "all connection requests")
        res.status(200).json(serverResponse)

    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    }
})


userRouter.get("/connections", verifyUser, async (req, res) => {    
try{
   const loggedInUser = req.userInfo;

   const allConnections = await ConnectionInvite.find({
    $or : [
        {fromUserId : loggedInUser._id, status : "accepted"},
        {toUserId : loggedInUser._id, status : "accepted"}
    ]
   })
   .populate("fromUserId", SAFE_DATA)
   .populate("toUserId", SAFE_DATA)

   if(!allConnections.length){ 
   return res.status(200).json(new ApiResponse(200, [],  "No connection requests found"))
   }
     
   const myConnections = allConnections.map((connection) => {
    if(connection.fromUserId._id.toString() === loggedInUser._id?.toString()){
        return connection.toUserId
    }
    return connection.fromUserId
   })

   const serverResponse = new ApiResponse(200, myConnections, "your connections fetched succesfully")
   res.status(200).json(serverResponse)
    
  } catch (error) {
    res.status(404).json(new ApiError(400, "Error " + error.message))
  }
})


userRouter.get("/core", verifyUser, async (req, res) => {
    try {
        /*
        feed , show all users except ->
          loggedInUser
          all connections (whether status-> "interested", "rejected" , "ignored" , "accepted")
        */   
        
         const loggedInUser = req.userInfo._id 

        //  const page = parseInt(req.query.page) || 1;
        //  let limit = parseInt(req.query.limit) || 10;
        //  limit = limit > 50 ? 50 : limit;
        //  const skip = (page - 1) * limit;

         const allConnections = await ConnectionInvite.find({
            $or : [
                {fromUserId : loggedInUser._id},
                {toUserId :loggedInUser._id}
            ]
         }) ;

         const toIgnoreUsersFromFeed = new Set();

         allConnections.forEach((connection) => {
            toIgnoreUsersFromFeed.add(connection.fromUserId)
            toIgnoreUsersFromFeed.add(connection.toUserId)
         })

         const allUsers = await User.find({
            $and : [
                { _id : {$nin : Array.from(toIgnoreUsersFromFeed) }},
                {_id : {$ne : loggedInUser._id}}
            ] 
         })
         .select(SAFE_DATA)
        //  .skip(skip)
        //  .limit(limit);
   

        const serverResponse = new ApiResponse(200, allUsers , "your feed fetched succesfully")
        res.status(200).json(serverResponse)
         
    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    }
})

module.exports = userRouter