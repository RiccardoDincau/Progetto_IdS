const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");
const tokenChecker = require("./tokenChecker.js");

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

function displayedComment(mongooseReport, mongooseComment) {
    return {
        _id: "/report/" + mongooseReport._id,
        _id: mongooseComment._id,
        content: mongooseComment.content,
        user: mongooseComment.user,
    };
}

function editUser(mongooseUser, newReportID) {
    return {
        _id: mongooseUser._id,
        name: mongooseUser.name,
        user_level: mongooseUser.user_level,
        email: mongooseUser.email,
        reports: mongooseUser.reports.concat([newReportID]),
    };
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
            .catch((err) => {
                console.log("Error in user quering.\n", err);
            });

        if (user == null) {
            res.status(400).json({ error: "User does not exist" });
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
            res.status(400).send("State is not valid");
            return;
        }
    }

    if (req.query["kind"]) {
        if (!Enums.kind["enum"].includes(req.query["kind"])) {
            res.status(400).send("Kind is not valid");
            return;
        }
    }

    if (req.query["category"]) {
        if (!Enums.category["enum"].includes(req.query["category"])) {
            res.status(400).send("Category is not valid");
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

    let userUrl = req.body["user"];
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

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

    let reportAttributes = {};
    reportAttributes["user"] = userID;

    for (let attr of requiredAttributes) {
        if (req.body[attr] == undefined) {
            console.log("Missing attribute:", attr);
            res.status(400).send("Missing attribute: " + attr);
            return;
        }

        reportAttributes[attr] = req.body[attr];
    }

    let report = new Report(reportAttributes);

    report = await report.save().catch((err) => {
        console.log("Error in report saving...");
        res.status(400).send(
            "Error in report saving, probably an invalid enum was given"
        );
        return null;
    });
    if (report == null) return;
    let reportId = report.id;

    //Modification of the user by adding the report's ID in the corrispondent field
    let newUser = await User.findById(userID).exec();
    newUser = editUser(newUser, reportId);
    user = await User.findByIdAndUpdate(userID, newUser).exec();

    res.location(req.path + reportId)
        .status(201)
        .send();
});

router.get("/:id", async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch((err) => {
            console.log("Error in Report quering (Id may be wrong)");
        });

    if (!report) {
        res.status(404).send("Report not found");
        console.log("Report not found");
        return;
    }

    res.status(200).json(displayedReport(report));
});

router.put("/:id", tokenChecker, async (req, res) => {
    let { votes, state } = req.body;

    let report = await Report.findById(req.params.id)
        .exec()
        .catch((err) => {
            console.log("Error in Report quering (Id may be wrong)");
        });

    if (!report) {
        res.status(404).send("Report not found");
        console.log("Report not found");
        return;
    }

    if (
        state &&
        report.state != state &&
        req.loggedUser.user_level != "admin"
    ) {
        res.status(403).send(
            "Unauthorized action, this user can not change state of the report"
        );
        return;
    }

    report = await Report.findByIdAndUpdate(req.params.id, { votes, state })
        .exec()
        .catch((err) => {
            console.log("Error in Report quering (Id may be wrong)");
        });

    if (!report) {
        res.status(404).send();
        console.log("Report not found");
        return;
    }

    report = await Report.findById(req.params.id);

    res.status(200).json(displayedReport(report));
});

router.delete("/:id", tokenChecker, async (req, res) => {
    if (req.loggedUser.user_level != "admin") {
        res.status(403).send(
            "Unauthorized action, this user can not delete a report"
        );
        return;
    }

    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => {
            console.log("Error in Report quering (ID may be wrong)");
        });

    if (!report) {
        res.status(404).send("Report not found. (ID may be wrong)");
        console.log("Report not found");
        return;
    }

    await Report.deleteOne({ _id: report._id });
    console.log("Report removed");
    res.status(204).send();
});

router.get("/:id/comments", async (req, res) => {
    let comments;

    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => {
            // find the report by the given id
            console.log("Error in Report quering (Id may be wrong)");
        });

    let sentQueries = {};
    if (req.query.user) {
        // req.query.user is in the format /user/:id
        sentQueries["user"] = req.query.user;

        let userUrl = req.query.user;
        let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1); // extract the id from the /user/:id string

        let user = null;
        user = await User.findById(userID)
            .exec()
            .catch((err) => {
                // find a user by his id
                console.log("Error in user quering.\n", err);
            });

        if (user == null) {
            res.status(400).send("User does not exist\n");
            return;
        }
    }

    comments = await report.comments.find({ sentQueries }).exec(); // return an array of comments (mongoose format)

    comments = comments.map(displayedComment); // displayComment on every element of the array comments

    res.status(200).json(comments); // return the array (json format)
});

router.get("/:reportID/comments/:commentID", async (req, res) => {
    let report = await Report.findById(reportID)
        .exec()
        .catch(() => {
            console.log("Error in Report quering (Id may be wrong)");
        });

    let comment = await report.comments
        .id(commentID)
        .exec()
        .catch(() => {
            console.log("Error in Comment quering (Id may be wrong)");
        });

    if (!comment) {
        res.status(404).send();
        console.log("Comment not found");
        return;
    }

    res.status(200).json(displayedComment(report, comment));
});

router.post("/report/:id/comment", tokenChecker, async (req, res) => {
    let requiredAttributes = ["content"];

    let userUrl = req.body["user"];
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

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

    let commentAttributes = {};
    commentAttributes["user"] = userUrl;
    for (let attr of requiredAttributes) {
        if (req.body[attr] == undefined) {
            console.log("Missing attribute: ", attr);
            res.status(400).send("Missing attribute: " + attr);
            return;
        }

        reportAttributes[attr] = req.body[attr];
    }

    let comment = new Comment(commentAttributes);

    comment = await comment.save().catch((err) => {
        console.log("Error in comment saving...");
        res.status(404).send(
            "Error in comment saving, probably an invalid enum was given"
        );
        return null;
    });

    if (comment == null) return;
    // TODO
    // da aggiungere il commento nello user

    let commentID = comment.id;
    res.location(req.path + commentID)
        .status(201)
        .send();
});

router.delete(
    "/report/:reportID/comments/:commentID",
    tokenChecker,
    async (req, res) => {
        // must be the user whom wrote the comment or an admin

        let report = await Report.findById(req.params.reportID)
            .exec()
            .catch(() => {
                console.log("Error in Report quering (Id may be wrong)");
            });

        let comment = await report.comments
            .id(req.params.commentID)
            .exec()
            .catch(() => {
                console.log("Error in Comment quering (Id may be wrong)");
            });

        if (!comment) {
            res.status(404).send();
            console.log("Comment not found");
            return;
        }

        await Comment.deleteOne({ _id: comment._id });
        console.log("Comment removed");
        res.status(204).send();
    }
);

module.exports = router;
