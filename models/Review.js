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

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static Method to get avg of course tuitions// Static Method to get avg of course tuitions
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } },
		},
	]);

	try {
		await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageRating,
		});
	} catch (error) {
		console.error(error);
	}
};

// Call averageRating after save
ReviewSchema.post("save", async function () {
	// Import the model directly and use it
	await this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating before delete
ReviewSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		// Import the model directly and use it
		await this.constructor.getAverageRating(this.bootcamp);
	}
);

module.exports = mongoose.model("Review", ReviewSchema);
