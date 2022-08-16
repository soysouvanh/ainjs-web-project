"use strict";

/**
 * Forbidden exception occurs when user has no permission to access to the resource.
 */
module.exports = class ForbiddenException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Forbidden" : message, 403);
	}
};