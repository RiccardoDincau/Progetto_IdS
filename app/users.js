const express = require("express");
const router = express.Router();
module.exports = router;

const User = require("./models/user.js");
const Enums = require("./models/enums.js");
const tokenChecker = require("./tokenChecker.js");

function displayedUsers(mongooseUser) {
    return {
        _id: mongooseUser._id,
        name: mongooseUser.name,
        email: mongooseUser.email,
        user_level: mongooseUser.user_level,
        reports: mongooseUser.reports,
    };
}

//GET methods
router.get("", async (req, res) => {
    let possibleQueries = ["user_level"];
    let interrupt = false;

    //Check to filter only the available query strings
    let finalQueries = {};
    for (let el of possibleQueries) {
        if (req.query[el]) finalQueries[el] = req.query[el];
    }

    //Check if the value is included in its enum domain
    if (req.query["user_level"]) {
        if (!Enums.user_level["enum"].includes(req.query["user_level"])) {
            res.status(400).send("User level is not valid");
            return;
        }
    }

    let usersFound = await User.find(finalQueries).catch((err) => {
        console.log("The parameter inserted is not accepted");
        res.status(400).send("The parameter inserted is not accepted");
        interrupt = true;
    });

    if (!usersFound) {
        if (!interrupt) res.status(404).send("User not found");
        return;
    }

    usersFound = usersFound.map(displayedUsers);
    //Returns the same list passed with a format used by mongoose, but with a json format

    res.status(200).json(usersFound);
});

router.get("/:id", async (req, res) => {
    let interrupt = false;

    //Search of the users given the id by the request
    let usersFound = await User.findById(req.params.id)
        .exec()
        .catch((err) => {
            res.status(400).send("ID is not properly formatted");
            interrupt = true;
            return;
        });

    if (interrupt) return;

    //Handling of the case in which there's no found user
    if (!usersFound) {
        res.status(404).send("User not found");
        console.log("User not found");
        return;
    }

    res.status(200).json(displayedUsers(usersFound));
});

//POST methods
router.post("", async (req, res) => {
    let requiredAttributes = ["name", "email", "user_level", "password"];

    //req.body is an object (like a dictionary) which contains the parameters passed
    let body = req.body;
    for (let el of requiredAttributes) {
        if (!body[el]) {
            console.log("Missing attribute: ", el);
            res.status(400).send("Missing attribute: " + el);
            return;
        }
    }

    //Check if the email is already used by a user
    let email = body["email"];
    email = await User.findOne({ email: email }).exec();
    if (email) {
        res.status(400).send("Email already registered");
        return;
    }

    //Add the user in the database
    let user = new User(body);
    user = await user.save().catch((err) => {
        console.log(err);
        console.log("Error occured while saving ...");
        res.status(400).send("Error occured while saving ...");
        return null;
    });

    if (!user) {
        return;
    }
    res.location(req.path + user.id)
        .status(201)
        .send();
});

//DELETE methods
router.delete("/:id", tokenChecker, async (req, res) => {
    if (req.loggedUser.user_level != "admin") {
        res.status(403).send(
            "Unauthorized action, this user can not delete user."
        );
        return;
    }
    let userID = req.params.id;
    let interrupt = false;

    //Searching and deletion of the user based on the id
    let user = await User.findById(userID)
        .exec()
        .catch(() => {
            res.status(400).send("ID not accepted");
            interrupt = true;
        });
    if (interrupt) return;
    if (!user) {
        res.status(404).send("User not found");
        return;
    }
    User.deleteOne({ _id: user._id });
    res.status(201).send("Deletion completed");
});
