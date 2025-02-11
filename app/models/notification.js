var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Notification",
    new Schema({
        title: String,
        content: String,
        report: { type: Schema.Types.ObjectId, ref: "Report" },
    })
);
