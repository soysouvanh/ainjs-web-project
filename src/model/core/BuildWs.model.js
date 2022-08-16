"use strict";

module.exports = class BuildWs extends AbstractModel {
	/**
	 * Merge files content and return result.
	 * @param array files Files URI list (ex: ["/js/a.js", "/js/b.js", "/js/c.js"]). 
	 * @returns string
	 */
	async mergeFiles(files) {
		// Retrieve files content
		const filesLength = files.length;
		let contents = [];
		for(let i = 0; i < filesLength; i++) {
			contents[i] = new Promise((resolve, reject) => {
				global.fs.readFile(PUBLIC_PATH + files[i], (err, data) => {
					// Case error
					if(err) {
						reject(err);
					}

					// Return file content
					resolve(data);
				});
			});
		}
		contents = await Promise.all(contents);
		
		// Merge contents
		let mergedContents = "";
		for(const content of contents) {
			mergedContents += content;
		}

		// Return merged contents
		return mergedContents;
	}
	
	/**
	 * Build "/public/core.js" and "/public/core.js.deflate" in using configuration file "/src/configuration/js-core.configuration.js".
	 * @returns void
	 */
	 async jsCore() {
		// Load JS configuration file
		const jsFiles = require(CONFIGURATION_PATH + "/js-core" + CONFIGURATION_FILE_EXTENSION);

		// Merge files content
		this.view.content = await this.mergeFiles(jsFiles);
		
		// Minify merged files content
		const minified = global.uglifyJS.minify(this.view.content).code;

		// Create minified JS file
		const jsCoreFile = PUBLIC_PATH + "/" + this.parameters.jsFile;
		global.fs.writeFile(jsCoreFile, minified, (err) => {
			// Case error
			if(err) {
				this.ainjs.throwException("FileException", err);
			}
		});

		// Create deflate JS file
		global.zlib.deflate(minified, (err, buffer) => {
			// Case error
			if(err) {
				this.ainjs.throwException("DeflateException", err);
			} 
			
			// Create deflate JS file
			global.fs.writeFile(jsCoreFile + ".deflate", buffer, (err) => {
				// Case error
				if(err) {
					this.ainjs.throwException("FileException", err);
				}
			});
		});
	}

	/**
	 * Build "/public/core.css" and "/public/core.css.deflate" in using configuration file "/src/configuration/css-core.configuration.js".
	 * @returns void
	 */
	 async cssCore() {
		// Load JS configuration file
		const cssFiles = require(CONFIGURATION_PATH + "/css-" + this.parameters.cssFile.split(".")[0] + CONFIGURATION_FILE_EXTENSION);

		// Merge files content
		this.view.content = await this.mergeFiles(cssFiles);

		// Minify merged files content: use plugins cssnano and autoprefixer
		const output = await global.postcss([global.cssnano, global.autoprefixer]).process(this.view.content, {from: undefined}),
			minified = output.css;
		
		// Create minified CSS file
		const cssFile = PUBLIC_PATH + "/" + this.parameters.cssFile;
		global.fs.writeFile(cssFile, minified, (err) => {
			// Case error
			if(err) {
				this.ainjs.throwException("FileException", err);
			}
		});

		// Create deflate CSS file
		global.zlib.deflate(minified, (err, buffer) => {
			// Case error
			if (err) {
				this.ainjs.throwException("DeflateException", err);
			} 
			
			// Create deflate CSS file
			global.fs.writeFile(cssFile + ".deflate", buffer, (err) => {
				// Case error
				if(err) {
					this.ainjs.throwException("FileException", err);
				}
			});
		});
	}

	/**
	 * Build "/public/critical.css" and "/public/critical.css.deflate" in using configuration file "/src/configuration/css-critical.configuration.js".
	 * @returns void
	 */
	 async cssCritical() {
		this.parameters.cssFile = "critical.css";
		await this.cssCore();
	}
};