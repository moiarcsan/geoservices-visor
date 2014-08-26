/*
 * MapLayout.js
 * Copyright (C) 2011, Cliente <cliente@email.com>
 * 
 * This file is part of Proyecto SiceCAT
 * 
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 * 
 * Authors:: Alejandro D\u00edaz Torres (mailto:adiaz@emergya.com)
 * Author: Mar\u00eda Arias de Reyna Dom\u00ednguez (mailto:marias@emergya.com)
 * Author: Mois�s Arcos Santiago (mailto:marcos@emergya.com)
 * 
 */

/**
 * @requires OpenLayers.js
 * @requires ext-all.js
 * @requires SiceCAT.js
 */

/**
 * Class: Map
 * 
 * Map layout container
 * 
 * Inherits from: - <Ext.Component>
 */
SiceCAT.MapLayout = Ext
		.extend(
				Ext.Component,
				{

					/**
					 * Property: sicecatInstance {SiceCAT} instance of sicecat
					 * viewer
					 */
					sicecatInstance : null,
					mapPanel : null,
					toolbarNav : null,
					footBar : null,
					map : null,

					/**
					 * Property: zoomToSelectionText {String} Default text to be
					 * show
					 */
					zoomToSelectionText : "zoom to selection",

					/**
					 * Property: zoomToSelectionTooltipText {String} Default
					 * text to be show
					 */
					zoomToSelectionTooltipText : "zoom to selected features",

					/**
					 * Property: initialExtentText {String} Default text to be
					 * show
					 */
					initialExtentText : "initial extent",

					/**
					 * Property: initialExtentTooltipText {String} Default text
					 * to be show
					 */
					initialExtentTooltipText : "zoom to initial extent",

					/**
					 * Property: zoomToLayerText {String} Default text to be
					 * show
					 */
					zoomToLayerText : "Zoom to Layer",

					/**
					 * Property: zoomToLayerTooltipText {String} Default text to
					 * be show
					 */
					zoomToLayerTooltipText : "zoom to layer extent",

					/**
					 * Property: zoomToMunicipioText {String} Default text to be
					 * show
					 */
					zoomToMunicipioText : "zoom to municipio/comarca",

					/**
					 * Property: zoomToMunicipioTooltipText {String} Default
					 * text to be show
					 */
					zoomToMunicipioTooltipText : "zoom to municipio/comarca",

					/**
					 * Property: navigationText {String} Default text to be show
					 */
					navigationText : "nav",

					/**
					 * Property: navigationTooltipText {String} Default text to
					 * be show
					 */
					navigationTooltipText : "navigate",

					/**
					 * Property: previousTooltipText {String} Default text to be
					 * show
					 */
					previousTooltipText : "previous",

					/**
					 * Property: previousTooltipText {String} Default text to be
					 * show
					 */
					previousTooltipText : "previous in history",

					/**
					 * Property: nextText {String} Default text to be show
					 */
					nextText : "next",

					/**
					 * Property: nextTooltipText {String} Default text to be
					 * show
					 */
					nextTooltipText : "next in history",

					/**
					 * Property: measureLineTooltipText {String} Default text to
					 * be show
					 */
					measureLineTooltipText : "measure a line path",

					/**
					 * Property: measurePolygonTooltipText {String} Default text
					 * to be show
					 */
					measurePolygonTooltipText : "measure a polygon area",

					/**
					 * Property: calculadoraText {String} Default text to be
					 * show
					 */
					calculadoraText : "Calculadora",

					/**
					 * Property: calculadoraTooltipText {String} Default text to
					 * be show
					 */
					calculadoraTooltipText : "geographic calculator",

					/**
					 * Property: spuntoradioText {String} Default text to be
					 * show
					 */
					spuntoradioText : "Point and radius",

					/**
					 * Property: spuntoradioTooltipText {String} Default text to
					 * be show
					 */
					spuntoradioTooltipText : "Point and radius selection",

					/**
					 * Property: drawPolygonText {String} Default text to be
					 * show
					 */
					drawPolygonText : "poly",

					/**
					 * Property: drawLineText {String} Default text to be show
					 */
					drawLineText : "line",

					/**
					 * Property: drawPointText {String} Default text to be show
					 */
					drawPointText : "point",

					/**
					 * Property: selectText {String} Default text to be show
					 */
					selectText : "select",

					/**
					 * Property: selectTooltipText {String} Default text to be
					 * show
					 */
					selectTooltipText : "select feature",

					/**
					 * Property: selectBoxTooltipText {String} Default text to
					 * be show
					 */
					selectBoxTooltipText : "select feature by box",

					/**
					 * Property: deleteText {String} Default text to be show
					 */
					deleteText : "delete",

					/**
					 * Property: editText {String} Default text to be show
					 */
					editText : "edit feature",

					/**
					 * Property: editAttributesText {String} Default text to be
					 * show
					 */
					editAttributesText : "edit attributes",

					/**
					 * Property: goToText {String} Default text to be show
					 */
					goToText : "Go To",

					/**
					 * Property: goToTooltipText {String} Default text to be
					 * show
					 */
					goToTooltipText : "go to coordinates",

					/**
					 * Property: maxExtentText {String} Default text to be show
					 */
					maxExtentText : "max extent",

					/**
					 * Property: maxExtentTooltipText {String} Default text to
					 * be show
					 */
					maxExtentTooltipText : "zoom to max extent",

					printText : "Print {0}",
					printErrorTitleText : "Print error",
					printErrorText : "An error ocurred in server side",
					featureInfoTooltip : "Get the information clicking the map",
					toolTipTooltipText : "Get the information over the map",
					geoNamesSearcherUrl: "http://ws.geonames.org/searchJSON?",
					streetsSearchText: "Streets search",
					geoNamesZoom: null,
					geoNamesWidth: null,
					searchWFSDefaultStateText : "Press 'Query' to send request",
					searchWFSNotFoundStateText : "Not elements found",
					searchWFSFoundsStateText : "<ul><li>{0} elements has been found</li><li>Draw in '{1}' layer</li></ul>",
					errorWFSText: "Error ocurred in WFS. <a href='#' id='error_msg_wfs_detail'>More information</a>",
					errorWFSDetailsTitleText: "Details",
					queryText : "Ask",
					searcherTitleText : "Finder",
					searchButtonWFSButtonText : "WFS",
					searchButtonWFSButtonTooltipText : "Search WFS layers configured",
					titleAddressPanel: "Address - {0}",
					titleWayPanel: "Vía PK - {0}",
					titleGeneralPanel: "General - {0}",
					titleWarningPanel: "Error de localización",
					msgWarningPanel: "La localización no se ha devuelto correctamente por el servidor",
					titleResultLayer: "Resultados de la consulta",
					msgErrorServer: "Error de servidor",
					msgResults: "results",
					
					titlesForLayer : {
						"p:pap" : "Centres de l'administraci\u00f3 p\u00fablica",
						"p:pas" : "Centres d'assist\u00e8ncia social",
						"p:pb" : "Centres de negoci",
						"p:pe" : "Centres educatius",
						"p:pl" : "Centres de lleure",
						"p:pm" : "Centres de transport i mobilitat",
						"p:psa" : "Centres de salut",
						"p:pse" : "Centres de seguretat",
						"p:t" : "Topon\u00edmia (nomencl\u00e0tor)",
						"r:ra" : "Anotacions poligonals",
						"r:rl" : "Anotacions lineals",
						"r:rp" : "Anotacions puntuals",
						"s:a" : "AVAS (Base dels avions de vigil\u00e0ncia i atac).",
						"s:ab" : "\u00C0rees B\u00e0siques policials.",
						"s:ae" : "Activitats extractives.",
						"s:ap" : "Inuncat: Punts d'actuaci\u00f3 priorit\u00e0ria.",
						"s:aps" : "Punts d'actuaci\u00f3 priorit\u00e0ria",
						"s:b" : "Guaites.",
						"s:c" : "Heliports.",
						"s:c112" : "Centres del servei 112.",
						"s:ca" : "Xarxa de camins",
						"s:cd" : "Inuncat: Cons de dejecci\u00f3",
						"s:co" : "Al\u00e7ada edificis",
						"s:d" : "Hidrants",
						"s:db" : "Districtes de Barcelona.",
						"s:e" : "Punts d'aigua.",
						"s:ef" : "Estacions de ferrocarril.",
						"s:ei" : "Establiments industrials (SIPAE)",
						"s:en" : "Espais Naturals de Protecci\u00f3 Especial.",
						"s:f" : "Parcs de bombers",
						"s:fo" : "\u00C0rees forestals p\u00fabliques",
						"s:g" : "Xarxa RESCAT (Torres de comunicaci\u00f3)",
						"s:h" : "Capitals de municipi",
						"s:i" : "L\u00edmits municipals",
						"s:ir" : "Zones inundables presa Rialb",
						"s:k" : "L\u00edmits comarcals.",
						"s:lf" : "L\u00ednies de ferrocarril.",
						"s:np" : "Nuclis de poblaci\u00f3",
						"s:nv" : "Nodes del graf",
						"s:p" : "L\u00edmits provincials",
						"s:pi" : "Inuncat_Zones potencialment inundables.",
						"s:plo" : "Municipis amb Policia Local.",
						"s:pn" : "Risc incendi forestal. Perill.",
						"s:po" : "\u00daltima posici\u00f3 dels efectius RESCAT",
						"s:rpo" : "Mapa de les Regions Policials.",
						"s:s1" : "Malla SOC 1km",
						"s:s5" : "Malla SOC de 5 km",
						"s:sc" : "Inuncat: Sirenes preses cobertura.",
						"s:soc" : "Malla SOC 1 km",
						"s:sp" : "Situaci\u00f3 de la sirena de les preses.",
						"s:sv" : "Segments del graf",
						"s:svm" : "Segments del graf",
						"s:tf" : "T\u00fanels de ferrocarril",
						"s:tt" : "Inuncat: Temps de tr\u00e0nsit",
						"s:vu" : "Infocat: Mapa de vulnerabilitat d'incendis",
						"s:x" : "Eixos carretera (DGC)",
						"s:y" : "Punts quilom\u00e8trics (DGC)",
						"s:z" : "Tallafocs",
						"s:z1" : "Inuncat. Zones inundables T50",
						"s:z3" : "Zones inundables T500.",
						"s:zt" : "Inuncat: Zones inundables T100"
					},

					/**
					 * Method: init_map_sicecatII
					 * 
					 * Load map panel and map controls
					 */
					init_map_sicecatII : function() {
						this.toolbarNav = [], this.footBar = [];

						var lyrTopo = "topo", lyrOrto = "orto";
						var saveStrategy = new OpenLayers.Strategy.Save();
						saveStrategy.events.register("fail", this, saveFail);

						vector = // AuxiliaryLayer.getLayer(OpenLayers.Control.ToolTipControl
									// + "_container");
						new OpenLayers.Layer.Vector("vector", {
							strategies : [ new OpenLayers.Strategy.Save() ],
							displayInLayerSwitcher : false
						});

						this.init_toolbarNav();

						this.init_stateBar();

						this.init_contextMap();

						this.init_invisible_controls();

						this.mapPanel = new GeoExt.MapPanel({
							border : true,
							region : "center",
							height : 400,
							width : 600,
							map : this.map,
							center : new OpenLayers.LonLat(5, 45),
							zoom : 4,
							tbar : this.toolbarNav,
							bbar : this.footBar,
							items : [ {
								xtype : "gx_zoomslider",
								aggressive : true,
								vertical : true,
								height : 100,
								x : 15,
								y : 130
							} ]
						});
					},

					/**
					 * Method: init_contextMap
					 * 
					 * Load map overview
					 */
					init_contextMap : function() {

						var overview = new SiceCAT.Control.OverviewMap({
							mapOptions : {
								projection : this.map.projection,
								units : this.map.units,
								initialExtent : this.map.initialExtent,
								maxExtent : this.map.maxExtent,
								resolutions : this.map.resolutions,
								tileSize : this.map.tileSize,
								numZoomLevels : this.map.numZoomLevels,
								displayProjection : this.map.displayProjection,
								maxScale : this.map.maxScale,
								minScale : this.map.minScale
							},
							maximized : true,
							// size: new OpenLayers.Size(200, 150),
							// size: new OpenLayers.Size(400, 400),
							autoPan : true
						});
						this.map.addControl(overview);
					},

					/**
					 * Method: init_invisible_controls
					 * 
					 * Load invisible controls to this.map
					 */
					init_invisible_controls : function() {
						AuxiliaryLayer.setMap(this.map);
						Sicecat.locate_box_control = new SiceCAT.Control.LocateBox();
						this.map.addControl(Sicecat.locate_box_control);
					},

					/**
					 * Method: init_stateBar
					 * 
					 * Load this.footBar
					 */
					init_stateBar : function() {

						action = new GeoExt.Action({
							control : new OpenLayers.Control.ScaleLine(),
							map : this.map
						});

						actions["scale"] = action;

						this.footBar.push("->");
						var proj2show = new Array();
						var projName2show = new Array();
						projName2show[0] = "WGS84";
						projName2show[1] = "UTM ETRS89 31N";
						projName2show[2] = "UTM ED50 31N";
						proj2show[0] = "EPSG:4326";
						proj2show[1] = "EPSG:25831";
						proj2show[2] = "EPSG:23031";
						var control = new OpenLayers.Control.MousePositionSiceCAT(
								{
									projectionsToShow : proj2show,
									projectionsNameToShow: projName2show,
									map : this.map
								});
						action = new GeoExt.Action({
							control : control,
							map : this.map
						});
						actions["mousePosition"] = action;
						this.footBar.push(action);
					},

					/**
					 * Method: init_toolbarNav
					 * 
					 * Load this.toolbarNav
					 */
					init_toolbarNav : function() {
						var tooltipAct = null;
						// ZoomToMaxExtent control, a "button" control
						action = new GeoExt.Action({
							control : new OpenLayers.Control.ZoomToInitialExtend(),
							iconCls : "ZoomToMaxExtent",
							map : this.map,
							tooltip : this.maxExtentTooltipText
						});
						actions["max_extent"] = action;
						this.toolbarNav.push(action);

						// ZoomToselection control, a "button" control
						action = new GeoExt.Action({
							control : new OpenLayers.Control.ZoomToSelection(),
							iconCls : "ZoomToSelection",
							map : this.map,
							tooltip : this.zoomToSelectionTooltipText
						});
						actions["zoomToSelection"] = action;
						this.toolbarNav.push(action);

						var control = new OpenLayers.Control.ZoomToLayer({
							sicecatInstance : this.sicecatInstance
						});
						action = new GeoExt.Action({
							control : control,
							iconCls : "ZoomToLayer",
							map : this.map,
							tooltip : this.zoomToLayerTooltipText
						});
						actions["zoomToLayer"] = action;

						var zoom_url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, Sicecat.defaultWMSServer.replace("ows/wms?", "ows/wfs"));
						action = new GeoExt.Action(
								{
									control : new OpenLayers.Control.ZoomToMunicipioComarca(),
									iconCls : "ZoomToMunicipio",
									map : this.map,
									url: zoom_url,
									sicecatInstance : Sicecat,
									tooltip : this.zoomToMunicipioTooltipText
								});
						actions["zoomtomunicipio/comarca"] = action;
						this.toolbarNav.push(action);

						this.toolbarNav.push("-");

						// Navigation control and DrawFeature controls
						// in the same toggle group
						// Pan
						action = new GeoExt.Action({
							control : new OpenLayers.Control.Navigation(),
							map : this.map,
							// button options
							toggleGroup : "draw",
							iconCls : "Navigation",
							allowDepress : true,
							tooltip : this.navigationTooltipText,
							// check item options
							group : "draw",
							checked : true
						});
						actions["nav"] = action;
						
						// Navigation history - two "button" controls
						ctrl = new OpenLayers.Control.NavigationHistory();
						this.map.addControl(ctrl);

						action = new GeoExt.Action({
							iconCls : "ZoomPrevious",
							control : ctrl.previous,
							disabled : true,
							tooltip : this.previousText
						});
						actions["previous"] = action;
						this.toolbarNav.push(action);

						action = new GeoExt.Action({
							iconCls : "ZoomNext",
							control : ctrl.next,
							disabled : true,
							tooltip : this.nextTooltipText
						});
						actions["next"] = action;
						this.toolbarNav.push(action);

						this.toolbarNav.push("-");
						// Measure group button
						// Handler polygon
						var handler_area = function(){
							if(actions["measure polygon"].control.active){
								actions["measure polygon"].control.deactivate();
								actions["tooltipcontrol"].control.activate();
							}else{
								if(action_measure.pressed){
									actions["measure polygon"].control.activate();
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
								}else{
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(!tooltipAct){
										actions["tooltipcontrol"].control.activate();
									}
								}
							}
						};
						// Measure polygon
						var this_ = this;
						var action_measure_area = new GeoExt.ux.MeasureArea({
							map : this.map,
							decimals : 4,
							text : this.measurePolygonTooltipText,
				            template: '<p>Area: {[values.measure.toFixed(this.decimals)]}&nbsp;'+
			                '{units}<sup>2</sup></p>',
							iconCls : "MeasureArea",
							handler: function(){
								// If the button is pressed
								if(action_measure.pressed){
									// And the another control is activated
									if(actions["measure line"].control.active){
										actions["measure line"].control.deactivate();
										actions["measure polygon"].control.activate();
									}
								}else{
									// Activate the polygon control
									actions["measure polygon"].control.activate();
									// Deactivate the tooltip control
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
									// Chaged pressed status of the generic tool to true
									action_measure.pressed = true;
								}
								action_measure.setIconClass("MeasureArea");
								action_measure.setHandler(handler_area);
								action_measure.setTooltip(this_.measurePolygonTooltipText);
							},
							controlOptions : {
								geodesic : true
							},
							toggleGroup : 'draw'
						});
						actions["measure polygon"] = action_measure_area;
						// Handler path
						var handler_path = function(){
							if(actions["measure line"].control.active){
								actions["measure line"].control.deactivate();
								actions["tooltipcontrol"].control.activate();
							}else{
								if(action_measure.pressed){
									actions["measure line"].control.activate();
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
								}else{
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(!tooltipAct){
										actions["tooltipcontrol"].control.activate();
									}
								}
							}
						};
						// Measure path
						action = new GeoExt.ux.MeasureLength({
							map : this.map,
							decimals : 4,
							iconCls : "MeasureLine",
				            template: '<p>Longitud: {[values.measure.toFixed(this.decimals)]}&nbsp;'+
			                '{units}</p>',
							text : this.measureLineTooltipText,
							handler: function(){
								// If the button is pressed
								if(action_measure.pressed){
									// The polygon control is activated
									if(actions["measure polygon"].control.active){
										actions["measure polygon"].control.deactivate();
										actions["measure line"].control.activate();
									}
								}else{
									// Activate the line control
									actions["measure line"].control.activate();
									// Deactivate the tooltip control
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
									// Chaged pressed status of the generic tool to true
									action_measure.pressed = true;
								}
								action_measure.setIconClass("MeasureLine");
								action_measure.setHandler(handler_path);
								action_measure.setTooltip(this_.measureLineTooltipText);
							},
							controlOptions : {
								geodesic : true
							},
							toggleGroup : 'draw'
						});
						actions["measure line"] = action;
						var action_measure = new Ext.SplitButton({
							tooltip: this.measureLineTooltipText,
							iconCls: "MeasureLine",
							enableToggle: true,
							toggleGroup: "draw",
							handler: function(){
								if(actions["measure line"].control.active){
									actions["measure line"].control.deactivate();
									actions["tooltipcontrol"].control.activate();
								}else{
									if(action_measure.pressed){
										actions["measure line"].control.activate();
										tooltipAct = actions["tooltipcontrol"].control.active;
										if(tooltipAct){
											actions["tooltipcontrol"].control.deactivate();
										}
									}else{
										tooltipAct = actions["tooltipcontrol"].control.active;
										if(!tooltipAct){
											actions["tooltipcontrol"].control.activate();
										}
									}
								}
							},
							listeners: {
								// Listener to deactivate the control when it changes the tool
								'toggle': function(evt){
									if(!action_measure.pressed){
										if(actions["measure line"].control.active){
											actions["measure line"].control.deactivate();
										}
										if(actions["measure polygon"].control.active){
											actions["measure polygon"].control.deactivate();
										}
									}
								}
							},
							menu: [actions["measure line"], actions["measure polygon"]]
						});
						
						this.toolbarNav.push(action_measure);

						// ToolTipControl
						control = new OpenLayers.Control.ToolTipControl([], {
							clickout : true,
							toggle : true,
							multiple : false,
							highlightOnly : true,
							selectStyle : Sicecat.styles["select"]
						});
						var action_tooltip = new GeoExt.Action({
							control : control,
							map : this.map,
							// button options
							enableToggle: true,
							toggleGroup : "draw",
							iconCls : "GetFeatureInfo",
							tooltip : this.toolTipTooltipText,
							pressed: true,
							handler: function(){
								/*if(actions["tooltipcontrol"].control.active){
									actions["tooltipcontrol"].control.deactivate();
									actions["defaulttooltipcontrol"].control.activate();
								}else{
									actions["defaulttooltipcontrol"].control.deactivate();
									actions["tooltipcontrol"].control.activate();
								}*/
							}
						});
						actions["tooltipcontrol"] = action_tooltip;
						this.toolbarNav.push(action_tooltip);
						
						// DefaulToolTipControl
						control = new OpenLayers.Control.DefaultToolTipControl([], {
							clickout : false,
							toggle : true,
							multiple : true,
							hover : false,
							highlightOnly : false,
							selectStyle : Sicecat.styles["select"]
						});
						// Default action to the context menu
						action = new GeoExt.Action({
							control : control,
							map : this.map,
							// button options
							//toggleGroup : "draw",
							iconCls : "ToolTipControl",
							tooltip : this.toolTipTooltipText,
							// check item options
							//group : "draw",
							//pressed: true
						});
						actions["defaulttooltipcontrol"] = action;
						this.toolbarNav.push("-");
						// Select with a button
						// Handler select features by box
						var handler_select_box =  function(){
							if(actions["selectBox"].control.active){
								actions["tooltipcontrol"].control.activate();
								actions["selectBox"].control.deactivate();
							}else{
								if(action_select.pressed){
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
									actions["defaulttooltipcontrol"].control.deactivate();
									actions["selectBox"].control.activate();
								}else{
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(!tooltipAct){
										actions["tooltipcontrol"].control.activate();
									}else{
										actions["defaulttooltipcontrol"].control.activate();
									}
								}
							}
						};
						// Select by box
						var action_select_box = new GeoExt.Action({
							text: this.selectBoxTooltipText,
							iconCls : "SelectFeatureBox",
							toggleGroup : "draw",
							enableToggle : true,
							map : this.map,
							handler: function(){
								// If the button is pressed
								if(action_select.pressed){
									// And the another control is activated
									if(actions["select"].control.active){
										actions["select"].control.deactivate();
										actions["selectBox"].control.activate();
									}
									if(actions["pointRadiusSelection"].control.active){
										actions["pointRadiusSelection"].control.deactivate();
										actions["selectBox"].control.activate();
									}
								}
								action_select.setIconClass("SelectFeatureBox");
								action_select.setHandler(handler_select_box);
								action_select.setTooltip(this_.selectBoxTooltipText);
							},
							control : new OpenLayers.Control.SelectFeatureControl([],{
								clickout : false,
								toggle : true,
								multiple : true,
								multipleKey : "shiftKey",
								box : true,
								selectStyle : Sicecat.styles["select"]
							})
						});
						actions["selectBox"] = action_select_box;
						// Handler point radius
						var handler_point_radius = function(){
							if(actions["pointRadiusSelection"].control.active){
								actions["pointRadiusSelection"].control.deactivate();
								actions["tooltipcontrol"].control.activate();
							}else{
								if(action_select.pressed){
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
									actions["defaulttooltipcontrol"].control.deactivate();
									actions["pointRadiusSelection"].control.activate();
								}else{
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(!tooltipAct){
										actions["tooltipcontrol"].control.activate();
									}else{
										actions["defaulttooltipcontrol"].control.deactivate();
									}
								}
							}
						};
						
						// Select by point and radius
						var action_select_radious = new GeoExt.Action({
							iconCls : "SeleccionPuntoRadio",
							control : new OpenLayers.Control.SeleccionPuntoRadio([],{
								clickout : false,
								toggle : false,
								multiple : false,
								hover : false,
								highlightOnly : false,
								selectStyle : Sicecat.styles["select"]
							}),
							handler: function(){
								// If the button is pressed
								if(action_select.pressed){
									// And the another control is activated
									if(actions["select"].control.active){
										actions["select"].control.deactivate();
										actions["pointRadiusSelection"].control.activate();
									}
									if(actions["selectBox"].control.active){
										actions["selectBox"].control.deactivate();
										actions["pointRadiusSelection"].control.activate();
									}
								}
								action_select.setIconClass("SeleccionPuntoRadio");
								action_select.setHandler(handler_point_radius);
								action_select.setTooltip(this_.spuntoradioText);
							},
							map : this.map,
							toggleGroup : "draw",
							// button options
							enableToggle : false,
							text : this.spuntoradioText
						});
						actions["pointRadiusSelection"] = action_select_radious;
						
						//Handler select one feature
						var handler_one_feature = function(){
							if(actions["select"].control.active){
								actions["select"].control.deactivate();
								actions["tooltipcontrol"].control.activate();
							}else{
								if(action_select.pressed){
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(tooltipAct){
										actions["tooltipcontrol"].control.deactivate();
									}
									actions["defaulttooltipcontrol"].control.deactivate();
									actions["select"].control.activate();
								}else{
									tooltipAct = actions["tooltipcontrol"].control.active;
									if(!tooltipAct){
										actions["tooltipcontrol"].control.activate();
									}else{
										actions["defaulttooltipcontrol"].control.deactivate();
									}
								}
							}
						};
						Sicecat.featureSelectedMonitor = new SiceCAT.FeatureSelectedMonitor({
							title: 'Selected features by layers',
							closeAction : 'close',
							width : 200,
							height : 300,
							id : 'features_selected',
							layout : 'fit'
						});
						// SelectFeature control, a "toggle" control
						action = new GeoExt.Action({
							iconCls : "SelectFeature",
							control : new OpenLayers.Control.SelectFeatureControl([],{
								clickout : false,
								toggle : true,
								multiple : true,
								highlightOnly : true,
								selectStyle : Sicecat.styles["select"]
							}),
							handler: function(){
								// If the button is pressed
								if(action_select.pressed){
									// And the another control is activated
									if(actions["selectBox"].control.active){
										actions["selectBox"].control.deactivate();
										actions["select"].control.activate();
									}
									if(actions["pointRadiusSelection"].control.active){
										actions["pointRadiusSelection"].control.deactivate();
										actions["select"].control.activate();
									}
								}
								action_select.setIconClass("SelectFeature");
								action_select.setHandler(handler_one_feature);
								action_select.setTooltip(this_.selectTooltipText);
							},
							map : this.map,
							toggleGroup : "draw",
							// button options
							enableToggle : true,
							text : this.selectTooltipText
						});
						actions["select"] = action;
						
						// Select feature one by one (default)
						var action_select = new Ext.SplitButton({
							tooltip: this.selectTooltipText,
							iconCls: 'SelectFeature',
							enableToggle: true,
							toggleGroup: "draw",
							handler: function(){
								if(actions["select"].control.active){
									actions["select"].control.deactivate();
									actions["tooltipcontrol"].control.activate();
								}else{
									if(action_select.pressed){
										tooltipAct = actions["tooltipcontrol"].control.active;
										if(tooltipAct){
											actions["tooltipcontrol"].control.deactivate();
										}
										actions["defaulttooltipcontrol"].control.deactivate();
										actions["select"].control.activate();
										
									}else{
										tooltipAct = actions["tooltipcontrol"].control.active;
										if(!tooltipAct){
											actions["tooltipcontrol"].control.activate();
										}else{
											actions["defaulttooltipcontrol"].control.deactivate();
										}
									}
								}
							},
							listeners: {
								// Listener to deactivate the control when it changes the tool
								'toggle': function(evt){
									if(!action_select.pressed){
										// Deactivate the select one by one
										if(actions["select"].control.active){
											actions["select"].control.deactivate();
										}
										// Deactivate the select by box
										if(actions["selectBox"].control.active){
											actions["selectBox"].control.deactivate();
										}
										// Deactivate the select by point and radius
										if(actions["pointRadiusSelection"].control.active){
											actions["pointRadiusSelection"].control.deactivate();
										}
									}
								}
							},
							menu: [actions["select"], 
							       actions["selectBox"], 
							       actions["pointRadiusSelection"]]
						});
						this.toolbarNav.push(action_select);

						this.toolbarNav.push("-");

						// Obtiene la url del wms en funcion del servidor wms:
						// http://sigescat.pise.interior.intranet/ows/wms? --> 
						// http://sigescat.pise.interior.intranet/openls
						// e incluye el proxy
                        
						this.toolbarNav.push(new SiceCAT.CombinedSearchField({                            
							id: 'searchbar',
                            titleAddressPanel: this.titleAddressPanel,
                            msgResults: this.msgResults,
                            titleGeneralPanel: this.titleGeneralPanel,
                            msgErrorServer: this.msgErrorServer,
                            msgWarningPanel: this.msgWarningPanel,
                            titleWarningPanel: this.titleWarningPanel,
                            titleWayPanel: this.titleWayPanel
						}));
						
						var action_wfs = this.getSearchWFSAction();
						actions["wfs_searcher"] = action_wfs;
						this.toolbarNav.push(action_wfs);
						
						this.toolbarNav.push("->");
						this.toolbarNav.push("-");

						this.getPrint("PDF");
						this.getPrint("PNG");
						this.toolbarNav.push("-");

						// Merge geocalculator and goto
						action = new GeoExt.Action({
							control : new OpenLayers.Control.GeoCalculator(),
							map : this.map,
							tooltip : this.calculadoraTooltipText,
							iconCls : 'GeoCalculator'
						});
						actions["calculator"] = action;
						this.toolbarNav.push(action);

						this.toolbarNav.push("-");
					},
					
					/**
					 * Init WFS search action for GeoExt
					 * 
					 * Parameters: layers - <Array<Map>> with layer parameters
					 * for GXP WFS panel
					 */
					getSearchWFSAction : function() {
                        // Search WFS Action
						var layers;
						if (!!this.sicecatInstance.jsonSearchServices) {
							layers = new Array();
							var j = 0;
							for ( var i = 0; i < this.sicecatInstance.jsonSearchServices.length; i++) {
								if (this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs") {
									var url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, this.sicecatInstance.jsonSearchServices[i]["url"]);
									var url_schema = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, this.sicecatInstance.jsonSearchServices[i]["schema"]);
									layers[j++] = {
										title : this.sicecatInstance.jsonSearchServices[i]["title"],
										name : this.sicecatInstance.jsonSearchServices[i]["name"],
										namespace : this.sicecatInstance.jsonSearchServices[i]["namespace"],
										url : url,
										schema : url_schema,
										maxFeatures : this.sicecatInstance.jsonSearchServices[i]["maxFeatures"]
									};
								} else if (this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs_all"
										&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"]
										&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length
										&& this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length > 0) {
									var url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, this.sicecatInstance.jsonSearchServices[i]["url"]);
									for ( var k = 0; k < this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length; k++) {
										var title;
										if (!!this.titlesForLayer[this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]]) {
											title = this.titlesForLayer[this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]];
										} else {
											title = this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k];
										}
										var url_schema = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, 
												this.sicecatInstance.jsonSearchServices[i]["schema_base"] + this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]);
										layers[j++] = {
											title : title,
											name : this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]
													.split(":")[1],
											namespace : this.sicecatInstance.jsonSearchServices[i]["namespace"],
											url : url,
											schema : url_schema,
											maxFeatures : this.sicecatInstance.jsonSearchServices[i]["maxFeatures"]
										};
									}
								} 
							}
						}
						
						var sicecatInstance = this.sicecatInstance;

						Sicecat.wfsSearcherWindow = null;
						if (!Sicecat.wfsSearcherWindow) {
							Sicecat.wfsSearcherWindow = new SiceCAT.QueryDialog({
                                layers: layers,
                                queryText: this.queryText,
                                searchWFSDefaultStateText: this.searchWFSDefaultStateText,
                                searchWFSNotFoundStateText: this.searchWFSNotFoundStateText,
                                searchWFSFoundsStateText: this.searchWFSFoundsStateText,
                                errorWFSText: this.errorWFSText,
                                errorWFSDetailsTitleText: this.errorWFSDetailsTitleText,                                
                                sicecatInstance: sicecatInstance,  
                                errorDescribeFeatureNotFound: this.errorDescribeFeatureNotFound,
								title : this.searcherTitleText
							});
						}
						var action = new GeoExt.Action(
								{
									itemID : "SearchBox",
									// text : this.searchButtonWFSButtonText,
									control : new OpenLayers.Control(),
									map : map,
									iconCls : "SearchWFS",
									// button options
									allowDepress : false,
									tooltip : this.searchButtonWFSButtonTooltipText,
									// check item options
									group : "search",
									listeners : {
										click : function(renderer) {
											Sicecat.wfsSearcherWindow.show();
										}
									}
								});

						return action;
					},

					/**
					 * Method: getPrint
					 * 
					 * add the print control of the type (PDF,PNG,...)
					 * 
					 * Parameters: type - {<String>} can be PDF|PNG
					 * 
					 */
					getPrint : function(type) {
						var printErrorText = this.printErrorText;
						var printErrorTitleText = this.printErrorTitleText;
						
						var url = type + ".do/";
						
						if(!!Sicecat.PDFServer){
							url = Sicecat.PDFServer + url;
						}

						var printProvider = new SiceCAT.data.PrintProvider(
								{
									method : "POST",
									url : url,
									autoLoad : true,
									listeners : {
										"printexception" : function(printProvider, response) {
											var error = new Ext.Window({
														id : 'printWindowErrorID',
														title : printErrorTitleText,
														closeAction: 'hide',
														resizable : true,
														autoHeight : false,
														autoWidth : false,
														width : 350,
														height : 220,
														items : [
																{
																	xtype : "textarea",
																	overflow : "hidden",
																	name : "Error Message",
																	value : printErrorText,
																	width : 350,
																	height : 170
																},
																{
																	xtype : "tbbutton",
																	text : "OK",
																	handler : function() {
																		Ext.getCmp('printWindowErrorID').hide();
																	}
																} ]
													});
											error.show();
										},
										"loadcapabilities": function() {
											if(type == "PDF"){
												this.capabilities.printURL = this.getAbsoluteUrl("PDF.do/print.pdf.do");
												this.capabilities.createURL = this.getAbsoluteUrl("PDF.do/create.json.do");
											}else if(type == "PNG"){
												this.capabilities.printURL = this.getAbsoluteUrl("PNG.do/print.pdf.do");
												this.capabilities.createURL = this.getAbsoluteUrl("PNG.do/create.json.do");
											}
										}
									}
								});

						printProvider.customParams.outputFormat = type;
						printProvider.customParams.url_icon = 'images/pdf/logo.png';
						printProvider.customParams.rotation = 0;

						var printPage = new GeoExt.data.PrintPage({
							printProvider : printProvider
						});
						var action = new GeoExt.Action(
								{
									tooltip : String
											.format(
													this.printText,
													printProvider.customParams.outputFormat),
									iconCls : 'Print' + type,
									handler : function() {
										var printDialog = new Ext.Window(
												{
													id : 'printWindowID',
													title : 'Print ' + type,
													autoHeight : false,
													width : 150,
													height : 100,
													resizable : false,
													items : [
															{
																xtype : 'textfield',
																name : 'title',
																value : 'Titulo',
																plugins : new GeoExt.plugins.PrintProviderField(
																		{
																			printProvider : printProvider
																		})
															},
															{
																xtype : "tbbutton",
																text : "Print "
																		+ printProvider.customParams.outputFormat,
																handler : function() {
																	printProvider
																			.print(
																					mapPanel,
																					printPage);
																	Ext
																			.getCmp(
																					'printWindowID')
																			.close();
																}
															} ]
												});
										printPage.fit(this.map);
										printDialog.show();
									}
								});
						actions["print_" + type] = action;
						// alert("dame --> "+ type);
						this.toolbarNav.push(action);
					}
				});