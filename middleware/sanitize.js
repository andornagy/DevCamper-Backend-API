const sanitizeHtml = require("sanitize-html");

// Middleware to sanitize user inputs in req.body, req.query, and req.params
const sanitizeInputs = (req, res, next) => {
	// Sanitize req.body
	if (req.body) {
		for (const key in req.body) {
			if (typeof req.body[key] === "string") {
				req.body[key] = sanitizeHtml(req.body[key]);
			}
		}
	}

	// Sanitize req.query
	if (req.query) {
		for (const key in req.query) {
			if (typeof req.query[key] === "string") {
				req.query[key] = sanitizeHtml(req.query[key]);
			}
		}
	}

	// Sanitize req.params
	if (req.params) {
		for (const key in req.params) {
			if (typeof req.params[key] === "string") {
				req.params[key] = sanitizeHtml(req.params[key]);
			}
		}
	}

	next();
};

module.exports = sanitizeInputs;
