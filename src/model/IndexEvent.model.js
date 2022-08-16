"use strict";

module.exports = class IndexEvent extends AbstractModel {
	/**
	 * Check login: email and password.
	 * @returns void
	 * @throws FormDataException
	 */
	login() {
		// Retrieve parameters
		const parameters = this.parameters;

		// Case email or password incorrect
		if(parameters.email !== "test@email.com" || parameters.password !== "password") {
			this.throwException(FormDataException, "password", "messages", "AccessDenied");
		}
	}
};