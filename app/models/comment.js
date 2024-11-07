var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
    "Comment",
    new Schema({
        content: String,
        user: { type: Schema.Types.ObjectId, ref: "User" },
    })
);
