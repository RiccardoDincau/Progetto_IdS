const express = require('express');
const router = express.Router();

const Report = require("./models/report.js");
const User = require("./models/user.js");

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
        comments: mongooseReport.comments
    };
}

function displayedComment(mongooseReport, mongooseComment){
    return {
        _id: mongooseReport._id,
        _id: mongooseComment._id,
        content: mongooseComment.content,
        user: mongooseComment.user
    }
}

router.get("", async (req, res) => {
    let possibleQueries = ["state", "kind", "category", "position"];
    
    let sentQueries = {};
    for (let q of possibleQueries) {
        if (req.query[q]) sentQueries[q] = req.query[q];
    }
    
    console.log("Queries requested: ", sentQueries);
    
    let reports = await Report.find(sentQueries)

    reports = reports.map(displayedReport);

    res.status(200).json(reports);
});

router.post("", async (req, res) => {
    // Serve comments?????
    let requiredAttributes = ["title", "content", "votes", 
        "position", "kind", "category", "state", "comments"];

    let reportAttributes = {};

    let userUrl = req.body["user"];
    let userID = userUrl.substring(userUrl.lastIndexOf('/') + 1);

    let user = null;
    user = await User.findById(userID).exec().catch((err) => {
        console.log("Error in user quering.\n", err);
    });

    if(user == null) {
        res.status(400).json({ error: 'User does not exist' });
        return;
    };

    reportAttributes["user"] = userID

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
        res.status(400).send("Error in report saving, probably an invalid enum was given");
        return null;
    });
    if (report == null) return;
    let reportId = report.id;

    res.location(req.path + reportId).status(201).send();
});

router.get("/:id", async (req, res) => {
    let report = await Report.findById(req.params.id).exec().catch((err) => {
        console.log("Error in Report quering (Id may be wrong)");
    });

    if (!report) {
        res.status(404).send();
        console.log("Report not found");
        return;
    }

    res.status(200).json(displayedReport(report));
});

router.put("/:id", async (req, res) => {
    let {votes, state} = req.body;
    
    let report = await Report.findByIdAndUpdate(req.params.id, {votes, state}).exec().catch((err) => {
        console.log("Error in Report quering (Id may be wrong)");
    });

    if (!report) {
        res.status(404).send();
        console.log("Report not found");
        return;
    }

    res.status(200).json(displayedReport(report));
});


router.delete("/:id", async (req, res) => {
    let report = await Report.findById(req.params.id).exec().catch(() => {
        console.log("Error in Report quering (Id may be wrong)"); 
    });

    if (!report) {
        res.status(404).send();
        console.log("Report not found");
        return;
    }

    await Report.deleteOne({_id: report._id});
    console.log('Report removed');
    res.status(204).send();
});

router.get("/:id/comments/:id", async (req, res) => {
    const params = Object.values(req.params);
    const reportID = params[0];
    const commentID = params[1];

    let report = await Report.findById(reportID).exec().catch(() => {
        console.log("Error in Report quering (Id may be wrong)"); 
    });

    let comment = await report.comments.id(commentID).exec().catch( () => {
        console.log("Error in Comment quering (Id may be wrong)");
    });

    if(!comment){
        res.status(404).send();
        console.log("Comment not found");
        return;
    }

    res.status(200).json(displayedComment(report, comment));

})

module.exports = router;