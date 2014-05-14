/*
 * SiceCAT.Control.GetFeatureInfo.js
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
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 * 
 * Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: SiceCAT.Control.GetFeatureInfo
 * 
 * The GetFeatureInfo control shows a window with information of features at evt
 * click
 * 
 * It is designed to be used with a <OpenLayers.Control.Panel>
 * 
 * Inherits from: - <OpenLayers.Control.GetFeature>
 * 
 */
SiceCAT.Control.GetFeatureInfo = OpenLayers
		.Class(
				OpenLayers.Control.GetFeature,
				{

					/** i18n */

					/*
					 * Property: type
					 * 
					 * Type of Control
					 */
					type : OpenLayers.Control.TYPE_TOOL,

					/** i18n * */
					nameText : 'Name',
					typeText : 'Type',
					titleWinCoord : 'Coordinates',
					titleWarningWin : 'Warning',
					msgWarningWin : 'The layers {0} has not found.',
					

					/*
					 * Function: trigger
					 * 
					 */
					trigger : function() {
						if (this.map == null || this.map.div == null)
							return;
					},
					activate : function() {
						OpenLayers.Control.prototype.activate.apply(this, []);

						var this_ = this;

						Ext.get(this.map.div).addListener("click",
								this_.clickEvent, this_);
					},
					deactivate : function() {
						OpenLayers.Control.prototype.deactivate.apply(this, []);
						var this_ = this;
						Ext.get(this.map.div).removeListener("click",
								this_.clickEvent, this_);
					},
					clickEvent : function(evt) {
						if(Ext.isGecko){
							var evento = ((window.event)?(event):(evt));
							if(evento && evento.xy){
								return this.selectClick(evento.xy.x, evento.xy.y, this);
							}
						}else{
							if (event.xy) {
								return this.selectClick(event.xy.x, event.xy.y, this);
							}
						}
						
					},
					initialize : function(options) {
						OpenLayers.Control.prototype.initialize.apply(this,
								[ options ]);
					},

					/*
					 * Function: setLayer
					 * 
					 * Choose the layer in which the control will work.
					 */
					setLayer : function(layer) {
						this.layer = layer;
					},

					/**
					 * Method: selectClick Called on click
					 * 
					 * Parameters: evt - {<OpenLayers.Event>}
					 */
					selectClick : function(x, y, this_) {
						return this.getFeatureInfo(x, y);
					},
					
				

					/**
					 * Method: getFeatureInfo
					 * 
					 * Obtiene la inforamcion de las capas disponibles para el
					 * punto seleccionado
					 * 
					 * Paramerters: - posX - posY - direccion - municipio -
					 * comarca
					 */
					getFeatureInfo : function(posX, posY, direccion, municipio,
							comarca) {
						var integradorAPI = integrator;

						var evt = new Object();
						evt.x = posX;
						evt.y = posY;

						evt.xy = evt;

						var layers_availables = [];
						var layers_map = {};
						var layers_request = [];
						var result = [];
						var exc_layers = [];
						var urlSigescat = null;
						var indexUrl = Sicecat.defaultWMSServer.indexOf("?");
						if(indexUrl != -1){
							urlSigescat = Sicecat.defaultWMSServer.replace("?", "");
						}else{
							urlSigescat = Sicecat.defaultWMSServer;
						}
						Ext.each(map.layers, function(layer, index) {
							if (layer.visibility) {
								var type = null;
								if (layer instanceof OpenLayers.Layer.WMS && !(layer instanceof SiceCAT.Layer.WMS_SIGESCAT)){
									type = "WMS";
								}else if (layer instanceof OpenLayers.Layer.Vector && !!layer.protocol){
									type = "WFS";
								}
								if (type != null && layer.name.indexOf("OpenLayers") < 0 && !layers_map[layer.name]){
									if(layer.protocol && 
											(layer.protocol.format instanceof OpenLayers.Format.KML || 
													layer.protocol.format instanceof OpenLayers.Format.GML)){
										// Do anything
									}else{
										layers_availables.push([layer.name, type, layer ]);
										if(layer.params != null && layer.params.LAYERS != null){
											var layer_name = layer.params.LAYERS;
											var layer_url = layer.url;
											var security = false;
											if(layer.params.SECURITY){
												security = true;
											}
											layers_request.push({
												layer: layer_name,
												url: layer_url,
												security: security
											});
											result.push({layer: layer.params.LAYERS, res: null, loaded: false});
										}
										
										layers_map[layer.name] = true;
									}
								}
							}
						});
						
						
						var waitMsg = new Ext.LoadMask(Ext.getBody(), {
							msg : "Loading ..."
						});
						waitMsg.enable(true);
						waitMsg.show();
						
						var this_ = this;
						// Procesado unitario de las peticiones wms
						if(layers_request.length == 0){
							waitMsg.hide();
						}
						Ext.each(layers_request, function(layer_obj, index) {
							(function(){
								waitMsg.hide();
							}).defer(30000);
								Ext.Ajax.request({
								    url: Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, layer_obj.url),
								    method: 'GET',
								    params: {
								    	SERVICE: 'WMS',
								    	VERSION: '1.1.1',
								    	REQUEST: 'GetFeatureInfo',
								        LAYERS: layer_obj.layer,
								        QUERY_LAYERS: layer_obj.layer,
								        INFO_FORMAT: 'application/vnd.ogc.gml',
								        BBOX: map.getExtent(),
								        X: posX,
								        Y: posY,
								        HEIGHT: map.size.h,
								        WIDTH: map.size.w,
								        SRS: map.getProjection(),
								        SECURITY: layer_obj.security
								    },
								    success: function(response, options){
								        var text = response.responseText;
								        var theParser = new OpenLayers.Format.GML();
								        var feature = theParser.read(text)[0];
								        var name_feature = "";
								        if(feature != null && feature.gml != null){
								        	// La respuesta es correcta
							        		if(feature.gml.featureNSPrefix != null){
							        			name_feature += feature.gml.featureNSPrefix + ":";
							        		}
							        		if(feature.gml.featureType != null){
							        			name_feature += feature.gml.featureType;
							        		}else if(name_feature.indexOf(":") != -1){
							        			name_feature = name_feature.replace(":", "");
							        		}
							        	}else if(feature == null){
							        		// La respuesta es una excepcion
							        		for(var i=0; i<result.length; i++){
							        			if(options.params.LAYERS == result[i].layer){
							        				// Ponemos a true para que se muestren el resto de capas
							        				result[i].loaded = true;
							        			}
							        		}
							        		// Parseamos la excepcion
							        		var parserExc = new OpenLayers.Format.OGCExceptionReport();
							        		var featureExc = parserExc.read(text);
							        		var exceptions = null;
							        		if(featureExc != null 
							        				&& featureExc.exceptionReport != null 
							        				&& featureExc.exceptionReport.exceptions != null){
							        			exceptions = featureExc.exceptionReport.exceptions;
							        			for(var i=0; i<exceptions.length; i++){
							        				if(exceptions[i] != null && exceptions[i].text != null){
							        					exc_layers.push(options.params.LAYERS);
							        				}
							        			}
							        		}
							        		layer_store.fireEvent('failureStore');
							        	}
								        if(name_feature != null){
								        	Ext.each(result, function(res_value, index){
								        		if(res_value.layer == name_feature){
								        			// Recorremos layer_availables y nos quedamos con la del mismo nombre
								        			for(var i=0; i<layers_availables.length; i++){
								        				if(layers_availables[i][2] != null 
								        						&& layers_availables[i][2].params != null 
								        						&& layers_availables[i][2].params.LAYERS != null
								        						&& layers_availables[i][2].params.LAYERS == name_feature){
								        					res_value.res = layers_availables[i];
								        				}
								        			}
								        		}
								        	});
								        	result = this_.postproccess(result, layer_store, waitMsg);
								        }
								    },
								    scope: this
								});
							
						});
						
						var layer_store = new Ext.data.Store(
								{
									proxy : new Ext.data.MemoryProxy(
											layers_availables),
									reader : new Ext.data.ArrayReader({}, [ {
										name : 'name'
									}, {
										name : 'type',
										type : 'string'
									}, {
										name : 'layer'
									} ]),
									listeners: {
										'load': function(records, options){
											if(grid.getStore() != null && grid.getStore().getCount() == layer_store.getCount()){
												waitMsg.hide();
											}
										},
										'failureStore': function(records, options){
											if(grid.getStore() != null && grid.getStore().getCount() == layer_store.getCount()){
												waitMsg.hide();
												var strError = "";
												if(exc_layers != null && exc_layers.length > 0){
													for(var i=0; i<exc_layers.length; i++){
														if(i==0){
															strError += exc_layers;
														}else{
															strError += ", " + exc_layers;
														}
													}
													strError = String.format(this_.msgWarningWin, strError);
													Ext.Msg.alert(this_.titleWarningWin, strError);
												}
											}
										}
									}
								});
						var colModel = new Ext.grid.ColumnModel([ {
							dataIndex : 'name',
							header : this.nameText
						}]);
						var selModel = new Ext.grid.RowSelectionModel({
							singleSelect : true
						});
						var gridView = new Ext.grid.GridView({
							forceFit : true
						});

						var myMask = new Ext.LoadMask(Ext.getBody(), {
							msg : "Loading ..."
						});

						var layerInfo = this.infoCapa;
						var nameAtr = this.nameAtribute;
						var valueAtr = this.nameValue;

						var grid = new Ext.grid.GridPanel(
								{
									autoHeight : true,
									//width : 478,
									store : layer_store,
									view : gridView,
									colModel : colModel,
									selModel : selModel,
									listeners : {
										'rowclick' : function(grid, rowIndex, e) {
											myMask.enable(true);
											myMask.show();
											var rec = grid.store.getAt(rowIndex);
											var layer = rec.get('layer');
											var pixel = new OpenLayers.Pixel(posX, posY);
											if (layer instanceof OpenLayers.Layer.WMS) {
												control = new OpenLayers.Control.WMSGetFeatureInfo(
														{
															layers : [ layer ],
															title : layer.name,
															vendorParams: {
																SECURITY: layer.params.SECURITY
															},
															handleResponse : function(
																	xy,
																	request,
																	url) {
																if (Sicecat.isLogEnable)
																	console
																			.log(request);
																var message = request.responseText;

																if (request.responseXML != null) {
																	var format = new OpenLayers.Format.XML();
																	var element = format
																			.read(
																					message)
																			.getElementsByTagName(
																					"ServiceExceptionReport")[0];
																	var texto = element
																			.getElementsByTagName("ServiceException")[0].textContent;
																	message = texto;
																}

																var popup = new Ext.Window(
																		{
																			title : layer.name,
																			//location : pixel,
																			map : map,
																			//width : 700,
																			html : message,
																			layout: 'fit',
																			collapsible : false,
																			autoScroll : true,
																			listeners : {
																				'afterrender' : function(popup) {
																					myMask.hide();
																				}
																			}
																		});

																popup.doLayout();
																popup.show();
															}
														});
												map.addControl(control);

												control.request(evt, {
													hover : true
												});

											} else {
												// Fabricamos un array que
												// servir� de almac�n de
												// features
												fs = [];
												// Obtenemos el lonlat y su
												// punto a partir del pixel
												var lonlat = map
												.getLonLatFromViewPortPx(pixel);
												if (layer.features.length > 0) {
													
													
													var point = new OpenLayers.Geometry.Point(
															lonlat.lon,
															lonlat.lat);
													// Detectamos si es o no un
													// punto
													if (layer.geom == "POINT" 
														|| (!!layer.protocol && layer.protocol.geometry == "POINT")) {
														// Tratamiento para el
														// punto
														var min = layer.features[0].geometry
																.distanceTo(point);
														var feat = layer.features[0];
														var BaseDistance = map.resolution * 10;
														for ( var i = 1; i < layer.features.length; i++) {
															var geom = layer.features[i].geometry;
															if (geom
																	.distanceTo(point) < min) {
																min = layer.features[i].geometry
																		.distanceTo(point);
																feat = layer.features[i];
															}
														}
														if (min <= BaseDistance) {
															fs.push(feat);
														}
													} else if (layer.geom == "POLYGON" 
														|| (!!layer.protocol && layer.protocol.geometry == "POLYGON")) {
														// Tratamiento para el
														// poligono
														Ext
																.each(
																		layer.features,
																		function(
																				feature,
																				index) {
																			if (feature.geometry
																					.containsPoint(point))
																				fs
																						.push(feature);
																		});
													} else if (layer.geom == "LINE" 
														|| (!!layer.protocol && layer.protocol.geometry == "LINE")) {
														// Tratamiento para la
														// l�nea
														var min = point
																.distanceTo(layer.features[0].geometry);
														var feat = layer.features[0];
														var BaseDistance = map.resolution * 3;
														for ( var i = 1; i < layer.features.length; i++) {
															var geom = layer.features[i].geometry;
															if (point
																	.distanceTo(geom) < min) {
																min = point
																		.distanceTo(geom);
																feat = layer.features[i];
															}
														}
														if (min <= BaseDistance) {
															fs.push(feat);
														}
													}
												}
												if (fs.length > 0) {
													Ext
															.each(
																	fs,
																	function(f) {
																		var data = f.data;
																		var myData = [];
																		for (p in data) {
																			myData
																					.push([
																							p,
																							data[p] ]);
																		}
																		var store = new Ext.data.ArrayStore(
																				{
																					// store
																					// configs
																					autoDestroy : true,
																					storeId : 'myStore',
																					// reader
																					// configs
																					idIndex : 0,
																					fields : [
																							{
																								name : 'atribute',
																								type : 'string'
																							},
																							{
																								name : 'value',
																								type : 'string'
																							} ],
																					data : myData
																				});
																		var grid = new Ext.grid.GridPanel(
																				{
																					title : layer.name,
																					store : store,
																					columns : [
																							{
																								header : 'Atributes',
																								dataIndex : 'atribute',
																								width : 100
																							},
																							{
																								header : 'Values',
																								dataIndex : 'value',
																								width : 100
																							} ],
																					autoHeight : true,
																					width : 200

																				});
																		var pixel = new OpenLayers.Pixel(posX, posY);
																		var point = map.getLonLatFromViewPortPx(pixel);
																		var popup = new GeoExt.Popup(
																				{
																					title : f.layer.name + " ("+this_.titleWinCoord+": X=" +  point.lon + "-"
																					+ "Y="+ point.lat + ")",
																					location : f,
																					width : 200,
																					collapsible : false,
																					listeners : {
																						'afterrender' : function(
																								popup) {
																							myMask
																									.hide();
																						}
																					},
																					items : [ grid ]
																				});
																		popup
																				.doLayout();
																		popup
																				.show();

																	});
												} else {
													var pixel = new OpenLayers.Pixel(posX, posY);
													var point = map.getLonLatFromViewPortPx(pixel);
													var popup = new Ext.Window(
															{
																title : "Error " + " ("+this_.titleWinCoord+": X=" +  point.lon + "-"
																		+ "Y="+ point.lat + ")",
																//location : lonlat,
																map : map,
																width : 200,
																html : integradorAPI.errorFeatureNotFound,
																collapsible : false,
																listeners : {
																	'afterrender' : function(popup) {
																		myMask.hide();
																	}
																}
															});
													popup.doLayout();
													popup.show();

												}
											}
										}
									}
								});

						var win = Ext.WindowMgr.get("layers_grid");
						if (win != null) {
							win.close();
						}
						var pixel = new OpenLayers.Pixel(posX, posY);
						var point = map.getLonLatFromViewPortPx(pixel);
						var this_ = this;
						win = new Ext.Window({
							closeAction : 'close',
							width : 700,
							height : 300,
							id : 'layers_grid',
							layout : 'fit',
							autoScroll : true,
							title : integradorAPI.availableLayers +" ("+ this_.titleWinCoord+ ": X=" + point.lon + " Y=" + point.lat + ")",
							items : [ grid ]
						});
						win.on("close", function(){
							waitMsg.hide();
						});
						//win.show();
						return grid;
					},
					
					/* Post-Proccessing */
					postproccess: function(result, layer_store, waitMsg){
						Ext.each(result, function(value, index){
							if(value.res != null && !value.loaded){
								layer_store.loadData([value.res], true);
								value.loaded = true;
							}
						});
						/*var end = true;
						for(var i=0; i<result.length; i++){
							end = end && result[i].loaded;
						}
						if(end){
							waitMsg.hide();
						}*/
						return result;
					},
					
					
					setMap : function(map) {
						OpenLayers.Control.prototype.setMap
								.apply(this, [ map ]);
					},

					CLASS_NAME : "SiceCAT.Control.GetFeatureInfo"
				});
