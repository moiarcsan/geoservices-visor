/*
 * West.js
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
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 * Author: María Arias de Reyna Domínguez (mailto:marias@emergya.com)
 * Author: Moisés Arcos Santiago (mailto:marcos@emergya.com)
 * 
 */

/**
 * @requires OpenLayers.js
 * @requires ext-all.js
 * @requires SiceCAT.js
 */

/**
 * Class: SiceCAT.West
 * 
 * West layout container
 * 
 * Inherits from: - <Ext.Component>
 */
SiceCAT.West = Ext
		.extend(
				Ext.Component,
				{

					/**
					 * Property: leftSide {Ext.Panel} with leftSide of map
					 */
					leftSide : null,

					/**
					 * Property: polygon styling window {Ext.Window} with
					 * styling window
					 */
					polyWin : null,

					/**
					 * * Property: lineWin styling window {Ext.Window} with
					 * styling window
					 */
					lineWin : null,

					/**
					 * Property: pointWin styling window {Ext.Window} with
					 * styling window
					 */
					pointWin : null,

					/**
					 * routing: sicecatInstance {Array} with routing buttons
					 */
					routing : null,

					/**
					 * Property: localizator {Array} with localizator buttons
					 */
					localizator : null,

					/**
					 * exporter: exporter {Array} with exporter buttons
					 */
					exporter : null,

					/**
					 * Property: tree {Ext.tree.TreePanel} layer tree
					 */
					tree : null,

					/**
					 * Property: sicecatInstance {SiceCAT} instance of sicecat
					 * viewer
					 */
					sicecatInstance : null,
					
					/**
					 * Property: drawPolygonTooltipText {String} Default text to
					 * be show
					 */
					drawPolygonTooltipText : "draw polygon",
					
					/**
					 * Property: drawLineTooltipText {String} Default text to be
					 * show
					 */
					drawLineTooltipText : "draw line",
					
					/**
					 * Property: drawPointTooltipText {String} Default text to
					 * be show
					 */
					drawPointTooltipText : "draw point",
					
					/**
					 * Property: deleteTooltipText {String} Default text to be
					 * show
					 */
					deleteTooltipText : "delete feature",
					
					/**
					 * Property: editTooltipText {String} Default text to be
					 * show
					 */
					editTooltipText : "edit feature",
					
					/**
					 * Property: editAttributesTooltipText {String} Default text
					 * to be show
					 */
					editAttributesTooltipText : "edit attributes",
					
					/**
					 * Property: dragFeatureTooltipText {String} Default text
					 * to be show
					 */
					dragFeatureTooltipText : "Drags feature",

					/** i18n **/
					importExportButtonText : "Import",
					searchButtonText : "Locator/Finder",
					routingBottonText : "Routes",
					editionButtonText: "Edition",
					layersText : "Layers",
					stylingButtonText : "Edit Style",
					legendButtonText : "Legend",
					routeText : "Calculate Route",
					searchButtonOneText : "DG",
					searchButtonOneTitleText : "Direct gecode search",
					queryText : "Ask",
					errorTraceText: "Trace: {0}",
					errorDescribeFeatureNotFound: "Failed to access the <a href={0}>{1} entity  scheme</ a>",
					fromPath: "From",
					toPath: "To",
					typeSPath: "Shortest",
					typeQPath: "Quickest",
					turnsPath: "Obey turns",
					calculatePath: "Calculate",
					removePath: "Clean",
					titleRoutingGrid: "Route",
					nameStreet: "Street name",
					timePath: "Time",
					distancePath: "Distance",
					titleError: "Error",
					msgError: "It's not possible find a path",
					infoPath: "Information",
					warningEditMsgTitle: "Warning",
					warningEditMsg: "The layer tries to edit is not visible",
					errorEditMsgTitle: "Error",
					errorEditMsg: "The layer tries to edit is not enabled. Consult with your administrator",
					errorDeleteMsg: "There are not any edit layer enabled. Consult with your administrator",

					/**
					 * Method: init_left_panel
					 * 
					 * Load this.leftSide
					 */
					init_left_panel : function() {
						this.exporter = [];
						this.localizator = [];
						this.routing = [];
						this.edition = [];

						this.init_layers_tree_2();
						this.init_toolbarRouting();
						
						var buttonsLocalizator = new Ext.Panel({
							frame : false,
							title : this.searchButtonText,
							autoHeight : true,
							border : false,
							tbar : this.localizator
						});
						var buttonsEdition = null;
						if(Global_TMP.permisos.indexOf("admin1") > -1){
							// Not load toolbar edition
						}else{
							this.init_toolbarEdition();
							buttonsEdition = new Ext.Panel({
								id : 'edition',
								frame : false,
								autoscroll : true,
								title : this.editionButtonText,
								border : false,
								tbar : this.edition
							});
						}

						var buttonsRouting = new Ext.Panel({
							id : 'routing',
							frame : false,
							autoscroll : true,
							title : this.routingBottonText,
							// autoHeight : true,
							border : false,
							items : this.routing
						});

						var legend = new GeoExt.LegendPanel({
							title : this.legendButtonText,
							map : this.map,
							dynamic : true
						});

						if(buttonsEdition != null){
							this.leftSide = {
									/*
									 * Panel tipo accordion
									 */
									id : 'accordionWest',
									region : 'west',
									xtype : 'panel',
									layout : 'accordion',
									border : true,
									split : true,
									collapsible : true,
									collapseMode : "mini",
									// autoScroll : true,
									width : 200,
									layoutConfig : {
										titleCollapse : false,
										animate : false,
										activeOnTop : false
									},
									items : [
									// �rbol de capas (Capas)
									this.tree,
									// Leyenda (Leyenda)
									legend,
									// Edici�n de capas (Edici�n)
									buttonsEdition,
									// Creaci�n de rutas (Ruta)
									buttonsRouting]
									// Buscador
									//buttonsLocalizator]
								};
						}else{
							this.leftSide = {
									/*
									 * Panel tipo accordion
									 */
									id : 'accordionWest',
									region : 'west',
									xtype : 'panel',
									layout : 'accordion',
									border : true,
									split : true,
									collapsible : true,
									collapseMode : "mini",
									// autoScroll : true,
									width : 200,
									layoutConfig : {
										titleCollapse : false,
										animate : false,
										activeOnTop : false
									},
									items : [
									// �rbol de capas (Capas)
									this.tree,
									// Leyenda (Leyenda)
									legend,
									// Creaci�n de rutas (Ruta)
									buttonsRouting]
									// Buscador
									//buttonsLocalizator]
								};
						}
					},

					/**
					 * Method: init_toolbarRouting
					 * 
					 * Load this.routing
					 */
					init_toolbarRouting : function() {
						var control = this;
						var routingForm = new Ext.FormPanel(
								{
									id : 'formPanelRouting',
									// width : 195,
									frame : false,
									border : false,
									labelWidth : 50,
									style : {
										"margin-left" : '5px',
										"margin-right" : '5px'
									},
									items : [ {
										fieldLabel : this.fromPath,
										id : 'fromRoute',
										xtype : 'textfield',
										name : 'source_route',
										allowBlank : false,
										readOnly : true,
										width : 135
									}, {
										fieldLabel : this.toPath,
										id : 'toRoute',
										xtype : 'textfield',
										name : 'destination_route',
										allowBlank : false,
										readOnly : true,
										width : 135
									}, {
										xtype : 'radiogroup',
										hideLabel : true,
										vertical : false,
										items : [ {
											id : 'shortestType',
											checked : true,
											boxLabel : this.typeSPath,
											name : 'routeType'
										}, {
											id : 'quickestType',
											boxLabel : this.typeQPath,
											name : 'routeType'
										} ]
									}, {
										id : 'turns',
										fieldLabel : this.turnsPath,
										xtype : 'checkbox',
										name : 'turn_route',
										checked : true,
										style : {
											"margin-left" : '50px'
										}
									} ],
									buttons : [
											{
												text : this.calculatePath,
												xtype : "button",
												hideLabel : true,
												width : 60,
												style : {
													"margin-left" : "0px"
												},
												handler : function() {
													// Comprobamos que los
													// campos obligatorios no
													// estén vacíos
													var srcValue = Ext.getCmp("fromRoute").getValue();
													var targetValue = Ext.getCmp("toRoute").getValue();
													var shortestValue = Ext.getCmp("shortestType").getValue();
													var quickestValue = Ext.getCmp("quickestType").getValue();
													var turnsValue = Ext.getCmp("turns").getValue();
													if (srcValue != null
															&& targetValue != null) {
														var type = null;
														if (shortestValue) {
															type = "DISTANCE";
														} else if (quickestValue) {
															type = "TIME";
														}
														var formatSoap = new OpenLayers.Format.XMLSOAP();
														// Parámetros que se
														// envian en la petición
														var paramInput = {
															srsName : map.projection,
															startPoint : srcValue,
															targetPoint : targetValue,
															toPrioritize : type,
															useDefinedTurns : turnsValue
														};
														var inputData = formatSoap.write(paramInput);
														var url = Sicecat.defaultWMSServer.replace("ows/wms?", "mrk");
														// Método que se lanza
														// cuando la consulta al
														// servicio no tiene
														// éxito
														var requestFailure = function(response) {
															Ext.Msg.alert(control.titleError, control.msgError);
														};

														// Método que se lanza
														// cuando la petición al
														// servicio tiene éxito
														var requestSuccess = function(response) {
															var format = new OpenLayers.Format.XMLSOAP();
															var output = format.read(response.responseText);
															var info = null;
															var infoTime = null;
															var infoDistance = null;
															var grid = null;
															var store = null;
															var path = null;
															var seg = null;
															var min = null;
															var time = null;
															var routingData = [];
															var arrayEdge = [];
															var edge = [];
															var routingGeom = [];
															if (output.path) {
																// Añadir la
																// lista de
																// pasos al grid
																grid = Ext.getCmp("routingGrid");
																grid.setVisible(true);
																store = grid.store;
																path = output.path;
																for ( var i = 0; i < path.length; i++) {
																	// Procesar
																	// el tiempo
																	seg = path[i].time;
																	if (seg >= 60) {
																		min = Math.floor(seg / 60);
																		seg = seg % 60;
																		seg = Math.round(seg);
																		time = min + "m " + seg + "s";
																	} else {
																		seg = Math.round(seg);
																		time = seg + "s";
																	}
																	// Redondear
																	// la
																	// distancia
																	// a dos
																	// decimales
																	distance = path[i].distance;
																	distance = (Math.round(distance * 100)/100) + "m";
																	routingData[i] = ["<b>" + path[i].name + "</b>",
																			time,
																			distance,
																			path[i].arrayEdge];
																	// Recuperamos
																	// cada una
																	// de las
																	// edge del
																	// camino
																	arrayEdge[i] = path[i].arrayEdge;
																	if (i == path.length - 1) {
																		infoTime = time;
																		infoDistance = distance;
																	}
																}
																store.loadData(routingData);
																// Dibujar la
																// geometría de
																// la respuesta
																for ( var i = 0; i < arrayEdge.length; i++) {
																	edge = arrayEdge[i];
																	for ( var j = 0; j < edge.length; j++) {
																		routingGeom.push(edge[j]);
																	}
																}
																// Añadir la
																// informacion
																// de tiempo y
																// distancia
																// total
																info = Ext
																		.getCmp("routingInfoPanel");
																info
																		.setVisible(true);
																var infoTimeLabel = Ext
																		.getCmp("timeLabel");
																var infoDistanceLabel = Ext
																		.getCmp("distanceLabel");
																infoTimeLabel.setText("<b>" + control.timePath + "</b>" + ": " + infoTime, false);
																infoDistanceLabel
																		.setText("</br><b>" + control.distancePath + "</b>" + ": " + infoDistance, false);
															} else {
																Ext.Msg.alert(control.titleError, control.msgError);
															}
															if (routingGeom.length != 0) {
																// Calculamos
																// los
																// parametros
																// necesarios
																// para hacer el
																// zoom a la
																// ruta
																routingGeom[0].geometry[0].calculateBounds();
																var bounds = routingGeom[0].geometry[0].getBounds();
																for ( var i = 1; i < routingGeom.length; i++) {
																	routingGeom[i].geometry[0].calculateBounds();
																	bounds.extend(routingGeom[i].geometry[0]
																					.getBounds());
																}
																// Creamos los
																// elementos
																// necesarios
																// para dibujar
																// la geometria
																var vectorLayerGeometry = null;
																var features = [];
																var vectorFeature = null;
																var style = null;
																// Nos creamos
																// la capa
																// contenedora
																// de la ruta
																if (map
																		.getLayersByName("Geometry Path").length > 0) {
																	map
																			.removeLayer(map
																					.getLayersByName("Geometry Path")[0]);
																}
																vectorLayerGeometry = new OpenLayers.Layer.Vector(
																		"Geometry Path",
																		{
																			'displayInLayerSwitcher' : false
																		});
																map
																		.addLayer(vectorLayerGeometry);
																for ( var i = 0; i < routingGeom.length; i++) {
																	// Para cada
																	// feature
																	// nos
																	// creamos
																	// un vector
																	// contenedor
																	style = {
																		strokeWidth : 5,
																		strokeColor : "#0000ff"
																	};
																	vectorFeature = new OpenLayers.Feature.Vector(
																			routingGeom[i].geometry[0],
																			{},
																			style);
																	features
																			.push(vectorFeature);
																}
																vectorLayerGeometry
																		.addFeatures(features);
																map
																		.zoomToExtent(
																				bounds,
																				false);
															}
														};
														// Petición de datos al
														// servicio
														OpenLayers.Request
																.POST({
																	url : Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, url),
																	scope : this,
																	headers : {
																		"Content-Type" : "text/xml;charset=UTF-8",
																		"SOAPAction" : "urn:findShortestPath"
																	},
																	failure : requestFailure,
																	success : requestSuccess,
																	data : inputData
																});
													}
												}
											},
											{
												// Botón de borrar
												text : this.removePath,
												hideLabel : true,
												width : 60,
												handler : function() {
													// 1) Reseteamos todos los
													// elementos del formulario
													Ext.getCmp("fromRoute")
															.reset();
													Ext.getCmp("toRoute")
															.reset();
													Ext.getCmp("shortestType")
															.reset();
													Ext.getCmp("quickestType")
															.reset();
													Ext.getCmp("turns").reset();
													// 2) Vaciamos el grid de
													// resultados y el panel de
													// informacion
													if (Ext
															.getCmp("routingGrid").store) {
														Ext
																.getCmp("routingGrid").store
																.removeAll();
														Ext.getCmp(
																"routingGrid")
																.setVisible(
																		false);
													}
													if (Ext
															.getCmp("routingInfoPanel")) {
														var info = Ext
																.getCmp("routingInfoPanel");
														info.setVisible(false);
													}
													// 3) Eliminamos las marcas
													// del mapa, la geometria y
													// el zoom
													if (map
															.getLayersByName("Mark Layer").length > 0) {
														map
																.removeLayer(map
																		.getLayersByName("Mark Layer")[0]);
													}
													if (map
															.getLayersByName("Geometry Path").length > 0) {
														map
																.removeLayer(map
																		.getLayersByName("Geometry Path")[0]);
													}
													if (map
															.getLayersByName("Point Layer").length > 0) {
														map
																.removeLayer(map
																		.getLayersByName("Point Layer")[0]);
													}
												}
											} ]
								});
						// Crear el data store
						var store = new Ext.data.ArrayStore({
							fields : [ {
								name : 'name',
								type : 'text'
							}, {
								name : 'time',
								type : 'text'
							}, {
								name : 'distance',
								type : 'text'
							}, {
								name : 'arrayEdge'
							} ]
						});
						// row expander
						var expander = new Ext.ux.grid.RowExpander({
							tpl : new Ext.Template(this.timePath
									+ ": {time} <br>" + this.distancePath
									+ ": {distance}"),
						});
						// Grid de resultados de la peticion
						var routingGrid = new Ext.grid.GridPanel(
								{
									id : "routingGrid",
									title : this.titleRoutingGrid,
									height : 175,
									// autoHeight: true,
									autoscroll : true,
									store : store,
									hidden : true,
									plugins : [ expander ],
									columns : [ expander, {
										header : this.nameStreet,
										dataIndex : "name",
										width : 155
									} ],
									listeners : {
										cellclick : function(grid, rowIndex,
												columnIndex, e) {
											if (map
													.getLayersByName("Point Layer").length > 0) {
												map
														.removeLayer(map
																.getLayersByName("Point Layer")[0]);
											}
											var arrayEdgeGeom = grid.store
													.getAt(rowIndex).data.arrayEdge;
											var point = null;
											var lonlat = null;
											if (arrayEdgeGeom.length > 0) {
												point = arrayEdgeGeom[0].geometry[0].components[0];
												lonlat = point.getBounds()
														.getCenterLonLat();
												map.setCenter(lonlat);
											}
											var layerPoint = new OpenLayers.Layer.Vector(
													"Point Layer",
													{
														'displayInLayerSwitcher' : false
													});
											var style = {
												pointRadius : 5,
												graphicName : "circle",
												fillColor : "white",
												strokeColor : "#0000ff",
												strokeWidth : 2,
												opacity : 0.9
											};
											var featureVectorPoint = new OpenLayers.Feature.Vector(
													point, {}, style);
											var featurePoint = [];
											map.addLayer(layerPoint);
											featurePoint
													.push(featureVectorPoint);
											layerPoint
													.addFeatures(featurePoint);
										}
									}
								});
						// Panel con información de la ruta completa (Tiempo
						// total y distancia total)
						var routingInfoPanel = new Ext.Panel({
							id : "routingInfoPanel",
							title : this.infoPath,
							hidden : true,
							// height : 40,
							// width: 195,
							items : [ {
								xtype : "label",
								id : "timeLabel"
							}, {
								xtype : "label",
								id : "distanceLabel"
							} ]
						});

						// Panel de routing
						var routingPanel = new Ext.Panel({
							// height: 400,
							// autoscroll: true,
							id : "routingPanel",
							autoHeight : true,
							items : [ routingForm, routingInfoPanel,
									routingGrid ]
						});
						this.routing.push(routingPanel);
					},

					/**
					 * Method: init_toolbarLocalizacion
					 * 
					 * Load this.localizator
					 */
					init_toolbarLocalizacion : function() {

						var layers;
						var geocodeServices;
						if (!!this.sicecatInstance.jsonSearchServices) {
							layers = new Array();
							geocodeServices = {};
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
										console
												.log("Registred + "
														+ url
														+ " as direct geocode service in '"
														+ name + "'");
									geocodeServices[name] = url;
								}
							}
						}

						action = this.getDirectGeocodeAction(geocodeServices);
						actions["search_1"] = action;
						this.localizator.push(action);
						this.exporter.push("-");

						action = this.getSearchWFSAction(layers);
						actions["search_2"] = action;
						this.localizator.push(action);
					},

					/**
					 * Init direct geocode searcher action for GeoExt
					 * 
					 * Parameters: geocodeServices - <Map<String,String>> with
					 * name key and service's url value
					 */
					getDirectGeocodeAction : function(geocodeServices) {
						var searcherTitleText = this.searcherTitleText;

						// TODO: Ping to geocodeServices["sigescat"] and load it
						// if responses
						var panelSearch = new SiceCAT.GeoSearch({
							map : map,
							geoNamesZoom : 8,
							sicecatInstance : this.sicecatInstance,
							geoNamesWidth : 775,
							geoNamesSearcherUrl : geocodeServices["sigescat"], // ||
							// geocodeServices["default"]
							restSearcherUrl : geocodeServices["restSearcher"]
						});
						var geocodeWin;
						var action = new GeoExt.Action({
							itemID : "SearchBox",
							// text : this.searchButtonOneText,
							control : new OpenLayers.Control(),
							map : map,
							iconCls : "SearchGeocode",
							// button options
							allowDepress : false,
							tooltip : this.searchButtonOneTitleText,
							// check item options
							group : "search",
							listeners : {
								click : function(renderer) {
									if (!geocodeWin) {
										geocodeWin = new Ext.Window({
											title : searcherTitleText,
											shadow : false,
											width : 800,
											plain : true,
											closeAction : "hide",
											onHide : function() {
												panelSearch.onHidePanels();
											},
											items : [ panelSearch ]
										});
									}
									geocodeWin.show();

									panelSearch.onShowPanels();
								}
							}
						});
						return action;
					},

					/**
					 * Method: init_toolbarEdition
					 * 
					 * Load this.edition
					 */
					init_toolbarEdition : function() {
						// Edit vector
						vector = new OpenLayers.Layer.Vector("vector", {
							strategies : [ new OpenLayers.Strategy.Save() ],
							displayInLayerSwitcher : false
						});
						// Select the points layer
						var pointLayerSicecat = null;
						var controlPointLayer = null;
						var lineLayerSicecat = null;
						var controlLineLayer = null;
						var polygonLayerSicecat = null;
						var controlPolygonLayer = null;
						var arrayEditLayers = [];
						for(l in map.layers){
							//Check if the layer is editable
							if(map.layers[l].protocol 
									&& map.layers[l].protocol.editable
									&& map.layers[l].protocol.inUse === "true"
									&& map.layers[l].protocol.geometry == "POINT"){
								pointLayerSicecat = map.layers[l];
								// Add layer to array to enable the delete feature control
								arrayEditLayers.push(pointLayerSicecat);
							}
							if(map.layers[l].protocol 
									&& map.layers[l].protocol.editable
									&& map.layers[l].protocol.inUse === "true"
									&& map.layers[l].protocol.geometry == "LINE"){
								lineLayerSicecat = map.layers[l];
								// Add layer to array to enable the delete feature control
								arrayEditLayers.push(lineLayerSicecat);
							}
							if(map.layers[l].protocol 
									&& map.layers[l].protocol.editable
									&& map.layers[l].protocol.inUse === "true"
									&& map.layers[l].protocol.geometry == "POLYGON"){
								polygonLayerSicecat = map.layers[l];
								// Add layer to array to enable the delete feature control
								arrayEditLayers.push(polygonLayerSicecat);
							}
						}
						
						// Polygon control draw
						if(polygonLayerSicecat != null){
							controlPolygonLayer = new OpenLayers.Control.DrawFeature(
									polygonLayerSicecat, OpenLayers.Handler.Polygon, {
										name : "DrawPolygon"
									});
						}
						
						var showMsg = function(scope, type){
							if(type == "warning"){
								Ext.Msg.show({
									title: scope.warningEditMsgTitle, 
									msg: scope.warningEditMsg,
									buttons: Ext.Msg.OK
								});
							}else if(type == "error"){
								Ext.Msg.show({
									title: scope.errorEditMsgTitle, 
									msg: scope.errorEditMsg,
									buttons: Ext.Msg.OK
								});
							}else if(type == "deleteFeatureError"){
								Ext.Msg.show({
									title: scope.errorEditMsgTitle, 
									msg: scope.errorDeleteMsg,
									buttons: Ext.Msg.OK
								});
							}
							
						};

						action = new GeoExt.Action({
							iconCls : "DrawPolygon",
							control : controlPolygonLayer,
							map : map,
							// button options
							toggleGroup : "draw",
							tooltip : this.drawPolygonTooltipText,
							// check item options
							group : "draw",
							scope: this,
							handler: function(){
								if(controlPolygonLayer.active){
									if(!!controlPolygonLayer.layer){
										if(!controlPolygonLayer.layer.visibility){
											showMsg(this, "warning");
											controlPolygonLayer.deactivate();
										}
									}else{
										showMsg(this, "error");
										controlPolygonLayer.deactivate();
									}
								}else{
								    actions["tooltipcontrol"].control.activate();
								}
							}
						});
						actions["draw_poly"] = action;
						this.edition.push(action);
						
						if(lineLayerSicecat != null){
							controlLineLayer = new OpenLayers.Control.DrawFeature(
									lineLayerSicecat, OpenLayers.Handler.Path, {
										name : "DrawLine"
									});
						}
						
						action = new GeoExt.Action({
							iconCls : "DrawLine",
							control : controlLineLayer,
							map : map,
							// button options
							toggleGroup : "draw",
							tooltip : this.drawLineTooltipText,
							// check item options
							group : "draw",
							scope: this,
							handler: function(){
								if(controlLineLayer.active){
									if(!!controlLineLayer.layer){
										if(!controlLineLayer.layer.visibility){
											showMsg(this, "warning");
											controlLineLayer.deactivate();
										}
									}else{
										showMsg(this, "error");
										controlLineLayer.deactivate();
									}
								}else{
								    actions["tooltipcontrol"].control.activate();
								}
							}
						});
						actions["draw_line"] = action;
						this.edition.push(action);
						
						if(pointLayerSicecat != null){
							controlPointLayer = new OpenLayers.Control.DrawFeature(
									pointLayerSicecat, 
									OpenLayers.Handler.Point, {
										name : "DrawPoint"
									});
						}

						action = new GeoExt.Action({
							iconCls : "DrawPoint",
							control : controlPointLayer,
							map : map,
							// button options
							toggleGroup : "draw",
							tooltip : this.drawPointTooltipText,
							// check item options
							group : "draw",
							scope: this,
							handler: function(){
								if(controlPointLayer.active){
									if(!!controlPointLayer.layer){
										if(!controlPointLayer.layer.visibility){
											showMsg(this, "warning");
											controlPointLayer.deactivate();
										}
									}else{
										showMsg(this, "error");
										controlPointLayer.deactivate();
									}
								}else{
								    actions["tooltipcontrol"].control.activate();
								}
							}
						});
						actions["draw_point"] = action;
						this.edition.push(action);

						// Sicecat.featuresDelete = [];
						var deleteFeatureControl = new OpenLayers.Control.SelectFeature(
								arrayEditLayers,
								{
									name : "OpenLayers.Control.DeleteFeature",
									type : OpenLayers.Control.TYPE_TOGGLE,
									hover : false,
									toggle : true,
									multiple : true,
									box: true,
									onSelect : function(feature) {
										// if feature doesn't have a
										// fid, destroy it
										if (feature.fid == undefined) {
											feature.layer
													.destroyFeatures([ feature ]);
										} else {
											feature.state = OpenLayers.State.DELETE;
											feature.layer.events
													.triggerEvent(
															"afterfeaturemodified",
															{
																feature : feature
															});
											feature.layer
													.drawFeature(feature);
										}
									}
								});
						action = new GeoExt.Action({
							iconCls : "DeleteFeature",
							control : deleteFeatureControl,
							map : map,
							toggleGroup : "draw",
							// button options
							enableToggle : true,
							tooltip : this.deleteTooltipText,
							scope: this,
							handler: function(){
								var result = false;
								if(!!deleteFeatureControl.layers && deleteFeatureControl.layers.length > 0){
									var num_layers = deleteFeatureControl.layers.length;
									for(var i = 0; i<num_layers; i++){
										result = result || deleteFeatureControl.layers[i].visibility;
									}
								}
								if(!!deleteFeatureControl.layers && deleteFeatureControl.layers.length == 0){
									// Si no hay capas editables
									showMsg(this, "deleteFeatureError");
									deleteFeatureControl.deactivate();
								}else if(!result){
									showMsg(this, "warning");
									deleteFeatureControl.deactivate();
								}else if(!deleteFeatureControl.active){
									actions["tooltipcontrol"].control.activate();
								}
							}
						});
						actions["delete_feature"] = action;
						
						var modifyFeatureControl = new SiceCAT.Control.ModifyFeatureControl(arrayEditLayers);

						this.edition.push(action);
						action = new GeoExt.Action({
							iconCls : "EditFeature",
							control : modifyFeatureControl,
							map : map,
							toggleGroup : "draw",
							// button options
							enableToggle : true,
							tooltip : this.editTooltipText,
							scope: this,
							handler: function(){
								var result = false;
								if(!!modifyFeatureControl.selectControl 
										&& !!modifyFeatureControl.selectControl.layers
										&& modifyFeatureControl.selectControl.layers.length > 0){
									var num_layers = modifyFeatureControl.selectControl.layers.length;
									for(var i = 0; i<num_layers; i++){
										result = result || modifyFeatureControl.selectControl.layers[i].visibility;
									}
								}
								if(!!modifyFeatureControl.selectControl
										&& !!modifyFeatureControl.selectControl.layers
										&& modifyFeatureControl.selectControl.layers.length == 0){
									// Si no hay capas editables
									showMsg(this, "deleteFeatureError");
									modifyFeatureControl.deactivate();
								}else if(!result){
									showMsg(this, "warning");
									modifyFeatureControl.deactivate();
								}else if(!modifyFeatureControl.active){
									actions["tooltipcontrol"].control.activate();
								}
							}
						});
						actions["edit_feature"] = action;
						this.edition.push(action);
						
						var editAtrControl = new OpenLayers.Control.EditFeatureAttributes(arrayEditLayers);

						action = new GeoExt.Action(
								{
									iconCls : "EditAttributes",
									control : editAtrControl,
									map : this.map,
									toggleGroup : "draw",
									// button options
									enableToggle : true,
									tooltip : this.editAttributesTooltipText,
									scope: this,
									handler: function(){
										var result = false;
										if(!!editAtrControl.layers && editAtrControl.layers.length > 0){
											var num_layers = editAtrControl.layers.length;
											for(var i = 0; i<num_layers; i++){
												result = result || editAtrControl.layers[i].visibility;
											}
										}
										if(!!editAtrControl.layers && editAtrControl.layers.length == 0){
											// Si no hay capas editables
											showMsg(this, "deleteFeatureError");
											editAtrControl.deactivate();
										}else if(!result){
											showMsg(this, "warning");
											editAtrControl.deactivate();
										}else if(!editAtrControl.active){
											actions["tooltipcontrol"].control.activate();
										}
									}
								});
						actions["edit_attributes"] = action;
						this.edition.push(action);

						var data = [];
						Ext.each(map.layers, function(item) {
							if (item.features != null)
								data.push(new Ext.data.Record({
									value : item.layer,
									text : item.name
								}));
						});
						
						var dragFeatureControl = new SiceCAT.Control.ModifyFeatureControl(arrayEditLayers,
								{
							mode: OpenLayers.Control.ModifyFeature.DRAG,
									'dragend' : {
										callback : function(
												feature, pixel) {
											if (feature.fid) {
												feature.state = OpenLayers.State.UPDATE;
											} else {
												feature.state = OpenLayers.State.INSERT;
											}
											if (feature.attributes["OBJECTID"]) {
												feature.attributes["OBJECTID"] = undefined;
											}
											feature.layer.events
													.triggerEvent(
															"afterfeaturemodified",
															{
																feature : feature
															});
											feature.layer
													.drawFeature(feature);
										},
										context : this
									}
								}); 

						action = new GeoExt.Action(
								{
									iconCls : "DragFeature",
									control : dragFeatureControl,
									map : this.map,
									title : "drag",
									// button options
									toggleGroup : "draw",
									enableToggle : true,
									tooltip : this.dragFeatureTooltipText,
									// check item options
									group : "draw",
									scope: this,
									handler: function(){
										var result = false;
										if(!!dragFeatureControl.selectControl 
												&& !!dragFeatureControl.selectControl.layers
												&& dragFeatureControl.selectControl.layers.length > 0){
											var num_layers = dragFeatureControl.selectControl.layers.length;
											for(var i = 0; i<num_layers; i++){
												result = result || dragFeatureControl.selectControl.layers[i].visibility;
											}
										}
										if(!!dragFeatureControl.selectControl
												&& !!dragFeatureControl.selectControl.layers
												&& dragFeatureControl.selectControl.layers.length == 0){
											// Si no hay capas editables
											showMsg(this, "deleteFeatureError");
											dragFeatureControl.deactivate();
										}else if(!result){
											showMsg(this, "warning");
											dragFeatureControl.deactivate();
										}else if(!dragFeatureControl.active){
											actions["tooltipcontrol"].control.activate();
										}
									}
								});
						actions["drag_feature"] = action;
						this.edition.push(action);

						// Dependiendo de los permisos
						if(Sicecat.permisos.readOnly){
							// Habilitamos
							actions.draw_point.setDisabled(true);
							actions.draw_line.setDisabled(true);
							actions.draw_poly.setDisabled(true);
							actions.drag_feature.setDisabled(true);
							actions.edit_feature.setDisabled(true);
							actions.delete_feature.setDisabled(true);
							actions.edit_attributes.setDisabled(true);
						}else if(Sicecat.permisos.editWFS){
							// Deshabilitamos
							actions.draw_point.setDisabled(false);
							actions.draw_line.setDisabled(false);
							actions.draw_poly.setDisabled(false);
							actions.drag_feature.setDisabled(false);
							actions.edit_feature.setDisabled(false);
							actions.delete_feature.setDisabled(false);
							actions.edit_attributes.setDisabled(false);
						}
						

						this.map.addLayer(vector);
					},

					/**
					 * Method: init_toolbarExport
					 * 
					 * Load this.export
					 */
					init_toolbarExport : function() {
						var loadGML = new OpenLayers.Control.LoadGML();
						var loadWMS = new OpenLayers.Control.LoadWMS();
						var loadKML = new OpenLayers.Control.LoadKML();
						var loadCamcat = new OpenLayers.Control.LoadCamcat();
						var loadAE = new OpenLayers.Control.LoadAreaEmergencia();
						var exportWFS = new OpenLayers.Control.ExportWFS();

						// Exporters
						action = new GeoExt.Action({
							itemID : "LoadCamcat",
							// text : this.gmlText,
							control : loadCamcat,
							map : map,
							iconCls : "LoadCamcat",
							// button options
							allowDepress : false,
							tooltip : this.loadCamcatTooltipText,
							// check item options
							group : "export"
						});
						actions["loadCamcat"] = action;
						this.exporter.push(action);
						this.exporter.push("-");

						// Exporters
						action = new GeoExt.Action({
							itemID : "LoadGML",
							// text : this.gmlText,
							control : loadGML,
							map : map,
							iconCls : "LoadGML",
							// button options
							allowDepress : false,
							tooltip : this.loadGMLTooltipText,
							// check item options
							group : "export"
						});
						actions["loadGML"] = action;
						this.exporter.push(action);
						this.exporter.push("-");

						action = new GeoExt.Action({
							itemID : "LoadKML",
							// text : this.kmlText,
							control : loadKML,
							map : map,
							iconCls : "LoadKML",
							// button options
							allowDepress : false,
							tooltip : this.loadKMLTooltipText,
							// check item options
							group : "export"
						});
						actions["loadKML"] = action;
						this.exporter.push(action);
						this.exporter.push("-");

						action = this.getAddLayersPanel();
						actions["loadWMS"] = action;
						this.exporter.push(action);
						// this.exporter.push("-");

						// adiaz: #65016 Esta funcionalidad se recoge con otros
						// botones
						// action = new GeoExt.Action({
						// itemID : "LoadAreaEmergencia",
						// // text : this.areaEmergenciaText,
						// control : loadAE,
						// map : map,
						// iconCls : "LoadAreaEmergencia",
						// // button options
						// allowDepress : true,
						// tooltip : this.loadEATooltipText,
						// // check item options
						// group : "export"
						// });
						// actions["loadAE"] = action;
						// this.exporter.push(action);
						// this.exporter.push("-");

						action = new GeoExt.Action({
							itemID : "ExportWFS",
							// text : this.exportWFSText,
							control : exportWFS,
							map : map,
							iconCls : "ExportWFS",
							// button options
							allowDepress : true,
							tooltip : this.exportWFSTooltipText,
							// check item options
							group : "export2"
						});
						actions["exportWFS"] = action;
						// this.exporter.push(action);
						// Desaparece de la barra de herramientas

					},

					/**
					 * Method: init_layers_tree_2
					 * 
					 * Inicializa el árbol de capas
					 * 
					 * Cartografía base: Son capas que forman la base del mapa.
					 * Normalmente son opacas, por lo que no permiten visualizar
					 * las capas que hay bajo ellas. Por este motivo sólo podrá
					 * haber una capa base activa a la vez. Su
					 * activación/desactivación se realizará mediante un control
					 * de tipo radio. Capas superpuestas u Overlays: Se trata
					 * normalmente capas que contienen zonas transparentes, por
					 * lo que pueden ser superpuestas a la capa base activa. Su
					 * activación/desactivación se realizará mediante un control
					 * de tipo checkbox ya que puede haber varias activas al
					 * mismo tiempo. Capas editables: En esta categoría se
					 * agrupan las capas WFS-T editables por el usuario. Capas
					 * del usuario: Se trata de las capas que el usuario añade
					 * mediante el asistente WMS. Se activan y desactivan
					 * mediante un checkbox.
					 */
					init_layers_tree_2 : function() {

						var sicecatInstance = this.sicecatInstance;
						
						this.tree = new SiceCAT.tree.LayerTree({
							sicecatInstance: sicecatInstance
						});
					}
});
