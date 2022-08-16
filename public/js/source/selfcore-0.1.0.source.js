var _doc = document,
	_win = window,
	_u = undefined,
	//_nod = _doc.getElementById.bind(_doc),
	_$ = _doc.getElementById.bind(_doc),
	_qs = _doc.querySelector.bind(_doc),
	_qsa = _doc.querySelectorAll.bind(_doc),
	_new = _doc.createElement.bind(_doc),
	_ = {
		/**
		 * Add event to node.
		 * @param string eventName Event name to lower case.
		 * @param function functionName Reference to the function.
		 * @return void
		 */
		addEvent: function(eventName, functionName) {
			if(this.attachEvent) this.attachEvent("on" + eventName, functionName);
			else this.addEventListener(eventName, functionName, false);
			return this;
		},

		/**
		 * Remove event from node.
		 * @param string eventName Event name to lower case.
		 * @param function functionName Reference to the function.
		 * @return void
		 */
		removeEvent: function(eventName, functionName) {
			if(this.detachEvent) this.detachEvent("on" + eventName, functionName);
			else this.removeEventListener(eventName, functionName, false);
			return this;
		},
		
		trigger: function(eventName) {
			if(_doc.createEvent) {
				var evObj = _doc.createEvent("MouseEvents");
				evObj.initEvent(eventName, true, false );
				this.dispatchEvent(evObj);
			}
			else if(_doc.createEventObject) { //IE
				var evObj = _doc.createEventObject();
				this.fireEvent("on" + eventName, evObj);
			} 
		} 
		
	};

/**
 * Case remove does not exist.
 * Remove node.
 * @returns void
 */
if(HTMLElement.prototype.remove == _u) {
	HTMLElement.prototype.remove = function() {
		this.parentNode.removeChild(this);
	};
}

/**
 * Case after does not exist.
 * Insert node or string after HTML element.
 * @param HTMLElement HTML element.
 * @returns void
 */
if(HTMLElement.prototype.after == _u) {
	HTMLElement.prototype.after = function() {
		var m = arguments,
			l = m.length,
			i = 0,
			t = this,
			p = t.parentNode;
		while(i < l) {
			if(m[i] instanceof Node){
				t = t.nextSibling;
				if(t != null) {
					p.insertBefore(m[i], t);
				}
				else {
					p.appendChild(m[i]);
				}
			}else{
				p.appendChild(_d.createTextNode(m[i]));
			};
			++i;
		}
	};
}

/**
 * Tag tools.
 */

/**
 * Determine if node has class name.
 * @param string className Class name to fin.
 * @return boolean true if class name found, otherwise false.
 */
HTMLElement.prototype.hasClass = function(className) {
	return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
};

/**
 * Add a class name to the node.
 * @param string className Class name to add.
 * @return object Current object.
 */
HTMLElement.prototype.addClass = function(className) {
	if(!this.hasClass(className)) {
		if(this.className == "") this.className = className;
		else this.className += " " + className;
	}
	return this;
};

/**
 * Remove a class name of the node.
 * @param string className Class name to remove.
 * @return object Currenct object.
 */
HTMLElement.prototype.removeClass = function(className) {
	this.className = (" " + this.className + " ").replace(" " + className + " ", " ").trim();
	return this;
};

/**
 * Remove all children.
 * @return object Current object.
 */
 /*
HTMLElement.prototype.empty = function() {
	while(this.firstChild) this.removeChild(this.firstChild);
	return this;
};
*/

/**
 * Return tag index in the parent tag. Start with 1.
 * @return integer.
 */
HTMLElement.prototype.getIndex = function() {
	return Array.prototype.indexOf.call(this.parentNode.children, this) + 1;
};

/**
 * Case closest does not exist.
 * Return the closest ancestor by selector.
 * @param selector Selector.
 * @returns void
 */
if(HTMLElement.prototype.closest == _u) {
	if(!Element.prototype.matches) {
		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
	}
	
    HTMLElement.prototype.closest = function(selector) {
        var el = this;
        if(!_doc.documentElement.contains(el)) return null;
        do {
            if(el.matches(selector)) {
				return el;
			}
            el = el.parentElement || el.parentNode;
        } while(el !== null && el.nodeType == 1); 
        return null;
    };
}

/**
 * Return the closest ancestor by class name.
 * @param string className Class name to find.
 * @return object Parent node found, otherwise, null.
 */
HTMLElement.prototype.getClosestParentByClass = function(className) {
	var exists = false,
		re = new RegExp("(^|\\s)" + className + "(\\s|$)"),
		node = this;
	
	while(node.parentNode && node.nodeName!=="BODY") {
		node = node.parentNode;
		if(node.className && re.test(node.className)) {
			exists = true;
			break;
		}
	}
	
	return exists ? node : null;
};

/**
 * Return the closest ancestor by node name.
 * @param string nodeName Node name to find.
 * @return object Parent node found, otherwise, null.
 */
HTMLElement.prototype.getClosestParentByNodeName = function(nodeName) {
	var exists = false,
		node = this;
	
	while(node.parentNode) {
		node = node.parentNode;
		if(node.nodeName==nodeName) {
			exists = true;
			break;
		}
		else if(node.nodeName=="BODY") break;
	}
	
	return exists ? node : null;
};

/**
 * Return the closest ancestor by attribute name.
 * @param string attributeName Attribute name to find.
 * @param string value Attribute value.
 * @return object Parent node found, otherwise, null.
 */
HTMLElement.prototype.getClosestParentByAttribute = function(attributeName, value) {
	var exists = false,
		node = this;
	
	while(node.parentNode) {
		node = node.parentNode;
		if(node.hasAttribute(attributeName) && node.getAttribute(attributeName) == value) {
			exists = true;
			break;
		}
		else if(node.nodeName=="BODY") break;
	}
	
	return exists ? node : null;
};

//HTMLElement.prototype.qsa = HTMLElement.querySelectorAll.bind(HTMLElement);

/**
 * Add event to node (HTMLElement and Document).
 * @param string eventName Event name to lower case.
 * @param function functionName Reference to the function.
 * @return object Current object.
 */
Node.prototype.addEvent = _.addEvent;
Node.prototype.removeEvent = _.removeEvent;
Node.prototype.trigger = _.trigger;

//HTMLElement.prototype.addEvent = _.addEvent;
//HTMLElement.prototype.removeEvent = _.removeEvent;
//HTMLElement.prototype.trigger = _.trigger;

/**
 * Add event to document.
 * @param string eventName Event name to lower case.
 * @param function functionName Reference to the function.
 * @return object Current object.
 */
//Document.prototype.addEvent = _.addEvent;
//Document.prototype.removeEvent = _.removeEvent;
//Document.prototype.trigger = _.trigger;

/**
 * Add event to window.
 * @param string eventName Event name to lower case.
 * @param function functionName Reference to the function.
 * @return object Current object.
 */
Window.prototype.addEvent = _.addEvent;
Window.prototype.removeEvent = _.removeEvent;
Window.prototype.trigger = _.trigger;

/*
if(typeof Window != "_u") {
	Window.prototype.addEvent = _.addEvent;
	Window.prototype.addEvent = _.removeEvent;
}
else {
	var DOMElemProto = window['[[DOMElement.prototype]]'];
	DOMElemProto.addEvent = _.addEvent;
	DOMElemProto.removeEvent = _.removeEvent;
}
*/

/**
 * Convert number to format "d,ddd.dd".
 * @param integer d Number of decimals. 2 by default.
 * @param string ts The thousands separator. "," by default.
 * @param string ds decimal separator. "." by default.
 * @return string
 */
Number.prototype.format = function(d, ts, ds) {
	var s = this.toFixed(d || 2).replace(/\d(?=(\d{3})+\.)/g, "$&" + (ts || ","));
	return ds == _u ? s : s.replace(".", ds);
};

/**
 * Round number (equivalent to Math.round) to format "d,ddd".
 * @param string ts The thousands separator. "," by default.
 * @return string
 */
Number.prototype.round = function(ts) {
	return (Math.round(this) + "").replace(/\d(?=(\d{3})+$)/g, "$&" + (ts || ","));
};

/**
 * Set number to HTML tag.
 * @param value float Number to set.
 * @param digits integer Number of decimals.
 * @return HTMLElement Reference to the element.
 */
HTMLElement.prototype.setNumber = function(value, digits) {
	//Set value without formatting
	this.setAttribute("data-value", value);
	
	//Format with digits
	if(digits != _u) {
		value = value.format(digits);
	}
	
	//Case input
	if(this.tagName == "INPUT") {
		//For javacript to get value
		this.value = value;
		
		//For CSS to use selector
		this.setAttribute("value", value);
	}
	
	//Case others tags
	else {
		this.innerHTML = value;
	}
	
	//Return the current object
	return this;
};

/**
 * Return HTML element offset.
 * @returns {top, left, width, height, x, y}
 */
HTMLElement.prototype.offset = function() {
	var rect = this.getBoundingClientRect(),
		scrollLeft = _win.pageXOffset || _doc.documentElement.scrollLeft,
		scrollTop = _win.pageYOffset || _doc.documentElement.scrollTop;
	
	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft,
		width: rect.width,
		height: rect.height,
		x: rect.x,
		y: rect.y
	};
};

/**
 * Return true if element is displayed (display != "none").
 * @returns {Boolean}
 */
HTMLElement.prototype.isDisplayed = function() {
    return !!(this.offsetWidth || this.offsetHeight || this.getClientRects().length);
};

/**
 * Return true if element is visible and not hidden on overflow.
 * @returns {Boolean}
 */
HTMLElement.prototype.isVisible = function() {
    var style = window.getComputedStyle(this);
    return  style.width !== "0" && style.height !== "0" && style.opacity !== "0" && style.display !== "none" && style.visibility !== "hidden";
};

/**
 * Select range.
 * @param integer selectionStart
 * @param integer selectionEnd
 * @returns HTMLElement
 */
/*
HTMLElement.prototype.selectRange = function(selectionStart, selectionEnd) {
	//Case modern browsers
	var o = this;
	if(o.setSelectionRange) {
		o.focus();
		o.setSelectionRange(selectionStart, selectionEnd);
	}
    
    //Case IE8 and below
	else if(o.createTextRange) {
		var range = o.createTextRange();
		range.collapse(true);
		range.moveEnd("character", selectionEnd);
		range.moveStart("character", selectionStart);
		range.select();
	}
	
    //Return the current object
	return o;
}
*/
/**
 * Set cursor position.
 * @param integer position Position.
 * @returns HTMLElement
 */
/*
HTMLElement.prototype.setCursorPosition = function(position) {
    //Case content editable
    var o = this;
    if(o.hasAttribute("contenteditable")) {
        o.focus();
        document.getSelection().collapse(o, position);
        return o;
    }
    
    //Case input text or textarea
	return this.selectRange(position, position);
}
*/

/**
 * Remove event from document.
 * @param string eventName Event name to lower case.
 * @param function functionName Reference to the function.
 * @return object Current object.
 */
Document.prototype.removeEvent = _.removeEvent;
Document.prototype.trigger = _.trigger;
//(typeof Window != "_u" ? Window : DOMWindow).prototype.removeEvent = _.removeEvent;//Window is unknown for Safari

/**
 * Loop on nodes list. Return true to break the loop.
 * @param function function Function with node element in parameter.
 * @return void
 * @uses var divs = document.querySelectorAll("div").forEach(function(el, i) {el.style.color = "orange";});
 */
NodeList.prototype.forEach = Array.prototype.forEach;

if(String.prototype.setCharAt == _u) {
	/**
	 * Replace the character on index "index" by another character "chr".
	 * @param integer index Index of the character to replace.
	 * @param string chr New character.
	 * @return string
	 */
	String.prototype.setCharAt = function(index, chr) {
		if(index > this.length - 1 || index < 0) {
			return this;
		}
		return this.substring(0, index) + chr + this.substring(index + 1);
	}
}

String.prototype.toCamelCase = function() {
	//Replace accented characters
	//Convert to lower case and delimite words by space
	//Convert first character of each word to upper case and join words
	var s = this.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		.toLowerCase().replace(/[^a-z\d]+/g, " ")
		.replace(/[^a-zA-Z0-9]+(.)/g, function(match, chr) {
			return chr.toUpperCase();
		});
	return /^\d/.test(s) ? "_" + s : s;
};

//Define URLSearchParams if does not exist.
if(Window.prototype.URLSearchParams == _u) {
	/**
	 * Search parameter in the search string.
	 * @param string queryString Query string (ex: _win.location.search).
	 * @return null|string
	 */
	Window.prototype.URLSearchParams = function(queryString) {
		this.queryString = queryString;
		this.get = function(name) {
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(this.queryString);
			return results == null ? null : decodeURIComponent(results[1]);
		};
	}
}