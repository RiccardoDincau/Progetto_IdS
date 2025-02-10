const express = require("express");

const app = express();
const cors = require("cors");

const notifications = require("./notifications.js");
const reports = require("./reports.js");
const users = require("./users.js");
const authentication = require("./authentication.js");
const comments = require("./comments.js");
const images = require("./images.js");
const votes = require("./votes.js");
const district_user = require("./district_user.js");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

app.use("/", express.static("vue-project/dist"));

// app.get("/", (req, res) => {
//     console.log("New request to the landing page");
//     res.status(200).send("Pagina di accesso");
// });

app.use("/api/authentication", authentication);

app.use("/api/reports", reports);
app.use("/api/reports", comments);
app.use("/api/reports", images);
app.use("/api/reports", votes);

app.use("/api/users", users);
app.use("/api/users", notifications);
app.use("/api/district_user", district_user);

module.exports = app;
