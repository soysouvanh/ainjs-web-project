"use strict";

// Define global variables
// Start measure execution time
global.HR_START = process.hrtime();

// Paths
global.ASPECT_PATH = __dirname + "/src/aspect";
global.CONFIGURATION_PATH = __dirname + "/src/configuration";
global.EXCEPTION_PATH = __dirname + "/src/exception";
global.FIELD_PATH = __dirname + "/src/field";
global.FORM_PATH = __dirname + "/src/form";
global.METADATA_PATH = __dirname + "/src/metadata";
global.MODEL_PATH = __dirname + "/src/model";
global.TEMPLATE_PATH = __dirname + "/src/template";

global.CSS_VIEW_PATH = __dirname + "/src/view/css";
global.DIALOG_VIEW_PATH = __dirname + "/src/view/dialog";
global.EVENT_VIEW_PATH = __dirname + "/src/view/event";
global.JS_VIEW_PATH = __dirname + "/src/view/js";
global.PAGE_VIEW_PATH = __dirname + "/src/view/page";
global.WS_VIEW_PATH = __dirname + "/src/view/ws";

global.LOG_PATH = __dirname + "/log";
global.PUBLIC_PATH = __dirname + "/public";

global.DIALOG_CACHE_PATH = __dirname + "/cache/dialog";
global.EVENT_CACHE_PATH = __dirname + "/cache/event";
global.PAGE_CACHE_PATH = __dirname + "/cache/page";
global.WS_CACHE_PATH = __dirname + "/cache/ws";

// Extension files
global.DEFLATE_FILE_EXTENSION = ".html.deflate";
global.HTML_FILE_EXTENSION = ".html";

global.ASPECT_FILE_EXTENSION = ".aspect.js";
global.CSS_FILE_EXTENSION = ".css";
global.CONFIGURATION_FILE_EXTENSION = ".configuration.js";
global.EXCEPTION_FILE_EXTENSION = ".exception.js";
global.FIELD_FILE_EXTENSION = ".field.js";
global.FORM_FILE_EXTENSION = ".form.js";
global.JS_FILE_EXTENSION = ".js";
global.LOG_FILE_EXTENSION = ".log.txt";
global.METADATA_FILE_EXTENSION = ".metadata.js";
global.MODEL_FILE_EXTENSION = ".model.js";
global.TEMPLATE_FILE_EXTENSION = ".template.ejs";

global.CSS_VIEW_FILE_EXTENSION = ".css.ejs";
global.DIALOG_VIEW_FILE_EXTENSION = ".dialog.ejs";
global.EVENT_VIEW_FILE_EXTENSION = ".event.ejs";
global.FOOTER_VIEW_FILE_EXTENSION = ".footer.ejs";
global.HEADER_VIEW_FILE_EXTENSION = ".header.ejs";
global.JS_VIEW_FILE_EXTENSION = ".js.ejs";
global.MENU_VIEW_FILE_EXTENSION = ".menu.ejs";
global.PAGE_VIEW_FILE_EXTENSION = ".page.ejs";
global.WS_VIEW_FILE_EXTENSION = ".ws.ejs";

// Mime types: full list can be found in https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
global.MIME_TYPE = {
	html: "text/html",
	css: "text/css",
	js: "text/javascript",
	json: "application/json",
	csv: "text/csv",
	xml: "application/xml",

	ico: "image/x-icon",
	jpeg: "image/jpeg",
	jpg: "image/jpeg",
	png: "image/png",
	svg: "image/svg+xml",

	mp3: "audio/mpeg",
	
	pdf: "application/pdf",
	
	doc: "application/msword",
	docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	ppt: "application/vnd.ms-powerpoint",
	pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	xls: "application/vnd.ms-excel",
	xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	
	zip: "application/zip",
	"7z": "application/x-7z-compressed"
};

// Framework cache configuration
global.cacheConfiguration = null;

// Framework classes
global.AbstractModel = null;
global.AbstractWsModel = null;

global.AbstractException = null;
global.FormDataException = null;
global.InternalServerErrorException = null;
global.NotFoundException = null;

// Library
global.fs = null;
global.cache = null;
global.crypto = null;
global.ejs = null;
global.postcss = null;
global.cssnano = null;
global.autoprefixer = null;
global.uglifyJS = null;
global.zlib = null;
global.htmlMinifier = null;
global.xml2js = null;

/**
 * Output in the console (= console.log).
 * @param {*} object Object to display.
 * @param boolean endProcess Determine if end process. false by default. 
 */
 global.trace = (object, endProcess = false) => {
	// Trace object
	console.log(object);

	// Case end process
	if(endProcess) {
		process.exit();
	}
}

/**
 * Log an exception in file /log/<type>-<yyyymmdd>.<LOG_FILE_EXTENSION>.
 * @param Error exception Error instance.
 * @param string|undefined type (optional) Log type (file name prefix). "error" by default.
 * @returns void 
 */
global.log = (exception, type = "error") => {
	// Set log type default value
	if(type === null || type === undefined) {
		type = "error";
	}

	// Append log in log file
	const dateTime = new Date().toISOString();
	if(global.fs === null) {
		global.fs = require("fs");
	}
	global.fs.appendFile(
		LOG_PATH + "/" + type + "-" + dateTime.slice(0, 10).replace(/-/g, "") + LOG_FILE_EXTENSION,
		dateTime.replace(/\..+$/, "") + " " + exception.stack + "\n",
		(err) => {
			// Trace error
			console.log(err);

			// Case uncaughtException: end process
			if(global.response === null) {
				// End process as soon as possible
				process.exit(1);
			}
		}
	);
}

// Catch uncaught exceptions
process.on("uncaughtException", err => {
	// Log error in error file
	log(err);
	
	// End process as soon as possible
	console.log("UncaughtException: end process. " + err.stack);
});

module.exports = class Ainjs {
	/**
	 * Constructor.
	 * Initialize attributes.
	 * @param object arguments:
	 *		- object http HTTP instance.
	 *		- object request Request instance.
	 *		- object response Response instance.
	 *		- string template Template name. "default" by default.
	 * @returns void
	 */
	constructor(args) {
		// Initialize instance attributes
		for(const name in args) {
			this[name] = args[name];
		}
	}

	/**
	 * Initialize global variables.
	 * @returns void
	 */
	async initilizeGlobals() {
		// Load critical classes
		global.AbstractException = require(EXCEPTION_PATH + "/AbstractException" + EXCEPTION_FILE_EXTENSION);

		// Load core classes and instances
		[
			// Framework cache configuration
			global.cacheConfiguration,

			// Framework classes
			global.AbstractModel,

			global.FormDataException,
			global.InternalServerErrorException,
			global.NotFoundException,

			// NodeJS Library
			global.fs,
			global.cache,
			global.crypto,
			global.ejs,
			global.postcss,
			global.cssnano,
			global.autoprefixer,
			global.uglifyJS,
			global.zlib,
			global.htmlMinifier,
			//global.xml2js
		] = await Promise.all([
			// Load framework cache configuration
			require(CONFIGURATION_PATH + "/cache" + CONFIGURATION_FILE_EXTENSION),

			// Load framework classes
			require(MODEL_PATH + "/AbstractModel" + MODEL_FILE_EXTENSION),
			
			require(EXCEPTION_PATH + "/FormDataException" + EXCEPTION_FILE_EXTENSION),
			require(EXCEPTION_PATH + "/InternalServerErrorException" + EXCEPTION_FILE_EXTENSION),
			require(EXCEPTION_PATH + "/NotFoundException" + EXCEPTION_FILE_EXTENSION),

			// Load NodeJS library
			require("fs"),
			new (require("node-cache"))(),
			require("crypto"),
			require("ejs"),
			require("postcss"),
			require("cssnano"),
			require("autoprefixer"),
			require("uglify-js"),
			require("zlib"),
			require("html-minifier"),
			//require("xml2js")
		]);
	}

	/**
	 * Load post data and run calback..
	 * @param function callback Callback on end request.
	 * @returns void
	 */
	loadPostData(callback) {
		// On data event
		let query = "";
		const o = this;
		this.request.on("data", (chunk) => {
			// Concatenate query string
			query += chunk;
		});

		// On end event
		this.request.on("end", () => {
			// Convert query string to object
			this.parameters = Object.fromEntries(new URLSearchParams(query));
			
			// Run dynamic resource
			callback();
		});
	}

	/**
	 * Parse URL and return object containing path, resource name and request type.
	 * @param string url URL. 
	 * @returns object {
	 * 	path: <string>,
	 * 	resourceName: <string>,
	 * 	fileExtension: <string|null>,
	 * 	uri: <string>>,
	 * 	modelName: <string|null>,
	 * 	actionName: <string|null>,
	 * 	requestType: <page|event|dialog|ws|static>,
	 * 	parameters: <object>
	 * }
	 */
	static parseUrl(url) {
		// Parse URI
		/*
		Example 1:
		[
			'/aa/bb/login,event?email=my@email.com&password=12345678',
			'/aa/bb/login',
			'/aa/bb/',
			'login',
			undefined,
			undefined,
			',event?email=my@email.com&password=12345678',
			',event',
			'event',
			'?email=my@email.com&password=12345678',
			'email=my@email.com&password=12345678',
			index: 0,
			input: '/aa/bb/login,event?email=my@email.com&password=12345678',
			groups: undefined
		]

		Example 2:
		[
			'/aa/bb/login?email=my@email.com&password=12345678',
			'/aa/bb/login',
			'/aa/bb/',
			'login',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			'email=my@email.com&password=12345678',
			index: 0,
			input: '/aa/bb/login?email=my@email.com&password=12345678',
			groups: undefined
		]

		Example 3:
		[
			'/aa/bb/?email=my@email.com&password=12345678',
			'/aa/bb/',
			'/aa/bb/',
			'',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			'email=my@email.com&password=12345678',
			index: 0,
			input: '/aa/bb/?email=my@email.com&password=12345678',
			groups: undefined
		]

		Example 4:
		[
			'/login?email=my@email.com&password=12345678',
			'/login',
			'/',
			'login',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678',
			'email=my@email.com&password=12345678',
			index: 0,
			input: '/login?email=my@email.com&password=12345678',
			groups: undefined
		]

		Example 5:
		[
			'/?email=my@email.com&password=12345678%27',
			'/',
			'/',
			'',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678%27',
			undefined,
			undefined,
			'?email=my@email.com&password=12345678%27',
			'email=my@email.com&password=12345678%27',
			index: 0,
			input: '/?email=my@email.com&password=12345678%27',
			groups: undefined
		]

		Example 6:
		[
			'/aa/bb/image.png?k1=v1',
			'/aa/bb/image.png',
			'/aa/bb/',
			'image.png',
			'.png',
			'png',
			'?k1=v1',
			undefined,
			undefined,
			'?k1=v1',
			'k1=v1',
			index: 0,
			input: '/aa/bb/image.png?k1=v1',
			groups: undefined
		]
		*/
		const t = url.match(/^(([^\,\?]*\/)([^\/\.\,\?]*(\.([^\.\,\?]+))?))((\,([^\,\?]+))?(\?([^\?]+)?)?)?/),
			t2 = t[2].split("/"),
			modelName = t[2] !== "/" ? t2[t2.length - 2] : "index",
			resourceName = t[3] !== "" ? t[3] : "index",
			requestType = t[8] !== undefined ? t[8] : "page";
		
		// Return parsed result
		return {
			path: t[2] === "/" ? "/" : t[2].replace(/[^\/]+\/$/, ""),
			resourceName: resourceName,
			fileExtension: t[5] !== undefined ? t[5] : null,
			uri: t[3] !== "" ? t[1] : t[1] + "index",
			modelName: t[5] === undefined ? Ainjs.toPascalCase(modelName) + (requestType !== "page" ? requestType[0].toUpperCase() + requestType.slice(1) : "") : null,
			actionName: t[5] === undefined ? Ainjs.toCamelCase(resourceName) : null,
			requestType: t[5] === undefined ? requestType : "static",
			parameters: t[10] !== "" ? Object.fromEntries(new URLSearchParams(t[10])) : {}
		};
	}

	/**
	 * Convert a string to Pascal case.
	 * @param string String. 
	 * @returns string
	 */
	 static toPascalCase(string) {
		// Convert accentued characters to non accentued characters
		string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

		// Convert non alphanumeric to space and retrieve words
		let words = string.replace(/[^a-zA-Z\d]+/g, " ").split(" "),
			count = words.length;
		
		// Upper case first character of each word
		for(let i = 0; i < count; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].slice(1);
		}

		// Return Pascal case
		return words.join("");
	}

	/**
	 * Convert a string to Camel case.
	 * @param string string 
	 * @returns string
	 */
	static toCamelCase(string) {
		// Convert string to Pascal case
		string = Ainjs.toPascalCase(string);

		// Return Camel case
		return string[0].toLowerCase() + string.slice(1);
	}

	/**
	 * Load this.formData in synchronous process and put in cache.
	 * @param string uri URI.
	 * @param string requestType Request type: page, event, dialog, ws.
	 * @returns object
	 */
	 static async getFormData(uri, requestType) {
		// Retrieve form data from cache
		let formData = global.cache.get(uri += "." + requestType + FORM_FILE_EXTENSION);
		
		// Case form data does not exist in cache
		if(formData === undefined) {
				let fieldNames = null;
				try {
					// Load fields list: request parameters list
					fieldNames = require(FORM_PATH + uri);
				} catch(e) {
					// Request has no parameter
					return null;
				}

				// Initialize form data
				formData = {};

				// Load fields asynchronously
				let requires = [];
				for(const fieldName of fieldNames) {
					requires.push(new Promise((resolve, reject) => {resolve(require(FIELD_PATH + "/" + fieldName + FIELD_FILE_EXTENSION))}));
				}
				requires = await Promise.all(requires);
				
				// Build form data
				const n = requires.length;
				for(let i = 0; i < n; i++) {
					formData[fieldNames[i]] = requires[i];
				};
				
				// Store form data in cache
				Ainjs.putStaticCache(uri, formData, requestType + FORM_FILE_EXTENSION);
		}
		
		// Return form data
		return formData;
	}

	/**
	 * Return require content if found, othewise defaultValue.
	 * @param string fileName File name.
	 * @param {*} defaultValue (optional) Default value if not found. null by default.
	 * @returns null|object|array
	 */
	static getRequireContent(fileName, defaultValue) {
		try {
			// Return require content
			return require(fileName);
		} catch(e) {
			// No content by default
		}

		// Return default value
		return defaultValue === undefined ? null : defaultValue;
	}

	/**
	 * Return file content if found, othewise defaultValue.
	 * @param string fileName File name.
	 * @param {*} defaultValue (optional) Default value if not found. null by default.
	 * @returns null|string
	 */
	static getFileContent(fileName, defaultValue) {
		try {
			// Return file content
			return global.fs.readFileSync(fileName).toString();
		} catch(e) {
			// No content by default
		}

		// Return default value
		return defaultValue === undefined ? null : defaultValue;
	}

	/**
	 * Return minified CSS file content if found, othewise defaultValue.
	 * @param string fileName CSS file name.
	 * @param {*} defaultValue (optional) Default value if not found. null by default.
	 * @returns null|string
	 */
	 static async getCssContent(fileName, defaultValue) {
		try {
			// Minify merged files content: use plugins cssnano and autoprefixer
			const output = await global.postcss([global.cssnano, global.autoprefixer]).process(
				global.fs.readFileSync(fileName).toString(),
				{from: undefined}
			);

			// Return minified file content
			return output.css;
		} catch(e) {
			// No content by default
		}

		// Return default value
		return defaultValue === undefined ? null : defaultValue;
	}

	/**
	 * Return JS file content if found, othewise defaultValue.
	 * @param string fileName JS file name.
	 * @param {*} defaultValue (optional) Default value if not found. null by default.
	 * @returns null|string
	 */
	 static getJsContent(fileName, defaultValue) {
		try {
			// Minify and return JS file content
			return global.uglifyJS.minify(global.fs.readFileSync(fileName).toString()).code;
		} catch(e) {
			// No content by default
		}

		// Return default value
		return defaultValue === undefined ? null : defaultValue;
	}

	/**
	 * Return page element file content if found, othewise defaultValue.
	 * @param string uri Page element URI.
	 * @param string fileExtension File extension.
	 * @returns null|string
	 */
	static getPageElement(uri, fileExtension) {
		// Return page element (header, footer or menu) if found
		let content = Ainjs.getFileContent(uri + fileExtension);
		if(content !== null) {
			return content;
		}

		// Return page default of the sub folders
		let t = uri.split("/");
		while(t.length > 2) {
			t.pop();
			content = Ainjs.getFileContent(PAGE_VIEW_PATH + t.join("/") + "/default" + fileExtension);
			if(content !== null) {
				return content;
			}
		}

		// Return default content: this content must exist
		return global.fs.readFileSync(PAGE_VIEW_PATH + "/default" + fileExtension).toString();
	}

	/**
	 * Return page breadcrumb content.
	 * @param string uri URI (ex: /folder1/folder2/resource-name).
	 * @returns string
	 */
	static getPageBreadcrumb(uri) {
		// Begin breadcrumb
		//See https://developers.google.com/search/docs/data-types/breadcrumb
		let breadcrumb = '<ol itemscope itemtype="https://schema.org/BreadcrumbList">',
			metadata;
		
		// Loop on URL resources
		const folders = uri.split("/"),
			foldersLength = folders.length;
		uri = "";
		for(let i = 0; i < foldersLength; i++) {
			// Case not index resource
			let isIndex = i === 0 || folders[i] === "index";
			if(!isIndex) {
				uri += "/" + folders[i] ;
			}

			// Case not /index
			if(!(i === 1 && folders[i] === "index")) {
				// Retrieve resource metadata
				metadata = Ainjs.getRequireContent(METADATA_PATH + (!isIndex ? uri : uri + "/index") + METADATA_FILE_EXTENSION);
				if(metadata !== null) {
					// Add link
					breadcrumb += '<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="' + metadata.canonical
						+ '" title="' + metadata.title
						+ '" itemprop="item"><span itemprop="name">' + metadata.navigation
						+ '</span></a><meta itemprop="position" content="' + i
						+ '"/></li>';
				}
			}
		}
		
		//End breadcrumb
		return breadcrumb + "</ol>";
	}

	/**
	 * Throw exception.
	 * @param string|AbstractException name Exception name. Exception must exists in /exception folder (ex: FormDataException).
	 * @param string|object message (optional) Exception message. undefined by default.
	 * @returns void
	 * @throws AbstractException
	 */
	throwException(name, message) {
		const exceptionClass = typeof name === "function"
			? name
			: require(EXCEPTION_PATH + "/" + name + EXCEPTION_FILE_EXTENSION);
		throw new exceptionClass(message);
	}

	/**
	 * Check request parameters.
	 * @param object parameters Request parameters pass by reference (ex: this.parameters).
	 * @param object formData Form data (ex: this.formData).
	 * @param string redirectUrl (optional) Redirect URL on error. undefined by default.
	 * @returns void
	 * @throws FormDataException
	 */
	checkParameters(parameters, formData, redirectUrl) {
		try {
			//Loop on form data
			for(const fieldName in formData) {
				// Retrieve field field
				const field = formData[fieldName],
					label = field.title === null ? field.label : field.title;
				
				// Case parameter exists
				if(parameters[fieldName] !== undefined) {
					// Case array value from select, checkbox
					// Case string value (by default) from input, textarea, radio
					const values = typeof parameters[fieldName] === "object" 
						? (
								typeof field.defaultValue === "object"
									? field.defaultValue
									: [field.defaultValue]
							)
						: [parameters[fieldName]];
					
					//Loop on values
					for(let value of values) {
						// Clean value: string by default
						value = value.trim();
						
						// Check required value
						if(field.required.value && value === "") {
							// Case no default value
							if(field.defaultValue === null) {
								throw new FormDataException({fieldId: fieldName, type: "required", message: field.required.message, label: label});
							}

							// Set default value
							parameters[fieldName] = value = field.defaultValue;
						}

						// Check length and format
						const length = ("" + value).length;
						if(length > 0) {
							// Check miunimum length
							if(field.minLength.value > 0 && length < field.minLength.value) {
								throw new FormDataException({fieldId: fieldName, type: "minLength", message: field.minLength.message, label: label});
							}

							// Check maximum length
							if(field.maxLength.value > 0 && length > field.maxLength.value) {
								throw new FormDataException({fieldId: fieldName, type: "maxLength", message: field.maxLength.message, label: label});
							}

							// Check format
							if(field.format.value !== null) {
									if(!field.format.value.test(value)) {
										throw new FormDataException({fieldId: fieldName, type: "format", message: field.format.message, label: label});
									}
							}
							
							// Check select: field.values should not be empty
							if(field.type === "select" && field.values !== null) {
								// Case select key not found with value string type by default
								if(field.values[value] === undefined) {
									throw new FormDataException({fieldId: fieldName, type: "format", message: field.format.message, label: label});
								}
							}

							// Check number: min and max
							else if(field.type === "number") {
								//Cast value to int or decimal: int by default
								parameters[fieldName] = value = field.step === null || !/[\.]/.test(field.step) ? parseInt(value, 10) : parseFloat(value);

								// Case min exists
								if(field.min.value !== null && value < field.min.value) {
									throw new FormDataException({fieldId: fieldName, type: "min", message: field.min.message, label: label});
								}

								// Case max exists
								if(field.max.value !== null && value < field.max.value) {
									throw new FormDataException(JSON.stringify({fieldId: fieldName, type: "max", message: field.max.message, label: label}));
								}
							}
						}
					}
				}

				// Case parameter is not set
				else {
					parameters[fieldName] = null;
				}
				
				// Case parameter is not set or is empty
				if(parameters[fieldName] === null || parameters[fieldName] === "") {
					// Set parameter with default value
					parameters[fieldName] = field.defaultValue;
					
					// Case required parameter
					if(field.required.value) {
						// Case no default value
						if(field.type === 'checkbox' || field.defaultValue === null) {
							throw new FormDataException({fieldId: fieldName, type: "required", message: field.required.message, label: label});
						}
					}
				}
			}

			// Case exists model
			if(this.model !== null) {
				// Set/Update model parameters
				this.model = parameters;
			}
		} catch(e) {
			// Case no redirect URL, throw exception
			if(redirectUrl === undefined || redirectUrl === null) {
				throw e;
			}
			
			// On error, redirect URL
			this.response.redirect(301, redirectUrl);
		}
	}

	/**
	 * Load all view elements of the page and return view template. 
	 * @param string pageView Page view.
	 * @returns string
	 */
	async getPageView(pageView) {
		// Retrieve form data, model class, aspects list
		const [templateView, pageCriticalCss, pageCss, pageJs, pageHeader, pageMenu, pageFooter, pageBreadcrumb, metadata] = await Promise.all([
			Ainjs.getFileContent(TEMPLATE_PATH + "/" + this.template + TEMPLATE_FILE_EXTENSION),
			Ainjs.getFileContent(PUBLIC_PATH + "/critical" + CSS_FILE_EXTENSION, ""),
			Ainjs.getCssContent(CSS_VIEW_PATH + this.uri + "." + this.requestType + CSS_VIEW_FILE_EXTENSION, ""),
			Ainjs.getJsContent(JS_VIEW_PATH + this.uri + "." + this.requestType + JS_VIEW_FILE_EXTENSION, ""),
			Ainjs.getPageElement(this.uri, HEADER_VIEW_FILE_EXTENSION),
			Ainjs.getPageElement(this.uri, MENU_VIEW_FILE_EXTENSION),
			Ainjs.getPageElement(this.uri, FOOTER_VIEW_FILE_EXTENSION),
			Ainjs.getPageBreadcrumb(this.uri),
			Ainjs.getRequireContent(METADATA_PATH + this.uri + METADATA_FILE_EXTENSION, {
				title: "",
				navigation: "",
				description: "",
				keywords: "",
				author: AUTHOR,
				compression: true,
				static: true,
				expiry: 0,
				cache: 0,
				canonical: this.uri
			})
		]);
		
		// Set view data
		this.view._pageBody = pageView;
		this.view._pageCriticalCss = pageCriticalCss;
		this.view._pageCss = pageCss;
		this.view._pageJs = pageJs;
		this.view._pageHeader = pageHeader;
		this.view._pageMenu = pageMenu;
		this.view._pageFooter = pageFooter;
		this.view._pageBreadcrumb = pageBreadcrumb;
		this.view._metadata = metadata;

		// Return template view
		return templateView;
	}

	/**
	 * Put page content in file cache.
	 * @param string cacheFile Cache file to save.
	 * @param string content Page content to put in cache (ex: "<html...</html>").
	 * @returns void
	 */
	async putPageCache(cacheFile, content) {
		// Create HTML file
		global.fs.writeFile(cacheFile, content, (err) => {
			// Case error
			if(err) {
				// Lof error
				return log(err);
			}
		});

		// Create deflate JS file
		global.zlib.deflate(content, (err, buffer) => {
			// Case error
			if(err) {
				// Lof error
				return log(err);
			} 
			
			// Create deflate file
			global.fs.writeFile(cacheFile + ".deflate", buffer, (err) => {
				// Case error
				if(err) {
					// Lof error
					log(err);
				}
			});
		});
	}

	/**
	 * Put static content in cache with expiration depending on cache configuration.
	 * @param string uri URI
	 * @param string value Content to put in cache.
	 * @param string extension Resource extension (ex: css, js, etc.).
	 * @returns void
	 */
	 static putStaticCache(uri, value, extension) {
		// Case URI exists in cache configuration
		if(global.cacheConfiguration.uri[uri] !== undefined) {
			// Case cache expiration set
			if(global.cacheConfiguration[uri].expiry > 0) {
				// Put cache with expiration
				global.cache.set(uri, value, global.cacheConfiguration.uri[uri].expiry);
			}

			// Ignore cache by extension
			return;
		}

		// Case extension exists in cache configuration
		if(global.cacheConfiguration.extension[extension] !== undefined && global.cacheConfiguration.extension[extension].expiry > 0) {
			// Put cache with expiration
			global.cache.set(uri, value, global.cacheConfiguration.extension[extension].expiry);
		}
	}

	/**
	 * Render page on success.
	 * @returns void
	 */
	async renderOnSuccessPage() {
		// Load page view
		this.getPageView(this.pageView).then((pageView) => {
			// Minify page content
			const htmlMinifier = require('html-minifier');
			pageView = htmlMinifier.minify(global.ejs.render(pageView, this.view), {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				//minifycss: true,
				//minifyJS: true
			}).replace(/[\t\n\r]+/g, "");

			// Set response status and content type
			this.response.writeHead(200, {"Content-Type": "text/html"});

			// Set response content
			this.response.write(pageView);
			this.response.end();

			// Case static page
			if(this.view._metadata.static && this.view._metadata.expiry > 0) {
				// Save page in file cache
				this.putPageCache(PAGE_CACHE_PATH + "/"+ this.uri.slice(1).replace(/\//g, "_") + HTML_FILE_EXTENSION, pageView);

				// Put page in cache
				if(this.view._metadata.expiry > 0) {
					global.cache.set(this.uri, pageView, this.view._metadata.expiry);
				}
			}
		});
	}

	/**
	 * Render page on error.
	 * @param AbstractException exception Exception.
	 * @returns void
	 */
	async renderOnErrorPage(exception) {
		// Load page view
		this.uri = exception instanceof NotFoundException ? "/not-found" : "/internal-server-error";
		this.getPageView(Ainjs.getFileContent(PAGE_VIEW_PATH + this.uri + PAGE_VIEW_FILE_EXTENSION)).then((pageView) => {
			// Set response status and content type
			this.response.writeHead(exception.statusCode, {"Content-Type": "text/html"});

			// Set response content
			this.response.write(global.ejs.render(pageView, this.view));
			this.response.end();
		});
	}

	/**
	 * Render event on success.
	 * @returns void
	 */
	async renderOnSuccessEvent() {
		// Set response status and content type
		this.response.writeHead(200, {"Content-Type": this.pageView !== null || this.pageView[0] === "<" ? "text/html" : (this.pageView[0] === "{" ? "application/json" : "application/javascript")});

		// Set response content
		this.response.write(global.ejs.render(this.pageView, this.view));
		this.response.end();
	}

	/**
	 * Render event on error.
	 * @param AbstractException exception Exception.
	 * @returns void
	 */
	async renderOnErrorEvent(exception) {
		// Set response status and content type
		this.response.writeHead(exception.statusCode, {"Content-Type": exception.message === null || exception.message === "" || exception.message[0] === "<" ? "text/html" : (exception.message[0] === "{" ? "application/json" : "application/javascript")});

		// Set response content
		this.response.write(exception.message);
		this.response.end();
	}

	/**
	 * Render dialog on success.
	 * @returns void
	 */
	async renderOnSuccessDialog() {
		// Set response status and content type
		this.response.writeHead(200, {"Content-Type": "text/html"});

		// Set response content
		this.response.write(global.ejs.render(this.pageView, this.view));
		this.response.end();
	}

	/**
	 * Render dialog on error.
	 * @param AbstractException exception Exception.
	 * @returns void
	 */
	async renderOnErrorDialog(exception) {
		// Set response status and content type
		this.response.writeHead(exception.statusCode, {"Content-Type": "text/html"});

		// Set response content
		this.uri = exception instanceof NotFoundException ? "/not-found" : "/internal-server-error";
		this.response.write(global.ejs.render(Ainjs.getFileContent(DIALOG_VIEW_PATH + this.uri + DIALOG_VIEW_FILE_EXTENSION), this.view));
		this.response.end();
}

	/**
	 * Render web service on error.
	 * @returns void
	 */
	async renderOnSuccessWs() {
		// Set response status and content type
		const format = this.parameters.format === undefined || this.parameters.format === null || MIME_TYPE[this.parameters.format] === undefined ? "json" : this.parameters.format;
		this.response.writeHead(200, {"Content-Type":	MIME_TYPE[format]});
		
		// Build response
		// Case page view exists
		let response = null;
		if(this.pageView !== null) {
				// Case view data exist
				if(Object.entries(this.view).length > 0) {
					// Build response with page view and view data
					response = global.ejs.render(this.pageView, this.view);
				}

				// Case by default
				else {
					// Set response with page view by default
					response = this.pageView;
				}
		}

		// Case page view does not exist
		else {
			// Build default response with view data
			const viewType = typeof this.view;
			response = JSON.stringify({
				uri: this.uri + "," + this.requestType,
				parameters: this.parameters,
				duration: process.hrtime(HR_START)[1] / 1000000,
				data: viewType === "object"
					? this.view
					: (viewType === "string" && this.view[0] === "{") ? JSON.parse(this.view) : this.view
			});
		}

		// Case response into XML
		if(format === "xml") {
			// Convert object to XML string
			if(global.xml2js === null) {
				global.xml2js = require("xml2js");
			}
			response = (new global.xml2js.Builder()).buildObject(JSON.parse(response));
		}

		// Set response content
		this.response.write(response);
		this.response.end();
	}

	/**
	 * Render web service on error.
	 * @param AbstractException exception Exception.
	 * @returns void
	 */
	async renderOnErrorWs(exception) {
		// Set response status and content type
		const format = this.parameters.format === undefined || this.parameters.format === null || MIME_TYPE[this.parameters.format] === undefined ? "json" : this.parameters.format;
		this.response.writeHead(exception.statusCode, {"Content-Type":	MIME_TYPE[format]});

		// Build response
		// Case error page view exists
		const message = JSON.stringify({
			uri: this.uri + "," + this.requestType,
			parameters: this.parameters,
			duration: process.hrtime(HR_START)[1] / 1000000,
			data: {
				statusCode: exception.statusCode,
				message: this.http.STATUS_CODES[exception.statusCode],
				information: typeof exception.message === "object" ? JSON.parse(exception.message) : exception.message
			}
		});
		this.uri = exception instanceof NotFoundException ? "/not-found" : "/internal-server-error";
		let response = Ainjs.getFileContent(WS_VIEW_PATH + this.uri + WS_VIEW_FILE_EXTENSION);
		if(response !== null) {
			// Set response view if not exists
			if(this.view.response === undefined) {
				this.view.response = message;
			}
			
			// Build response with page view and view data
			response = global.ejs.render(response, this.view);
		}
		
		// Case error page view does not exist
		else {
			// Build default response
			response = message;
		}

		// Case response into XML
		if(format === "xml") {
			// Convert object to XML string
			if(global.xml2js === null) {
				global.xml2js = require("xml2js");
			}
			response = (new global.xml2js.Builder()).buildObject(JSON.parse(response));
		}

		// Set response content
		this.response.write(response);
		this.response.end();
	}

	/**
	 * Log message.
	 * @param string|Exception exception Message to log.
	 * @returns void
	 */
	async log(exception) {
		// Determine current date and time
		const dateTime = new Date().toISOString(),
			logFile = LOG_PATH + "/error-" + dateTime.slice(0, 10).replace(/-/g, "") + LOG_FILE_EXTENSION,
			message = dateTime.replace(/\..+$/g, "") + " " + exception.stack;

		// Log error in file
		global.fs.appendFile(logFile, message + "\n", (err) => {
			if(err) {
				console.log("Write in file impossible: " + logFile + "\n" + err + "\n" + message);
			}
		});
	}

	/**
	 * Run dynamic resource.
	 * @returns void
	 */
	async runDynamicResource() {
		try {
			// Load AbstractWsModel if request type is "ws"
			const isWs = this.requestType === "ws";
			if(isWs) {
				AbstractWsModel = require(MODEL_PATH + "/AbstractWsModel" + MODEL_FILE_EXTENSION);
			}

			// Retrieve resource elements (model class, form data, aspects list, page view) and class
			let viewPrefix = this.requestType.toUpperCase(),
				[modelClass, formData, aspects, pageView] = await Promise.all([
					Ainjs.getRequireContent(MODEL_PATH + this.path + this.modelName + MODEL_FILE_EXTENSION),
					Ainjs.getFormData(this.uri, this.requestType),
					Ainjs.getRequireContent(ASPECT_PATH + this.uri + "." + this.requestType + ASPECT_FILE_EXTENSION, []),
					Ainjs.getFileContent(global[viewPrefix + "_VIEW_PATH"] + this.uri + global[viewPrefix + "_VIEW_FILE_EXTENSION"])
				]);
			
			// Instanciate model
			this.formData = formData;
			this.model = modelClass === null ? null : new modelClass(this);

			// Case ws request type
			if(isWs) {
				// Case no model or action
				if(modelClass === null || this.model === null || this.model[this.actionName] === undefined) {
					this.throwException("NotImplementedException", this.uri + "," + this.requestType);
				}
			}

			// Case page, event, or dialog request type, but no view
			else if(pageView === null) {
				throw new NotFoundException(this.requestType === "page" ? this.uri : this.uri + "," + this.requestType);
			}

			// Retrieve aspects list
			// Case aspects list definied
			if(typeof aspects === "function") {
				aspects = aspects(this);
			}

			// Case no aspects list
			else if(aspects.length === 0 && this.model !== null && this.model[this.actionName] !== undefined) {
				// Define aspects list by default: only action
				aspects = [{
					methodName: this.model[this.actionName].bind(this.model),
					arguments: null
				}];
			}
		
			// Set page view
			this.pageView = pageView;

			// Run aspects : an aspect can call aojs method (this.xxx) and/or model method (this.model.xxx)
			for(const aspect of aspects) {
				// Execute aspect
				if(aspect.arguments === undefined || aspect.arguments === null || aspect.arguments.length === 0) {
					await aspect.methodName();
				}
				else {
					await aspect.methodName(...aspect.arguments);
				}
			}

			// Retrieve model view data
			if(this.model !== null) {
				// Merge Ainjs view data and model view data
				this.view = {...this.view, ...this.model.view};
			}
			
			// Render on success
			this["renderOnSuccess" + this.requestType[0].toUpperCase() + this.requestType.slice(1)]();
		} catch(exception) {
			// Case not FormDataException
			if(!(exception instanceof FormDataException)) {
				// Log error
				this.log(exception);
				
				// Case unknown error
				if(!(exception instanceof AbstractException)) {
					exception = new InternalServerErrorException(this.http.STATUS_CODES[500]);
				}
			}

			// Render on error
			this["renderOnError" + this.requestType[0].toUpperCase() + this.requestType.slice(1)](exception);
		}
	}

	/**
	 * Determine if encoding exists in headers.
	 * @param string encoding Encoding (ex: deflate).
	 * @returns boolean
	 */
	hasAcceptEncoding(encoding) {
		const re = new RegExp("(^|[^\\w])" + encoding + "([^\\w]|$)");
		return re.test(this.request.headers["accept-encoding"]);
	}

	/**
	 * Launch request. It is the entry point of the Aspect-Oriented process.
	 * @returns void
	 */
	async run() {
		// Case globals not yet initialized
		if(global.fs === null) {
			await this.initilizeGlobals();
		}

		// Parse URL
		const parsedUrl = Ainjs.parseUrl(this.request.url),
			contentType = MIME_TYPE[parsedUrl.fileExtension],
			hasDeflate = /\bdeflate\b/.test(this.request.headers["accept-encoding"]);
		let headers = {"Content-Type": contentType};

		// Set expiration information for browser
		if(global.cacheConfiguration.extension[parsedUrl.fileExtension] !== undefined && global.cacheConfiguration.extension[parsedUrl.fileExtension].cache > 0) {
			headers["Expires"] = new Date(Date.now() + global.cacheConfiguration.extension[parsedUrl.fileExtension].cache * 1000).toGMTString();
			headers["Cache-Control"] = "max-age=" + global.cacheConfiguration.extension[parsedUrl.fileExtension].cache + ", must-revalidate";
		}
		else {
			// Already expires
			headers["Expires"] = "Sun, 06 Feb 1972 00:00:00 GMT";

			// No cacheable
			headers["Cache-Control"] = "no-cache, must-revalidate";
			headers["Pragma"] = "no-cache";
		}

		// Case static resource: resource with extension (ex: image, css, js...)
		if(parsedUrl.fileExtension !== null) {
			// Case file extension found
			if(contentType !== undefined) {
				// Case client accepts deflate format
				let uri = parsedUrl.uri;
				if(hasDeflate && (parsedUrl.fileExtension === "css" || parsedUrl.fileExtension === "js")) {
					uri += ".deflate";
					headers["Content-Encoding"] = "deflate";
					headers["Vary"] = "Accept-encoding, User-Agent";
				}

				// Retrieve resource from cache if exists
				const cache = global.cache.get(uri);

				// Case cache exists
				if(cache !== undefined) {
					// Return cache
					this.response.writeHead(200, headers);
					this.response.end(cache);
					return;
				}

				// Read deflate file from file system
				global.fs.readFile(PUBLIC_PATH + uri, (err, data) => {
					// Case error
					if(err/* && hasDeflate*/) {
						// Read text file from file system
						global.fs.readFile(PUBLIC_PATH + parsedUrl.uri, (err, data) => {
							// Remove deflate "Accept-Encoding" from headers
							//delete headers["Content-Encoding"];
							//delete headers["Vary"];

							// Case error
							if(err) {
								// Return Not found
								this.response.writeHead(404, headers);
								this.response.end(this.http.STATUS_CODES[404]);
								return;
							}
							
							// Case file found
							// Return file content
							this.response.writeHead(200, headers);
							this.response.end(data);

							// Put resource in cache
							Ainjs.putStaticCache(uri, data, parsedUrl.fileExtension);
						});
						return;
					}
					
					// Case file found
					// Return file content
					this.response.writeHead(200, headers);
					this.response.end(data);

					// Put resource in cache
					Ainjs.putStaticCache(uri, data, parsedUrl.fileExtension);
				});
			}

			// Case file extension unknown or not defined
			else {
				// Return Not found
				this.response.writeHead(404, {"Content-Type": MIME_TYPE.html});
				this.response.end(this.http.STATUS_CODES[404]);
			}

			// End process
			return;
		}
		
		// Set resource attributes
		this.path = parsedUrl.path;
		this.resourceName = parsedUrl.resourceName;
		this.uri = parsedUrl.uri;
		this.modelName = parsedUrl.modelName;
		this.actionName = parsedUrl.actionName;
		this.requestType = parsedUrl.requestType;
		this.parameters = this.parameters === undefined || this.parameters === null
			? parsedUrl.parameters
			: (
				parsedUrl.parameters === null
					? this.parameters
					: {...parsedUrl.parameters, ...this.parameters}
			);
		this.view = {};
		
		// Case dynamic resource
		// Case GET method
		headers["Content-Type"] = MIME_TYPE.html;
		if(this.request.method === "GET") {
			// Case page request type
			if(this.requestType === "page") {
				// Case deflate accepted
				global.fs.readFile(PAGE_CACHE_PATH + "/"+ this.uri.slice(1).replace(/\//g, "_") + (hasDeflate ? DEFLATE_FILE_EXTENSION : HTML_FILE_EXTENSION), (err, data) => {
					// Case no cache
					if(err) {
						// Load dynamic resource
						return this.runDynamicResource();
					}
					
					// Return cache
					if(hasDeflate) {
						headers["Content-Encoding"] = "deflate";
						headers["Vary"] = "Accept-encoding, User-Agent";
					}
					this.response.writeHead(200, headers);
					this.response.end(data);
				});
			}

			// Case other request type
			else {
				// Load dynamic resource
				this.runDynamicResource();
			}
		}

		// Case POST method
		else if(this.request.method === "POST") {
			// Load data and then load dynmaic resource
			this.loadPostData(this.runDynamicResource.bind(this));
		}
		
		// Case other method: @todo
		else {
			this.response.writeHead(405, headers);
			this.response.end(this.http.STATUS_CODES[405]);
		}
	}
};