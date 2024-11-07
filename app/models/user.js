var mongoose = require("mongoose");
var Schema = mongoose.Schema;

module.exports = mongoose.model(
    "User",
    new Schema({
        _id: Schema.Types.ObjectId,
    })
);
