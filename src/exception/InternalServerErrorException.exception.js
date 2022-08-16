"use strict";

/**
 * Internal Server Error exception occurs when an error is unknown.
 */
module.exports = class InternalServerErrorException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Internal Server Error" : message, 500);
	}
};