const express = require("express");

const app = express();

const notifications = require("./notifications.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
});


app.get("", (req, res) => {
    console.log("New request to the landing page");
    res.status(200).send("Pagina di accesso");
});

app.use("/api/notifications", notifications);

module.exports = app;