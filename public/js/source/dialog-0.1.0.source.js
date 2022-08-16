/**
 * Draggable class.
 * @param string id Block dialog identifier.
 * @return Draggable
 * @author Vincent SOYSOUVANH
 * @since 2015-05-15
 */
function Draggable(id) {
	var o = this;
	
	o.tag = _$(id);
	
	if(o.tag) {
		o.isDragging = false;
		o.dragOffset = {x: 0, y: 0};
		o.body = document.documentElement.scrollLeft ? document.documentElement : document.body;

		o.init(document.body);
	}
}
Draggable.prototype = {
	init: function(container) {
		var o = this,
			docBody = o.body,
			offset = o.dragOffset,
			tag = o.tag,
			bar = tag.querySelector(".bar"),
			i;
		
		bar.addEvent("mousedown", function(e) {
			o.isDragging = true;
			
			//Initialize offset used in document on mouse move
			e.pageX = (e.pageX || e.clientX) + docBody.scrollLeft;
			e.pageY = (e.pageY || e.clientY) + docBody.scrollTop;
			offset = {
				x: e.pageX - tag.offsetLeft,
				y: e.pageY - tag.offsetTop
			};
			
			//Case all browsers except Firefox
			if(e.buttons==_u) {
				document.addEvent("mousemove", function(e) {
					if((e.buttons==0||e.which==0) && o.isDragging) {
						e.pageX = e.pageX || e.clientX + docBody.scrollLeft;
						e.pageY = e.pageY || e.clientY + docBody.scrollTop;
						tag.style.top = (e.pageY - offset.y) + "px";
						tag.style.left = (e.pageX - offset.x) + "px";
						
						o.isDragging = false;
					}
				});
			}
		});
		
		//For IE only
		bar.addEvent("mousemove", function(e) {
			if(e.buttons==0||e.which==0) o.isDragging = false;
		});
		
		//Works only on firefox. Not fired on Chrome, IE, Safari and opera
		container.addEvent("mousemove", function(e) {
			if(o.isDragging) {
				e.pageX = e.pageX || e.clientX + docBody.scrollLeft;
				e.pageY = e.pageY || e.clientY + docBody.scrollTop;
				tag.style.top = (e.pageY - offset.y) + "px";
				tag.style.left = (e.pageX - offset.x) + "px";
			}
		});
		container.addEvent("mouseup", function(e) {
			o.isDragging = false;
		});
	}
};

/**
 * Dialog class.
 * @param object p Parameters:
 * 		- id (optional): Block dialog identifier. "dlg" by default.
 *		- bodyId (optional): Block body identifier.
 * 		- isModal (optional): modal status, false by default.
 *		- isDraggable (optional): draggable status, true by default.
 *		- top (optional): top position, center by default according height.
 *		- left (optional): left position, center by default according width.
 * 		- width (optional): dialog width (ex: "250px", "15em"). "auto" by default.
 * 		- height (optional): dialog height (ex: "250px", "15em"). "auto" by default.
 *		- title (optional): dialog title.
 *		- body (optional): dialog content.
 * @return Dialog
 * @author Vincent SOYSOUVANH
 * @since 2015-05-15
 */
function Dialog(p) {
	/**
	 * Set dialog.
	 * @type Dialog
	 */
	var o = this;
	
	/**
	 * Set dialog maximum width by default.
	 * @var integer
	 */
	o._maxWidth = "640px";//40em
	
	/**
	 * Set dialog maximum height by defulat.
	 * @var integer
	 */
	o._maxHeight = "736px";//46em
	
	/**
	 * Modal status.
	 * @var boolean
	 */
	o.id = "dlg";
	
	/**
	 * Dialog class.
	 * @var string
	 */
	o.class = "",
	
	/**
	 * Modal status.
	 * @var boolean
	 */
	o.isModal = true;
	
	/**
	 * Draggable status.
	 * @var boolean
	 */
	o.isDraggable = true;
	
    /**
     * Window height.
     * @var integer
     */
    o.winHeight = screen.height > 768 ? _win.innerHeight || _doc.documentElement.clientHeight || _doc.body.clientHeight : 432;
    
	/**
	 * Dialog width.
	 * @var string
	 */
	//o.width = "auto";
	//o.maxWidth = o._maxWidth;
	
	/**
	 * Dialog height.
	 * @var string
	 */
	//o.height = "auto";
	//o.maxHeight = o._maxHeight;
	
	/**
	 * Dialog title.
	 * @var string
	 */
	o.title = "";
	
	/**
	 * Dialog content.
	 * @var string
	 */
	o.body = "";
	
	/**
	 * Define buttons to display.
	 * @var object
	 */
	o.buttons = {
		okDlg: {label: "OK", onClick: "close", class: "ok"}
	};
	
	/**
	 * Enable and display o.buttons.
	 * @var boolean
	 */
	o.buttonEnabled = true;
	
	/**
	 * Event on close.
	 * @var function
	 */
	o.onClose = null;
	
	/**
	 * I
	 */
	o._init(p);
}

/**
 * Initialize dialog.
 * @return void
 */
Dialog.prototype._init = function(p) {
	//Set parameters
	var parms = ["id", "class", "bodyId", "footerId", "isModal", "top", "left"/*, "width", "height", "maxWidth", "maxHeight"*/, "title", "body", "buttons", "buttonEnabled", "focusId", "onClose"],
		n = parms.length,
		o = this,
		dlg = _new("div"),
		btns = "",
		i;
	for(i=0; i<n; i++) {
        if(p[parms[i]] !== _u) {
            o[parms[i]] = p[parms[i]];
        }
    }
	
	//if(o.buttonEnabled === _u) {
	//	o.buttonEnabled = true;
	//}
	
	if(o.buttonEnabled) {
		//Build buttons
		for(i in o.buttons) {
			btns += "<button type='button' id='" + i + "Btn'" + (o.buttons[i].class ? " class='" + o.buttons[i].class + "'" : "") + ">" + o.buttons[i].label + "</button>";
		}
	}
	
	//Build dialog
	//dlg.id = o.id;
	if(o.isModal) {
        dlg.className = "modal";
    }
    
    //Extract JS from source
    var jsRe = /<script[^>]*>([.\s\S]+?)<\/script>/g,
        js = "",
        a;
    while((a = jsRe.exec(o.body)) != null) {
        js += a[1];
    }
    
    //Remove JS from source
    o.body = o.body.replace(jsRe, "").replace(/^\s+/, "");
    
	//if(o.width!="auto" || o.height!="auto" || o.maxWidth!=o._maxWidth || o.maxHeight!=o._maxHeight) dlg.setAttribute("style", "width:" + o.width + ";height:" + o.height + ";max-width:" + o.maxWidth + ";max-height:" + o.maxHeight);
	if(o.body.charAt(0) != "<") {
        o.body = "<p>" + o.body + "</p>";
    }
	dlg.innerHTML = "<div id='" + o.id + "' class='dialog" + (o.class != "" ? " " + o.class : "")
		//+ "' draggable='" + (o.isDraggable ? "true" : "false") + "' style='"
		+ "' style='"
		//+ "width:" + o.width + ";height:" + o.height
        //+ ";max-width:" + o.maxWidth + ";max-height:" + o.maxHeight
		+ "'><div class='bar'>"
		+ o.title+ "</div><div" + (o.bodyId ? " id='" + o.bodyId + "'" : "") + " class='body' style='max-height:" + o.winHeight + "px'>"
		//+ o.title+ "</div><div" + (o.bodyId ? " id='" + o.bodyId + "'" : "") + " class='body'>"
		+ o.body + "</div><div" + (o.footerId ? " id='" + o.footerId + "'" : "") + " class='footer'>"
		+ (o.buttonEnabled ? "<p class='buttons'>" + btns + "</p>" : "")
		+ "</div></div>";
	
	//Add buttons: special case
	//If .action class exists then buttons class is replaced by action class
	var action = dlg.querySelector(".action");
	if(o.buttonEnabled && action != null) {
		var buttons = dlg.querySelector(".buttons"),
			body = action != null ? action.parentNode : dlg.querySelector(".body"),
			footer = buttons.parentNode,
			notice = body.querySelector(".notice");
		
        //Move .action and .notice
        footer.appendChild(body.removeChild(action));
        if(notice != null) {
            footer.appendChild(notice);
        }
        
		//Remove buttons
		footer.removeChild(buttons);
	}
	document.body.appendChild(o.modal = dlg);
	
    //Center dialog
	o.refreshPosition();

	//Attach buttons event
	if(o.buttonEnabled) {
	//if(action === null) {
		for(i in o.buttons) {
			var btn = _$(i);
			if(btn == null) {
				btn = _$(i + "Btn");
			}
			if(btn != null) {
				var t = typeof o.buttons[i].onClick;
				
				//Case event is declared
				if(t == "function") {
					btn.__close = o.close.bind(o);
					btn.__click = o.buttons[i].onClick;
					btn.addEvent("click", function() {
						if(this.__click()) {
							this.__close();
						}
					});
				}
				
				//Case string, indicate method name to call (ex: "close")
				else if(t == "string") {
					btn.addEvent("click", o[o.buttons[i].onClick].bind(o));
				}
			}
		}
	//}
	}
    
    try {
        if(p.init !== _u && typeof p.init === "function") {
            p.init();
        }
        else if(action!=null) {
            action.querySelector(":last-child").focus();
        }
        else if(o.buttonEnabled) {
            dlg.querySelector(".buttons>:last-child").focus();
        }
    } catch(e) {
        //Button can not exists
    }
    
    //Execute JS
    if(js != "") {
        eval(js);
    }
    
	//Set draggable behaviour
	if(o.isDraggable) {
        new Draggable(o.id);
    }
};

/**
 * Refresh dialog center position.
 * @return void
 */
Dialog.prototype.refreshPosition = function() {
    //Size dialog height
    var o = this,
        dlg = _$(o.id),
        /*winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,*/
        dlgHeight = dlg.offsetHeight;
    if(dlgHeight > o.winHeight) {
        dlgHeight = o.winHeight;
        dlg.style.maxHeight = o.winHeight + "px";
        dlg.querySelector(".body").style.maxHeight = (o.winHeight - dlg.querySelector(".bar").offsetHeight - dlg.querySelector(".footer").offsetHeight - 3*16) + "px";
    }
    
    //Center dialog
	dlg.style.left = o.left ? o.left : (((_win.innerWidth || _doc.documentElement.clientWidth || _doc.body.clientWidth) - dlg.offsetWidth)/2/* + (document.documentElement.scrollLeft || document.body.scrollLeft)*/) + "px";
	dlg.style.top = o.top ? o.top : ((o.winHeight - dlgHeight)/2/* + (document.documentElement.scrollTop || document.body.scrollTop)*/) + "px";
};

/**
 * Close dialog.
 * @return void
 */
Dialog.prototype.close = function() {
	var o = this,
		field = o.focusId ? _$(o.focusId) : null;
	o.modal.parentNode.removeChild(o.modal);
	if(field !== null) {
        field.focus();
    }
	if(o.onClose) {
		o.onClose();
	}
};