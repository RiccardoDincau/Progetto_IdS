const express = require("express");

const app = express();

app.get("", (req, res) => {
    console.log("New request to the landing page");
    res.status(200).send("Pagina di accesso");
});

module.exports = app;