const express = require("express");
const {
	getBootcamps,
	getBootcamp,
	getBootcampsInRadius,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../controllers/bootcamps");

const router = express.Router();

// Handle all bootcamps
router.route("/").get(getBootcamps).post(createBootcamp);

// Handle single bootcamps GET PUT DELETE
router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

// Handle Bootcamps in a radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
