const express = require('express');
const userRouter = express.Router();

const verifyUser = require('../middlewares/auth');
const ConnectionInvite = require('../models/connectionInvite.model');
const User = require('../models/user.model');

const SAFE_DATA = "firstName lastName photoURL age gender about skills";

userRouter.get("/user/request/received", verifyUser, async (req, res) => {
    try {
        const loggedInUser = req.userInfo;

        const allConnectionRequests = await ConnectionInvite.find({
            toUserId : loggedInUser._id,
            status : "interested",
        })
        populate("fromUserId", SAFE_DATA);

        res.status(200).json({
            message : "all connection requests",
            allConnectionRequests
        })
    } catch (error) {
        res.status(400).json({
            message : "Error " + error.message
        })
    }
})


userRouter.get("/user/connections", verifyUser, async (req, res) => {    
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
    throw new Error("No connection requests found")
   }
     
   const myConnectionRequests = allConnections.forEach((connection) => {
    if(connection.fromUserId.toString() === loggedInUser._id.toString()){
        return connection.toUserId
    }
    return connection.fromUserId
   })

   res.status(200).json({
    message : "your connection requests",
    myConnectionRequests
   })
    
  } catch (error) {
    res.status(200).json({
        message : "Error " + error.message
    })
  }
})


userRouter.get("/user/core", verifyUser, async (req, res) => {
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
   

         res.json({ data: allUsers });
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = userRouter