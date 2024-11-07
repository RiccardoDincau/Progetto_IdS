var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var { kind, category, state } = require("./enums.js");

module.exports = mongoose.model(
    "Report",
    new Schema({
        title: String,
        content: String,
        user: { type: Schema.Types.ObjectId, ref: "User" },
        votes: Number,
        position: String,
        kind,
        category,
        state,
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    })
);
