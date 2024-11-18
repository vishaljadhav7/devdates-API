const express = require('express');
const profileRouter = express.Router();
const verifyUser = require('../middlewares/auth');

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

module.exports = profileRouter