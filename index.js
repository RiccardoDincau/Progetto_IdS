const app = require("./app/app.js");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const DB = process.env.DB;

// console.log(PORT, DB);

mongoose.connect(DB).then(() => {
    console.log("Connected to database: ", DB);
    app.listen(PORT, () => {
        console.log("Server listening on port:", PORT);
    });
}).catch((err) => {
    console.error("Database connection error:", err);
});
