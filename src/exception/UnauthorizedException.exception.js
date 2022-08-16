"use strict";

/**
 * Unauthorized exception occurs when authentication est incorrect.
 */
module.exports = class UnauthorizedException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Unauthorized" : message, 401);
	}
};