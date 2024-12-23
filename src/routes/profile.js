const express = require('express');
const userProfileRouter = express.Router();
const verifyUser = require('../middlewares/auth');
const { validateEditProfileData} = require('../utils/validation');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

userProfileRouter.get("/view", verifyUser, async (req, res) => {
    try {
        const {userInfo} = req;

        const serverResponse = new ApiResponse(200, userInfo , "user info")
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

        const message = `${loggedInUser.firstName}, your profile updated successfuly`

        const serverResponse = new ApiResponse(200, loggedInUser , message)
        res.status(200).json(serverResponse)
        
     } catch (error) {
        res.status(404).json(new ApiError(400, "Error " + error.message))
     }
})

module.exports = userProfileRouter