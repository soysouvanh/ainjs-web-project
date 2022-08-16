"use strict";

/**
 * Abstract class for exception. All exceptions should inherit AbstractException.
 */
module.exports = class AbstractException extends Error {
	/**
	 * Constructor.
	 * @param string|object message Message. 
	 * @param int statusCode Status code.
	 * @returns void
	 */
	constructor(message, statusCode) {
		super(typeof message === "object" ? JSON.stringify(message) : message)
		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.statusCode = statusCode;
	}

	/**
	 * Return status code.
	 * @returns int
	 */
	statusCode() {
		return this.statusCode;
	}
};