const express = require('express');
const profileRouter = express.Router();
const verifyUser = require('../middlewares/auth');

const { validateEditProfileData} = require('../utils/validation')

profileRouter.get("/profile/view", verifyUser, async (req, res) => {
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

profileRouter.patch('/profile/edit', verifyUser, async (req, res) => {
     try {
        if(validateEditProfileData(req)){
          throw new Error('invalid edit request')
        }

        const loggedInUser = req.userInfo
        const userEditInfo = req.body

        Object.keys(userEditInfo).forEach((keyField) => {
            loggedInUser[keyField] = userEditInfo[keyField]
        })

        await loggedInUser.save(); 

        res.status(200).json({
            message : "profile updated!"
        })
        
     } catch (error) {
        res.status(400).json({
            message : "Error " + error.message
        })
     }
})

module.exports = profileRouter