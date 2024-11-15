var mongoose = require("mongoose");
const { user_level } = require("./enums");
const notification = require("./notification");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
    "User",
    new Schema({
        name: String,
        email: String,
        password: String,
        user_level,
        reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
        notifications: [{type: Schema.Types.ObjectId, ref: "Notification"}]
    })
);
