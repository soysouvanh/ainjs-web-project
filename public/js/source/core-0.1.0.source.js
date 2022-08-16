/**
 * Dependencies:
 *		- loading-layer.source.css
 * 
 */

/**
 * Asynchrone script to load Javascript libraries.
 * To load dynamically Javascript resource, this function should be used.
 * 
 * @param r Resource URL to load.
 * @param e Event or function to execute after resource loaded.
 * @return void
 * @deprecated use instead <script defer src="xxx"></script>
 */
/*function _as(r,e){
   var d=document,
	   t=d.createElement("script");
   t.type="text/javascript";
   t.src=r;
   t.async=true;
   if(e){
	   if(d.all)t.onreadystatechange=function(){
		   var s=t.readyState;
		   if(s=="loaded"||s=="complete")e()
	   };
	   else t.onload=e
   }
   //d.body.appendChild(t)
   d.head.insertBefore(t,d.head.children[d.head.children.length-1].nextElementSibling)
}*/

/**
 * Send AJAX request.
 * @param object parameters Object in JSON format:
 *	- url: URL.
 *	- method: (optional) Method GET by default.
 *	- data: (optional) Parameters in JSON or string format.
 *	- async: (optional) true to send request asynchronous. true by default.
 *	- send: (optional) function to execute after sending request.
 *	- success: (optional) function to execute on success.
 *	- error: (optional) function to execute on error.
 *	- progress: (optional) function to execute on progress.
 *	- load: (optional) function to execute on load.
 *	- loadEnd: (optional) function to execute on load end.
 *	- responseType: (optional) response type: "text/html" or "text/xml". "text/html" by default.
 *	- header: (optional) data (keys/values) to put in the request headers.
 * @returns boolean true if there is no error with XMLHttpRequest, otherwise false.
 */
function ajax(parameters) {
	var xhr = null,
		query = null,
		dataType = typeof parameters.data;
	
	//Execute before action
	if(parameters.before) {
		parameters.before();
	}
	
	//Check url
	if(!parameters.hasOwnProperty("url") || parameters.url === "") {
		return false;
	}
	
	//Set response type by default
	if(typeof parameters.responseType === "undefined") {
		//parameters.responseType = "text/html";
		parameters.responseType = "text";
	}
	
	//Case Mozilla, Safari,...
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();

		//Some Mozilla versions can not work without overide mime type
		if(xhr.overrideMimeType) {
			xhr.overrideMimeType(parameters.responseType);
		}
	}
	
	//Case IE
	else if(window.ActiveXObject) {
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e) {
			try {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e) {
			}
		}
	}
	
	//Case no XMLHttpRequest
	if(xhr == null) {
		alert("Impossible to create XMLHttpRequest instance. Your browser is too old.");
		return false;
	}
	
	try {
		//Set response type
		xhr.responseType = parameters.responseType;
	} catch(e) {
		//Fix IE11
		xhr.onloadstart = function(ev) {
			xhr.responseType = parameters.responseType;
		}
	}
	
	//Define action on server response
	xhr.onreadystatechange = function() {
		//xhr.readyState == 1 : xhr created
		//xhr.readyState == 2 : send called
		//xhr.readyState == 3 : data sent
		//xhr.readyState == 4 : data receipted
		if(xhr.readyState == 4) {
			//Case success
			//if(xhr.status == 200 || xhr.status == 0) {
			if(xhr.status < 500) {
				if(parameters.success) {
					parameters.success(xhr, parameters);
				}
			}
			
			//Case error
			else {
				if(parameters.error) {
					parameters.error(xhr);
				}
				console.log(xhr);
			}
		}
	};
	
	//Build query: if no query, it must be null
	if(dataType === "object") {
		query = "";
		for(var key in parameters.data) {
			query += "&" + key + "=" + encodeURIComponent(parameters.data[key]);
		}
		query = query !== "" ? query.substring(1) : null;
	}
	else if(dataType === "string") {
		if((parameters.data = parameters.data.trim()) !== "") {
			query = parameters.data;
		}
	}
	
	//Check method
	parameters.method = typeof parameters.method === "string" ? parameters.method.toLowerCase() : "get";
	if(parameters.method !== "get" && parameters.method !== "post") {
		parameters.method = "get";
	}
	
	//Case GET method
	var url = parameters.url;
	if(parameters.method === "get") {
		//Remove "?" at the end of the URL
		url = url.trimRight("?");
		
		//Case query
		if(query !== null) {
			//Add query to the URL
			url += "?" + query;
		}
	}
	
	//Set events
	xhr.onprogress = parameters.progress;
	xhr.onerror = parameters.error;
	xhr.onload = parameters.load;
	xhr.onloadend = parameters.loadEnd;
	
	//Open the URL: asynchron by default
	xhr.open(parameters.method, url, parameters.async === _u || parameters.async);
	
	//Case POST method
	if(parameters.method === "post") {
		//Change the MIME type for POST method: must be after xhr.open and before xhr.send
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
    
    //Case request headers
    if("object" == typeof parameters.header) {
        for(var key in parameters.header) {
			xhr.setRequestHeader(key, parameters.header[key]);
		}
    }
	
	//Send request
	xhr.send(query);
    
    //Case after send action
    if(parameters.send) {
        parameters.send();
    }
	
	return true;
}

/**
 * Parse query string and return parameters in object (JSON) format.
 * @param string url URL (window.location.href) or query (window.location.search).
 * @return object Map with key/value.
 */
function getParameters(url) {
	/*
	var t = url.split("?");
	t = (t.length > 1 ? t[1] : t[0]).split("&");
	
	var l = t.length,
		map = {},
		i,
		q;
	for(i = 0; i < l; i++) {
		q = t[i].split("=");
		map[q[0]] = decodeURIComponent(q[1]);
	}
	
	return map;
	*/
	var map = {};
	
	url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
		map[key] = decodeURIComponent(value);
	});
	
	return map;
}

/**
 * Return template.
 * @param string templateId Tag identifier.
 * @param object values Keys to replace by values (ex: {label: "...", description: "..."}).
 * @return string
 */
function getTemplate(templateId, values) {
	var html = _$(templateId).innerHTML;
	for(var i in values) {
		html = html.replace(new RegExp("{#" + i + "}", "g"), values[i]);
	}
	return html;
}

/**
 * Show/remove button loader
 * @param string id Button identifier (ex: okBtn).
 * @param boolea status true to show loader, otherwise false to remove loader.
 * @return void
 */
/*function setButtonLoader(id, status) {
	var btn = _$(id);
	if(btn === null) {
		return;
	}
	
	//Show loader
	if(status === true) {
		//Disable button
		btn.setAttribute("disabled", "disabled");
		
		//Show loader
		var loader = _new("i"),
			widthPx = btn.offsetWidth + "px";
		loader.id = "loader";
		loader.style.width = widthPx;
		loader.style.height = btn.offsetHeight + "px";
		loader.style.marginLeft = "-" + widthPx;
		
		loader.className = "icon24 refreshIcon spin";
		btn.parentNode.insertBefore(loader, btn.nextSibling);
	}
	
	//Remove loader
	else {
		//Remove loader
		var loader = _$("loader");
		loader.parentNode.removeChild(loader);
		
		//Enable button
		btn.removeAttribute("disabled");
	}
}*/

/**
 * Return object properties.
 * @param object Object.
 * @return object
 */
function getProperties(o) {
	var props = {};
	
	for(var k in o) {
		var type = typeof o[k];
		if(type !== "function") {
			if(type !== "object") {
				props[k] = o[k];
			}
		}
	}
	
	return props;
}

/**
 * Return the selector maximum z-index.
 * @param string selector (optional) Selector. "body *" by default.
 * @return integer
 */
function getMaxZIndex(selector) {
	//Retrieve tags
	var tags = _doc.querySelectorAll(selector ? selector : "body *"),
		nTags = tags.length,
		maxZIndex = 0,
		view = _doc.defaultView;
	
	//Loop on tags list
	for(var i = 0; i < nTags; i++) {
		//Determine tag zIndex
		var zIndex = view.getComputedStyle(tags[i], null).getPropertyValue("z-index");
		
		//Set zIndex
		if("auto" != zIndex && (zIndex = parseInt(zIndex, 10)) > maxZIndex) {
			maxZIndex = zIndex;
		}
	}
	
	//Return max zIndex
	return maxZIndex;
}

function initializeWindowResizeMessage(url) {
    _win.addEvent("resize", function(ev) {
        var urlData = _win.location;
        _win.parent.postMessage(
            {
                url: urlData.href,
                pathname: urlData.pathname,
                hostname: urlData.hostname,
                protocol: urlData.protocol,
                port: urlData.port,
                width: document.body.offsetWidth,
                height: document.documentElement.offsetHeight,
                head: document.head.innerHTML,
                body: document.body.innerHTML
            },
            "https://adminty.loc"
        );
    });
    
    _win.trigger("resize");
}

/**
 * Show/Hide page loader.
 * 
 * @param boolean isLoading If true, then show page loader, otherwise false.
 * 
 * @returns void
 */
function activeLoader(isLoading) {
	var body = _qs("body"),
		id = "pageLoader",
		pageLoader = _$(id);
	
	//Case show loading
	if(isLoading == _u || isLoading) {
		//Case not loading yet
		if(pageLoader == null) {
			//Show loader
			var loadingLayer = _new("div");
			loadingLayer.id = id;
			loadingLayer.className = "loadingLayer";
			loadingLayer.innerHTML = "<div class='ball1'></div><div class='ball2'></div>";
			loadingLayer.style.height = body.scrollHeight + "px";
			body.appendChild(loadingLayer);

			//Set vertical center
			var ball1 = _qs("#pageLoader > .ball1"),
				delta = (_win.pageYOffset + (_win.innerHeight / 2) - ball1.offsetTop) + "px";
			ball1.style.top = delta;
			_qs("#pageLoader > .ball2").style.top = delta;
		}
	}
	
	//Case remove loading
	else if(pageLoader != null) {
		try {
			body.removeChild(pageLoader);
		} catch(e) {

		}
	}
}

/**
 * Show modal form.
 * @param string uri URI (ex: /project/add).
 * @param string|object data (optional) Parameters. undefined by default.
 * @param string targetId (optional) Tag identifier where to send response. "modalFormPanel" by default.
 * @param string method (optional) HTTP method. "get" by default.
 * @param string callbacks (optional) Callbacks with keys: onSuccess, onError, onBefore, onAfter. undefined by default.
 * @returns void
 */
function modalForm(uri, data, targetId, method, callbacks) {
	if(targetId == _u) {
		targetId = "modalFormPanel";
	}
	if(method == _u) {
		method = "get";
	}
	if(callbacks == _u) {
		callbacks = {};
	}
	if(callbacks.onSuccess == _u) {
		callbacks.onSuccess = function(xhr, parameters) {
			_event.onSuccess(xhr, parameters);
		}
	}
	if(callbacks.onError == _u) {
		callbacks.onError = function(xhr) {
			_event.onError(xhr);
		}
	}
	if(callbacks.onBefore == _u) {
		callbacks.onBefore = function() {
			activeLoader(true);
		};
	}
	if(callbacks.onAfter == _u) {
		callbacks.onAfter = function() {
			var o = _$(this.targetId);
			if(o.children.length > 0) {
				for(var i in o.children) {
					if(o.children[i].tagName != "STYLE" && o.children[i].tagName != "SCRIPT") {
						o.children[i].scrollIntoView(true);
						break;
					}
				}
			}
			else {
				var pl = _$("pageLoader");
				o.remove();
				pl == null && pl.remove();
			}
			activeLoader(false);
		};
	}
	ajax({
		url: uri + ",dialog",
		data: data,
		targetId: targetId,
		success: callbacks.onSuccess,
		error: callbacks.onError,
		before: callbacks.onBefore,
		after: callbacks.onAfter
	});
	
	var panel = _$(targetId);
	if(panel == null) {
		panel = _new("div");
		panel.id = targetId;
		_doc.body.appendChild(panel);
	}
	panel.addClass("modal");
}

/**
 * Show confirm message before delete action.
 * @param object options Options required: id (optional), title, message, url, parameters, yesLabel, noLabel
 * @returns void
 */
function confirmDelete(options) {
	_.confirmDeleteDlg = new Dialog({
		id: options.id ? options.id : "confirmDlg",
		title: options.title,
		body : options.message,
		buttons: {
			okConfirmDlg: {
				label: options.yesLabel,
				onClick: function() {
					_event.post({
						url: options.url,
						data: options.parameters,
						before: function() {
							activeLoader(true);
						},
						after: function() {
							activeLoader(false);
						},
						loadEnd: function() {
							_.confirmDeleteDlg.close();
							delete _.confirmDeleteDlg;
							
						}
					});
				},
				class: "ok"
			},
			cancelConfirmDlg: {
				label: options.noLabel,
				onClick: "close",
				class: "cancel"
			}
		}
	});
}

var 

/**==========================================================================
 * Global for ajax session
 ==========================================================================*/
//Use _ instead of _global
//_global = {
//},

/**==========================================================================
 * Event
 ==========================================================================*/
_event = {
	/**
	 * Default error title on ajax error.
	 * @type String
	 * @see _event.defaultErrorMessage
	 */
	defaultErrorTitle: "Technical error occurs",
	
	/**
	 * Default error message on ajax error.
	 * @type String
	 * @see _event.defaultErrorTitle
	 */
	defaultErrorMessage: "<p>Please, retry later.</p>",
	
	/**
	 * Show/hide loader inside a tag.
	 * @param object o Tag object in which the loader will be created.
	 * @return void
	 */
	showLoader:function(o) {
		/*
		//if(o) o.prepend('<img id="ldr" src="/loader.gif" width="16" height="16"/>')
		if(o) {
			//Case link
			if(o[0].tagName=="A") {
				var oImg = o.children("img"),
					xy = o.offset(),
					zi = o.css("z-index");
				
				//Set loader visible
				if(!oImg.length) {
					o.prepend(f._il);
					oImg = o.children("img")
				}
				oImg.css("visibility", "visible");
				
				//Set cache button
				o.after("<b id='cbtn' style='position:absolute;display:inline-block;left:"+xy.left+"px;top:"+xy.top+"px;z-index:"+(zi=="auto" ? zi : parseInt(zi, 10)+1)+";width:"+(o.width()+2*(parseInt(o.css("borderLeftWidth"),10)+parseInt(o.css("paddingLeft"),10)))+"px;height:"+(o.height()+2*(parseInt(o.css("borderTopWidth"),10)+parseInt(o.css("paddingTop"),10)))+"px'>&nbsp;</b>")
			}
			
			//Case button
			else {
				var visibility = "visibility",
					visible = "visible",
					hidden = "hidden",
					oImg = $("#_imgLdr");
				if(o.css(visibility)==visible) {
					oImg.css({margin:"0 0 0 "+(o.width()/2+8)+"px", visibility:visible});
					o.css(visibility, hidden);
				}
				else {
					o.css(visibility, visible);
					oImg.css(visibility, hidden);
				}
			}
		}
		*/
	},
	
	/**
	 * On success event for GET and POST requests.
	 * @param string source Content sent by the server.
	 * @param object parameters (optional) Parameters in JSON format built in _form::init.
	 * @return void
	 */
	onSuccess:function(source, parameters) {
		//Case source is XMLHttpRequest instead of response text
		if(source instanceof XMLHttpRequest) {
			source = source.responseText;
		}
		
		//Case HTML content
		var c = source.replace(/^\s+/, "").charAt(0);
		if(c == "<" || c == "") {
			//The Regular expression must be to set in a variable (jsRe) and must have the flag "g" to use a loop
            var jsRe = /<script[^>]*>([.\s\S]+?)<\/script>/g,
                a = null;
            
            if(parameters) {
                //Remove JS
                var html = source.replace(jsRe, "");
                
				//Set content in targetId
				if(parameters.targetId) {
					(typeof parameters.targetId=="string" ? _$(parameters.targetId) : parameters.targetId).innerHTML = html;
				}
				
				//Set content in a section, and then append this section to appendTo
				else if(parameters.appendTo) {
                    /*
					var child = _new("div");
					child.innerHTML = source;
					(typeof parameters.appendTo=="string" ? _$(parameters.appendTo) : parameters.appendTo).appendChild(child);
                    */
                   (typeof parameters.appendTo=="string" ? _$(parameters.appendTo) : parameters.appendTo).insertAdjacentHTML("beforeend", html);
				}
			}
			
			//Case scripts to execute
			//if(source.indexOf("<script") !== -1) {
			if(c != "") {
				while((a = jsRe.exec(source)) !== null) {
					eval(a[1]);
				}
			}
		}
		
		//Case JSON
		else if(c == "{") {
			if(!parameters.hasOwnProperty("alertDisabled") || parameters.alertDisabled != true) {
				eval("var o=" + source);
				
				if(o.fieldId) {
					//var label = _qs("#" + parameters.formId + " label[for='"+ o.fieldId + "']");
					if(!o.hasOwnProperty("title")) {
						//o.title = label ? label.innerHTML.replace(/<[^>]+>/g, "") : o.label;
						o.title = o.label;
					}
					
					//Case maybe radio
					if(_$(o.fieldId) === null) {
						var field = _qs("#" + parameters.formId + " [id^=" + o.fieldId + "]");
						if(field) {
							o.fieldId = field.id;
						}
					}
				}
				
				if(o.title && o.message) {
					parameters.alert && parameters.alert.before && _event.onField(parameters.alert.before, o);
					_form.alert(o);
					parameters.alert && parameters.alert.after && _event.onField(parameters.alert.after, o);
				}
			}
		}
		
		//Case Javascript content by default
		else {
			eval(source);
		}
        
        //Case after action
        if(parameters.after) {
            parameters.after();
        }
	},
	
	/**
	 * On field message, execute callback(s).
	 * @param object beforeOrAfter alert.before or alert.after attribute passed in form initialization (_form.init)
	 * @param object fieldMessageData Field message data.
	 * @return void
	 */
	onField: function(beforeOrAfter, fieldMessageData) {
		beforeOrAfter._ && beforeOrAfter._(fieldMessageData);
		
		if(beforeOrAfter[fieldMessageData.fieldId]) {
			beforeOrAfter[fieldMessageData.fieldId]._ && beforeOrAfter[fieldMessageData.fieldId]._(fieldMessageData);
			beforeOrAfter[fieldMessageData.fieldId][type] && beforeOrAfter[fieldMessageData.fieldId][type](fieldMessageData);
		}
	},
	
	/**
	 * On error event for GET and POST requests.
	 * @param object event Event.
	 * @return void
	 */
	onError: function(event) {
        //Case after action
        if(this.after) {
            this.after();
        }
        
		//alert("Une erreur " + event.target.status + " s'est produite au cours de la réception du document.");
        _form.alert({
            title: _event.defaultErrorTitle,
            message: _event.defaultErrorMessage + "<p>" + event.status  + ": " + event.statusText + "</p>"
        });
	},
	
	/**
	 * On progress event for GET and POST requests.
	 * @param object event Event.
	 * @return void
	 */
	onProgress: function(event) {
		return (event.position / event.totalSize) * 100;
	},
	
	/**
	 * Convert JSON object to query.
	 * @param object json JSON object.
	 * @return string null if not an object or string, otherwise string.
	 */
	toQuery: function(json) {
		var dataType = typeof json;
		
		//Case already in string format
		if(dataType === "string") {
			return json;
		}
		
		//Case not an object
		if(dataType !== "object") {
			return null;
		}
		
		//Case object
		var query = "";
		for(key in json) {
			query += "&" + key + "=" + encodeURIComponent(json[key]);
		}
		
		return query.substring(1);
	},
	
	/**
	 * Request by GET method.
	 * @param object parameters Object in JSON format:
	 * 	- object o Jquery object clicked. Optional if function is called directly (ex: e.g({url:"/folder/resource"})).
	 * 	- string targetId (optional) Target tag identifier (ex: b).
	 * 	- string url (optional) URL (ex: /_mgr/logout), otherwise href of the o object.
	 * 	- mixed data (optional) Parameters in string format (ex: "name=John&time=2pm") or in JSON object format (ex: { name: "John", time: "2pm" } or { "choices[]": ["Jon", "Susan"]}).
	 * @return boolean false
	 */
	get: function(parameters) {
		//if(parameters.o) {
		//	_event.showLoader(parameters.o);
		//}
		
		//Check url
		if(!parameters.hasOwnProperty("url") || parameters.url === "") {
			return false;
		}

		//Build parameters
		var t = parameters.url.split("?"),
			dataType = typeof parameters.data;
		
		//Case data are already set
		if(t.length >= 2) {
			if(dataType === "string" && parameters.data.length > 0) {
				parameters.data += "&" + t[1];
			}
			else if(dataType === "object") {
				parameters.data = t[1] + "&" + _event.toQuery(parameters.data);
			}
			else {
				parameters.data = t[1];
			}
		}
		
		//Case retrieve data from form
		else if(!parameters.hasOwnProperty("data")) {
			parameters.data = _form.getData(parameters);
		}
		
		//Set URL
		parameters.url = t[0];
		if(parameters.url.indexOf(",event") === -1 && parameters.url.indexOf(",ws") === -1 && parameters.url.indexOf(",test") === -1) {
			parameters.url += ",event";
		}
		
		//Set on success event
		if(typeof parameters.success !== "function") {
			parameters.success = function(xmlHttpRequest, parameters) {
				//Display HTML and/or evaluate Javascript
				_event.onSuccess(xmlHttpRequest.responseText, parameters);
			}
		}
		
		//Set on error event
		if(typeof parameters.error !== "function") {
			parameters.error = function(xmlHttpRequest) {
				var source = xmlHttpRequest.responseText,
					c = source.charAt(0);
				
				//Case JSON
				if(c == "{") {
					eval("var o=" + source);
					if(o.title && o.message) {
						parameters.alert && parameters.alert.before && _event.onField(parameters.alert.before, o);
						_form.alert(o);
						parameters.alert && parameters.alert.after && _event.onField(parameters.alert.after, o);
					}
				}
				
				//Case JS
				else {
					eval(source);
				}
			}
		}
		
		//Send request
		return ajax(parameters);
	},
	
	/**
	 * Request by POST method.
	 * @param object parameters Object in JSON format:
	 * 	- object o Jquery object clicked.
	 * 	- boolean isA Define if object clicked is a link or button. true for a link.
	 * 	- string targetId (optional) Target tag identifier (ex: cf for Contact Form).
	 * 	- string url (optional) URL (ex: /_mgr/logout), otherwise href of the o object.
	 * 	- mixed data (optional) Parameters in string format (ex: "name=John&time=2pm") or in JSON object format (ex: { name: "John", time: "2pm" } or { "choices[]": ["Jon", "Susan"]}), otherwise data form.
	 * @return boolean false
	 */
	post: function(parameters) {
		//if(parameters.o) {
		//	_event.showLoader(parameters.o);
		//}
		
		//Check url
		if(!parameters.hasOwnProperty("url") || parameters.url === "") {
			return false;
		}

		//Build URL
		var t = parameters.url.split("?");
		if(t[0].indexOf(",event") === -1 && t[0].indexOf(",ws") === -1 && t[0].indexOf(",test") === -1) {
			parameters.url = t[0] + ",event";
			if(t[1]) {
				parameters.url += "?" + t[1];
			}
		}
		
		//Set on success event
		if(typeof parameters.success !== "function") {
			parameters.success = function(xmlHttpRequest, parameters) {
				//Display HTML and/or evaluate Javascript
				_event.onSuccess(xmlHttpRequest.responseText, parameters);
			}
		}
		
		//Set on error event
		if(typeof parameters.error !== "function") {
			parameters.error = function(xmlHttpRequest) {
				var source = xmlHttpRequest.responseText,
					c = source.charAt(0);
				
				//Case JSON
				if(c == "{") {
					eval("var o=" + source);
					if(o.title && o.message) {
						parameters.alert && parameters.alert.before && _event.onField(parameters.alert.before, o);
						_form.alert(o);
						parameters.alert && parameters.alert.after && _event.onField(parameters.alert.after, o);
					}
				}
				
				//Case JS
				else {
					eval(source);
				}
			}
		}
		
		//Send request
		parameters.method = "post";
		return ajax(parameters);
	}
	
	/**
	 * Launch a rate event.
	 * @parms object o Cicked star tag.
	 * @return void
	 * @deprecated
	 */
	/*
	rate:function(o) {
		//Display loading
		var t = /^https?:\/\/[^\/]+(.+?)([^\/]+)$/.exec(location.href);
		$("#rateResponse").html("<img src='/loader.gif' width='16' height='16' alt='...'/>");
		
		//Call rate event
		_event.p({
			url:"/rate",
			parms:{
				rp: t[1].replace(/^(\/_mgr)?(\/brouillon)?/,""),
				rn: t[2],
				n: o.getAttribute("data-rating")
			}
		});
		
		//Clean labels tag
		$("#rateLabel,#rateLabels").remove();
	}*/
},

/**==========================================================================
 * Form
 ==========================================================================*/
_form = {
	/**
	 * Key Press Events set in _form::add.
	 * @var object
	 */
	_keyPressEvents: {},
	
	/**
	 * Image loader HTML source.
	 * @var string
	 */
	//_il: "<img id='_imgLdr' style='position:absolute;margin:0 0 0 -20px;visibility:hidden' src='/loader2.gif' alt='...' width='16' height='16'/>",
	
	/**
	 * Add a form to initialize.
	 * @param string formId Form identifier (ex: "_ppF").
	 * @param string toJsonData (optional) Put all form data into json format in the parameter name defined by toJsonData. false by default.
	 * @param string focusId (optional) Field identifier for focus when form is visible (ex: "_ppF_eml").
	 * @param object selector (optional) Fields selector (ex: "#_ppF input[type='text'],#_ppF input[type='password']").
	 * @param string targetId (optional) Target identifier to set content.
	 * @param string btnSfx (optional) Button suffix. "okBtn" by default. Button must exist.
	 * @param function before (optional) action to execute before the data post. Declare as "function(){...}".
     * @param function send (optional) action to execute after sending request. Declare as "function(){...}".
     * @param function after (optional) action to execute after on success or error. Declare as "function(){...}".
	 * @return void
	 */
	//add: function(formId, focusId, selector, targetId, btnSfx, preAction) {
	/**
	 * Initialize form event.
	 * @param object parameters Object in JSON format:
	 * 	- string formId Form identifier (ex: "mainForm").
	 * 	- string focusId (optional) Field identifier for focus when form is visible (ex: "email").
	 * 	- object selector (optional) Fields selector (ex: "#_ppF input[type='text'],#_ppF input[type='password']").
	 * 	- string targetId (optional) Target identifier to set content.
	 * 	- string btnSfx (optional) Button suffix. "okBtn" by default. Button must exist.
	 * 	- function preAction (optional) action to execute before the data post. Declare as "function(){...}".
	 * @return void
	 */
	init: function(parameters) {
		//Complete parameters
		parameters.form = _$(parameters.formId);
		parameters.method = (parameters.form.getAttribute("method") || "get").toLowerCase();
		parameters.okBtn = _$(parameters.okBtnId || "okBtn");
		parameters.isButton = parameters.okBtn && parameters.okBtn.tagName === "BUTTON";
		if(typeof parameters.error !== "function") {
			parameters.error = _event.onError;
		}
		if(typeof parameters.progress !== "function") {
			parameters.progress = _event.onProgress;
		}
		
		//Disabled form submit by default
		parameters.form.addEvent("submit", function(e) {
			e.preventDefault();
			return false;
		});
		
		//Add form to forms list
		_form._keyPressEvents[parameters.formId] = {
			parameters: parameters,
			submit: function() {
				//Execute before action
				if(parameters.before) {
					parameters.before();
				}
				
				//Case post method
				//Set parameters to send by post
				if(parameters.method === "post") {
					//Case not data name
					if(parameters.dataName === _u || parameters.dataName === null || parameters.dataName == "") {
						parameters.data = _form.getData(parameters);
					}
					
					//Case Data name
					else {
						if(parameters.data === _u || parameters.data === null) {
							parameters.data = {};
						}
						parameters.data[parameters.dataName] = _form.getJson(parameters.formId);
					}
                    
                    //Case has GET
                    var q = window.location.search;
                    if(q != "") {
                        var parms = q.substring(1).split("&"),
                            nParms = parms.length;
                        if(nParms > 0) {
                            var dataType = typeof parameters.data;
                            for(var i = 0; i < nParms; i++) {
                                var t = parms[i].split("=");
                                if(_$(t[0]) == null) {
                                    if(dataType === "string") {
                                        if(parameters.data.length > 0) {
                                            parameters.data += "&";
                                        }
                                        parameters.data += parms[i];
                                    }
                                    else if(dataType === "object") {
                                        parameters.data[t[0]] = t[1] != _u ? t[1] : "";
                                    }
                                }
                            }
                        }
                    }
				}
				
				//Launch request
				parameters.url = parameters.isButton ? parameters.form.getAttribute("action") : parameters.okBtn.getAttribute("href");
				_event[parameters.method](parameters);
				//parameters.data = null;
				return false;
			}/*,
			trigger:function(event) {
				return event.keyCode === 13 ? _form._keyPressEvents[parameters.formId].submit() : true
			}*/
		};
		
		//Set focus on field
		if(parameters.focusId) {
			_$(parameters.focusId).focus();
		}
		
		//Set enter key press event on fields defined in the selector
		//if(parameters.selector) $(parameters.selector).each(function(){
		//	$("#"+this.id).bind("keypress", _form._keyPressEvents[formId].e)
		//});
		if(!parameters.selector) {
			parameters.selector = "#" + parameters.formId + " input, #" + parameters.formId + " select";
		}
		/*_qsa(parameters.selector).forEach(function(o) {
			o.addEvent("keypress", _form._keyPressEvents[parameters.formId].trigger);
		});*/
		
		//Set click event on ok button to submit form
		parameters.okBtn.addEvent("click", _form._keyPressEvents[parameters.formId].submit);
		
		//Case modal form
		if(parameters.form.parentNode.hasClass("modal")) {
			var closeBtn = _new("a"),
				cancelBtn = _qs("#" + parameters.formId + " button.cancel");
			closeBtn.className = "close";
			closeBtn.setAttribute("href", "javascript:void(0)");
			closeBtn.innerHTML = "✖";
			closeBtn.addEvent("click", function() {
				this.parentNode.parentNode.remove();
			});
			parameters.form.appendChild(closeBtn);
			if(cancelBtn) {
				cancelBtn.addEvent("click", function() {
					closeBtn.click();
				});
			}
		}
		
		//Preload loader
		//parameters.okBtn.prepend(_form._il)
	},
	
	/**
	 * Retrieve data from form and return data into string JSON format.
	 * @param string formId for identifier.
	 * @return string JSON format.
	 */
	getJson: function(formId) {
		//Retrieve data from form
		var data = {};
		_qsa("#" + formId + " input, #" + formId + " select, #" + formId + " textarea").forEach(function(o) {
			var name = o.getAttribute("name"),
				key = name === null || name === _u || name == "" ? o.id : name,
				type = o.getAttribute("type") || o.tagName.toLowerCase();
			if(key != "") {
				if(type == "radio") {
					if(o.checked) {
						data[key] = o.value;
					}
				}
				else if(type == "checkbox" || type == "select") {
					if(data[key] == _u) {
						data[key] = [];
					}
					if(type == "checkbox") {
						if(o.checked) {
							data[key].push(o.value);
						}
					}
					else {
						var options = o.options,
							n = options.length,
							i;
						for(i = 0; i < n; i++) {
							if(options[i].selected) {
								data[key].push(options[i].value);
							}
						}
					}
				}
				else {
					data[key] = o.value;
				}
			}
		});
		
		//Return string format
		return JSON.stringify(data);
	},
	
	/**
	 * Retrieve data from form if parameters.data is empty.
	 * @param object parameters JSON object.
	 * @return mixed Query string if parameters.data is empty, otherwise parameters.data.
	 */
	getData: function(parameters) {
		//Case parameters.data is empty
		//Retrieve data from form
		//if(parameters.data === _u || parameters.data === null || parameters.data == "" || parameters.data === {}) {
			//Build string query
			var query = "";
			_qsa("#" + parameters.formId + " input, #" + parameters.formId + " select, #" + parameters.formId + " textarea").forEach(function(o) {
				var name = o.getAttribute("name"),
					key = name === null || name === _u || name == "" ? o.id : name,
					type = o.getAttribute("type");
				if(key != "") {
					if(type == "checkbox" || type == "radio") {
						if(o.checked) {
							query += "&" + key + "=" + encodeURIComponent(o.value);
						}
					}
					else {
						query += "&" + key + "=" + encodeURIComponent(o.value);
					}
				}
			});
			return query.substring(1);
		//}
		
		//Case parameters.data is not empty
		//return parameters.data;
	},
	
	/**
	 * Display Alert Message.
	 * @param object parameters JSON object:
	 * 		- string message Message.
	 * 		- string title (optional) Title.
	 * 		- string fieldId (optional) Field identifier.
	 * @param function callback Fonction callback à la fermeture de l'alerte.
	 */
	//a:function(msg, tit, fid) {
	alert: function(parameters, callback) {
		//Always remove ajax loader before alert message, otherwise does not removed
		//$("#ldr").remove();
		
		//Display alert message
		//tit = tit ? tit+"\n\n" : "";
		//alert(tit+msg);
		new Dialog({
			title: parameters.title,
			body: parameters.message,
			focusId: parameters.alias ? parameters.alias : (parameters.fieldId ? parameters.fieldId : null),
			onClose: callback
		});
		
		//alert(parameters.title ? parameters.title + "\n\n" + parameters.message : parameters.message);
		//if(parameters.fieldId !== _u) {
		//	_$(parameters.fieldId).focus();
		//}
	},
	
	/**
	 * Check form.
	 * @param string id Form identifier (ex: "cF").
	 * @param array (optional) excludes Field identifiers to exclude (ex: ["fn", "ln", "pn"]).
	 * @return boolean true if no error, otherwise false.
	 */
	check:function(id, excludes) {
		//@todo
		return true;
		
		/*
		var isOk = true,
			delim = ";";
		excludes = (typeof excludes)=="array" ? delim+excludes.join(delim)+delim : null;
		$("#"+id+" input,#"+id+" select,#"+id+" textarea").each(function(){
			//Remove begin and end spaces of the field value
			//var fld = $(this);
			
			//try {
				//fld.val(fld.val().replace(/^\s*|\s*$/g, ""));
				this.value = this.value.replace(/^\s*|\s*$/g, "");
			//} catch(e) {
				//Case input file
				//e.message: The operation is insecure
				//alert(e.message);
			//}
			
			//Deprecated
			//if(fld.val()==""&&(excludes==null||excludes.indexOf(delim+id+delim)!=-1)) {
			//	//Retrieve html content of the field label
			//	fid = this.id;
			//	lbl = $("#"+id+" label[for='"+fid+"']").html();
			//	
			//	//Field is required, indicated by "*"
			//	if(lbl&&lbl.lastIndexOf("*")!=-1) {
			//		lbl = lbl.replace(re, "");
			//		f.a("Le champ \""+lbl+"\" est obligatoire.", lbl, fid);
			//		ok = 0;
			//		return false
			//	}
			//}
			
			if(this.value==""&&this.getAttribute("required")=="required"&&(excludes==null||excludes.indexOf(delim+id+delim)!=-1)) {
				//Retrieve html content of the field label
				var fid = this.id,
					lbl = $("#"+id+" label[for='"+fid+"']").html().replace(/\s*<.*?$/, "");
				f.a("Le champ \""+lbl+"\" est obligatoire.", lbl, fid);
				return isOk = false
			}
		});
		return isOk
			*/
	},
	
	/**
	 * Initialize characters remaining for input text type.
	 * @param string selector Selector (ex: "#mainForm input[type='text'][maxlength], #mainForm textarea[maxlength]").
	 * @param string plurialText Label for remaining characters in plurial text (ex: "caractères restants").
	 * @param string plurialText Label for remaining characters in singular text (ex: "caractère restant").
	 * @return void
	 */
	initCharactersRemaining: function(selector, plurialText, singularText) {
		_qsa(selector).forEach(function(el) {
			var c = _new("span"),
				max = el.getAttribute("maxlength");
			c.setAttribute("class", "charactersRemaining");
			c.innerHTML = "<span id='" + el.id + "CR'>" + max + "</span>/" + max +  " <span id='" + el.id + "Txt'>" + plurialText + "</span>";
			el.parentNode.insertBefore(c, el);

			el.addEvent("keyup", function(ev) {
				var o = ev.target || ev.srcElement,
					max = parseInt(o.getAttribute("maxlength"), 10),
					target = _$(o.id + "CR"),
					length = parseInt(o.value.length, 10),
					n = max - length;
				target.innerHTML = n;
				_$(o.id + "Txt").innerHTML = n > 1 ? plurialText : singularText; 
			});

			el.trigger("keyup");
		})
	},
	
	/**
	 * Redirect page by post.
	 * @param string url URL.
	 * @param object parameters JSON.
	 * @return void
	 */
	post: function(url, parameters) {
		//Build form
		var form = _new("form"),
			i;
		form.method = "post";
		form.action = url;
		for(i in parameters) {
			var input = _new("input");
			input.type = "text";
			input.name = i;
			input.value = parameters[i];
			form.appendChild(input);
		}
		
		//Insert hidden form in the body
		form.className = "hidden";
		_qs("body").appendChild(form);
		
		//Submit form
		form.submit();
	}
},

_image = {
	widthMax: 1080,
	heightMax: 608,
	
	thumbnailWidth: 120,
	thumbnailHeight: 67,
	
	/**
	 * Convert dataURL to blob.
	 * @param string dataURL Data URI from HTMLCanvasElement.toDataURL(). Examples:
	 * 		- Simple text/plain data: data:,Hello%2C%20World!
	 * 		- base64-encoded version of the above: data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D
	 * 		- An HTML document with <h1>Hello, World!</h1>: data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E
	 * 		- An HTML document that executes a JavaScript alert. Note that the closing script tag is required: data:text/html,<script>alert('hi');</script>
	 * @return Blob
	 */
	/*dataURLToBlob: function(dataURL) {
		var base64Marker = ';base64,';
		if(dataURL.indexOf(base64Marker) == -1) {
			var parts = dataURL.split(',');
			return new Blob([parts[1]], {type: parts[0].split(':')[1]});
		}
		
		var parts = dataURL.split(base64Marker),
			raw = window.atob(parts[1]),
			rawLength = raw.length,
			uInt8Array = new Uint8Array(rawLength);

		for(var i = 0; i < rawLength; ++i) {
		  uInt8Array[i] = raw.charCodeAt(i);
		}
		
		return new Blob([uInt8Array], {type: parts[0].split(':')[1]});
	},*/
	
	/**
	 * Resize image.
	 * @param object p JSON object. Parameters expected:
	 * 		- string fileId: file identifier.
	 * 		- integer width: Image width.
	 * 		- integer height: Image height.
	 * @param function handle Action to execute with blob type parameter.
	 * @return void
	 */
	resize: function(p, handle) {
		var file = _$(p.fileId);
		if(file) {
			file = file.files[0];
			if (file.type.indexOf('image') == 0) {
				var reader = new FileReader();
				
				reader.onload = function (event) {
					var image = new Image();
					image.src = event.target.result;

					image.onload = function() {
						var imageWidth = image.width,
							imageHeight = image.height;
						
						if(imageWidth > p.width) {
							imageHeight *= p.width / imageWidth;
							imageWidth = p.width;
						}
						
						if(imageHeight > p.height) {
							imageWidth *= p.height / imageHeight;
							imageHeight = p.height;
						}
						
						var canvas = document.createElement("canvas");
						canvas.width = imageWidth;
						canvas.height = imageHeight;
						image.width = imageWidth;
						image.height = imageHeight;
						
						var ctx = canvas.getContext("2d");
						ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

						//handle(_image.dataURLToBlob(canvas.toDataURL(file.type)));
						handle(canvas);
					}
				};
				
				reader.readAsDataURL(file);
			}
		}
	}
},

/**==========================================================================
 * Cookie
 ==========================================================================*/

_cookie = {
	/**
	 * Create a cookie. To remove cookie, set value = "", and days = -1.
	 * @param string key Cookie name.
	 * @param string value Cookie value.
	 * @param integer days Number of days of expiration.
	 * @return void
	 */
	set:function(key, value, days) {
		var expires = "";
		if(days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + (days > 0 ? date.toUTCString() : "Thu, 01 Jan 1970 00:00:01 GMT");
		}
		document.cookie = key + "=" + value + expires + "; path=/; secure";
	},
	
	/**
	 * Get the cookie value.
	 * @param string key Cookie name.
	 * @return string String if cookie found, otherwise null.
	 */
	get:function(key) {
		var nameEQ = key + "=",
			ca = document.cookie.split(";"),
			c,
			i;
		for(i=0;i < ca.length; i++) {
			c = ca[i];
			while(c.charAt(0)==" ") {
				c = c.substring(1, c.length);
			}
			if(c.indexOf(nameEQ)==0) {
				return c.substring(nameEQ.length, c.length);
				/*
				var s = c.substring(nameEQ.length, c.length);
				if(s.charAt(0) === "{" && s.charAt(s.length - 1) === "}") {
					eval("s=" + s);
				}
				return s;
				*/
			}
		}
		return null;
	},
	
	/**
	 * Remove a cookie.
	 * @param string key Cookie name.
	 * @return void
	 */
	remove:function(key) {
		_cookie.set(key, "", -10);
	}
}

;