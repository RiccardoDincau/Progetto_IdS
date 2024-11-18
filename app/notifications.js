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
        req.loggedUser.user_level != "admin" &&
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
    if (
        req.loggedUser.user_level != "admin" &&
        req.params.userID != req.loggedUser.id
    ) {
        errResp.unauthorizedAction(
            res,
            "Cannot access another user notification."
        );
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

//DELETE methods
router.delete(
    "/:userID/notifications/:notID",
    tokenChecker,
    async (req, res) => {
        if (
            req.loggedUser.user_level != "admin" &&
            req.params.userID != req.loggedUser.id
        ) {
            errResp.unauthorizedAction(
                res,
                "Cannot access another user notifications."
            );
        }

        let notificationID = req.params.notID;
        let userId = req.params.userID;

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

        res.status(201).send();
    }
);

module.exports = router;
