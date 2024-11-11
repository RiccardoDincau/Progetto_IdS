const express = require("express");
const router = express.Router();

const Notification = require("./models/notification.js");
const User = require("./models/user.js");
const Report = require("./models/report.js");

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
    let interrupt = false;
    //Scenario in which a query has been added
    if (req.query.user) {
        let user = req.query.user;
        notifications = await Notification.find(user)
            .exec()
            .catch((err) => {
                //Check of the parameter format
                res.status(400).send("User has an incorret format");
                interrupt = true;
                return null;
            });
        //Exits if an error has been occurred
        if (interrupt) return;
    } else notifications = await Notification.find({}).exec();

    if (!notifications) {
        res.status(404).send("Notification not found");
        return;
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
    let interrupt = false;

    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);
    let reportID = reportUrl.substring(reportUrl.lastIndexOf("/") + 1);

    let user = null;
    user = await User.findById(userID)
        .exec()
        .catch((err) => {
            console.log("Error in user quering.\n", err);
            interrupt = true;
        });

    if (!user) {
        if (!interrupt) res.status(400).json({ error: "User does not exist" });
        return;
    }

    interrupt = false;
    let report = null;
    report = await Report.findById(reportID)
        .exec()
        .catch((err) => {
            res.status(400).send("Error in report quering");
            interrupt = true;
        });

    if (!report) {
        if (!interrupt) res.status(404).send("Report not found");
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
    let interrupt = false;
    let notification = await Notification.findById(req.params.id)
        .exec()
        .catch(() => {
            console.log("Error in Notification quering (Id may be wrong)");
            res.status(400);
            interrupt = true;
        });

    if (!notification) {
        if (!interrupt) res.status(404).send("Notification not found");
        return;
    }

    res.status(200).json(displayedNotification(notification));
});

router.delete("/:id", async (req, res) => {
    let notificationID = req.params.id;

    //Searching and deletion of the notification based on the id
    User.findByIdAndDelete(notificationID)
        .exec()
        .then((doc) => {
            if (!doc) {
                res.status(404).send("User not found");
            }
            res.status(200).send(`Deleted user: ${doc._id}`);
            return;
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send("ID not accepted");
        });
});

module.exports = router;
