const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");
const Comment = require("./models/comment.js");
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
            // find the report by the given id
            console.log("Error in Report quering (Id may be wrong)\n");
        });

        if (!report) {
            res.status(404).send("Report not found");
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
                // find a user by his id
                console.log("Error in user quering.\n", err);
            });

        if (user == null) {
            res.status(400).send("User does not exist");
            return;
        }
    }

    // comments = await report.comments.find({ sentQueries }).exec(); // return an array of comments (mongoose format)
    let comments = report.comments;

    comments = comments.map(displayedComment); // displayComment on every element of the array comments

    res.status(200).json(comments); // return the array (json format)
});

router.get("/:reportID/comments/:commentID", async (req, res) => {
    let report = await Report.findById(req.params.reportID)
        .exec()
        .catch(() => {
            console.log("Error in Report quering (Id may be wrong)\n");
        });

    let comment = await report.comments
        .id(req.params.commentID)
        .exec()
        .catch(() => {
            console.log("Error in Comment quering (Id may be wrong)\n");
        });

    if (!comment) {
        res.status(404).send();
        console.log("Comment not found\n");
        return;
    }

    res.status(200).json(displayedComment(report, comment));
});

router.post("/:id/comments", async (req, res) => { // separare comments da report
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

        commentAttributes[attr] = req.body[attr];
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

router.delete("/:reportID/comments/:commentID", async (req, res) => {
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
});

module.exports = router;