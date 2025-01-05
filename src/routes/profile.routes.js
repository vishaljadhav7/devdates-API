const express = require('express');
const userProfileRouter = express.Router();
const verifyUser = require('../middlewares/auth');
const { validateEditProfileData} = require('../utils/validation');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');

userProfileRouter.get("/view", verifyUser, async (req, res) => {
    try {
        const {userInfo} = req;

        const userForView = await User.findById(userInfo._id).select("-password");

        const serverResponse = new ApiResponse(200, userForView , "user for view")
        res.status(200).json(serverResponse)

    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    }
})

userProfileRouter.patch('/edit', verifyUser, async (req, res) => {
     try {
        if(!validateEditProfileData(req)){
          throw new Error('invalid edit request')
        }

        const loggedInUser = req.userInfo
        const userEditInfo = req.body

        Object.keys(userEditInfo).forEach((keyField) => {
            loggedInUser[keyField] = userEditInfo[keyField]
        })

        await loggedInUser.save(); 

        const editedProfile = await User.findById(loggedInUser._id).select("-password");

        const message = `${editedProfile.firstName}, your profile updated successfuly`

        const serverResponse = new ApiResponse(200, editedProfile , message)
        res.status(200).json(serverResponse)
        
     } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
     }
})


userProfileRouter.get('/get-profile/:toUserId', verifyUser, async (req, res) => {
    try {
       const {toUserId} = req.params;
       
       if(!toUserId){
         throw new Error('user id required'); 
       }

       const userProfile = await User.findById(toUserId).select("-password");
     
       if(!userProfile){
        throw new Error('user does not exist'); 
       }

       return res.status(200).json(new ApiResponse(200, userProfile, 'user retrieved succesfully'))
       
    } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
    } 
})

module.exports = userProfileRouter