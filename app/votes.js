const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const tokenChecker = require("./tokenChecker.js");

const errResp = require("./errors/errorResponse.js");

router.get("/:id/votes", tokenChecker, async (req, res) => {
    let report = await Report.findById(req.params.id)
        .exec()
        .catch(() => errResp.idNotValid(res));

    if (!report) {
        errResp.reportNotFound(res);
        return;
    }

    let hasVoted = false;

    let userUrl = req.loggedUser.id;
    let userID = userUrl.substring(userUrl.lastIndexOf("/") + 1);

    for (let user of report.votes) {
        if (user == userID) {
            hasVoted = true;
            break;
        }
    }

    res.status(200).json({ hasVoted });
});

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
        }).exec();
    } else {
        report = await Report.findByIdAndUpdate(req.params.id, {
            $pull: { votes: userID },
        }).exec();
    }

    report = await Report.findById(req.params.id).exec();

    res.status(200).json({votes: report.votes.length});
});

module.exports = router;
