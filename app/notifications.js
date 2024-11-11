const express = require("express");
const router = express.Router();

const Notification = require("./models/notification.js");
const User = require("./models/user.js");
const Report = require("./models/report.js");
const tokenChecker = require("./tokenChecker.js");

function displayedNotification(mongooseNotification) {
    return {
        _id: mongooseNotification._id,
        title: mongooseNotification.title,
        content: mongooseNotification.content,
        report: mongooseNotification.report,
        user: mongooseNotification.user,
    };
}

router.get("", async (req, res) => {
    let notifications;

    if (req.query.user) {
        notifications = await Notification.find({
            user: req.query.user,
        }).exec();
    } else {
        notifications = await Notification.find({}).exec();
    }

    notifications = notifications.map(displayedNotification);

    res.status(200).json(notifications);
});

router.post("", async (req, res) => {
    let body = req.body;
    let title = body.title;
    let content = body.content;
    let userUrl = body.user;
    let reportUrl = body.report;

    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);
    let reportID = reportUrl.substring(reportUrl.lastIndexOf("/") + 1);

    let user = null;
    user = await User.findById(userID)
        .exec()
        .catch((err) => {
            console.log("Error in user quering.\n", err);
        });

    if (user == null) {
        res.status(400).json({ error: "User does not exist" });
        return;
    }

    let report = null;
    report = await Report.findById(reportID)
        .exec()
        .catch((err) => {
            console.log("Error in report quering.\n", err);
        });

    if (report == null) {
        res.status(400).json({ error: "Report does not exist" });
        return;
    }

    let notification = new Notification({
        title,
        content,
        user: userID,
        report: reportID,
    });

    notification = await notification.save();

    let notificationId = notification.id;

    res.location(req.path + notificationId)
        .status(201)
        .send();
});

router.get("/:id", async (req, res) => {
    let notification = await Notification.findById(req.params.id)
        .exec()
        .catch(() => {
            console.log("Error in Notification quering (Id may be wrong)");
        });

    if (!notification) {
        res.status(404).send();
        console.log("Notification not found");
        return;
    }

    res.status(200).json(displayedNotification(notification));
});

router.delete("/:id", tokenChecker, async (req, res) => {
    let notification = await Notification.findById(req.params.id)
        .exec()
        .catch(() => {
            console.log("Error in Notification quering (Id may be wrong)");
        });

    if (!notification) {
        res.status(404).send();
        console.log("Notification not found");
        return;
    }

    await Notification.deleteOne({ _id: notification._id });
    console.log("Notification removed");
    res.status(204).send();
});

module.exports = router;
