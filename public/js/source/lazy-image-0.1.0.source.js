/**
 * Initialize lazy images.
 * 
 * @param  images Lazy images lists by query selector: _qsa("img.lazyImage").
 * 
 * @return void
 */
function initializeLazyImages(images) {
	if(images) {
		_.lazyImage = {
			list: images,
			sources: {}
		};
		_.lazyImage.list.forEach(function(el) {
			el.addEvent("update", function() {
				var //wx1 = w.pageXOffset,
					wy1 = _win.pageYOffset,
					//wx2 = wx1 + w.innerWidth - 1,
					wy2 = wy1 + _win.innerHeight - 1,			
					e = this,
					//ex1 = e.offsetLeft,
					ey1 = e.offsetTop;
					//ex2 = ex1 + e.clientWidth - 1,
					//ey2 = ey1 + e.clientHeight - 1;

					//bx1 = ex1>=wx1 && ex1<=wx2,
					//by1 = ey1>=wy1 && ey1<=wy2,
					//bx2 = ex2>=wx1 && ex2<=wx2,
					//by2 = ey2>=wy1 && ey2<=wy2;

				//Case element corner is inside the window
				//if((bx1 || bx2) && (by1 || by2)) {
				//Fix reload page with ey1<wy2: load all images before the current scroll position
				if(ey1 < wy2/* || ((ex1>=wx1 && ex1<=wx2) || (ex2>=wx1 && ex2<=wx2)) && ((ey1>=wy1 && ey1<=wy2) || (ey2>=wy1 && ey2<=wy2))*/) {
					var i = e.removeClass("lazyImage").previousSibling,
						s;
					if(i != null && i.tagName == "NOSCRIPT" && (s = /src=['"]([^'"]+)['"]/i.exec(i.innerHTML)) != null) {
						e.src = s[1];
						_.lazyImage.sources[e.id] = 1;
					}
				}
			});
		});

		//Document on event scroll
		_win.addEvent("scroll", function() {
			//Trigger update lazy image
			_.lazyImage.list.forEach(function(el, i) {
				if(!el.id) {
					el.id = "lazyImage" + i;
				};
				if(!_.lazyImage.sources[el.id]) {
					el.trigger("update");
				}
			});
		});
	}
}