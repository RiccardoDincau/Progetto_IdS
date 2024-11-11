const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("./models/user.js");

router.post("", async function (req, res) {
    let user = await User.findOne({ email: req.body.email })
        .exec()
        .catch(() => {
            console.log("User not found, email may be wrong.");
        });

    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.password != req.body.password) {
        res.status(400).json({ success: false, message: "Wrong password" });
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
        self: "/users/" + user._id,
    });
});

module.exports = router;
