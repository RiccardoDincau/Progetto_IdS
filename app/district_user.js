const express = require("express");
const router = express.Router();
module.exports = router;

const User = require("./models/user.js");
const tokenChecker = require("./tokenChecker.js");
const errResp = require("./errors/errorResponse.js");

router.post('', tokenChecker, async (req, res) => {
    if (req.loggedUser.user_level != 'admin'){
        errResp.unauthorizedAction(res);
        return;
    }

    let requiredAttributes = ["name", "email", "password"];

    let body = req.body;
    for (let el of requiredAttributes) {
        if (!body[el]) {
            errResp.missingAttribute(res, el);
            return;
        }
    }

    //Check if the email is already used by a user
    let email = body["email"];
    email = await User.findOne({ email }).exec();
    if (email) {
        errResp.emailAlredyRegistered(res);
        return;
    }

    //Add the user in the database
    let user = new User(body);
    user.notifications = [];
    user.user_level = 'district';
    user = await user.save().catch(() => errResp.userMalformed(res));

    if (!user) {
        errResp.userNotFound(res);
        return;
    }
    res.location(req.path + user.id)
        .status(201)
        .send();
})
