const express = require("express");
const router = express.Router();
module.exports = router;

const User = require("./models/user.js");
const Enums = require("./models/enums.js");

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
        return null;
    });
    if (!usersFound) return;

    usersFound = usersFound.map(displayedUsers);
    //Returns the same list passed with a format used by mongoose, but with a json format

    res.status(200).json(usersFound);
});

router.get("/:id", async (req, res) => {
    let interrupt=false;
    let usersFound = await User.findById(req.params.id)
        .exec()
        .catch((err) => {
            res.status(400).send("ID is not properly formatted");
            interrupt=true;
            return;
        });
    
    if (interrupt){
        return;
    }
    if (!usersFound) {
        res.status(404).send("User not found");
        console.log("User not found");
        return;
    }

    res.status(200).json(displayedUsers(usersFound));
});

//POST methods
router.post("", async (req, res) => {
    let requiredAttributes = ["name", "email", "user_level"];

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
router.delete("/:id", async (req, res) => {
    let userID = req.params.id;

    User.findByIdAndDelete(userID)
        .exec()
        .then((doc) => {
            if (!doc) {
                res.status(404).send("User not found");
                return;
            }
            res.status(200).send(`Deleted user: ${doc._id}`);
            return;
        })

        .catch((err) => {
            console.log(err);
            res.status(400).send("ID not accepted");
        });
});
