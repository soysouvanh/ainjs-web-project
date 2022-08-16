"use strict";

module.exports = class SampleWs extends AbstractWsModel {
	/**
	 * Sample of GET method.
	 * @returns void
	 * @throws AbstractException
	 */
	getMethod() {
		// Return data
		this.view = {
			"name": "ainjs",
			"version": "0.1.0",
			"description": "AiNjs (Aspect-inspired NodeJS) is a fullstack microframework for NodeJS.",
			"author": "Vincent SOYSOUVANH (https://www.linkedin.com/in/vincentsoysouvanh/)"
		}
	}
};