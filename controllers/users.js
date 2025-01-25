const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get a single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: user });
});

// @desc    Create a users
// @route   POST /api/v1/users
// @access  Private/Admin
exports.getCreate = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({ success: true, data: user });
});

// @desc    Update a users
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.getUpdate = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: user });
});

// @desc    Delete a users
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.getUpdate = asyncHandler(async (req, res, next) => {
	await User.findByIdAndDelete(req.params.id);

	res.status(200).json({ success: true, data: {} });
});
