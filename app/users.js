const express = require("express");
const router = express.Router();
module.exports = router;

const User = require("./models/user.js");
const Enums = require("./models/enums.js");
const tokenChecker = require("./tokenChecker.js");
const errResp = require("./errors/errorResponse.js");

function displayedUsers(mongooseUser) {
    return {
        _id: mongooseUser._id,
        name: mongooseUser.name,
        email: mongooseUser.email,
        user_level: mongooseUser.user_level,
        reports: mongooseUser.reports,
        notifications: mongooseUser.notifications,
    };
}

//GET methods
router.get("", async (req, res) => {
    let possibleQueries = ["user_level"];

    //Check to filter only the available query strings
    let finalQueries = {};
    for (let el of possibleQueries) {
        if (req.query[el]) finalQueries[el] = req.query[el];
    }

    //Check if the value is included in its enum domain
    if (req.query["user_level"]) {
        if (!Enums.user_level["enum"].includes(req.query["user_level"])) {
            errResp.user_levelNotValid(res);
            return;
        }
    }

    let usersFound = await User.find(finalQueries);

    if (!usersFound) {
        errResp.userNotFound(res);
        return;
    }

    usersFound = usersFound.map(displayedUsers);
    //Returns the same list passed with a format used by mongoose, but with a json format

    res.status(200).json(usersFound);
});

router.get("/:id", async (req, res) => {
    //Search of the users given the id by the request
    let user = await User.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    //Handling of the case in which there's no found user
    if (!user) {
        errResp.userNotFound(res);
        return;
    }

    res.status(200).json(displayedUsers(user));
});

//POST methods
router.post("", async (req, res) => {
    let requiredAttributes = ["name", "email", "password"];

    //req.body is an object (like a dictionary) which contains the parameters passed
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
    user.user_level = 'citizen';
    user = await user.save().catch(() => errResp.userMalformed(res));

    if (!user) {
        errResp.userNotFound(res);
        return;
    }
    res.location(req.path + user.id)
        .status(201)
        .send();
});
