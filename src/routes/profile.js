const express = require('express');
const userProfileRouter = express.Router();
const verifyUser = require('../middlewares/auth');

const { validateEditProfileData} = require('../utils/validation')

userProfileRouter.get("/profile/view", verifyUser, async (req, res) => {
    try {
        const {userInfo} = req;

        res.status(200).json({ 
            message : "user info",
            userInfo
        })

    } catch (error) {
        res.status(404).json({
            message : "Error " + error.message
        })
    }
})

userProfileRouter.patch('/profile/edit', verifyUser, async (req, res) => {
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

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            userInfo: loggedInUser,
          });
        
     } catch (error) {
        res.status(400).json({
            message : "Error " + error.message
        })
     }
})

module.exports = userProfileRouter