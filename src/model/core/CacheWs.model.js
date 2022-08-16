"use strict";

module.exports = class CacheWs extends AbstractWsModel {
	/**
	 * Delete all caches in memory and in /cache/<dialog|event|page|ws>/.
	 * @returns void
	 */
	deleteAll() {
		// Delete all data
		global.cache.flushAll();
	}

	/**
	 * Delete cache by key and return the key in the response.
	 * @param string key Key of the cache to remove.
	 * @returns void
	 */
	delete() {
		// Delete data by key
		global.cache.del(this.parameters.key);

		// Set view data
		this.view.key = this.parameters.key;
	}

	/**
	 * Set value in cache or update cache already exists, and return the key/value in the response.
	 * @param string key Key attached to the value.
	 * @param {*} value Value to put in cache.
	 * @returns void
	 */
	set() {
		// Set value in cache
		global.cache.set(this.parameters.key, this.parameters.value);

		// Set view data
		this.view.key = this.parameters.key;
		this.view.value = this.parameters.value;
	}

	/**
	 * Get value by key and return the key/value in the response.
	 * @param string key Key attached to the value.
	 * @returns {*}
	 */
	get() {
		// Get value and set view data
		this.view.key = this.parameters.key;
		this.view.value = global.cache.get(this.parameters.key);
	}

	/**
	 * List all keys.
	 * @returns array
	 */
	keys() {
		// List keys and set view data
		this.view.keys = global.cache.keys();
	}
};