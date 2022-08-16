"use strict";

module.exports = class AbstractModel {
	/**
	 * Initialize attributes.
	 * @param Ainjs ainjs Ainjs instance.
	 * @returns void
	 */
	constructor(ainjs) {
		// Initialize model attributes
		this.ainjs = ainjs;
		this.view = {};

		// Create shortcuts to useful Ainjs attributes
		this.request = ainjs.request;
		this.response = ainjs.response;
		this.parameters = ainjs.parameters;
		this.formData = ainjs.formData;

		// Create shortcuts to useful Ainjs methods
		//this.throwException = ainjs.throwException;
	}

	/**
	 * Throw an AbstractException.
	 * @param AbstractException exception Exception class (ex: FormDataException). 
	 * @param string fieldId Field identifier (ex: password).
	 * @param string type Check type (ex: format, required, min, max, minLength, maxLength, messages). "format" by default.
	 * @param string messageKey Message key (ex: "AccessDenied" for type="messages", otherwise "message"). "message" by default.
	 * @param object formData Form data. this.formData by default.
	 * @returns void
	 * @throws AbstractException
	 */
	throwException(exception, fieldId, type = "format", messageKey = "message", formData = this.formData) {
		// Check exception
		if(typeof exception !== "function") {
			throw new InternalServerErrorException("AbstractException expected: " + exception);
		}

		// Check form data
		if(formData === null || formData === undefined) {
			throw new InternalServerErrorException("Parameter required: formData");
		}
		if(typeof formData !== "object" || formData.constructor !== Object) {
			throw new InternalServerErrorException("Parameter object type expected: formData");
		}
		
		// Check fieldId
		if(formData[fieldId] === undefined) {
			throw new InternalServerErrorException("Field identifier unknown in formData: " + fieldId);
		}

		// Check check type
		if(formData[fieldId][type] === undefined) {
			throw new InternalServerErrorException("Check type unknown in formData." + type + ": " + type);
		}

		// Check message key
		if(type === "messages" && formData[fieldId][type][messageKey] === undefined) {
			throw new InternalServerErrorException("Message key unknown in formData: " + messageKey);
		}

		// Throw exception
		throw new exception({fieldId: fieldId, type: type, message: formData[fieldId][type][messageKey], label: formData[fieldId].label});
	}
};