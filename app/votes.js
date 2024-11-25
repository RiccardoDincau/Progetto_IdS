const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
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

router.put("/:id/votes", tokenChecker, async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    let liked = req.body.liked;

    let userUrl = req.loggedUser.id;
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

    if (liked) {
        report = await Report.findByIdAndUpdate(req.params.id, {
            $addToSet: { votes: userID },
        });
    } else {
        report = await Report.findByIdAndUpdate(req.params.id, {
            $pull: { votes: userID },
        });
    }

    report = await Report.findById(req.params.id).exec();

    res.status(200).json(displayedReport(report));
});

module.exports = router;
