const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const errResp = require("./errors/errorResponse.js");

const User = require("./models/user.js");

router.post("", async function (req, res) {
    if (!req.body.email) {
        errResp.missingAttribute(res, email);
        return;
    }

    let user = await User.findOne({ email: req.body.email })
        .exec()
        .catch(() => errResp.emailNotValid(res));

    if (!user) {
        errResp.userNotFound(res);
        return;
    }

    if (user.password != req.body.password) {
        errResp.authenticationFailed(res, "Wrong password");
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
