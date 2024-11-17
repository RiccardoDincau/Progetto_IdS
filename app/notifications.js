const express = require("express");
const router = express.Router();

const Notification = require("./models/notification.js");
const User = require("./models/user.js");
const Report = require("./models/report.js");
const Comment = require("./models/comment.js");
const tokenChecker = require("./tokenChecker.js");
const errResp = require("./errors/errorResponse.js");

function displayedNotification(mongooseNotification) {
    return {
        _id: mongooseNotification._id,
        title: mongooseNotification.title,
        content: mongooseNotification.content,
        report: mongooseNotification.report,
        user: mongooseNotification.user,
    };
}

function newUserDelete(oldUser, notifications) {
    return {
        _id: oldUser._id,
        name: oldUser.name,
        email: oldUser.email,
        user_level: oldUser.user_level,
        reports: oldUser.reports,
        notifications: notifications,
    };
}
function newUserAdd(oldUser, newNotifications) {
    return {
        _id: oldUser._id,
        name: oldUser.name,
        email: oldUser.email,
        user_level: oldUser.user_level,
        reports: oldUser.reports,
        notifications: newNotifications,
    };
}

//GET methods
router.get("", async (req, res) => {
    //Queries that are accepted by the API
    let possibleQueries = ["report"];
    let body = req.body;

    //Extracting only the query strings that are accepted by the API
    let acceptedQueries = {};
    for (let el of possibleQueries) {
        if (body[el]) acceptedQueries[el] = body[el];
    }

    //Finding the notifications that fulfill the requirements
    let notification = await Notification.find(acceptedQueries).exec();

    if (!notification) {
        errResp.notificationNotFound(res);
        return;
    }
    notification = notification.map(displayedNotification);

    res.status(200).json(notification);
});

router.get("/:id", async (req, res) => {
    let notification = await Notification.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!notification) {
        errResp.notificationNotFound(res);
        return;
    }

    res.status(200).json(displayedNotification(notification));
});

//DELETE methods
router.delete("/:id", tokenChecker, async (req, res) => {
    let notificationID = req.params.id;
    let userId = req.loggedUser.id;

    //Search of the user to whom was sent the request
    let user = await User.findById(userId).exec();

    let userNotification = user.notifications;
    let index = userNotification.indexOf(notificationID);

    if (index == -1) {
        errResp.notificationNotFound(res);
        return;
    }

    //The element associated to "index" is removed from the list
    userNotification.splice(index, 1);

    //The user is updated with the deleted notification
    User.findByIdAndUpdate(
        userId,
        newUserDelete(user, userNotification)
    ).exec();

    res.status(200).send();
});

module.exports = router;
