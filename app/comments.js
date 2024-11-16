const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");
const errResp = require("./errors/errorResponse.js");
const { user_level } = require("./models/enums.js");
const tokenChecker = require("./tokenChecker.js");
const user = require("./models/user.js");

function displayedComment(mongooseReport, mongooseComment) {
    return {
        _id: mongooseComment._id,
        content: mongooseComment.content,
        report: "/report/" + mongooseReport._id,
        user: mongooseComment.user,
    };
}

router.get("/:id/comments", async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => {
            errResp.idNotValid(res);
            return;
        });

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

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
                errResp.idNotValid(res, { message: "User id is not valid" });
            });

        if (user == null) {
            errResp.userNotFound(res);
            return;
        }
    }

    let comments = await Comment.find({ ...sentQueries, report: req.params.id }).catch((err) => { // ... is the spread operator
        errResp.baseErrorResponse(res); // TODO mettere un errore per le query malformate (?)
        return;
    });

    if (comments.length === 0) {
        res.status(200).json([]);
        return;
    }
    comments = comments.map((mongooseComment) =>
        displayedComment(report, mongooseComment)
    ); // displayComment on every element of the array comments

    res.status(200).json(comments); // return the comments (json format)
});

router.get("/:reportID/comments/:commentID", async (req, res) => {
    let interrupt = false;

    //Check if the id is properly formatted and referenced to a report
    let report = await Report.findById(req.params.reportID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Report id not valid" });
            interrupt = true;
        });

    if (!report) {
        if (!interrupt) errResp.reportNotFound(res);
        return;
    }

    //Check if the id is properly formatted and referenced to a comment
    let comment = await Comment.findById(req.params.commentID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Comment id not valid" });
            interrupt = true;
        });

    if (!comment) {
        if (!interrupt) errResp.commentNotFound(res);
        return;
    }

    res.status(200).json(displayedComment(report, comment));
});

router.post("/:id/comments", tokenChecker, async (req, res) => {
    let requiredAttributes = ["content"];
    let interrupt = false;
    let userUrl = req.loggedUser.id;
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

    //Check if the user id is properly formatted and exists
    let user = await User.findById(userID)
        .exec()
        .catch((err) => {
            errResp.idNotValid(res, { message: "User id is not valid" });
            interrupt = true;
        });
    if (!user) {
        if (!interrupt) errResp.userNotFound(res);
        return;
    }

    let reportUrl = req.params.id;
    //Check if the report id is properly formatted and exists
    let report = await Report.findById(reportUrl)
        .exec()
        .catch((err) => {
            errResp.reportNotFound(res);
            report = true;
        });
    if (!report) {
        if (!interrupt) errResp.reportNotFound(res);
        return;
    }

    //The necessary attributes are taken out by the sent body
    let commentAttributes = {};
    commentAttributes["user"] = userID;
    commentAttributes["report"] = reportUrl.substring(reportUrl.lastIndexOf("/") + 1);
    for (let attr of requiredAttributes) {
        if (req.body[attr] == undefined) {
            errResp.missingAttribute(res, attr);
            return;
        }

        commentAttributes[attr] = req.body[attr];
    }

    let comment = new Comment(commentAttributes);

    comment = await comment.save()
        .catch(() => {
            errResp.commentMalformed(res);
            return;
        });

    if (comment == null) return;
    // TODO
    // da aggiungere il commento nello user

    let commentID = comment.id;

    res.location(req.path + commentID)
        .status(201)
        .send();
});

router.delete("/:reportID/comments/:commentID", async (req, res) => {
    let report = await Report.findById(req.params.reportID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Report id is not valid" });
            return;
        });

    let comment = await Comment.findById(req.params.commentID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Comment id is not valid" });
            return;
        });

    if (!comment) {
        errResp.commentNotFound(res);
        return;
    }

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    await Comment.deleteOne({ _id: comment._id });
    console.log("Comment removed");
    res.status(204).send();
});

module.exports = router;
