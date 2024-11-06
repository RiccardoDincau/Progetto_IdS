const express = require('express');
const router = express.Router();

const Notification = require("./models/notification.js");
const User = require("./models/user.js");
const Report = require("./models/report.js");

function displayedReport(mongooseUser) {
    return {
        _id: mongooseUser._id,
        name: mongooseUser.name, 
        email: mongooseUser.email, 
        user_level: mongooseUser.user_level,
        reports: mongooseUser.reports
    };
}
router.get("", async (req, res) => {
    let possibleQueries = ["not_logged", "citizen", "admin"];
    let sentQueries = {};
    for (let q of possibleQueries){
        if (req.query[q]) sentQueries[q] = req.query[q];
    }
    console.log("Queries requested: ", sentQueries);
    
})