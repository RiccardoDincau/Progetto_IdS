const express = require("express");
const router = express.Router();
module.exports = router;

const User = require("./models/user.js");

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
    let usersFound = await User.find(req.query).catch((err) => {
        console.log("The parameter inserted is not accepted");
        res.status(400).send("The parameter inserted is not accepted");
    });
    //req.query = contains the values passed as parameters of a query string
    //usersFound -> Returns an array of documents that satisfy the query criterias

    usersFound = usersFound.map(displayedUsers);
    //Returns the same list passed with a format used by mongoose, but with a json format

    res.status(200).json(usersFound);
});

router.get("/:id", async (req, res) => {
    let usersFound = await User.findById(req.params.id).exec();

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
            res.status(400).send("Missing attribute: ", el);
            return;
        }
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
