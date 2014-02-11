/*
 * ExportWFS.js
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
 */

/*
 * Class: OpenLayers.Control.ExportWFS
 * 
 * Export WFS data in CSV format
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2011
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Author:
 * 
 *  Mariano López Muñoz (mlopez@emergya.com)
 *  
 *  Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.ExportWFS = OpenLayers
		.Class(
				SiceCAT.Control.Exporter,
				{
					/*
					 * Property: displayClass
					 * 
					 * Display class name, for CSS.
					 */
					displayClass : "ExportWFS",
					/*
					 * Property: type
					 * 
					 * Type of Control
					 */
					type : OpenLayers.Control.TYPE_BUTTON,
					/*
					 * Property: window
					 * 
					 * Last window opened
					 */
					window : null,

					/*
					 * Property: exportarWFSText
					 * 
					 * <String> text to show
					 */
					exportarWFSText : "Exportar WFS en formato CSV",

					/*
					 * Property: capaText
					 * 
					 * <String> text to show
					 */
					capaText : "Capa:",

					/*
					 * Property: exportarText
					 * 
					 * <String> text to show
					 */
					exportarText : "Exportar",

					/*
					 * Property: closeText
					 * 
					 * <String> text to show
					 */
					closeText : "Cerrar",

					/*
					 * Property: numFeaturesText
					 * 
					 * <String> template showing number of features on extent
					 */
					numFeaturesText : "Listo para exportar {0} features visibles en el extent",

					/** i18n */
					stateNotLayerText : "Seleccione una capa el el selector",
					stateLayerLoadedText : "<ul><li>Listo para exportar {0} elementos visibles</li><li>Pulse en 'Exportar' para obtener el CSV</li></ul>",
					stateNotFoundText : "No se han encontrado elementos",
					downloadFileText : "{0}.csv",
					errorExport: "Error",
					msgErrorExportar: "Error al recuperar los atributos",
				    
				    /** 
				     * APIProperty: numDigits
				     * {Integer}
				     */
				    numDigits: 2,
				    
				    numDigitsPerProjection:{
				    	"EPSG:4326": 6	
				    },

					/*
					 * Property: statusBar
					 * 
					 * <Ext.ux.StatusBar> bar with control information
					 */
					statusBar : null,

					visibleFeatures : new Array(),

					/*
					 * Function: moveHandler
					 * 
					 * Listens mouse movements and recalculate number of
					 * features currently on the extent
					 */
					moveHandler : function(event) {
						var layer;
						if (!this.layerNotGeneric && Ext.getCmp("layerName")) {
							var layerIndex = Ext.getCmp("layerName").value;
							layer = this.map.layers[layerIndex];
						} else {
							layer = this.layerNotGeneric;
						}

						var enc = false;

						var features;
						if (!!layer && !!layer.selectedFeatures
								&& layer.selectedFeatures.length > 0) {
							// Only selected features
							features = new Array();
							Ext.each(layer.selectedFeatures, function(feature,
									j) {
								features.push(feature);
								enc = true;
							});
							this.visibleFeatures = features;
						} else {
							// All features
							this.visibleFeatures = new Array();
							if (layer) {
								var poly = layer.map.getExtent().toGeometry();
								if (!this.lastExtent
										|| !this.lastExtent.equals(poly.bounds)) {
									this.updateMessage(null);
									this.poly = poly;
									Ext.each(layer.features, function(item) {
										if (poly.intersects(item.geometry)) {
											this.visibleFeatures.push(item);
											enc = true;
										}
									}, this);
								}
							}
						}

						if (enc) {
							this.updateMessage(String.format(
									this.stateLayerLoadedText,
									this.visibleFeatures.length));
						} else if (!layer) {
							this.updateMessage(this.stateNotLayerText);
						} else {
							this.updateMessage(this.stateNotFoundText);
						}
					},

					/*
					 * Function: updateMessage
					 * 
					 * Modify the message of the state bar
					 */
					updateMessage : function(text) {
						// Ext.getCmp("features_label").update(text);
						if (!text)
							this.statusBar.showBusy();
						else {
							this.statusBar.setText(text);
						}
					},

					/*
					 * Function: getLayers
					 * 
					 * Returns the layers that are both visible and selectable
					 */
					getLayers : function() {
						var layer_data = new Array();
						Ext
								.each(
										map.layers,
										function(item, index) {
											if (item.visibility
													&& (item.CLASS_NAME == "OpenLayers.Layer.Vector" && item.protocol)) {
												layer_data.push([ index,
														item.name ]);
											}
										});

						return layer_data;
					},

					/*
					 * Function: trigger
					 * 
					 */
					trigger : function() {
						var capaText = this.capaText;
						var exportarWFSText = this.exportarWFSText;
						var numFeaturesText = this.numFeaturesText;

						var layer_label = new Ext.form.Label({
							xtype : 'label',
							forId : 'layerName',
							text : capaText,
							margins : '10 10 10 10'
						});

						var controlExporter = this;
						var textState;

						if (!this.layerNotGeneric) {
							var layer = new Ext.form.ComboBox({
								id : 'layerName',
								typeAhead : true,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								store : new Ext.data.ArrayStore({
									id : 0,
									fields : [ 'myId', 'displayText' ],
									data : this.getLayers()
								}),
								valueField : 'myId',
								displayField : 'displayText',
								listeners : {
									'select' : this.moveHandler,
									scope : this
								}
							});
							textState = this.stateNotLayerText;
						} else {
							var layer = new Ext.Container({
								items : [ new Ext.form.TextField({
									anchor : "90%",
									name : 'layerName',
									fieldLabel : capaText,
									value : this.layerNotGeneric.name,

									readOnly : true
								}) ]
							});
							textState = this.stateNotFoundText;
						}

						var features_label = new Ext.ux.StatusBar({
							defaultText : textState,
							width : 240,
							height : 50
						});

						this.statusBar = features_label;

						var embeddedDownloadify = this.getEmbeddedDownloadify("exportButton_csv_" + this.layer.name);

						var formPanel = new Ext.Window({
							id:"formExport",
							width : 250,
							title : exportarWFSText,
							maximizable : true,
							control : this,
							items : [ layer_label, layer, features_label ],
							onHide : function() {
//								Ext.get(controlExporter.map.div)
//										.removeListener("move",
//												controlExporter.moveHandler,
//												controlExporter);
								controlExporter.closed = true;
								map.events.unregister("move", controlExporter, controlExporter.moveHandler);
								map.events.unregister("moveend", controlExporter, controlExporter.prepareData);
							},
							onShow : function() {
//								Ext.get(controlExporter.map.div).addListener(
//										"move", controlExporter.moveHandler,
//										controlExporter);
								map.events.register("move", controlExporter, controlExporter.moveHandler);
								map.events.register("moveend", controlExporter, controlExporter.prepareData);
							}
						});
						formPanel.addButton(embeddedDownloadify);
						formPanel.addButton({
							text : this.closeText,
							handler : function() {
								this[this.closeAction]();
							},
							scope : formPanel
						});

						this.window = formPanel;
						this.window.show();
						this.moveHandler();
						this.prepareData();
					},

					/**
					 * Method: prepareData
					 * 
					 * Prepare data for be exported as CSV
					 * 
					 */
					prepareData : function() {
						var layer;
						if (!this.layer && Ext.getCmp("layerName")) {
							var layerIndex = Ext.getCmp("layerName").value;
							layer = this.control.map.layers[layerIndex];
						} else {
							layer = this.layer;
						}

						// Extraer la cabecera con todos los atributos de la
						// capa
						
						if(!layer.protocol){
							this.prepareDataVectorLayer(layer);
						}else if(!!layer.protocol.format 
								&& ((layer.protocol.format instanceof OpenLayers.Format.WFST.v1) // extensiones de v1
								|| (layer.protocol.format instanceof OpenLayers.Format.WFST.v1_0_0)) // o){
								){
							this.prepareDataWFS(layer);
						}else{
							this.prepareDataVector(layer);
						}
							
					},
					
					prepareDataVector: function(layer){
						var headerAtr = [];
						this.prepareAttributes(headerAtr, false);
					},
					
					prepareDataWFS: function(layer){
						var layerURL;
						if (layer.protocol.url.indexOf("?") == -1) {
							layerURL = layer.protocol.url + "?";
						} else {
							layerURL = layer.protocol.url;
						}

						var urlVectorWFS = layerURL
								+ "&request=DescribeFeatureType&typeName="
								+ layer.protocol.featurePrefix + ":"
								+ layer.protocol.featureType;
						
						/* GetURLProxy */
						urlVectorWFS = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.CARTOGRAFIA, urlVectorWFS);
//						if(urlVectorWFS.indexOf(OpenLayers.ProxyHost) != 0){
//							urlVectorWFS = OpenLayers.ProxyHost + urlVectorWFS;
//						}
						
						var requestSuccess = function(response){
							var format = new OpenLayers.Format.WFSDescribeFeatureType();
							var output = format.read(response.responseText);
							var properties = output.featureTypes[0].properties;
							var headerAtr = [];
							for(var i=0; i<properties.length; i++){
								if(properties[i].type != "gml:GeometryPropertyType" && properties[i].type != "xsd:hexBinary"){
									headerAtr.push(properties[i].name);
								}
							}
							this.prepareAttributes(headerAtr, false);
						};
						
						var requestFailure = function(response){
							Ext.Msg.alert(this.errorExport, this.msgErrorExportar);
						};
						
						// Petición de datos al servicio
						OpenLayers.Request.GET({
							url : urlVectorWFS,
							scope : this,
							failure : requestFailure,
							success : requestSuccess
						});
					},

					/**
					 * Method: setLayerToExport
					 * 
					 * Setter for layer to be exported
					 * 
					 * Parameters layer - <OpenLayers.Layer.Vector> to be
					 * exported
					 */
					setLayerToExport : function(layer) {
						this.layerNotGeneric = layer;
						this.layer = layer;
					},
				    
				    /**
					 * Method: parseGeometry
					 * 
					 * Parse geometry with projections origin and target
					 */
				    parseGeometry: function(geometry, projOrig, projTarget){
				    	
				    	if(!!geometry){
					    	if(!!geometry.components){
					    		for(var i = 0; i< geometry.components.length; i++){
					    			if(!!geometry.components[i]){
						    			this.parseGeometry.apply(
						                    this, [geometry.components[i], projOrig, projTarget]
						                );
					    			}
					    		}
					    	}else{
					    		geometry = OpenLayers.Projection.transform(geometry, projOrig, projTarget);
					    	}
				    	}
				    },
					
					prepareDataVectorLayer: function(layer){
						var header = new Array();
						for (key in layer.features[0].attributes) {
							header.push("\"" + key + "\"");
						}
						this.prepareAttributes(header, true);
					},
					
					defaultProj: "EPSG:4326",
					
					prepareAttributes: function(header, atr){
						var xyAdded = false;
						var table = new Array();
						
						var projection = this.map.projection;
				    	var numDigits = this.numDigitsPerProjection[projection] | this.numDigits;
			    		
						Ext.each(this.visibleFeatures,function(feat) {
							var array = new Array();
							if (!!feat.geometry && (feat.geometry instanceof OpenLayers.Geometry.Point) && !xyAdded) {
								header.push("X");
								header.push("Y");
								header.push("Projection");
								xyAdded = true;
							}
							if(atr){
								Ext.each(feat.attributes, function(atr) {
									for(i in atr) {
										array.push("\"" + atr[i] + "\"");
									}
								});
								table.push(array.join(";"));
							}else{
								Ext.each(header, function(h) {
									if(feat.attributes[h] != undefined){
										array.push("\"" + feat.attributes[h] + "\"");
									}else if(h == "X"){
										array.push("\"" + feat.geometry.x.toFixed(numDigits) + "\"");
									}else if(h == "Y"){
										array.push("\"" + feat.geometry.y.toFixed(numDigits) + "\"");
									}else if(h == "Projection"){
										if(projection == "EPSG:23031"){
											projection = "UTM ED50 31N";
										}else if(projection == "EPSG:25831"){
											projection = "UTM ETRS89 31N";
										}else if(projection == "EPSG:4326"){
											projection = "WGS84";
										}
										array.push("\"" + projection + "\"");
									}else{
										array.push("\"\"");
									}
								});
								table.push(array.join(";"));
							}
						});
						var headerRes = [];
						if(!atr){
							for(var i=0; i<header.length; i++){
								headerRes.push("\"" + header[i] + "\"");
							}
						}else{
							headerRes = header;
						}
						var fileName = String.format(this.downloadFileText,
								this.layer.name, "CSV");

						var mimeType = "data:text/csv;filename:"
								+ this.fileName + ";base64,";

						var data = Base64.encode(headerRes.join(";") + "\n"
								+ table.join("\n"));

						var downloadSuccessText = String.format(
								this.downloadSuccessText, "CSV",
								this.layer.name);
						this.getExportButton(fileName, data,
								"exportButton_csv_" + this.layer.name,
								this.downloadSuccessTitleText,
								downloadSuccessText,
								this.downloadCancelTitleText,
								this.downloadCancelText,
								this.downloadErrorTitleText,
								this.downloadErrorText, this.helpText,
								this.statusBar);
					},
					
					onCompleteRequest: function(){
			    		this.window.close();
			    		var successMsg = String.format(this.downloadSuccessText, "CSV", this.layer.name);
			    		Ext.Msg.alert(this.downloadSuccessTitleText, successMsg);
					},

					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "ExportWFS"
				});
