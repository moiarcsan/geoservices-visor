/*
 * SiceCAT.js
 * Copyright (C) 2011
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
 * Author: Maria Arias de Reyna Dominguez (marias@emergya.com), Alejandro Diaz Torres (adiaz@emergya.com)
 * 
 * Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 * 
 */

/**
 * @requires OpenLayers.js
 * @requires ext-all.js
 */

/**
 * Class: SiceCAT
 * 
 * Map initializer for SiceCAT project
 * 
 * Inherits from: - <OpenLayers.Class>
 */
SiceCAT = Ext
		.extend(
				Ext.Component,
				{

					/**
					 * Property: map
					 * 
					 * {Openlayers.Map} Map to interact
					 */
					map : null,

					auxId : 0,

					// empty pool for WFS editable layers
					poolWFSAvalaibles:{
						POINT:[],
						LINE:[],
						POLYGON:[]
					},

					/**
					 * Property: nombreCapaAuxiliarText
					 * 
					 * {String} Default text to be show
					 */
					nombreCapaAuxiliarText : "Auxiliar",

					/**
					 * Property: nombreCapaResultadoText
					 * 
					 * {String} Default text to be show
					 */
					nombreCapaResultadoText : "Resultado de consulta",

					/**
					 * Property: searchButtonWFSButtonText
					 * 
					 * {String} Default text to be show
					 */
					searchButtonWFSButtonText : "WFS",

					/**
					 * Property: searchButtonWFSButtonTooltipText
					 * 
					 * {String} Default text to be show
					 */
					searchButtonWFSButtonTooltipText : "Búsqueda en capas WFS configuradas",

					/** i18n * */
					compatibiltyIEText : "This browser is not 100% compatible with this viewer, please use Mozilla Firefox or Google Chrome 7 + 15 +",
					compatibiltyScreenText : "Your screen is not optimized for this viewer. The minimum recommended resolution is 1280x1024",
					compatibiltywindiwTitleText : "Warning!",
					errorTitle : "Feature Changes Error",
					errorMsg : "It's not possible save your changes",
					buttonText : "Accept",
					basicInformation : "Basic Information",
					moreInformation : "More Information",
					errorLayersTitleText: "Error ocurred loading {0} layers",
					errorLayersBodyText: "Layer '{0}' is not available",
					errorLayersBodyInfoText: "Click on 'Export' to download the log file with all layers that are not available",  
					contextRefreshedText: "Context refreshed",
					errorLayerInfoTitle: "Error",
					errorLayerInfo: "Error to get the layer information",
					userLayersText: "User's layers",

					// overrided by localized this.userLayersText
					DEFAULT_USER_LAYERS_FOLDER: "User's layers",

					/**
					 * Property: consultarText
					 * 
					 * {String} URL to this servlet
					 */
					consultarText : "Consultar",

					/**String.format(this_instance.errorLayersTitleText
					 * Property: PDFServer
					 * 
					 * {String} URL to this servlet
					 */
					PDFServer : null,

					/**
					 * Property: map
					 * 
					 * {String} URL to this servlet
					 */
					uploadServletURL : null,

					/**
					 * Property: downloadServletURL
					 * 
					 * {String} URL to this servlet
					 */
					downloadServletURL : null,

					/**
					 * Property: user
					 * 
					 * {String} User logged
					 */
					user : null,

					/**
					 * Property: layout
					 * 
					 * {String} Languaje
					 */
					layout : null,

					/**
					 * Property: configuration_file
					 * 
					 * {String} URL to json config file
					 */
					configuration_file : 'files.do/map_configuration.json.do',

					/**
					 * Property: layers_file
					 * 
					 * {String} URL to json config file
					 */
					layers_file : 'files.do/layers.json.do',

					/**
					 * Property: styles_file
					 * 
					 * {String} URL to json config file
					 */
					styles_file : 'files.do/styles.json.do',

					/**
					 * Property: search_services_file
					 * 
					 * {String} URL to json config file
					 */
					search_services_file : 'files.do/search_services.json.do',

					/**
					 * Property: jsonMapConfiguration
					 * 
					 * {Object} Container to load JSON file
					 */
					jsonMapConfiguration : null,

					/**
					 * Property: jsonLayers
					 * 
					 * {Object} Container to load JSON file
					 */
					jsonLayers : null,

					/**
					 * Property: jsonStyles
					 * 
					 * {Object} Container to load JSON file
					 */
					jsonStyles : null,

					/**
					 * Property: jsonSearchServices
					 * 
					 * {Object} Container to load JSON file
					 */
					jsonSearchServices : null,

					/**
					 * Property: styles
					 * 
					 * {Array<Openlayers.Style>} Styles to be applied in map
					 */
					styles : null,

					/**
					 * Property: searchServices
					 * 
					 * {Array} With search services configured
					 */
					searchServices : null,

					/**
					 * Property: activeLayer
					 * 
					 * {OpenLayers.Layer} selected
					 */
					activeLayer : null,

					/**
					 * Property: isLogEnable
					 * 
					 * {Boolean} for show log
					 */
					isLogEnable : false,
					
					tmpSelectedFeatures: [],
					
					selectedFeatureMonitor: null,
					
					GROUP_IDS:{
						SUPERADMIN:1,
						CECAT:2,
						GPCL:3
					},
					
					GROUP_NAMES:{
						1:'SUPERADMIN',
						2:'CECAT',
						3:'GPCL'
					},

					/**
					 * Property: groupLayers {Array} with group layers from
					 * layers.json
					 */
					groupLayers : new Ext.util.MixedCollection(),

					constructor : function(config) {
						if (this.isLogEnable)
							console.log("SiceCAT init");
						if (config) {
							this.addEvents({
								"readyToCreateMap" : true
							});
							// Copy configured listeners into *this* object so
							// that the base class's
							// constructor will add them.
							this.listeners = config.listeners;
						}

						// Call our superclass constructor to complete
						// construction process.
						SiceCAT.superclass.constructor.call(this, config);
					},
					
					/*
					 * Method: showHideMessageInformation at sicecatStatusBar
					 */
					showHideMessageInformation: function (text, timeout){
						var time = 5000;
						if(!!timeout){
							time = timeout
						}
						$('sicecatStatusBar').innerHTML = text;
						//$('sicecatStatusBar').getEl().show();
						$('sicecatStatusBar').style.display = "";
            			//$("div.sicecatStatusBar").delay(800).slideDown(400);
            			setTimeout(function() { 
	            				//console.log($("sicecatStatusBar"));
            					//document.getElementById('sicecatStatusBar').getEl().hide();
        						//$('sicecatStatusBar').getEl().hide();
        						$('sicecatStatusBar').style.display = "none";
            				}, time);
					},

					showCompatibiltyWindow : function() {
						var msg = "";
						if (Ext.isIE)
							msg += "\n" + this.compatibiltyIEText;
						if (screen.width < 1280 || screen.height < 1024) {
							msg += '\n' + this.compatibiltyScreenText;
						}
						if (msg != "") {
							Ext.Msg
									.alert(this.compatibiltywindiwTitleText,
											msg);
						}
					},

					/**
					 * Function: loadConfiguration
					 * 
					 * Loads the Sicecat dependant configuration
					 * 
					 * See Also:
					 * 
					 * <overrideConfiguration>
					 */
					loadConfiguration : function() {

						/*
						 * Default options
						 */
						this.PDFServer = "";
						this.uploadServletURL = "uploadServlet.do";
						this.downloadServletURL = "download.do/";

						this.user = new Object();
						this.user.logo = 'http://www.emergya.es/logo.jpg';

						this.layout = new Object();
						this.layout.idioma = "cat";

						OpenLayers.ProxyHost = 'proxy.do?url=';

						var this_ = this;
						this
								.loadStyling(function() {
									this_
											.loadSearchServices(function() {
												this_
														.loadMapConfiguration(function() {
															this_
																	.overrideConfiguration(this_.jsonMapConfiguration["OpenLayers.ProxyHost"]);
															this_.initGPCL();
														});
											});
								});
						// this.loadMapConfiguration(function() {
						// this_.overrideConfiguration(this_.jsonMapConfiguration["OpenLayers.ProxyHost"]);
						// this_.loadStyling(function() {
						// this_.loadSearchServices(function() {
						// ;
						// } );
						// });
						// });
					},

					/**
					 * Function: overrideConfiguration
					 * 
					 * Does override configuration of other libraries:
					 */
					overrideConfiguration : function(proxy) {
						if (!!proxy) {
							OpenLayers.ProxyHost = proxy;
						} else {
							OpenLayers.ProxyHost = "proxy.do?url=";
						}
					},

					initGPCL : function() {
						
						var bbox = this.jsonMapConfiguration['bbox'];
						var bboxArray = bbox.split(",");
						var minX = parseFloat(bboxArray[0]);
						var minY = parseFloat(bboxArray[1]);
						var maxX = parseFloat(bboxArray[2]);
						var maxY = parseFloat(bboxArray[3]);
						
						var initialBbox = new OpenLayers.Bounds(minX, minY, maxX, maxY);

						if (this.modo) {
							if (this.jsonSearchServices) {
								this.initMapSicecat(this.loadedBBox ? this.loadedBBox : initialBbox, initialBbox);

								var panel = new SiceCAT.ZoomToResultPanel(
										{
											doZoom : true,
											sicecatInstance : this,
											map : this.map,
											listeners : {
												loadLayer : function() {
													this.loadedBBox = panel.bboxReaded;
													this.layerComarcaMunicipio = panel.axiliaryLayerWFS;
													this.initMapSicecat(this.loadedBBox, initialBbox);
												},
												loadexception: function(){
													// loadexception
													var msg = "Error al cargar el municipio o comarca!!";
													if(!!this.idMunicipio){
														msg += "SIGESCAT esta fallando o el id de municipio " + this.idMunicipio + " es incorrecto!!";
													}else if(!!this.idComarca){
														msg += "SIGESCAT esta fallando o el id de comarca " + this.idComarca + " es incorrecto!!";
													}else{
														msg += "No se ha especificado id de comarca o municipio!!";
													}
													console.log(msg);
													this.initMapSicecat(initialBbox, initialBbox);
													// TODO: Msg with alert
												},
												scope : this
											}
										});
							}
							panel.on('zoomDone', function() {
								this.map.initialExtent = this.map.getExtent();
								// unregister listener
								panel.un('zoomDone', this);

							})
							if (this.idMunicipio) {
								panel.getZoomToResult("s:i", "INE_NUM",
										this.idMunicipio, "Comarca/Municipio");
							} else if (this.idComarca) {
								panel.getZoomToResult("s:k", "ID",
										this.idComarca, "Comarca/Municipio");
							}
						}
					},

					/**
					 * Method: loadLayersPost
					 * 
					 * Load Sicecat.jsonLayers to map. First ping the layer url
					 * 
					 * Parameters: map - {<Openlayers.Map>} Map to load the
					 * layers Sicecat.jsonLayers - {<Array>} layers loaded from
					 * json file
					 */
					loadLayersPost : function(map, continueLoading) {
						var this_ = this;
						this.errors = new Array();
						this.errors_text = "";
						this.waiting = 0;
						
						
						if (!!this.jsonLayers) {
							for ( var i = 0; i < this.jsonLayers.length; i++) {
								layerToLoad = this.jsonLayers[i];
								this_.waiting++;
								var url = (OpenLayers.ProxyHost
										.indexOf("url2") != -1 ? OpenLayers.ProxyHost
												: "")
												+ layerToLoad['url'];
								//console.log("URL --> "+ url);
							    this_.loadCorrectLayer(map, layerToLoad);
							    if(!!layerToLoad['testLayer'] && layerToLoad['testLayer'] == 'true'){
									if (layerToLoad['type'] == 'WMS') {
										this.testLayer(url, map, 
												layerToLoad, continueLoading);
									}else if (layerToLoad['type'] == 'WMST') {
										this.testLayer(url, map, 
												layerToLoad, continueLoading);
	//									this_.loadCorrectLayer(map, layerToLoad);
	//									this_.waiting--;
									}else{
										//TODO: console.log("capa no existente");
									}
							    }
							}
						}
//						if(this_.waiting == 0){
//							if(this_.errors_text != ""){
//								this_.showErrorWindow(String.format(this_.errorLayersTitleText, this_.errors.length), 
//										this_.errorLayersBodyInfoText, this_.errors_text);
//							} 
							continueLoading();
//						}
					},
					
					/*
					 *  private: testLayer
					 */
					testLayer: function (url, map, layerToLoad, continueLoading){
						var this_ = this;
//						this_.loadCorrectLayer(map, layerToLoad);
//						this_.waiting--;
						var postUrl = OpenLayers.ProxyHost + url.replace('proxy.do?url=', '');
                        Ext.Ajax.request({
                            url:  postUrl + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
							//url:  url,
//							url:  OpenLayers.ProxyHost + url,
							params : { SERVICE : 'WMS' , REQUEST : 'GetCapabilities', VERSION: '1.1.1'},
							method: 'GET',
							success: function ( result, request ) { 
								this_.waiting--;
								//console.log("SUCCESS --> "+ url);
								if(!!result 
										&& ((!!result.responseText && result.responseText.indexOf("HTTP 404") < 0) 
												|| (!!result.responseXML && result.responseXML.indexOf("HTTP 404") < 0))){
									//this_.loadCorrectLayer(map, layerToLoad);
								}else{
									this_.layerError(url, layerToLoad, map);									
								}
								if(this_.waiting == 0){
									if(this_.errors_text != ""){
										this_.showErrorWindow(String.format(this_.errorLayersTitleText, this_.errors.length), 
												this_.errorLayersBodyInfoText, this_.errors_text);
									}
									//console.log("ERROR --> "+ url);
									//continueLoading();
								}
							},
							failure: function ( result, request) {
								this_.waiting--;
								this_.layerError(url, layerToLoad, map);
								if(this_.waiting == 0){
									if(this_.errors_text != ""){
										this_.showErrorWindow(String.format(this_.errorLayersTitleText, this_.errors.length), 
												this_.errorLayersBodyInfoText, this_.errors_text);
									} 
									//continueLoading();
								}
							} 
						});
					},
					
					/*
					 *  private: testLayerInformation
					 */
					testLayerInformation: function (url, map, layerToLoad, continueLoading){
						var this_instance = this;
						var postUrl = OpenLayers.ProxyHost + url.replace('proxy.do?url=', '');
			            Ext.Ajax.request({
			                url:  postUrl + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
							params : { SERVICE : 'WMS' , REQUEST : 'GetCapabilities', VERSION: '1.1.1'},
							method: 'GET',
							success: function ( result, request ) { 
								if(!!continueLoading){
									continueLoading(result);
								}
							},
							failure: function ( result, request) {
								Ext.Msg.show({
									   title: this_instance.errorLayerInfoTitle,
									   msg: this_instance.errorLayerInfo,
									   buttons: Ext.Msg.OK
									});
							}
						});
					},
					
					waiting: 0,
					/*
					 *  private: testLayerGetCapabilities
					 */
					testLayerGetCapabilities: function (url, map, layerToLoad, continueLoading, onError){
						
						var this_instance = this;
						var postUrl = OpenLayers.ProxyHost + url.replace('proxy.do?url=', '');
						this.waiting++;
						
			            Ext.Ajax.request({
			                url:  postUrl + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities",
							params : { SERVICE : 'WMS' , REQUEST : 'GetCapabilities', VERSION: '1.1.1'},
							method: 'GET',
							success: function ( result, request ) { 
								this_instance.waiting--;
								if(!!result 
										&& ((!!result.responseText && result.responseText.indexOf("HTTP 404") < 0) 
												|| (!!result.responseXML && result.responseXML.indexOf("HTTP 404") < 0))){
									if(this_instance.waiting == 0){
//										if(this_instance.errors_text != ""){
//											this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
//													this_instance.errorLayersBodyInfoText, this_instance.errors_text);
//										}
										if(!!continueLoading){
											continueLoading();
										}
									}
								}else{
									if(!!onError){
										this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
												this_instance.errorLayersBodyInfoText, this_instance.errors_text);
										onError();
									}else{
										this_instance.layerError(url, layerToLoad, map);
										if(this_instance.waiting == 0){
											if(this_instance.errors_text != ""){
												this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
														this_instance.errorLayersBodyInfoText, this_instance.errors_text);
											}
											if(!!continueLoading){
												continueLoading();
											}
										}
									}
								}
							},
							failure: function ( result, request) {
								this_instance.waiting--;
								if(!!onError){
									this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
											this_instance.errorLayersBodyInfoText, this_instance.errors_text);
									onError();
								}else{
									this_instance.layerError(url, layerToLoad, map);
									if(this_instance.waiting == 0){
										if(this_instance.errors_text != ""){
											this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
													this_instance.errorLayersBodyInfoText, this_instance.errors_text);
										} 
										if(!!continueLoading){
											continueLoading();
										}
									}
								}
							} 
						});
					},
					
					/*
					 *  private: testLayerGetCapabilities
					 */
					testLayerGetMap: function (url, map, layerToLoad, continueLoading){
						
						var this_instance = this;
						
						var urlMap = url + "&LAYERS=" 
									+ layerToLoad.properties.layers 
										+ "&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A23031&BBOX=302100,4547000,442100,4687000&WIDTH=400&HEIGHT=400"; 
						
						if(urlMap != null){
							this.waiting++;
				            Ext.Ajax.request({
				                url:  OpenLayers.ProxyHost + urlMap,
								method: 'GET',
								success: function ( response ) { 
									this_instance.waiting--;
									if(response.responseText.indexOf("error") != -1){
										this_instance.layerError(url, layerToLoad, map);
									}
									if(this_instance.waiting == 0){
										if(this_instance.errors_text != ""){
											this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
													this_instance.errorLayersBodyInfoText, this_instance.errors_text);
										}
										if(!!continueLoading){
											continueLoading();
										}
									}
								},
								failure: function ( result, request) {
									this_instance.waiting--;
									this_instance.layerError(url, layerToLoad, map);
									if(this_instance.waiting == 0){
										if(this_instance.errors_text != ""){
											this_instance.showErrorWindow(String.format(this_instance.errorLayersTitleText, this_instance.errors.length), 
													this_instance.errorLayersBodyInfoText, this_instance.errors_text);
										} 
										if(!!continueLoading){
											continueLoading();
										}
									}
								} 
							});
						}
					},
					
					/**
					 * To be used from layerError method
					 */
					errors: new Array(),
					errors_text: "",
					
					/**
					 * Method: layerError
					 * 
					 * Register an error loading a layer and remove it from map
					 * 
					 * Parameters: url - {<Text>} url of the get capabilities not found
					 * layerToLoad - {<Object>} properties of the layer readed from layers.json
					 * map - {<OpenLayers.Map>} to remove the layer
					 */
					layerError: function (url, layerToLoad, map){
						//TODO: Eliminar carpetas vacias
						this.errors.push(url);
						this.errors_text +=  String.format(this.errorLayersBodyText, layerToLoad['name']) + " (url='" + url + "')" + "\n";
						var layers = map.getLayersByName(layerToLoad['name']);
						if(!!layers){
							for(var i = 0; i < layers.length; i++)
								this.removeLayer(layers[i]);
						}
					},
					
					/**
					 * Method: showErrorWindow
					 * 
					 * Load Sicecat.jsonLayers to map. First ping the layer url
					 * 
					 * Parameters: titleText - {<Text>} for the window
					 * bodyText - {<Text>} for the body
					 * errors_text - {<Text>} for the log file
					 */
					showErrorWindow: function (titleText, bodyText, errors_text){
						var formPanel = new Ext.Window({
							id:"formErrorLog",
							width : 250,
							title : titleText,
							maximizable : true,
						    defaults:{xtype:'textfield'},  
						    html: bodyText
						});

						var embeddedDownloadify = new Ext.Container({
							autoEl : 'p',
							id : 'error_log',
							cls : "downloadify"
						});
						
						formPanel.addButton(embeddedDownloadify);
						formPanel.show();
						
						Downloadify.create('error_log',{
				    	    filename: function(){
				    	      return "log.txt";
				    	    },
				    	    data: function(){ 
				    	      return errors_text;
				    	    },
				    	    onComplete: function(){
				    	    },
				    	    onCancel: function(){ 
				    	    },
				    	    onError: function(){  
				    	    },
				    	    transparent: false,
				    	    swf: 'media/downloadify.swf',
				    	    downloadImage: SiceCAT.Control.Exporter.downloadImage,
				    	    dataType:'string',
				    	    width: 100,
				    	    height: 28,
				    	    append: false
				    	  });
					},
					
					/**
					 * Method: loadCorrectLayer
					 * 
					 * Load Sicecat.jsonLayers[i] layer to map
					 * 
					 * Parameters: map - {<Openlayers.Map>} Map to load the
					 * layers Sicecat.jsonLayers - {<Array>} layers loaded from
					 * json file
					 * i index of the layer to be loaded
					 */
					loadCorrectLayer: function (map, layerToLoad){
						//console.log(layerToLoad);
						if (layerToLoad['type'] == 'WMS') {
							var wms = new OpenLayers.Layer.WMS(
									layerToLoad['name'],
									(OpenLayers.ProxyHost
											.indexOf("url2") != -1 ? OpenLayers.ProxyHost
											: "")
											+ layerToLoad['url'],
									layerToLoad['layerOp1'],
									layerToLoad['layerOp2']);
							var group = layerToLoad['groupLayers'];
							var subgroup = layerToLoad['subgroupLayers'];
							if (!!subgroup) {
								wms.groupLayers = group + "-"
										+ subgroup;
							}
							wms.subgroupLayers = subgroup;
							if (!this.groupLayers.containsKey(group)) {
								this.groupLayers.add(group,
										new Ext.util.MixedCollection());
							}
							this.groupLayers.item(group).add(subgroup,
									subgroup);
							map.addLayer(wms);
							(new SiceCATGeoParser()).generateLayerFromJson(layerToLoad, group, subgroup);
						} else if (layerToLoad['type'] == 'WMST') {
							var wms = new SiceCAT.Layer.WMS_SIGESCAT(
									layerToLoad['name'],
									(OpenLayers.ProxyHost
											.indexOf("url2") != -1 ? OpenLayers.ProxyHost
											: "")
											+ layerToLoad['url'],
									layerToLoad['layerOp1'],
									layerToLoad['layerOp2'],
									layerToLoad);
							wms.groupLayers = layerToLoad['groupLayers'];
							(new SiceCATGeoParser()).generateLayerFromJson(layerToLoad, layerToLoad['groupLayers']);
							map.addLayer(wms);
						} else if (layerToLoad['type'] == 'OSM') {
							var mapnik = new OpenLayers.Layer.OSM(
									layerToLoad['name']);
							map.addLayer(mapnik);
						} else if(layerToLoad['type'] == 'GML'){
							// Add a GML layer
							var name = layerToLoad['name'];
							var url = layerToLoad['url'];
							var gml = new OpenLayers.Layer.GML(name, url);
							var group = layerToLoad['groupLayers'];
							var subgroup = layerToLoad['subgroupLayers'];
							if (!!subgroup) {
								gml.groupLayers = group + "-" + subgroup;
							}
							gml.subgroupLayers = subgroup;
							if (!this.groupLayers.containsKey(group)) {
								this.groupLayers.add(group, new Ext.util.MixedCollection());
							}
							this.groupLayers.item(group).add(subgroup, subgroup);
							map.addLayer(gml);
						}else if(layerToLoad['type'] == 'KML'){
							// Add a KML Layer
							var name = layerToLoad['name'];
							var url = layerToLoad['url'];
							var kml = new OpenLayers.Layer.GML(name, url, {
								format: OpenLayers.Format.KML,
								formatOptions: { 
									extractStyles: true, 
									extractAttributes: true 
								},
								projection: new OpenLayers.Projection('EPSG:4326')
							});
							var group = layerToLoad['groupLayers'];
							var subgroup = layerToLoad['subgroupLayers'];
							if (!!subgroup) {
								kml.groupLayers = group + "-" + subgroup;
							}
							kml.subgroupLayers = subgroup;
							if (!this.groupLayers.containsKey(group)) {
								this.groupLayers.add(group, new Ext.util.MixedCollection());
							}
							this.groupLayers.item(group).add(subgroup, subgroup);
							map.addLayer(kml);
						}else if(layerToLoad['type'] == 'CSV'){
							// Add a CSV
							
						}else if(layerToLoad['type'] == 'CAMCAT'){
							// Add a CAMCAT
							var name = layerToLoad['name'];
							var url = layerToLoad['url'];
							var group = layerToLoad['groupLayers'];
							var subgroup = layerToLoad['subgroupLayers'];
							var this_ = this;
							Ext.Ajax.request({
								url:  url,
								method: 'GET',
								success: function (result, request){
									if(!!result
										&& (!!result.responseText 
												&& result.responseText.indexOf("HTTP 404") < 0)){
										var rows = result.responseText.split("\n");
										if(!!rows && rows.length > 0){
											// Add the name to the layer
											var layer = new OpenLayers.Layer.Vector(name);
											if (!!subgroup) {
												layer.groupLayers = group + "-" + subgroup;
											}
											layer.subgroupLayers = subgroup;
											var errors = 0;
											var features = 0;
											for(var i = 0; i < rows.length; i++){
												var controlCamCat = new OpenLayers.Control.LoadCamcat();
												controlCamCat.map = map;
												var feature = controlCamCat.readFeature(rows[i]);
												if(!!feature){
													layer.addFeatures(feature);
													features++;
												}else if(rows[i] != ""){
													errors++;
												}
											}
											if(errors == 0){
												if (!this_.groupLayers.containsKey(group)) {
													this_.groupLayers.add(group, new Ext.util.MixedCollection());
												}
												this_.groupLayers.item(group).add(subgroup, subgroup);
												map.addLayer(layer);
											}else{
												if(features != 0){
													if (!this_.groupLayers.containsKey(group)) {
														this_.groupLayers.add(group, new Ext.util.MixedCollection());
													}
													this_.groupLayers.item(group).add(subgroup, subgroup);
													map.addLayer(layer);
												}
											}
										}
									}
								}
							});
						}
					},
					
					LAYERS_LOADED:{},
					
					addLayer: function(layer){
						if(!!layer.layerID){
							this.LAYERS_LOADED[layer.layerID] = layer;
						}
						try{
							map.addLayer(layer);
							if(!!layer.order){
								//TODO: Reorder map.setLayerIndex(layer, layer.order);
							}
						}catch (e){
							if(this.isLogEnable){
								console.log(e.stack);
							}
						}
					},
					
					removeLayer: function(layer){
						if(!!layer){
							if(!!layer.layerID 
									&& !layer.isBaseLayer){
								this.LAYERS_LOADED[layer.layerID] = null;
							}
							
							try{
								if(!!layer 
										&& !!layer.name
										&& map.getLayersByName(layer.name).length > 0)
									map.removeLayer(layer);
							}catch (e){
								if(this.isLogEnable){
									console.log(e.stack);
								}
							}
						}
						
					},
					
					refreshFolders: function(continueLoading){
		    			if(!!continueLoading){
		    				continueLoading();
		    			}
					},

					refreshLayers: function(continueLoading){
						var this_ = this;

						var parser = new SiceCATGeoParser({map:this.map});

						this.clearLayersAndFolders();
						parser.treeFolder = new Ext.util.MixedCollection();

						//Refresh folders
						this_.refreshFolders(function(){
							this_.loadLayers(function(){
								this_.loadUserFolder(Sicecat.user.login, function(){
									setTimeout(function() {
									      // Refresh after 1 second
									      load_fifth();
									}, 1000);
									if(!!continueLoading)
										continueLoading();
					    		});
							});
						});
					},
					
					clearLayersAndFolders: function(){
						// init folders
						this.auxGroupLayers = new Array();
						this.notGroupLayers = new Array();

						// WFS pool
						this.poolWFSAvalaibles = {
							POINT:[],
							LINE:[],
							POLYGON:[]
						};
						
						// init layers
						this.LAYERS_LOADED = {};
						for(var i = this.map.layers.length - 1; i > -1; i--){
							try{
								this.map.removeLayer(this.map.layers[i]);
							}catch (e){
								// nada
							}
						}
					},

					/**
					 * Method: loadLayers
					 * 
					 * Load layers by user and group of the user
					 * 
					 */
					loadLayers : function(continueLoading) {
						//Sicecat.isLogEnable = true; 
						if(Sicecat.isLogEnable) console.log("usuario --> " + Global_TMP.user);
						if(Sicecat.isLogEnable) console.log("permisos --> " + Global_TMP.permisos);
						if(Sicecat.isLogEnable) console.log("municipio --> " + Global_TMP.idMunicipio);
						
						if(!!this.LAYERS_LOADED){
							for (var layerID in this.LAYERS_LOADED){
								var layer = this.LAYERS_LOADED[layerID];
								this.removeLayer(layer);
							}
						}

						//only init countLoadingLayers
						this.countLoadingLayers = 1;
						if(Global_TMP.permisos.indexOf("admin1") < 0){
							if(!!Global_TMP.idMunicipio){
								this.countLoadingLayers++;
							}else{
								this.countLoadingLayers++;
							}
						}
						
						//Load group folders
						this.loadLayersByGroup(this.GROUP_IDS.SUPERADMIN, continueLoading);
						if(Global_TMP.permisos.indexOf("admin1") < 0){
							if(!!Global_TMP.idMunicipio){
								if(Global_TMP.permisos.indexOf("admin2") > -1){
									Global_TMP.SELECTED_GROUP = this.GROUP_IDS.GPCL;
								}
								this.loadLayersByGroup(this.GROUP_IDS.GPCL, continueLoading);
							}else{
								if(Global_TMP.permisos.indexOf("admin2") > -1){
									Global_TMP.SELECTED_GROUP = this.GROUP_IDS.CECAT;
								}
								this.loadLayersByGroup(this.GROUP_IDS.CECAT, continueLoading);
							}
						}else{
							Global_TMP.SELECTED_GROUP = this.GROUP_IDS.SUPERADMIN;
						}

						if(!Global_TMP.SELECTED_GROUP){
							if(!!Global_TMP.idMunicipio){
								Global_TMP.USER_GROUP = this.GROUP_IDS.GPCL;		
							}else{
								Global_TMP.USER_GROUP = this.GROUP_IDS.CECAT;
							}
						}
					},
					
					loadUserFolder: function (user, continueLoading){
						//Load user folder
						if(Global_TMP.permisos.indexOf("admin")< 0){
							this.countLoadingLayers++;
							this.loadLayersByUser(user, continueLoading);
							this.SELECTED_USER = user;
						}else if(this.countLoadingLayers == 0 && !!continueLoading){
							continueLoading();
						}
					},

					
					/**
					 * Layer tree
					 */
					auxGroupLayers: new Array(),
					notGroupLayers: new Array(),
					getTreeRecursive: function(treeFolder, tree, notGroupLayers, parent, idGroup, idUser, parser){
						if(!!treeFolder.keys && treeFolder.keys.length > 0){
							for ( var i = 0; i < treeFolder.keys.length; i++) {
								key = treeFolder.keys[i];
								var label = parser.LOADED_FOLDERS_NAMES[key];
								if(!!label){
									label = label.split('-');
									label = label[label.length-1];
									if(label != 'overlays'){

										// override DEFAULT_USER_LAYERS_FOLDER
										var text = label;
										if(text == this.DEFAULT_USER_LAYERS_FOLDER){
											text = this.userLayersText;
										}
										//console.log(label);
										//console.log(text);

										if((!!treeFolder.item(key)
												&& treeFolder.item(key).length > 0)){

											var folder = 
											{
													leaf : false,
													isFolder : true,
													expanded : false,
													text : text, 
													groupLayers: key,
													userOwner: idUser,
													groupOwner: idGroup,
													order: parser.LOADED_FOLDERS_OBJECTS[key].order
												};
											folder.children  = new Array();
											if(!!parent){
												parent.children.push(folder);
											}else{
												tree.push(folder);
											}
											//notGroupLayers.push(key);
											this.getTreeRecursive(treeFolder.item(key), tree, notGroupLayers, folder, idGroup, idUser, parser);
										}else{

											var child = {
													nodeType : "gx_sicecat_overlaylayercontainer",
													expanded : false,
													isFolder : false,
													text : text,
													groupLayers : key,
													userOwner: idUser,
													groupOwner: idGroup,
													order: parser.LOADED_FOLDERS_OBJECTS[key].order,
													loader : {
														baseAttrs : {
															radioGroup : "foo",
															uiProvider : "layernodeui",
															groupLayers : key,
															userOwner: idUser,
															isFolder : false,
															groupOwner: idGroup,
															order: parser.LOADED_FOLDERS_OBJECTS[key].order
														}
													}
												};
												notGroupLayers.push(key);
												if(!!parent){
													parent.children.push(child);
												}else{
													tree.push(child);
												}
										}
									}
								}
							}
						}
					},
					
					layerOrder: 0,

					/**
					 * Method: loadLayersByGroup
					 * 
					 * Load layers of a group
					 * 
					 */
					loadLayersByGroup : function(idGroup, continueLoading) {
						var this_ = this;
						if(Sicecat.isLogEnable) console.log("loading group "+ idGroup);
						var parser = new SiceCATGeoParser({map:this.map});
						parser.loadLayersByGroup(idGroup, function(layers, layerTree, rootFolder){
							this_.countLoadingLayers--;

							//LayerTree
							for(var i = 0; i < parser.treeFolder.keys.length; i++){
								parser.treeFolder.add(parser.treeFolder.keys[i], parser.treeFolder.get(parser.treeFolder.keys[i]));
							}
							this_.getTreeRecursive(parser.treeFolder, this_.auxGroupLayers, this_.notGroupLayers, null, idGroup, null, parser);
							
							//Add layers to map
							for(var i = 0; i < layers.length; i++){
								var layer = layers[i];
								this_.addLayer(layer);
							}
							
							if(!!continueLoading 
									&& this_.countLoadingLayers == 0){
								continueLoading();
							}
						});
					},

					/**
					 * Method: loadLayersByUser
					 * 
					 * Load layers of a user
					 * 
					 */
					loadLayersByUser : function(idUser, continueLoading) {
						var this_ = this;
						if(Sicecat.isLogEnable) console.log("loading user "+ idUser);
						var parser = new SiceCATGeoParser({map:this.map}); 
						parser.loadLayersByUser(idUser, function(layers, layerTree, rootFolder){
							this_.countLoadingLayers--;
							
							//LayerTree
							for(var i = 0; i < parser.treeFolder.keys.length; i++){
								parser.treeFolder.add(parser.treeFolder.keys[i], parser.treeFolder.get(parser.treeFolder.keys[i]));
							}
							this_.getTreeRecursive(parser.treeFolder, this_.auxGroupLayers, this_.notGroupLayers, null, null, idUser, parser);
							
							//Add layers to map
							for(var i = 0; i < layers.length; i++){
								var layer = layers[i];
								this_.addLayer(layer);
							}
							
							if(!!continueLoading 
									&& this_.countLoadingLayers == 0){
								continueLoading();
							}
						});
					},

					/**
					 * Method: loadLayers
					 * 
					 * Write this.jsonLayers from file
					 * 'files.do/layers.json'
					 * 
					 */
					loadLayersOld : function(continueLoading) {
						var this_instance = this;
						// do the Ext.Ajax.request
						Ext.Ajax.request({
							// the url to the remote source
							url : this.layers_file,
							// define a handler for request success
							success : function(response, options) {
								this_instance.jsonLayers = Ext.util.JSON
										.decode(response.responseText);
								// use the stored object...
								// u can uncomment the following line if firebug
								// is available
								// console.info(store_end_point);
								this_instance.loadLayersPost(map, continueLoading);
							}
						// NO errors ! ;)
						// failure: layersRequest_onFailure ... or something
						// else
						});
					},

					/**
					 * Method: loadLayers
					 * 
					 * Write this.jsonLayers from file
					 * 'files.do/layers.json'
					 * 
					 */
					loadLayersOld : function(continueLoading) {
						var this_instance = this;
						// do the Ext.Ajax.request
						Ext.Ajax.request({
							// the url to the remote source
							url : this.layers_file,
							// define a handler for request success
							success : function(response, options) {
								this_instance.jsonLayers = Ext.util.JSON
										.decode(response.responseText);
								// use the stored object...
								// u can uncomment the following line if firebug
								// is available
								// console.info(store_end_point);
								this_instance.loadLayersPost(map, continueLoading);
							}
						// NO errors ! ;)
						// failure: layersRequest_onFailure ... or something
						// else
						});
					},

					/**
					 * Method: loadMapConfiguration
					 * 
					 * Write Sicecat.jsonMapConfiguration from file
					 * 'files.do/map_configuration.json'
					 * 
					 */
					loadMapConfiguration : function(continueLoading, loadMap) {
						var this_instance = this;

						var parser = new SiceCATGeoParser({map:this.map});
						if (!!this.jsonMapConfiguration) {
							// adiaz: #57170: Only one ajax request
							if (!!loadMap)
								this_instance.loadMapConfigurationPost(map);
							continueLoading();
						} else {
							// Persistence
							parser.loadMapConfiguration(function(form, action){
								// ON SUCCESS
								this_instance.jsonMapConfiguration = Ext.util.JSON.decode(action.response.responseText).data;
								if (!!loadMap)
									this_instance.loadMapConfigurationPost(map);
								continueLoading();
							}, function(form, action){
								// ON FAILURE
								console.log("Error loading map conf!!");
								// Msg with alert
							});
						}
					},

					/**
					 * Method: loadMapConfigurationPost
					 * 
					 * Load Sicecat.jsonMapConfiguration to map
					 * 
					 * Parameters: map - {<Openlayers.Map>} Map to load the
					 * layers Sicecat.jsonMapConfiguration - {<Array>} layers
					 * loaded from json file
					 */
					loadMapConfigurationPost : function(map) {

						if (!!this.jsonMapConfiguration) {
							// Resolutions
							var arrayResolutions = this.jsonMapConfiguration['resolutions'].split(",");
							var arrayResNumber = new Array();
							if(arrayResolutions != null){
								for(var i=0; i<arrayResolutions.length; i++){
									arrayResNumber.push(parseFloat(arrayResolutions[i]));
								}
							}
							this.jsonMapConfiguration['resolutions'] = arrayResNumber;
							// DisplayProjection
							var displayProj =  this.jsonMapConfiguration['displayProjection'];
							if(displayProj == "true"){
								this.jsonMapConfiguration['displayProjection'] = true;
							}else if(displayProj == "false"){
								this.jsonMapConfiguration['displayProjection'] = false;
							}
							// MaxResolution
							var maxResolution = this.jsonMapConfiguration['maxResolution'];
							this.jsonMapConfiguration['maxResolution'] = parseFloat(maxResolution);
							// MinResolutions
							var minResolutions = this.jsonMapConfiguration['minResolution'];
							this.jsonMapConfiguration['minResolution'] = parseFloat(minResolutions);
							// MaxScale
							var maxScale = this.jsonMapConfiguration['maxScale'];
							this.jsonMapConfiguration['maxScale'] = parseFloat(maxScale);
							// MinScale
							var minScale = this.jsonMapConfiguration['minScale'];
							this.jsonMapConfiguration['minScale'] = parseFloat(minScale);
							
							var bbox = this.jsonMapConfiguration['bbox'];
							var initialBbox = this.jsonMapConfiguration['initalBbox'];
							var bboxArray = bbox.split(",");
							var initialBboxArray = initialBbox.split(",");
							
							var minX = parseFloat(bboxArray[0]);
							var minY = parseFloat(bboxArray[1]);
							var maxX = parseFloat(bboxArray[2]);
							var maxY = parseFloat(bboxArray[3]);
							var initialMinX = parseFloat(initialBboxArray[0]);
							var initialMinY = parseFloat(initialBboxArray[1]);
							var initialMaxX = parseFloat(initialBboxArray[2]);
							var initialMaxY = parseFloat(initialBboxArray[3]);
							
							var numZoomLevels = this.jsonMapConfiguration['numZoomLevels'];
							this.jsonMapConfiguration['numZoomLevels'] = parseInt(numZoomLevels);
							
							var projection = this.jsonMapConfiguration['projection'];

							this.projection = projection;

							this.defaultWMSServer = this.jsonMapConfiguration['defaultWMSServer'];
							this.initMapSicecat(new OpenLayers.Bounds(minX,
									minY, maxX, maxY),
									new OpenLayers.Bounds(initialMinX,
											initialMinY, initialMaxX,
											initialMaxY));
						}
					},

					/**
					 * Method: loadMapConfigurationPost
					 * 
					 * Load Sicecat.jsonMapConfiguration to map
					 * 
					 * Parameters: map - {<OpenLayers.Map>} Map to load the
					 * layers Sicecat.jsonMapConfiguration - {<Array>} layers
					 * loaded from json file maxExtent - {OpenLayers.Bounds}
					 * With extent to use in the map restrictedExtent -
					 * {OpenLayers.Bounds} With restrictedExtend to use in the
					 * map
					 */
					initMapSicecat : function(maxExtent, initialExtent) {

						console
								.log("Init map in extent ("
										+ initialExtent
										+ ") on projection '"
										+ this.jsonMapConfiguration['projection']
										+ "'");

						//console.log("Resolutions --> " + this.jsonMapConfiguration['resolutions']);

						var center = initialExtent.getCenterLonLat();

						if (!map) {

							map = new OpenLayers.Map(
									{
										projection : this.jsonMapConfiguration['projection'],
										units : this.jsonMapConfiguration['units'],
										initialExtent : initialExtent,
										maxExtent : maxExtent,
										resolutions : this.jsonMapConfiguration['resolutions'],
										center : center,
										tileSize : new OpenLayers.Size(400, 400),
										numZoomLevels : this.jsonMapConfiguration['numZoomLevels'],
										displayProjection : this.jsonMapConfiguration['displayProjection'],
										maxScale : this.jsonMapConfiguration['maxScale'],
										minScale : this.jsonMapConfiguration['minScale']
									});
							// Servlets config
							this.PDFServer = this.jsonMapConfiguration['pdfserver'];
							this.uploadServletURL = this.jsonMapConfiguration['uploadServletURL'];
							this.downloadServletURL = this.jsonMapConfiguration['downloadServletURL'];

							// Session info
							this.user = new Object();
							this.user.logo = this.jsonMapConfiguration['defaultUserLogo'];
							this.layout = new Object();
							this.layout.idioma = this.jsonMapConfiguration['defaultIdioma'];

							this.map = map;

							this.fireEvent("readyToCreateMap", this, this);
						}
					},

					/**
					 * Method: loadStyling
					 * 
					 * Write Sicecat.jsonStyles from file
					 * 'files.do/styles.json'
					 * 
					 */
					loadStyling : function(continueLoading) {
						var this_instance = this;
						// do the Ext.Ajax.request
						Ext.Ajax.request({
							// the url to the remote source
							url : this.styles_file,
							// define a handler for request success
							success : function(response, options) {
								this_instance.jsonStyles = Ext.util.JSON
										.decode(response.responseText);
								// use the stored object...
								// u can uncomment the following line if firebug
								// is available
								// console.info(store_end_point);
								this_instance.loadStylingPost();
								continueLoading();
							}
						// NO errors ! ;)
						// failure: layersRequest_onFailure ... or something
						// else
						});
					},

					/**
					 * Method: loadStylingPost
					 * 
					 * Load this.jsonStyles to this.styles
					 * 
					 * Parameters: this.styles - {<Array>} styles defined to
					 * use in features in vector layers this.jsonStyles - {<Array>}
					 * styles defined in json file
					 */
					loadStylingPost : function() {

						// alert("this.jsonLayers --> " + this.jsonLayers);
						if (!!this.jsonStyles) {
							this.styles = new Object();
							for ( var i = 0; i < this.jsonStyles.length; i++) {
								var styleDefined = OpenLayers.Util
										.applyDefaults(
												this.jsonStyles[i]['options'],
												OpenLayers.Feature.Vector.style["select"]);
								this.styles[this.jsonStyles[i]['name']] = styleDefined;
							}
						}
					},

					/**
					 * Method: loadSearchServices
					 * 
					 * Write Sicecat.jsonSearchServices from file
					 * 'files.do/search_services.json'
					 * 
					 */
					loadSearchServices : function(continueLoading) {
						var this_instance = this;
						// do the Ext.Ajax.request
						Ext.Ajax
								.request({
									// the url to the remote source
									url : this.search_services_file,
									// define a handler for request success
									success : function(response, options) {
										this_instance.jsonSearchServices = Ext.util.JSON
												.decode(response.responseText);
										// use the stored object...
										// u can uncomment the following line if
										// firebug is available
										// console.info(store_end_point);
										this_instance.loadSearchServicesPost();
										continueLoading();
									}
								// NO errors ! ;)
								// failure: layersRequest_onFailure ... or
								// something else
								});
					},

					/**
					 * Method: loadSearchServicesPost
					 * 
					 * Load this.jsonSearchServices in this.map
					 * 
					 * Parameters: this.jsonSearchServices - {<Array>} search
					 * services defined in JSON
					 */
					loadSearchServicesPost : function() {

						if (!!this.jsonStyles) {
							this.searchServices = {};
							for ( var i = 0; i < this.jsonSearchServices.length; i++) {
								if (this.jsonSearchServices[i]['type'] == "wfs") {
									var renderer = OpenLayers.Util
											.getParameters(window.location.href).renderer;
									var visibility = false;
									var groupLayers = null;
									if (this.jsonSearchServices[i]['visibility']) {
										visibility = true;
									}

									renderer = (renderer) ? [ renderer ]
											: OpenLayers.Layer.Vector.prototype.renderers;

									// Overrides with ProxyHost configuration
									var layerProperties = new OpenLayers.Protocol.WFS(
											this.jsonSearchServices[i]['layerProperties']);
									if (!!layerProperties
											&& !!layerProperties["url"]) {
										layerProperties["url"] = OpenLayers.ProxyHost
												+ layerProperties["url"];
									}

									var _strategies = [
											new OpenLayers.Strategy.BBOX(),
											new OpenLayers.Strategy.Refresh({
												interval : 5000
											}) ];
									var saveStrategy = null;
									var this_ = this;

									// Definimos la funcion para el tratamiento
									// de error
									var ChangesFailed = function(response) {
										// Definimos la ventana emergente
										var msgBox = null;
										// Definimos el boton de aceptar
										var acceptButton = null;// Creamos el
										// boton de
										// aceptar
										acceptButton = new Ext.Button({
											text : this_.buttonText,
											handler : function() {
												msgBox.hide();
											}
										});
										// Creamos la ventana emergente para
										// mostrar el error
										msgBox = new Ext.Window(
												{
													title : this_.errorTitle,
													height : 200,
													width : 400,
													layout : 'accordion',
													closeAction : 'hide',
													buttons : [ acceptButton ],
													items : [
															{
																title : this_.basicInformation,
																margins : '5 5 5 5',
																cls : 'empty',
																html : this_.errorMsg
															},
															{
																title : this_.moreInformation,
																margins : '5 5 5 5',
																autoscroll : true,
																cls : 'empty',
																html : response.response.priv.responseText
															} ]
												});
										msgBox.show();
									};
									if (integrator.sicecatInstance.permisos
											&& integrator.sicecatInstance.permisos.editWFS) {
										saveStrategy = new OpenLayers.Strategy.Save();
										saveStrategy.events.register('fail',
												null, ChangesFailed);
										_strategies.push(saveStrategy);
									}
									var wfs = new OpenLayers.Layer.Vector(
											this.jsonSearchServices[i]['name'],
											{
												'groupLayers' : groupLayers,
												'visibility' : visibility,
												'strategies' : _strategies,
												'protocol' : new OpenLayers.Protocol.WFS(
														this.jsonSearchServices[i]['layerProperties']),
												'styleMap' : this
														.createStyleMap(),
												'renderers' : renderer
											});

									if (this.jsonSearchServices[i]['groupLayers']) {
										groupLayers = this.jsonSearchServices[i]['groupLayers'];
									}

									wfs.groupLayers = this.jsonSearchServices[i]['groupLayers'];
									var group = this.jsonSearchServices[i]['groupLayers'];
									if (group != 'editables') {
										var subgroup = this.jsonSearchServices[i]['subgroupLayers'];
										if (!!subgroup) {
											wfs.groupLayers = group + "-"
													+ subgroup;
										}

										wfs.subgroupLayers = subgroup;
										if (!this.groupLayers
												.containsKey(group)) {
											this.groupLayers
													.add(
															group,
															new Ext.util.MixedCollection());
										}
										this.groupLayers.item(group).add(
												subgroup, subgroup);
									}

									wfs.geom = this.jsonSearchServices[i]['geometry'];

									wfs.id = this.jsonSearchServices[i]['id'];
									if (this.map 
											&& this.map.getLayersByName(wfs.name).length == 0){
										this.map.addLayer(wfs);
									}
									this.searchServices[this.jsonSearchServices[i]['name']] = wfs;
								}
							}
						}
					},

					/**
					 * private: method[createStyleMap] Creates the default style
					 * map.
					 * 
					 * :return: ``OpenLayers.StyleMap`` The style map.
					 */
					createStyleMap : function() {
						var sketchSymbolizers = {
							"Point" : {
								fillColor : "#ee9900",
								fillOpacity : 0.4,
								hoverFillColor : "white",
								hoverFillOpacity : 0.8,
								strokeColor : "#ee9900",
								strokeOpacity : 1,
								strokeWidth : 1,
								strokeLinecap : "round",
								strokeDashstyle : "solid",
								hoverStrokeColor : "red",
								hoverStrokeOpacity : 1,
								hoverStrokeWidth : 0.2,
								pointRadius : 6,
								hoverPointRadius : 1,
								hoverPointUnit : "%",
								pointerEvents : "visiblePainted",
								cursor : "inherit"
							},
							"Line" : {
								fillColor : "#ee9900",
								fillOpacity : 0.4,
								hoverFillColor : "white",
								hoverFillOpacity : 0.8,
								strokeColor : "#ee9900",
								strokeOpacity : 1,
								strokeWidth : 1,
								strokeLinecap : "round",
								strokeDashstyle : "solid",
								hoverStrokeColor : "red",
								hoverStrokeOpacity : 1,
								hoverStrokeWidth : 0.2,
								pointRadius : 6,
								hoverPointRadius : 1,
								hoverPointUnit : "%",
								pointerEvents : "visiblePainted",
								cursor : "inherit"
							},
							"Polygon" : {
								fillColor : "#ee9900",
								fillOpacity : 0.4,
								hoverFillColor : "white",
								hoverFillOpacity : 0.8,
								strokeColor : "#ee9900",
								strokeOpacity : 1,
								strokeWidth : 1,
								strokeLinecap : "round",
								strokeDashstyle : "solid",
								hoverStrokeColor : "red",
								hoverStrokeOpacity : 1,
								hoverStrokeWidth : 0.2,
								pointRadius : 6,
								hoverPointRadius : 1,
								hoverPointUnit : "%",
								pointerEvents : "visiblePainted",
								cursor : "inherit"
							}
						};

						return new OpenLayers.StyleMap({
							"default" : new OpenLayers.Style(null, {
								rules : [ new OpenLayers.Rule({
									symbolizer : sketchSymbolizers
								}) ]
							})
						});
					},

					/**
					 * Set the active layer in maps controls
					 * 
					 * Parameter
					 * 
					 * layer - <OpenLayers.Layer> active
					 * 
					 * See also
					 * 
					 * <West>
					 */
					setActiveLayer : function(layer) {
						var disableEditing = !(layer instanceof OpenLayers.Layer.Vector);
						Ext
								.each(
										this.map.controls,
										function(c, i) {
											// Importante: no todos los
											// controles quieren que les //
											// Importante: Los controles
											// monocapa son los que hay que
											// modificarles el layer
											if (c.id
													.indexOf("OpenLayers.Control.EditFeatureAttributes") == 0) {
												c.setLayer([ layer ]);
											} else if (c.id
													.indexOf("SiceCAT.Control.SapoDragFeature") == 0) {
												c.setLayer(layer);
											} else if (c.id
													.indexOf("OpenLayers.Control.ModifyFeatureControl") == 0) {
												c.setLayer(layer);
											} else if (c.name
													&& c.name == "OpenLayers.Control.DeleteFeature") {
												c.setLayer([ layer ]);
											} else if (c.name
													&& (c.name == "DrawPolygon"
															|| c.name == "DrawLine" || c.name == "DrawPoint")) {
												c.layer = layer;
											}
										});

						this.activeLayer = layer;

						if (disableEditing || !layer.geom) {
							actions.draw_point.setDisabled(disableEditing);
							actions.draw_line.setDisabled(disableEditing);
							actions.draw_poly.setDisabled(disableEditing);
						} else {
							if (layer.geom == "POINT")
								actions.draw_point.setDisabled(disableEditing);
							else if (layer.geom == "LINE")
								actions.draw_line.setDisabled(disableEditing);
							else
								actions.draw_poly.setDisabled(disableEditing);
						}
						actions.drag_feature.setDisabled(disableEditing);
						actions.edit_feature.setDisabled(disableEditing);
						actions.delete_feature.setDisabled(disableEditing);
						actions.edit_attributes.setDisabled(disableEditing);
					},

					selectedFeatures : {},

					/* Keep track of the selected features */
					addSelected : function(feature) {
						// alert("add " + feature);
						// alert("this.sicecatInstance -_>
						// "+Sicecat.sicecatInstance);
						// alert("this.selectedFeatures -_>
						// "+this.selectedFeatures);
						var id;
						if (!!feature.data && !!feature.data.pk_id
								&& !isNaN(feature.data.pk_id)) {
							id = feature.data.pk_id;
						} else {
							Sicecat.auxId = Sicecat.auxId + 1;
							id = Sicecat.auxId;
						}
						feature.data.pk_id = id;
						feature.stylePrevius = feature.style;
						feature.style = Sicecat.styles["select"];
						if (!!Sicecat.activeLayer) {
							Sicecat.activeLayer.drawFeature(feature,
									feature.style);
						}
						integrator.msGisAddSelectedElement(id);
						Sicecat.selectedFeatures[id] = feature;
					},

					/* Clear the list of selected features */
					clearSelected : function(feature) {
						var id = feature.data.pk_id;
						feature.style = feature.stylePrevius;
						if (!!feature.style && !!Sicecat.activeLayer) {
							Sicecat.activeLayer.drawFeature(feature,
									feature.style);
						} else if (!!Sicecat.activeLayer
								&& !!Sicecat.activeLayer.styleMap.styles["default"].defaultStyle) {
							Sicecat.activeLayer
									.drawFeature(
											feature,
											Sicecat.activeLayer.styleMap.styles["default"].defaultStyle);
						}
						integrator.msGisDelUnselectedElement(id);
						Sicecat.selectedFeatures[id] = null;
					},

					/* Feature starting to move */
					startDrag : function(feature, pixel) {
						Sicecat.addSelected(feature);
						Sicecat.lastPixel = pixel;
					},

					/* Feature moving */
					doDrag : function(feature, pixel) {

						Sicecat.lastPixel = pixel;
						var res = Sicecat.map.getResolution();
						feature.geometry.move(res
								* (pixel.x - Sicecat.lastPixel.x), res
								* (Sicecat.lastPixel.y - pixel.y));

						if (!!Sicecat.activeLayer) {
							Sicecat.activeLayer.drawFeature(Sicecat.feature);
						} else if (!!vector) {
							Sicecat.activeLayer = vector;
							vector.drawFeature(Sicecat.feature);
						}
					},

					/* Featrue stopped moving */
					endDrag : function(feature, pixel) {
						for (f in Sicecat.selectedFeatures) {
							f.state = OpenLayers.State.UPDATE;
						}
						Sicecat.clearAllSelected();
					},

					/* Clear all selected features */
					clearAllSelected : function() {
						for ( var id in Sicecat.selectedFeatures) {
							if (!!Sicecat.selectedFeatures[id]) {
								Sicecat
										.clearSelected(Sicecat.selectedFeatures[id]);
							}
						}
						Sicecat.selectedFeatures = {};
					},
					
					/**
					 * Method: isOwnerlayer
					 * 
					 * Comprueba si el usuario tiene permisos sobre la capa
					 * 
					 * @param layer
					 * 
					 * @returns {Boolean}
					 */
					isOwnerlayer: function (layer){
						return (Sicecat.GROUP_IDS.SUPERADMIN == layer.groupID 
								&& (Sicecat.user.permisos.indexOf("admin1") > -1))
							|| (Sicecat.GROUP_IDS.CECAT == layer.groupID 
									&& (Sicecat.user.permisos.indexOf("admin2") > -1))
							|| ((Sicecat.GROUP_IDS.GPCL == layer.groupID)
									&& (Sicecat.user.permisos.indexOf("admin2") > -1))
							|| (!layer.groupID 
									//&& layer.userID == Sicecat.user.login
									);
					},

					CLASS_NAME : "SiceCAT"
				});
