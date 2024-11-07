var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var {kind, category, state} = require("./enums.js");

module.exports = mongoose.model('Report', new Schema ({
	title: String,
	content: String,
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	votes: {type: Number, default: 0},
	position: String,
	kind, 
	category, 
	state,
	comments: [ {type: Schema.Types.ObjectId, ref: "Comment", default: []} ]
}));