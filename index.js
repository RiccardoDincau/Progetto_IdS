const app = require("./app/app.js");

const port = 8080;

app.listen(port, () => {
    console.log("Server listening on port:", port);
});