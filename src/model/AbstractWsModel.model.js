"use strict";

module.exports = class AbstractWsModel extends AbstractModel {
	/**
	 * Authenticate user with username and password. Here, basic authentication is used.
	 * UnauthorizedException is thrown if username or password is incorrect.
	 * @returns void
	 * @throws UnauthorizedException
	 */
	authenticate() {
		// Retrieve username and password
		let authorization = this.request.headers.authorization,
			username = null,
			password,
			authenticationConfiguration;
		if(authorization !== undefined) {
			// Decrypt username and password
			authorization = new Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");
			username = this.hash(authorization[0]);
			password = this.hash(authorization[1]);
			
			// Load authentication configuration
			authenticationConfiguration = require(CONFIGURATION_PATH + "/ws-authentication" + CONFIGURATION_FILE_EXTENSION);
		}

		// Case user or password incorrect
		if(username === null || username !== authenticationConfiguration.username || password !== authenticationConfiguration.password) {
			// Set headers
			this.response.setHeader("WWW-Authenticate", "Basic");

			// Throw unauthorized exception
			const UnauthorizedException = require(EXCEPTION_PATH + "/UnauthorizedException" + EXCEPTION_FILE_EXTENSION);
			throw new UnauthorizedException();
		}
	}

	/**
	 * Hash a string with sha256 or sha512.
	 * @param string string String to hash. 
	 * @param string algorithm Algorithm (md5, sha1, sha256, sha224, sha512, sha384, sha3, ripemd160) to use. sha256 by default. 
	 * @returns string
	 */
	hash(string, algorithm = "sha256") {
		// Case algorithm unknown
		const algorithms = {
			md5: null,
			sha1: null,
			sha256: null,
			sha224: null,
			sha512: null,
			sha384: null,
			sha3: null,
			ripemd160: null
		};
		if(algorithms[algorithm] === undefined) {
			// Set algorithm by default: sha256
			algorithm = "sha256";
		}
		
		// Hash and return string
		return global.crypto
			.createHash(algorithm)		// Create hash object
			.update(string, "utf-8")	// Pass the string to be hashed
			.digest("hex");				// Create the hash in the required format
	}

};