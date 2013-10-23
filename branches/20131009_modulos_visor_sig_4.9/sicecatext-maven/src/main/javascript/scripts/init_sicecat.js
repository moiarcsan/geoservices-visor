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

Ext.onReady(function() {

	Ext.QuickTips.init();

	var map = new OpenLayers.Map();
	var wms = new OpenLayers.Layer.WMS("Global Imagery",
			"http://maps.opengeo.org/geowebcache/service/wms", {
				layers : "bluemarble"
			});
	var vector = new OpenLayers.Layer.Vector("vector");
	map.addLayers([ wms, vector ]);

	var ctrl, toolbarNav = [], toolbarEdit = [], action, actions = {};

	// ZoomToMaxExtent control, a "button" control
	action = new GeoExt.Action({
		control : new OpenLayers.Control.ZoomToMaxExtent(),
		map : map,
		text : "max extent",
		tooltip : "zoom to max extent"
	});
	actions["max_extent"] = action;
	toolbarNav.push(action);
	toolbarNav.push("-");

	// Navigation control and DrawFeature controls
	// in the same toggle group
	action = new GeoExt.Action({
		text : "nav",
		control : new OpenLayers.Control.Navigation(),
		map : map,
		// button options
		toggleGroup : "draw",
		allowDepress : false,
		pressed : true,
		tooltip : "navigate",
		// check item options
		group : "draw",
		checked : true
	});
	actions["nav"] = action;
	toolbarNav.push(action);

	// Navigation history - two "button" controls
	ctrl = new OpenLayers.Control.NavigationHistory();
	map.addControl(ctrl);

	action = new GeoExt.Action({
		text : "previous",
		control : ctrl.previous,
		disabled : true,
		tooltip : "previous in history"
	});
	actions["previous"] = action;
	toolbarNav.push(action);

	action = new GeoExt.Action({
		text : "next",
		control : ctrl.next,
		disabled : true,
		tooltip : "next in history"
	});
	actions["next"] = action;
	toolbarNav.push(action);
	// toolbarNav.push("->");

	// Measure path
	action = new GeoExt.ux.MeasureLength({
		map : map,
		tooltip : "measure a line path",
		controlOptions : {
			geodesic : true
		},
		toggleGroup : 'tools'
	});
	actions["measure line"] = action;
	toolbarNav.push(action);

	// Measure polygon
	action = new GeoExt.ux.MeasureArea({
		map : map,
		decimals : 0,
		tooltip : "measure a polygon area",
		toggleGroup : 'tools'
	});
	actions["measure polygon"] = action;
	toolbarNav.push(action);
	toolbarNav.push("->");

	// Reuse the GeoExt.Action objects created above
	// as menu items
	toolbarNav.push({
		text : "menu",
		menu : new Ext.menu.Menu({
			items : [
			// ZoomToMaxExtent
			actions["max_extent"],
			// Nav
			new Ext.menu.CheckItem(actions["nav"]),
			// Measure Line
			// actions["measure line"],
			// Measure polygon
			// actions["measure polygon"],
			// Navigation history control
			actions["previous"], actions["next"] ]
		})
	});

	// Edit Controls
	action = new GeoExt.Action({
		text : "draw poly",
		control : new OpenLayers.Control.DrawFeature(vector,
				OpenLayers.Handler.Polygon),
		map : map,
		// button options
		toggleGroup : "draw",
		allowDepress : false,
		tooltip : "draw polygon",
		// check item options
		group : "draw"
	});
	actions["draw_poly"] = action;
	toolbarEdit.push(action);

	action = new GeoExt.Action({
		text : "draw line",
		control : new OpenLayers.Control.DrawFeature(vector,
				OpenLayers.Handler.Path),
		map : map,
		// button options
		toggleGroup : "draw",
		allowDepress : false,
		tooltip : "draw line",
		// check item options
		group : "draw"
	});
	actions["draw_line"] = action;
	toolbarEdit.push(action);
	toolbarEdit.push("-");

	// SelectFeature control, a "toggle" control
	action = new GeoExt.Action({
		text : "select",
		control : new OpenLayers.Control.SelectFeature(vector, {
			type : OpenLayers.Control.TYPE_TOGGLE,
			hover : true
		}),
		map : map,
		// button options
		enableToggle : true,
		tooltip : "select feature"
	});
	actions["select"] = action;
	toolbarEdit.push(action);
	toolbarEdit.push("-");

	// Reuse the GeoExt.Action objects created above
	// as menu items
	toolbarEdit.push({
		text : "menu",
		menu : new Ext.menu.Menu({
			items : [
			// Draw poly
			new Ext.menu.CheckItem(actions["draw_poly"]),
			// Draw line
			new Ext.menu.CheckItem(actions["draw_line"]),
			// Select control
			new Ext.menu.CheckItem(actions["select"]), ]
		})
	});

	// Init map
	var mapPanel = new GeoExt.MapPanel({
		renderTo : "mappanel",
		height : 400,
		width : 600,
		map : map,
		center : new OpenLayers.LonLat(5, 45),
		zoom : 4,
		tbar : toolbarNav
	});

	var panel = new OpenLayers.Control.Panel();
	var loadGML = new OpenLayers.Control.LoadGML();
	var loadKML = new OpenLayers.Control.LoadKML();
	var loadWMS = new OpenLayers.Control.LoadWMS();
	panel.addControls([ loadGML, loadKML, loadWMS ]);
	map.addControl(panel);

	AuxiliaryLayer.setMap(map);

	map.addControl(new OpenLayers.Control.LayerSwitcher());

	var areaPoligonoSelector = document.getElementById("areaPoligonoSelector"); 
	Ext.each(map.layers, function(l, index) {
		var aLayer = document.createElement('option');
	    aLayer.label = l.name;
	    aLayer.text = l.name;
	    aLayer.value = l;
	    aLayer.layer = l;

		areaPoligonoSelector.options.add(aLayer);
	});
//	var areaPoligono = new OpenLayers.Control.AreaPoligono(areaPoligonoSelector);
//	map.addControl(areaPoligono);
	var areaCirculo = new OpenLayers.Control.AreaCirculo(areaPoligonoSelector);
	map.addControl(areaCirculo);


	var toolTip = new OpenLayers.Control.ToolTipControl();
	map.addControl(toolTip);
	
	
	mapMenu = new OpenLayers.Control.MapMenu();
	map.addControl(mapMenu);

});