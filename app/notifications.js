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
        _id: mongooseUser._id,
        name: mongooseUser.name,
        email: mongooseUser.email,
        user_level: mongooseUser.user_level,
        reports: mongooseUser.reports,
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

//POST methods
router.post("", async (req, res) => {
    let body = req.body;
    let title = body.title;
    let content = body.content;
    let reportUrl = body.report;

    let reportID = reportUrl.substring(reportUrl.lastIndexOf("/") + 1);

    let report = await Report.findById(reportID)
        .exec()
        .catch(() =>
            errResp.idNotValid(res, { message: "Report id is not valid" })
        );

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    let notification = new Notification({
        title,
        content,
        report: reportID,
    });

    notification = await notification.save();

    let notificationId = notification.id;
    let comments = await Comment.find({ report: reportID }).exec();

    let usersNewNotification = [];
    for (let el of comments) {
        usersNewNotification.push(el.user);
    }

    for (let el of usersNewNotification) {
        let user = await User.findById(el).exec();
        let notifications = user.notification;
        notifications.push(notificationId);
        User.findByIdAndUpdate(user.id, newUserAdd(user, notifications)).exec();
    }

    res.location(req.path + notificationId)
        .status(201)
        .send();
});

//DELETE methods
router.delete("/:id", tokenChecker, async (req, res) => {
    let notificationID = req.params.id;
    let userId = req.loggedUser.id;

    //Search of the user whereby was sent the request
    let user = await User.findById(userId).exec();

    let userNotification = user.notifications;
    let index = userNotification.indexOf(notificationID);

    //TODO: change the error response
    if (index == -1) {
        errResp.notificationNotFound(res);
        return;
    }

    userNotification.splice(index, 1);

    User.findByIdAndUpdate(
        userId,
        newUserDelete(user, userNotification)
    ).exec();

    res.status(200).send();
});

module.exports = router;
