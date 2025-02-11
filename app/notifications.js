const express = require("express");
const router = express.Router();

const Notification = require("./models/notification.js");
const User = require("./models/user.js");
const Report = require("./models/report.js");
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

//GET methods
router.get("/:userID/notifications", tokenChecker, async (req, res) => {
    if (
        req.params.userID != req.loggedUser.id
    ) {
        errResp.unauthorizedAction(
            res,
            "Cannot access another user notifications."
        );
    }

    let user = await User.findById(req.params.userID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res);
        });

    if (!user) {
        errResp.userNotFound(res);
        return;
    }

    let userNotifications = [];
    for (let notID of user.notifications) {
        let newNot = await Notification.findById(notID).exec();
        userNotifications.push(newNot);
    }

    userNotifications = userNotifications.map(displayedNotification);

    res.status(200).json(userNotifications);
});

router.get("/:userID/notifications/:notID", tokenChecker, async (req, res) => {  
    let user = await User.findById(req.params.userID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res);
        });

    if(!user){
        errResp.userNotFound(res);
        return;
    }   

    if (
        req.loggedUser.user_level != "district" &&
        req.params.userID != req.loggedUser.id
    ) {
        errResp.unauthorizedAction(
            res,
            "Cannot access another user notification."
        );
        return;
    }

    let notification = await Notification.findById(req.params.notID)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!notification) {
        errResp.notificationNotFound(res);
        return;
    }

    res.status(200).json(displayedNotification(notification));
});

module.exports = router;
