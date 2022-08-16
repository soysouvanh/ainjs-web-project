"use strict";

/**
 * Form data exception occurs when the resource is not implemented.
 */
module.exports = class NotImplementedException extends AbstractException {
	/**
	 * Constructor.
	 * @param string message Message.
	 */
	constructor(message) {
		super(message === undefined || message === null ? "Not Implemented" : message, 501);
	}
};