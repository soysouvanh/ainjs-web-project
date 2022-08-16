/**
 * AiNjs Framework
 * Cache configuration:
 * 	- expiry: server cache.
 * 	- cache: client (browser) cache.
 * 
 * Examples of duration:
 * 	6 minutes = 6 * 60 = 360 seconds
 * 	20 minutes = 20 * 60 = 1200 seconds
 * 	1 hour = 60 * 60 = 3600 seconds
 * 	1 day = 24 * 60 * 60 = 86400 seconds
 * 	1 week = 7 * 24 * 60 * 60 = 604800 seconds
 * 	30 days = 30 * 24 * 60 * 60 = 2592000 seconds
 */
module.exports = {
	default: {
		expiry: 0,
		cache: 0
	},

	// Cache by URI
	uri: {

	},

	// Cache by extension
	extension: {
		// Form data (only for server cache)
		"dialog.form.js": {
			expiry: 86400,
			cache: 0
		},
		"event.form.js": {
			expiry: 86400,
			cache: 0
		},
		"page.form.js": {
			expiry: 86400,
			cache: 0
		},

		// Resources
		html: {
			expiry: 86400,
			cache: 86400
		},
		css: {
			expiry: 86400,
			cache: 86400
		},
		js: {
			expiry: 86400,
			cache: 86400
		},

		// Data
		json: {
			expiry: 0,
			cache: 360
		},
		csv: {
			expiry: 0,
			cache: 360
		},
		xml: {
			expiry: 0,
			cache: 360
		},

		// Images
		ico: {
			expiry: 86400,
			cache: 86400
		},
		jpeg: {
			expiry: 86400,
			cache: 86400
		},
		jpg: {
			expiry: 86400,
			cache: 86400
		},
		png: {
			expiry: 86400,
			cache: 86400
		},
		svg: {
			expiry: 86400,
			cache: 86400
		},

		// Audio
		mp3: {
			expiry: 0,
			cache: 86400
		},
		
		// Documents
		pdf: {
			expiry: 0,
			cache: 86400
		},
		doc: {
			expiry: 0,
			cache: 86400
		},
		docx: {
			expiry: 0,
			cache: 86400
		},
		ppt: {
			expiry: 0,
			cache: 86400
		},
		pptx: {
			expiry: 0,
			cache: 86400
		},
		xls: {
			expiry: 0,
			cache: 86400
		},
		xlsx: {
			expiry: 0,
			cache: 86400
		},
		
		// Compress files
		zip: {
			expiry: 0,
			cache: 86400
		},
		"7z": {
			expiry: 0,
			cache: 86400
		}
	}
};