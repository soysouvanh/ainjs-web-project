"use strict";

/**
 * Form data exception occurs when the resource is not found.
 */
module.exports = class NotFoundException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Not found" : message, 404);
	}
};