/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/**
 * api: example[toolbar] Toolbar with Actions -------------------- Create a
 * toolbar with GeoExt Actions.
 */

function import_js(src) {
	var scriptElem = document.createElement('script');
	scriptElem.setAttribute('src', src);
	scriptElem.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(scriptElem);
}

function import_css(src) {
	var scriptElem = document.createElement('link');
	scriptElem.setAttribute('href', src);
	scriptElem.setAttribute('rel', 'stylesheet');
	scriptElem.setAttribute('type', 'text/css');
	document.getElementsByTagName('head')[0].appendChild(scriptElem);
}

function loadDependencies(){
	import_js("lib/init_sicecat.js");
		
	import_css("lib/ext/resources/css/ext-all.css"); 
	import_css("lib/GeoExt.ux/css/measure.css");
	import_css("lib/GeoExt/lib/resources/css/geoext-all-debug.css");
	import_css("lib/SiceCAT/css/all.css");
}

window.onload = loadDependencies;