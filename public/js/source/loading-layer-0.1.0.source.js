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