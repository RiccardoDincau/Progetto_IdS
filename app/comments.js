const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");
const errResp = require("./errors/errorResponse.js");
const { user_level } = require("./models/enums.js");
const user = require("./models/user.js");

function displayedComment(mongooseReport, mongooseComment) {
    return {
        _id: "/report/" + mongooseReport._id,
        _id: mongooseComment._id,
        content: mongooseComment.content,
        user: mongooseComment.user,
    };
}

router.get("/:id/comments", async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => {
            errResp.idNotValid(res);
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
    // TODO
    // comments = await report.comments.find({ sentQueries }).exec(); // return an array of comments (mongoose format)

    let comment_ids = report.comments || []; // array of comment id
    console.log(comment_ids);
    let comments = []; // this will be the array of mongoose comments
    let comment; // this will be the single comment that will be added to the array "comments"
    for(let comment_id of comment_ids){
        comment = await Comment.findById(comment_id).exec().catch((err) => {
            console.log("Comment not found", err);
            return;
        });
        if(comment){
            comments.push(comment);
        }
    }

    if (comments.length === 0) {
        res.status(200).json([]);
        return;
    }
    comments = comments.map((mongooseComment) => {
        displayedComment(report, mongooseComment);
    }); // displayComment on every element of the array comments

    res.status(200).json(comments); // return the array (json format)
});

router.get("/:reportID/comments/:commentID", async (req, res) => {
    let report = await Report.findById(req.params.reportID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Report id not valid" });
        });

    let comment = await report.comments
        .id(req.params.commentID)
        .exec()
        .catch(() => {
            errResp.idNotValid(res, { message: "Comment id not valid" });
        });

    if (!comment) {
        errResp.commentNotFound(res);
        return;
    }

    res.status(200).json(displayedComment(report, comment));
});

router.post("/:id/comments", async (req, res) => {
    // separare comments da report
    let requiredAttributes = ["content"];

    let userUrl = req.body["user"];
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

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

    let commentAttributes = {};
    commentAttributes["user"] = userUrl;
    for (let attr of requiredAttributes) {
        if (req.body[attr] == undefined) {
            errResp.missingAttribute(res, attr);
            return;
        }

        commentAttributes[attr] = req.body[attr];
    }

    let comment = new Comment(commentAttributes);

    comment = await comment.save().catch(() => errResp.commentMalformed(res));

    if (comment == null) return;
    // TODO
    // da aggiungere il commento nello user

    let commentID = comment.id;

    let report = await Report.findById(req.params.id).exec().catch((err) => {
        console.log("Report not found", err);
        res.status(400).json({ error: "Report does not exist" });
        return;
    });

    report.comments.push(commentID);

    report.save().catch((err) => {
        console.log("Error saving report", err);
        res.status(500).json({ error: "Failed to update report with comment" });
        return;
    });

    comment.save().catch((err) => {
        console.log("Error saving comment", err);
        res.status(500).json({ error: "Failed to saving comment" });
        return;
    });

    res.location(req.path + commentID)
        .status(201)
        .send();
});

router.delete("/:reportID/comments/:commentID", async (req, res) => {
    let report = await Report.findById(req.params.reportID)
        .exec()
        .catch(() =>
            errResp.idNotValid(res, { message: "Report id is not valid" })
        );

    let comment = await report.comments
        .id(req.params.commentID)
        .exec()
        .catch(() =>
            errResp.idNotValid(res, { message: "Comment id is not valid" })
        );

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
