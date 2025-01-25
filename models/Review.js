const { text } = require("express");
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, "Please add a title"],
		maxlength: [100, "Title can not be more than 100 characters"],
	},
	text: {
		type: String,
		required: [true, "Please add some text"],
	},
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, "Please add a rating between 1 and 10"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: "Bootcamp",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Review", ReviewSchema);
