const express = require("express");
const router = express.Router();

const Report = require("./models/report.js");
const errResp = require("./errors/errorResponse.js");
const tokenChecker = require("./tokenChecker.js");
const bodyParser = require("body-parser");

const fs = require("fs");

router.get("/:id/image", async (req, res) => {
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

    let imageURL =
        process.env.ROOT +
        "/report_images/" +
        req.params.id +
        "_rep_image.jpeg";

    console.log("Sending: ", imageURL);
    res.sendFile(imageURL, (err) => {
        console.log(err);
        errResp.imageNotFound(res);
    });
});

router.post(
    "/:id/image",
    tokenChecker,
    bodyParser.raw({ type: ["image/jpeg", "image/png"], limit: "5mb" }),
    async (req, res) => {
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

        fs.writeFile(
            "report_images/" + req.params.id + "_rep_image.jpeg",
            req.body,
            () => {
                console.log("Image saved.");
            }
        );

        res.location(req.path + req.params.id + "/image")
            .status(201)
            .send();
    }
);

module.exports = router;
