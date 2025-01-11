const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// Copy of req.query
	const reqQuery = { ...req.query };

	// Create query string
	let queryStr = JSON.stringify(req.query);

	// Create operators like $gt $gte etc...
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding resource
	query = Bootcamp.find(JSON.parse(queryStr));

	// Executing query
	const bootcamps = await query;
	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.findById(req.params.id);

	if (!bootcamps) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamps });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamps) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: {} });
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Clac radius using radiams
	// Divide distance by radius of the Earth
	// Radius of the Earth = 3,963 miles / 6,378.1 kilometers
	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius],
			},
		},
	});

	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
});
