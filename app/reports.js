const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");
const Enums = require("./models/enums.js");
const Notification = require("./models/notification.js");
const Comment = require("./models/comment.js");
const tokenChecker = require("./tokenChecker.js");

const errResp = require("./errors/errorResponse.js");

function displayedReport(mongooseReport) {
    return {
        _id: mongooseReport._id,
        title: mongooseReport.title,
        content: mongooseReport.content,
        user: mongooseReport.user,
        votes: mongooseReport.votes,
        position: mongooseReport.position,
        kind: mongooseReport.kind,
        category: mongooseReport.category,
        state: mongooseReport.state,
        comments: mongooseReport.comments,
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

function notificationTitleAndContent(mongooseReport) {
    let title = "";
    let content = "";
    let reportID = mongooseReport.id;
    let state = mongooseReport.state;
    switch (state) {
        case "active":
            console.log("Changed to active");
            title = "Report switched to active!";
            content =
                "The report " +
                reportID +
                " has been switched to active state.";
            break;

        case "work_in_progress":
            console.log("Changed to work in progress");
            title = "Report switched to work in progress!";
            content =
                "The report " +
                reportID +
                " has been switched to work in progress state.";
            break;

        case "archived":
            console.log("Changed to archived");
            title = "Report switched to archived!";
            content =
                "The report " +
                reportID +
                " has been switched to archived state.";
            break;

        default:
            break;
    }
    return new Notification({
        title: title,
        content: content,
        report: reportID,
    });
}

router.get("", async (req, res) => {
    let possibleQueries = ["state", "kind", "category", "position"];

    let sentQueries = {};

    let userUrl = req.query["user"];

    if (userUrl) {
        let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

        let user = null;
        user = await User.findById(userID)
            .exec()
            .catch(() => {
                errResp.idNotValid(res);
            });

        if (!user) {
            errResp.userNotFound(res);
            return;
        }
        sentQueries.user = userID;
    }

    for (let q of possibleQueries) {
        if (req.query[q]) sentQueries[q] = req.query[q];
    }

    //Check if the values are included in their corrispondent domain
    if (req.query["state"]) {
        if (!Enums.state["enum"].includes(req.query["state"])) {
            errResp.stateNotValid(res);
            return;
        }
    }

    if (req.query["kind"]) {
        if (!Enums.kind["enum"].includes(req.query["kind"])) {
            errResp.kindNotValid(res);
            return;
        }
    }

    if (req.query["category"]) {
        if (!Enums.category["enum"].includes(req.query["category"])) {
            errResp.categoryNotValid(res);
            return;
        }
    }

    console.log("Queries requested: ", sentQueries);

    let reports = await Report.find(sentQueries);

    reports = reports.map(displayedReport);

    res.status(200).json(reports);
});

router.post("", tokenChecker, async (req, res) => {
    let requiredAttributes = [
        "title",
        "content",
        "position",
        "kind",
        "category",
        "state",
    ];

    let userUrl = req.loggedUser.id;
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

    let user = null;
    user = await User.findById(userID)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!user) {
        errResp.userNotFound(res);
        return;
    }

    let reportAttributes = {};
    reportAttributes["user"] = userID;
    reportAttributes["votes"] = 0;

    for (let attr of requiredAttributes) {
        if (req.body[attr] == undefined) {
            errResp.missingAttribute(res, attr);
            return;
        }

        reportAttributes[attr] = req.body[attr];
    }

    let report = new Report(reportAttributes);

    report = await report.save().catch(
        errResp.reportMalformed(res, {
            message: "An invalid enum was probably given",
        })
    );
    if (!report) return;
    let reportId = report.id;

    //Modification of the user by adding the report's ID in the corrispondent field
    let newUser = await User.findById(userID).exec();
    let usrReport = newUser.reports;
    user = await User.findByIdAndUpdate(userID, {
        reports: usrReport.push(reportId),
    }).exec();

    res.location(req.path + reportId)
        .status(201)
        .send();
});

router.get("/:id", async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    res.status(200).json(displayedReport(report));
});

router.put("/:id", tokenChecker, async (req, res) => {
    let { votes, state } = req.body;

    let previousReport = await Report.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!previousReport) {
        errResp.reportNotFound(res);
        return;
    }

    let previousState = previousReport.state;

    if (
        state &&
        previousState != state &&
        req.loggedUser.user_level != "admin"
    ) {
        errResp.unauthorizedAction(
            res,
            "This user can not change the state of the report"
        );
        return;
    }

    let report = await Report.findByIdAndUpdate(req.params.id, { votes, state })
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    report = await Report.findById(req.params.id); 

    //Here starts the notification sending
    if (report.state != previousState) {
        console.log("Notifica inviata");
        // inserire l'invio della notifica
        let notification = notificationTitleAndContent(report);

        notification = await notification.save();

        let comments = await Comment.find({ report: report.id }).exec();

        for (let el of comments) {
            let userID = el.user;

            let user = await User.findById(userID).exec();

            let notifications = user.notifications;
            notifications.push(notification.id);

            await User.findByIdAndUpdate(user.id, { notifications }).exec();
        }
    }

    res.status(200).json(displayedReport(report));
});

router.delete("/:id", tokenChecker, async (req, res) => {
    if (req.loggedUser.user_level != "admin") {
        errResp.unauthorizedAction(res, "This user can not delete a report");
        return;
    }

    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    await Report.deleteOne({ _id: report._id });
    console.log("Report removed");
    res.status(204).send();
});

module.exports = router;
