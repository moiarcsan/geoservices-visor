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

						// TODO: #48206
						action = new GeoExt.Action(
								{
									control : new OpenLayers.Control.ZoomToMunicipioComarca(),
									iconCls : "ZoomToMunicipio",
									map : this.map,
									url: OpenLayers.ProxyHost + Sicecat.defaultWMSServer.replace("ows/wms?", "ows/wfs"),
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
							iconCls : "ToolTipControl",
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
								hover : false,
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
							closeAction : 'hide',
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
								hover : false,
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
						var openlsUrl = OpenLayers.ProxyHost + Sicecat.defaultWMSServer.replace("ows/wms?", "openls");
						
						// Combobox buscador
						/*this.toolbarNav.push(new SiceCAT.widgets.MultiSearchCombo({
							map: this.map,
							openlsUrl: openlsUrl,
							enableKeyEvents: true,
							listeners: {
								keydown: function(comboBox, e){
						        	if (e.getCharCode() == e.ENTER 
						        			&& comboBox.getValue() != null 
						        			&& comboBox.getValue() != "") {
						        		comboBox.keyEnterOnCombo = true;
						                comboBox.doQuery(comboBox.getValue());
						            }else{
						            	comboBox.keyEnterOnCombo = false;
						            }
						        }
							}
						}));*/
						
						var finish_load = 0;
						var id_field = null;
						var context_this = this;
						var num_results = [];
						var searcher_mask = new Ext.LoadMask(Ext.getBody());
						var data = "<XLS xsi:schemaLocation=\"http://www.opengis.net/xls ...\" " +
						"version=\"1.2.0\" xmlns=\"http://www.opengis.net/xls\" " +
						"xmlns:gml=\"http://www.opengis.net/gml\" " +
						"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
						"<Request methodName=\"Geocode\" requestID=\"123\" version=\"1.2.0\" maximumResponses=\"10\"> " +
						"<GeocodeRequest> " +
						"<Address countryCode=\"ES\"> " +
						"<FreeFormAddress>{0}</FreeFormAddress>" +
						"</Address>" +
						"</GeocodeRequest>" +
						"</Request>" +
						"</XLS>";
						var titlesForLayer = {
						    	"pap":"Centres de l'administració pública","pas":"Centres d'assistència social",
						    	"pb":"Centres de negoci","pe":"Centres educatius","pl":"Centres de lleure",
						    	"pm":"Centres de transport i mobilitat","psa":"Centres de salut",
						    	"pse":"Centres de seguretat","t":"Toponímia (nomenclàtor)",
						    	"ra":"Anotacions poligonals","rl":"Anotacions lineals","rp":"Anotacions puntuals",
						    	"a":"AVAS (Base dels avions de vigilància i atac).","ab":"Àrees Bàsiques policials.",
						    	"ae":"Activitats extractives.","ap":"Inuncat: Punts d'actuació prioritària.",
						    	"aps":"Punts d'actuació prioritària","b":"Guaites.","c":"Heliports.",
						    	"c112":"Centres del servei 112.","ca":"Xarxa de camins","cd":"Inuncat: Cons de dejecció",
						    	"co":"Alçada edificis","d":"Hidrants","db":"Districtes de Barcelona.","e":"Punts d'aigua.",
						    	"ef":"Estacions de ferrocarril.","ei":"Establiments industrials (SIPAE)",
						    	"en":"Espais Naturals de Protecció Especial.","f":"Parcs de bombers",
						    	"fo":"Àrees forestals públiques","g":"Xarxa RESCAT (Torres de comunicació)",
						    	"h":"Capitals de municipi","i":"Límits municipals","ir":"Zones inundables presa Rialb",
						    	"k":"Límits comarcals.","lf":"Línies de ferrocarril.","np":"Nuclis de població",
						    	"nv":"Nodes del graf","p":"Límits provincials","pi":"Inuncat_Zones potencialment inundables.",
						    	"plo":"Municipis amb Policia Local.","pn":"Risc incendi forestal. Perill.",
						    	"po":"Última posició dels efectius RESCAT","rpo":"Mapa de les Regions Policials.",
						    	"s1":"Malla SOC 1km","s5":"Malla SOC de 5 km","sc":"Inuncat: Sirenes preses cobertura.",
						    	"soc":"Malla SOC 1 km","sp":"Situació de la sirena de les preses.","sv":"Segments del graf",
						    	"svm":"Segments del graf","tf":"Túnels de ferrocarril","tt":"Inuncat: Temps de trànsit",
						    	"vu":"Infocat: Mapa de vulnerabilitat d'incendis","x":"Eixos carretera (DGC)",
						    	"y":"Punts quilomètrics (DGC)","z":"Tallafocs","z1":"Inuncat. Zones inundables T50",
						    	"z3":"Zones inundables T500.","zt":"Inuncat: Zones inundables T100"
						    };
						var entitatsForNamespace = {
					    	"s":["a","ab","ae","ap","aps","b","c","c112","ca","cd","co",
					    	     "d","db","e","ef","ei","en","f","fo","g","h","i","ir",
					    	     "k","lf","np","nv","p","pi","plo","pn","po","rpo","s1",
					    	     "s5","sc","soc","sp","sv","svm","tf","tt","vu","x","y",
					    	     "z","z1","z3","zt"],
					    	"p":["pap","pas","pb","pe","pl","pm","psa","pse","t"],
					    	"r":["ra","rl","rp"]
					    };
						
						var getNamespace = function(entitat){
					    	for(var index in entitatsForNamespace){
					    		for(var i = 0; i <entitatsForNamespace[index].length; i++){
					    			if(entitatsForNamespace[index][i] == entitat){
					    				return index;
					    			}
					    		}
					    	}
					    };
					    
						var searcher_win_new = new Ext.Window({
					        height: 180,
					        width: 400,
					        modal: false,
					        plain: true,
					        frame: false,
					        shadow: false,
					        border: false,
					        layout: 'accordion',
					        layoutConfig: {
					            // layout-specific configs go here
					            titleCollapse: true,
					            animate: true,
					            collapseFirst: true
					        },
					        resizable: false,
					        draggable: false,
					        closable: false,
					        items: [{
					        	id: 'addressPanel',
					        	cls: 'addressPanelStyle',
					        	title: this.titleAddressPanel,
					        	autoScroll: true,
					        	width: '100%'
					        },{
					        	id: 'wayPanel',
					        	cls: 'wayPanelStyle',
					        	title: this.titleWayPanel,
					        	autoScroll: true,
					        	width: '100%'
					        },{
					        	id: 'generalPanel',
					        	cls: 'generalPanelStyle',
					        	title: this.titleGeneralPanel,
					        	autoScroll: true,
					        	width: '100%'
					        }]
						});
						
						Ext.getBody().on('click', function(e, t){
						    var el = searcher_win_new.getEl();
						    if (!!el && !(el.dom === t || el.contains(t))) {
						    	searcher_win_new.hide();
						    }
						});
						
						// Method to get the data formated
						var getJsonFromFeature = function(feature, type){
							var json = [];
							var data = null;
							var json_data = null;
							var place = null;
							var nom = null;
							var municipi = null;
							for(var i=0; i<feature.length; i++){
								var arrayPlace = [];
								data = feature[i].data;
								json_data = feature[i].json;
								// Diferenciamos entre los tipos de resultados
								if(type == 0){
									// Direcciones
									place = data.place;
									if(place != null && place.indexOf(",") != -1){
										arrayPlace = place.split(",");
										nom = arrayPlace[0];
										municipi = arrayPlace[1];
									}
									if(nom == null && data.text != null){
										nom = data.text;
									}
									if(nom == null && data.typePlace != null){
										nom = data.typePlace;
									}
									var cadena = "";
									if(nom != null){
										cadena+=nom;
									}
									if(municipi != null && nom != null){
										cadena+="<br/>" + municipi;
									}else if(municipi != null && nom == null){
										cadena+=municipi;
									}
									json.push([cadena, data.lon, data.lat, null, null, data]);
								}else if(type == 1){
									// Vía PK
									nom = json_data.nom;
									valor = json_data.valor;
									entitat = json_data.entitat;
									objectid = json_data.id;
									var layer = titlesForLayer[entitat];
									var cadena = "";
									if(nom != null){
										cadena+=nom;
										if(valor != null){
											cadena+=", km " + valor;
										}
									}
									if(layer != null && (nom != null || valor != null)){
										cadena+="<br/>" + layer;
									}else{
										cadena+=layer;
									}
									json.push([cadena, data.utmX, data.utmY, entitat, objectid, null]);
								}else if(type == 2){
									// General
									nom = json_data.nom;
									municipi = json_data.municipi;
									entitat = json_data.entitat;
									var layer = titlesForLayer[entitat];
									var cadena = "";
									if(nom != null){
										cadena+=nom;
									}
									if(layer != null){
										cadena+="<br/>" + layer;
									}
									if(municipi != null && layer != null){
										cadena+=", " + municipi;
									}else if(municipi != null && layer == null){
										cadena +="<br/>" + municipi;
									}
									json.push([cadena, data.utmX, data.utmY, null, null, data]);
								}
							}
							return json;
						};
						// Method to get the grid address panel
						var getGridPanel = function(feature, type){
							var colModel = new Ext.grid.ColumnModel([{
								dataIndex : 'text',
								width: 400
							}]);
							var data_store = new Ext.data.SimpleStore({
						        fields: [{
						        	name: 'text'
						        },{
						        	lon: 'text'
						        },{
						        	lat: 'text'
						        },{
						        	entitat: 'text'
						        },{
						        	objectid: 'text'
						        }]
							});
							
							var json = getJsonFromFeature(feature, type);
							data_store.loadData(json);
							
							var gridView = new Ext.grid.GridView({
								forceFit : true,
							});
							
							var grid = new Ext.grid.GridPanel({
								autoHeight : true,
								hideHeaders: true,
								border: false,
								store : data_store,
								colModel : colModel,
								view : gridView,
								listeners: {
									'cellclick': function(grid, rowIndex, columnIndex, e){
										var record = grid.getStore().getAt(rowIndex);
										var text = record.json[0];
										if(text.indexOf("<br/>") != -1){
											text = text.replace("<br/>", ", ");
										}
										var lon = record.json[1];
										var lat = record.json[2];
										var entitat = record.json[3];
										var objectid = record.json[4];
										var data = record.json[5];
										var searchbar = Ext.getCmp('searchbar');
										searchbar.setValue(text);
										// Create the result layer
										var layer = new OpenLayers.Layer.Vector(text, {
											strategies : [new OpenLayers.Strategy.Save()],
											styleMap : Sicecat.createStyleMap()
										});
										// Add layer to map
										map.addLayer(layer);
										var position = new OpenLayers.LonLat(lon, lat);
										if(lon != null && lat != null && lon != "" && lat != ""){
											position.transform(
													new OpenLayers.Projection("EPSG:23031"),
													map.getProjectionObject()
											);
											var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(position.lon, position.lat));
											if(data != null ){
												feature.data = data;
											}
											feature.style = integrator.cloneObject(Sicecat.styles['resultatCerca']);
											layer.removeAllFeatures();
											layer.addFeatures(feature);
											// zoom in the location
											map.setCenter(position, 8);
										}else if(entitat != null){
											Sicecat.search_tool_origin = true;
										    var panel = new SiceCAT.ZoomToResultPanel({
										    	closest: false,
										    	sicecatInstance: Sicecat,
										    	map: Sicecat.map
										    });
										    panel.getZoomToResult(getNamespace(entitat) + ":" + entitat, "OBJECTID", objectid, text);
										}else{
											Ext.MessageBox.show({
												title : context_this.titleWarningPanel,
												msg : context_this.msgWarningPanel,
												width : 300,
												icon : Ext.Msg.INFO,
												buttons : Ext.Msg.OK
											});
										}
										// close the window
										searcher_win_new.hide();
									}
								}
							});
							
							return grid;
						};
						
						var finishLoad = function(){
							searcher_win_new.show();
				            searcher_win_new.alignTo(id_field, "tl-bl");
				            var layout = null;
				            for(var i=0; i<num_results.length; i++){
				            	if(num_results[i].records != 0){
				            		layout = searcher_win_new.getLayout();
				            		layout.setActiveItem(num_results[i].panel);
				            		break;
				            	}else{
				            		if(!Ext.getCmp(num_results[i].panel).collapsed){
				            			Ext.getCmp(num_results[i].panel).collapse();
				            		}
				            	}
				            }
				            num_results = [];
				            searcher_mask.hide();
						};
						
						var loadOpenLS = function(store, records, options){
							// Set the title with the records size
							var titletoset = "";
							var exception = false;
							if(options != null && options.type != null && options.type == "exception"){
								exception = true;
								titletoset = String.format(context_this.titleAddressPanel, context_this.msgErrorServer);
							}else{
								titletoset = String.format(context_this.titleAddressPanel, records.length + " " + context_this.msgResults);
							}
							var addressPanel = Ext.getCmp('addressPanel');
							addressPanel.setTitle(titletoset);
							if(records.length == 0 || exception){
								addressPanel.setDisabled(true);
								num_results[0] = {panel: 'addressPanel', records: 0};
							}else{
								addressPanel.setDisabled(false);
								num_results[0] = {panel: 'addressPanel', records: records.length};
							}
							// Set the content panel with the grid result
							var gridAddressPanel = getGridPanel(records, 0);
							addressPanel.removeAll();
							addressPanel.add(gridAddressPanel);
							finish_load--;
							if(finish_load == 0){
								finishLoad();
							}
						};
						
						var submitOpenLS = function(query){
							var openls_data = String.format(data, query);
							var store_rg = new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url: 'proxy.do?url=http://sigescat.pise.interior.intranet/openls',
									method: 'POST',
									xmlData: openls_data
								}),
								fields : [
								    {name: "lon", type: "number"},
								    {name: "lat", type: "number"},
								    "text"
								],
								listeners:{
									load: loadOpenLS,
									exception: function(e, records, options){
										loadOpenLS(null, [], {type: 'exception'});
									},
									scope: this
								},
								reader: new SiceCAT.data.OpenLS_XLSReader()
							});
							store_rg.load();
							searcher_mask.show();
						};
						
						var roadResponseSize = null;
						var solrResponseSize = null;
						var loadCercaGeneral = function(store, records, options){
							// Set the Via PK title panel
							var titletosetway = "";
							var exceptionWay = false;
							if(options != null && options.type != null && options.type == "exception"){
								exceptionWay = true;
								titletosetway = String.format(context_this.titleWayPanel, context_this.msgErrorServer);
							}else{
								titletosetway = String.format(context_this.titleWayPanel, roadResponseSize + " " + context_this.msgResults);
							}
							var wayPanel = Ext.getCmp('wayPanel');
							wayPanel.setTitle(titletosetway);
							if(roadResponseSize == 0 || exceptionWay){
								wayPanel.setDisabled(true);
								num_results[1] = {panel: 'wayPanel', records: 0};
							}else{
								wayPanel.setDisabled(false);
								num_results[1] = {panel: 'wayPanel', records: roadResponseSize};
							}
							// Set the content panel with the grid result
							var featureWay = records.slice(0, roadResponseSize);
							var gridWayPanel = getGridPanel(featureWay, 1);
							wayPanel.removeAll();
							wayPanel.add(gridWayPanel);
							// Set the General title panel
							var titletosetgeneral = "";
							var exceptionGeneral = false;
							if(options != null && options.type != null && options.type == "exception"){
								exceptionGeneral = true;
								titletosetgeneral = String.format(context_this.titleGeneralPanel, context_this.msgErrorServer);
							}else{
								titletosetgeneral = String.format(context_this.titleGeneralPanel, solrResponseSize + " " + context_this.msgResults);
							}
							var generalPanel = Ext.getCmp('generalPanel');
							generalPanel.setTitle(titletosetgeneral);
							if(solrResponseSize == 0 || exceptionGeneral){
								generalPanel.setDisabled(true);
								num_results[2] = {panel: 'generalPanel', records: 0};
							}else{
								generalPanel.setDisabled(false);
								num_results[2] = {panel: 'generalPanel', records: solrResponseSize};
							}
							// Set the content panel with the grid result
							var featureGeneral = records.slice(roadResponseSize, solrResponseSize);
							var gridGeneralPanel = getGridPanel(featureGeneral, 2);
							generalPanel.removeAll();
							generalPanel.add(gridGeneralPanel);
							finish_load--;
							if(finish_load == 0){
								finishLoad();
							}
						};
						
						var submitCercaGeneral = function(query){
							var url_cerca = "rest/cercaGeneral/" + encodeURIComponent(query);
							var store_cg = new Ext.data.Store({
								proxy : new Ext.data.HttpProxy({
									url: url_cerca,
									method: 'POST'
								}),
								fields : [
								    {name: "lon", type: "number"},
								    {name: "lat", type: "number"},
								    "text"
								],
								listeners:{
									load: loadCercaGeneral,
									exception: function(e, records, options){
										loadCercaGeneral(null, [], {type: 'exception'});
									},
									scope: this
								},
								reader: new Ext.data.JsonReader({
						            idProperty: 'id',
						            root: function(o){
						            	var out = [];
						            	roadResponseSize = o.roadResponse.lst.length;
						            	solrResponseSize = o.solrResponse.lst.length;
						            	return out.concat(o.roadResponse.lst, o.solrResponse.lst);
						            },
						            totalProperty: "totalHits",
						            fields: [
						                {name: 'id', mapping: 'id'},
						                {name: 'entitat', mapping: 'entitat'},
						                {name: 'nom', mapping: 'nom'},
						                {name: 'municipi', mapping: 'municipi', 
						                	convert: function(v, record){
						        		        if(record.municipi == null ){
						        		        	return "";
						        		        }
						        		    }
						                },
						                {name: 'score', mapping: 'score',
						                	convert: function(v, record){
						        		        if(record.score == null ){
						        		        	return "";
						        		        }
						        		    }
						                },
						                {name: 'utmX', mapping: 'utmX'},
						                {name: 'utmY', mapping: 'utmY'}
						            ]
						        })
							});
							store_cg.load();
						};
						
						var submitOnEnter = function (field, event) {
					        if (event.getKey() == event.ENTER) {
					            var value = field.getValue();
					            submitOpenLS(value);
					            finish_load++;
					            submitCercaGeneral(value);
					            finish_load++;
					            id_field = field.getId();
					        }
					    };
						
						this.toolbarNav.push(new Ext.form.TextField({
							id: 'searchbar',
							emptyText: "Search...",
							width: 240,
							listeners: {
				                specialkey: submitOnEnter
				            }
						}));
						
						// Search WFS Action
						var layers;
						if (!!this.sicecatInstance.jsonSearchServices) {
							layers = new Array();
							var j = 0;
							for ( var i = 0; i < this.sicecatInstance.jsonSearchServices.length; i++) {
								if (this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs") {
									var url = OpenLayers.ProxyHost
											+ this.sicecatInstance.jsonSearchServices[i]["url"];
									layers[j++] = {
										title : this.sicecatInstance.jsonSearchServices[i]["title"],
										name : this.sicecatInstance.jsonSearchServices[i]["name"],
										namespace : this.sicecatInstance.jsonSearchServices[i]["namespace"],
										url : url,
										schema : OpenLayers.ProxyHost
												+ this.sicecatInstance.jsonSearchServices[i]["schema"],
										maxFeatures : this.sicecatInstance.jsonSearchServices[i]["maxFeatures"]
									};
								} else if (this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs_all"
										&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"]
										&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length
										&& this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length > 0) {
									var url = OpenLayers.ProxyHost
											+ this.sicecatInstance.jsonSearchServices[i]["url"];
									for ( var k = 0; k < this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length; k++) {
										var title;
										if (!!this.titlesForLayer[this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]]) {
											title = this.titlesForLayer[this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]];
										} else {
											title = this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k];
										}
										layers[j++] = {
											title : title,
											name : this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]
													.split(":")[1],
											namespace : this.sicecatInstance.jsonSearchServices[i]["namespace"],
											url : url,
											schema : OpenLayers.ProxyHost
													+ this.sicecatInstance.jsonSearchServices[i]["schema_base"]
													+ this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k],
											maxFeatures : this.sicecatInstance.jsonSearchServices[i]["maxFeatures"]
										};
									}
								} else if (this.sicecatInstance.jsonSearchServices[i]['type'] == "geocode") {
									var url;
									if (this.sicecatInstance.jsonSearchServices[i]["useProxy"]
											&& this.sicecatInstance.jsonSearchServices[i]["useProxy"] == "false") {
										url = this.sicecatInstance.jsonSearchServices[i]["url"];
									} else {
										url = OpenLayers.ProxyHost
												+ this.sicecatInstance.jsonSearchServices[i]["url"];
									}
									var name = this.sicecatInstance.jsonSearchServices[i]["name"];
									if (Sicecat.isLogEnable)
										console.log("Registred + " + url + " as direct geocode service in '" + name + "'");
								}
							}
						}
						
						// Get layers from getCapabilities
						var urlWMS = Sicecat.defaultWMSServer;
						var urlWFS = null;
						if(urlWMS.indexOf("wms") != -1){
							urlWFS = urlWMS.replace("wms", "wfs");
						}
						if(urlWFS.indexOf("?") != -1){
							urlWFS = urlWFS.replace("?", "");
						}
						Ext.Ajax.request({
							url: OpenLayers.ProxyHost + urlWFS,
							method: 'GET',
						    params: {
						    	SERVICE: 'WFS',
						    	VERSION: '1.1.0',
						    	REQUEST: 'GetCapabilities'
						    },
						    success: function(response, options){
						    	var wfsReader = new OpenLayers.Format.WFSCapabilities.v1_1_0();
						    	var objectCapabilities = null;
						    	if(response != null && response.responseText != null){
						    		objectCapabilities = wfsReader.read(response.responseText);
						    	}
						    	var featureTypes = objectCapabilities.featureTypeList.featureTypes;
						    	var queryPanel = Ext.getCmp("queryPanel");
						    	queryPanel.layerStore.removeAll();
						    	var featuresToLoad = [];
						    	for(var i=0; i<featureTypes.length; i++){
						    		var featureToLoad = {};
						    		featureToLoad.maxFeatures = 200;
						    		featureToLoad.name = featureTypes[i].name;
						    		featureToLoad.namespace = featureTypes[i].featureNS;
						    		featureToLoad.schema = options.url + "?version=" 
						    								+ options.params.VERSION 
						    								+ "&request=DescribeFeatureType&typeName=" 
						    								+ featureTypes[i].nameComplete;
						    		var abstractTitle = featureTypes[i].abstract;
						    		if(abstractTitle != null && abstractTitle != ""){
						    			featureToLoad.title = abstractTitle;
						    		}else{
						    			featureToLoad.title = String.format(queryPanel.emptyNameLayerText, featureTypes[i].nameComplete); 
						    		}
						    		featureToLoad.url = options.url;
						    		featuresToLoad.push(featureToLoad);
						    	}
						    	var data = {
						    		layers: featuresToLoad
						    	};
						    	queryPanel.layerStore.loadData(data, false);
						    }
						});
						var action_wfs = this.getSearchWFSAction(layers);
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
					getSearchWFSAction : function(layers) {
						var searchWFSDefaultStateText = this.searchWFSDefaultStateText;
						var searchWFSNotFoundStateText = this.searchWFSNotFoundStateText;
						var searchWFSFoundsStateText = this.searchWFSFoundsStateText;
						var errorText = this.errorWFSText;
						var errorWFSDetailsTitleText = this.errorWFSDetailsTitleText;

						var statusBar = new Ext.ux.StatusBar({
							defaultText : searchWFSDefaultStateText,
							width : 365,
							height : 50
						});

						var sicecatInstance = this.sicecatInstance;

						var this_ = this;
						Ext.QuickTips.init();
						var panel = new SiceCAT.QueryPanel(
								{
									id: "queryPanel",
									width : 365,
									height : 350,
									map : map,
									maxFeatures : 200,
									layerStore : new Ext.data.JsonStore({
										data : {
											layers : layers
										},
										root : "layers",
										fields : [ "title", "name",
												"namespace", "url", "schema" ],
										sortInfo: {
											field: 'title',
											direction: 'ASC'
										}
									}),
									listeners : {
										storeload : function(panel, store) {
											if(store.getTotalCount() > 0){
												var axiliaryLayerWFS = AuxiliaryLayer.getLayer(sicecatInstance.nombreCapaResultadoText);
												axiliaryLayerWFS.events.on({
													"featuresadded": function(obj, el){
														// Comprobamos que el control no este activo
														if(actions["select"].control.active != null && actions["select"].control.active){
															actions["select"].control.deactivate();
															actions["select"].control.activate();
														}
														if(actions["selectBox"].control.active != null && actions["selectBox"].control.active){
															actions["selectBox"].control.deactivate();
															actions["selectBox"].control.activate();
														}
														if(actions["pointRadiusSelection"].control.active != null && actions["pointRadiusSelection"].control.active){
															actions["pointRadiusSelection"].control.deactivate();
															actions["pointRadiusSelection"].control.activate();
														}
													}
												});
												if(Sicecat.parentNode){
													Sicecat.parentNode.expand();
												}
												// Nos quedamos con el control activo
												var active_control = null;
												if(actions["select"].control.active){
													active_control = actions["select"].control;
												}else if(actions["selectBox"].control.active){
													active_control = actions["selectBox"].control;
												}else if(actions["pointRadiusSelection"].control.active){
													active_control = actions["pointRadiusSelection"].control;
												}
												// Antes de destruir las features hay que deseleccionarlas
												if(axiliaryLayerWFS.selectedFeatures.length > 0){
													for(var i=0; i<axiliaryLayerWFS.selectedFeatures.length; i++){
														active_control.unselect(axiliaryLayerWFS.selectedFeatures[i]);
													}
												}
												axiliaryLayerWFS.destroyFeatures();
												var features = [];
												var founds = 0;
												store.each(function(record) {
													features.push(record.get("feature"));
													founds++;
												});
												statusBar.setText(String.format(
														searchWFSFoundsStateText,
														founds,
														sicecatInstance.nombreCapaResultadoText));
												axiliaryLayerWFS.addFeatures(features);
											}else{
												statusBar.setText(searchWFSNotFoundStateText);
											}
										},
										loadexception : function(e, e2, e3) {
											if (!!e.queryTypeSiceCAT) {
												statusBar.setText(errorText);
												var msgText = String
														.format(
																this_.errorDescribeFeatureNotFound,
																e.url
																		.replace(
																				"proxy.do?url=",
																				""),
																e.queryTypeSiceCAT
																		.substring(e.queryTypeSiceCAT
																				.indexOf("=") + 1));
												console.log(msgText);
												if (!!Ext
														.get('error_msg_wfs_detail'))
													Ext
															.get(
																	'error_msg_wfs_detail')
															.on(
																	'click',
																	function(e) {
																		Ext.MessageBox
																				.show({
																					title : errorWFSDetailsTitleText,
																					msg : msgText,
																					width : 300,
																					icon : Ext.Msg.INFO,
																					buttons : Ext.Msg.OK
																				});
																	});
												// statusBar.setText(String.format(errorText,
												// String.format(this_.errorDescribeFeatureNotFound,
												// e.url,
												// e.queryTypeSiceCAT.substring(e.queryTypeSiceCAT.indexOf("=")+1))));
											} else if (!!e2
													&& !!e2.response
													&& !!e2.response.priv
													&& !!e2.response.priv.responseText) {
												var text = e2.response.priv.responseText;
												statusBar.setText(errorText);
												if (!!Ext
														.get('error_msg_wfs_detail'))
													Ext
															.get(
																	'error_msg_wfs_detail')
															.on(
																	'click',
																	function(e) {
																		Ext.MessageBox
																				.show({
																					title : errorWFSDetailsTitleText,
																					msg : text,
																					width : 300,
																					icon : Ext.Msg.INFO,
																					buttons : Ext.Msg.OK
																				});
																	});
											} else if (!!e2
													&& !!e2.response
													&& !!e2.response.priv
													&& !!e2.response.priv.responseXML) {
												var text = e2.response.priv.responseXML;
												statusBar.setText(errorText);
												if (!!Ext
														.get('error_msg_wfs_detail'))
													Ext
															.get(
																	'error_msg_wfs_detail')
															.on(
																	'click',
																	function(e) {
																		Ext.MessageBox
																				.show({
																					title : errorWFSDetailsTitleText,
																					msg : text,
																					width : 300,
																					icon : Ext.Msg.INFO,
																					buttons : Ext.Msg.OK
																				});
																	});
											} else {
												statusBar.setText(String
														.format(errorText));
												if (!!Ext
														.get('error_msg_wfs_detail')) {
													Ext
															.get(
																	'error_msg_wfs_detail')
															.on(
																	'click',
																	function(e) {
																		Ext.MessageBox
																				.show({
																					title : errorWFSDetailsTitleText,
																					msg : 'Error en la consulta',
																					width : 300,
																					icon : Ext.Msg.INFO,
																					buttons : Ext.Msg.OK
																				});
																	});
												}
											}
										},
										beforequery : function() {
											statusBar.showBusy();
										}
									}
								});

						var button = new Ext.Button({
							text : this.queryText,
							handler : function() {
								panel.query();
							}
						});

						panel.addButton(button);

						var sicecatInstance = this.sicecatInstance;

						Sicecat.wfsSearcherWindow = null;
						var searcherTitleText = this.searcherTitleText;
						if (!Sicecat.wfsSearcherWindow) {
							Sicecat.wfsSearcherWindow = new Ext.Window({
								title : searcherTitleText,
								shadow : false,
								width : 380,
								plain : true,
								closeAction : "hide",
								items : [ panel, statusBar ],
								listeners : {
									beforehide : function() {
										statusBar.clearStatus({
											useDefaults : true
										});
									}
								}
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