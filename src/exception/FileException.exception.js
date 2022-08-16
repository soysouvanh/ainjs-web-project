"use strict";

/**
 * File exception occurs when a file read/write is impossible.
 */
module.exports = class FileException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Internal Server Error" : message, 500);
	}
};