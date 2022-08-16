"use strict";

/**
 * Deflate exception occurs when deflate file is impossible.
 */
module.exports = class DeflateException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Internal Server Error" : message, 500);
	}
};