const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("./models/user.js");

router.post("", async function (req, res) {
    if (!req.body.email) {
        res.status(400).json({
            success: false,
            message: "Email not provided",
        });
        console.log("Email not provided");
        return;
    }

    let user = await User.findOne({ email: req.body.email })
        .exec()
        .catch(() => {
            console.log("User not found, email may be wrong.");
        });

    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    if (user.password != req.body.password) {
        res.status(400).json({ success: false, message: "Wrong password" });
        return;
    }

    var payload = {
        email: user.email,
        id: user._id,
        user_level: user.user_level,
    };

    var token = jwt.sign(payload, process.env.SECRET, {});

    res.json({
        success: true,
        token: token,
        email: user.email,
        id: "/users/" + user._id,
        user_level: user.user_level,
    });
});

module.exports = router;
