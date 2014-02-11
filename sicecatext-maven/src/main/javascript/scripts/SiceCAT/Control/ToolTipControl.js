/*
 * ToolTipControl.js
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
 * Class: OpenLayers.Control.ToolTipControl
 * 
 * Shows an html tooltip on the form of a popup when the mouse hovers over a
 * feature.
 * 
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control.SelectFeature>
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
 *  María Arias de Reyna Domínguez(marias@emergya.com)
 *  
 *  Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.ToolTipControl = OpenLayers
		.Class(
				OpenLayers.Control.SelectFeature,
				{
					/*
					 * Group: internal
					 */
					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "OpenLayers.Control.ToolTipControl",
					
					/** i18n **/
					featureTitleText: "Layer {0}: element data",
					featureTitleTextAPI: "{0} layer element: {1}",
					titlePopup: "Informacion",
					titleSeeMore: "Ver mas",
					titleReverseGeocoding: "Reverse Geocoding",
					nameProperty: "Property",
					valueProperty: "Value",
					
					/*
					 * Property: popups
					 * 
					 * Array of popups (tooltips) opened with this control and
					 * not closed.
					 */
					popups : new Array(),
					
					selectFeatureEvent: false,
							
					/**
				     * Constructor: OpenLayers.Control.ToolTipControl
				     * Create a new control for selecting features and show its tooltip.
				     *
				     * Parameters:
				     * layers - {<OpenLayers.Layer.Vector>}, or an array of vector layers. The
				     *     layer(s) this control will select features from.
				     * options - {Object} 
				     */
					initialize: function(layer, options){
						OpenLayers.Control.SelectFeature.prototype.initialize.apply(this, [layer, options]);
						this.createCallbacks();
					},
					
					/**
					 * Method: activate Activates the control.
					 * 
					 * Returns: {Boolean} The control was effectively activated.
					 */
					activate : function(arguments) {
						this.setLayer(this.getVectorLayers());
						// Create the control map to handler the click event
						var this_ = this;
						map.events.register("click", this_, this_.clickEventHandler);
						return OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
					},
					
					/**
				     * Method: deactivate
				     * Deactivates the control.
				     * 
				     * Returns:
				     * {Boolean} The control was effectively deactivated.
				     */
					deactivate: function(){
						this.closePopUps();
						var this_ = this;
						for(evt in map.events.listeners["click"]){
							if(evt.obj == this_ && evt.func == this_.clickEventHandler){
								// To do nothing
							}else{
								map.events.unregister("click", this_, this_.clickEventHandler);
							}
						}
						return OpenLayers.Control.SelectFeature.prototype.deactivate.apply(this, arguments);
					},
					
					clickEventHandler: function(event){
						this.trigger(event);
					},
					
					/**
					 * Function: updateLayers
					 * 
					 * Whenever the layers of the map changes, the control needs
					 * to be updated if this is activated. 
					 * 
					 * Called by a mapEvent addLayer and removeLayer
					 */
					updateLayers : function() {
						if(!!this.getVectorLayers){
							this.setLayer(this.getVectorLayers());
						}
						// CHECK IF THE TOOLTIP IS LOADED
						if(actions["tooltipcontrol"]){
							actions["tooltipcontrol"].disable();
							actions["tooltipcontrol"].enable();
						}
					},
					/**
					 * Function: closePopUps
					 * 
					 * Close all popups (tooltips) related to this control.
					 */
					closePopUps : function() {
						if (this.popups != null)
							while (this.popups.length > 0)
								this.popups.pop().close();
					},
					/**
					 * Function: createCallbacks
					 * 
					 * Function to crate the envents on the control to show 
					 * the tooltip and the events on the map to addLayer and removeLayer
					 */
					createCallbacks : function() {

						this.events.on({
							"featurehighlighted" : this.trigger
						});
						this.events.on({
							"featureunhighlighted" : this.closePopUps
						});

						map.events.un({
							"removelayer" : this.updateLayers,
							"addlayer" : this.updateLayers
						});
						
						var this_ = this;

						map.events.on({
							"removelayer" : this.updateLayers,
							"addlayer" : this.updateLayers
						});

					},
					
					/**
					 * Group: overridable
					 * 
					 * Function: trigger
					 * 
					 * This is the function that will be triggered when the
					 * mouse is over the feature. It shows the tooltip.
					 * 
					 * Parameters:
					 * 
					 * feature - Feature.
					 * 
					 * Returns:
					 * 
					 * void
					 * 
					 * See Also:
					 * 
					 * <closePopUps>
					 */
					trigger : function(event) {
						if(event.type == "featurehighlighted"){
							// It's been clicked over a feature
							this.clickOverFeatureHandler(event.feature);
						}else if(event.type == "click" && !this.selectFeatureEvent){
							// It's not been clicked over a feature
							this.clickHandler(event);
						}
					},
					
					showPopup: function(feature, items_acc){
						var accordion = new Ext.Panel({
				        	region:'west',
				        	margins:'5 0 5 5',
				        	split: true,
				        	autoWidth: true,
				        	layout:'accordion',
				        	items: items_acc
				        });
						// Add the new accordion with the layers info
						var popup = new GeoExt.Popup({
							title : this.titlePopup,
							location : feature,
							layout: 'fit',
							width: 300,
							height: 300,
							minWidth: 100,
							minHeight: 100,
							map: this.map,
							items: [accordion]
						});
						var this_ = this;
						popup.on('close', function(evt){
							this_.unselectAll();
							this_.selectFeatureEvent = false;
						});
						popup.timeout = false;
						popup.show();
						this.popups.push(popup);
					},

					/**
					 * Method: unselectAll Unselect all selected features. To
					 * unselect all except for a single feature, set the
					 * options.except property to the feature.
					 * 
					 * Parameters: options - {Object} Optional configuration
					 * object.
					 */
					unselectAll : function(options) {
						// we'll want an option to supress notification here
						var layers = this.layers || [ this.layer ];
						var layer, feature;
						for ( var l = 0; l < layers.length; ++l) {
							layer = layers[l];
							if (layer.selectedFeatures != null)
								for ( var i = layer.selectedFeatures.length - 1; i >= 0; --i) {
									feature = layer.selectedFeatures[i];
									if (!options || options.except != feature) {
										this.unselect(feature);
									}
								}
						}
					},
					
					/**
					 * Function: getVectorLayers 
					 * 
					 * Get all vector layers from the map in order 
					 * to update the control layers.
					 * 
					 */
					getVectorLayers: function(){
						var mapLayers = map.layers;
						var vectorLayers = [];
						Ext.each(mapLayers, function(l){
							// Check  if it's a vector layer
							if(l instanceof OpenLayers.Layer.Vector){
								// Add layer to the array
								vectorLayers.push(l);
							}
						});
						return vectorLayers;
					},
					
					/* Metodos y parametros auxiliares para el parseo del tooltip */
					defaultPropertyRow: "<tr><td>{0}</td><td>{1}</td></tr>",
					descriptionPropertyRow: "<tr><td colspan=\"2\" style=\"font-weight: bold;\">{0}</td></tr>",
					defaultPropertyTitle: "{0}({1}): {2}", // type(id): name
					unknownPropertyTitle: "{0}({1})", //When the type of the feature is unknown
					mappedProperties: {
						"pk_id": "Id",
						"type": "Type",
						"name": "Name",
						"description": "<strong style=\"font-weight: bold;\">Description</strong>",
						"style": null, //Not show
						"estilo": "Style"
					},
					
					obtainPropertyRow: function(property, value){
						var row = null;
						if(property == "description"){
							row = String.format(this.descriptionPropertyRow, value);
						} else if(property in this.mappedProperties
								&& this.mappedProperties[property] != null){
							row = String.format(this.defaultPropertyRow, this.mappedProperties[property], value);
						}else if(!(property in this.mappedProperties)){
							row = String.format(this.defaultPropertyRow, property, value);
						}
						return row;
					},
					
					obtainPropertyRows: function (attributes){
						var description = "";
						for(var dataAux in attributes){
							var row = this.obtainPropertyRow(dataAux, attributes[dataAux]);
							if(!!row){
								description += row;
							}									
						}
						return description;
					},
					
					obtainFeatureTitleText: function (name, type, id){
						if(!!type)
							return String.format(this.defaultPropertyTitle, type, id, name);
						else
							return String.format(this.unknownPropertyTitle, name, id);
					},						
					
					obtainFeatureTitle: function (feature){
						var title = this.featureTitleText;
						var name = "";
						
						if(!!feature.attributes["name"])
							name = 	feature.attributes["name"];
						
						if(!!feature.data){
							if(!!feature.data["TITOL"] 
							&& !!feature.data["COMENTARI"]
							&& !!feature.fid){
								title = this.obtainFeatureTitleText(feature.data["TITOL"], feature.layer.name, feature.fid);
							}else if(!!feature.data["pk_id"] 
									&& !!name){
								title = this.obtainFeatureTitleText(name, feature.data["type"], feature.data["pk_id"]);
							}
						}
						if (title == this.featureTitleText
								&& !!feature.attributes
								&& !!feature.attributes["pk_id"]){
							title = this.obtainFeatureTitleText(name, feature.attributes["type"], feature.attributes["pk_id"]);
						}
						
						return title;
					},
					
					getFeatureAPITitle: function(feature){
						return String.format(this.featureTitleTextAPI, feature.layer.name, feature.data.pk_id);
					},
					
					getDescription: function(feature){
						var colModel = new Ext.grid.ColumnModel([{
							dataIndex : 'property',
							header : this.nameProperty
						}, {
							dataIndex : 'value',
							header : this.valueProperty
						}]);
						var data_store = new Ext.data.SimpleStore({
					        fields: [{
					        	name: 'property'
					        },{
					        	name: 'value'
					        }]
						});
						
						var json = this.getJsonFromFeature(feature);
						data_store.loadData(json);
						
						var gridView = new Ext.grid.GridView({
							forceFit : true
						});
						
						var grid = new Ext.grid.GridPanel({
							autoHeight : true,
							store : data_store,
							colModel : colModel,
							view : gridView
						});
						
						return grid;
					},
					
					getJsonFromFeature: function(feature){
						var feature_data = [];
						for(f in feature.data){
							if(feature.data[f] != null && !!feature.data[f].value){
								feature_data.push([f, feature.data[f].value]);
							}else{
								feature_data.push([f, feature.data[f]]);
							}
						}
						return feature_data;
					},
					
					obtainFeatureTitleDescription: function (feature){
						var description = "<table>";
						var title = this.featureTitleText;
						if(!!feature.data && !!feature.data.sicecat_feature){
							// API origin
							if(feature.data.pk_id != null 
									&& feature.layer != null
									&& feature.layer.name != null){
								title = this.getFeatureAPITitle(feature);
								if(feature.data.description){
									description = feature.data.description;
								}else if(!!feature.attributes && !!feature.attributes.description){
									description = feature.attributes.description;
								}
							}
						}else{
							// WFS origin title
							if(!!feature.layer && !!feature.layer.name){
								title = String.format(this.featureTitleText, feature.layer.name);
							}
							// WFS origin description
							if(!feature.data.OBJECTID){
								if(!!feature.fid){
									feature.data.OBJECTID = feature.fid.split(".")[1];
									feature.attributes.OBJECTID = feature.fid.split(".")[1];
								}
							}
							description = this.getDescription(feature);
						}
						return {
							description: description,
							title: title
						};
					},
					
					/**
					 * Method: clickOverFeatureHandler
					 * 
					 * Params: {<OpenLayers.Vector.Feature>} feature
					 * 
					 */
					clickOverFeatureHandler: function(feature){
						this.closePopUps();
						var items_acc = [];
						// Info about selected feature
						var featureTitleDesc = this.obtainFeatureTitleDescription(feature);
						var div_html = document.createElement("div");
						div_html.className = "div_tooltip";
						var div_content = document.createElement("div");
						div_content.appendChild(div_html);
						var html_content = "";
						var infoTooltip = null;
						if(!!feature.data && !!feature.data.sicecat_feature){
							// API origin
							if(Ext.isGecko){
								// Firefox
								div_html.textContent = featureTitleDesc.description;
								html_content = div_content.textContent;
							}else{
								// Chrome / IE
								div_html.innerHTML = featureTitleDesc.description;
								html_content = div_content.innerHTML;
							}
							
							infoTooltip = new Ext.Panel({
				            	title: featureTitleDesc.title,
				            	autoScroll: true,
				            	html: html_content
				            });
						}else{
							infoTooltip = new Ext.Panel({
				            	title: featureTitleDesc.title,
				            	autoScroll: true,
				            	layout: 'fit',
				            	items: [featureTitleDesc.description]
				            });
						}
						
						// GetFeatureInfo
						var info_control = new SiceCAT.Control.GetFeatureInfo();
						var evento = null;
						if(!Ext.isGecko){
							evento = feature.parentEvt;
						}else{
							evento = feature.parentEvent;
						}
						var grid = info_control.clickEvent(evento);
						var moreInfo = new Ext.Panel({
			            	title: this.titleSeeMore,
			            	layout: 'fit',
			            	autoScroll: true,
			            	items: [grid]
			            });
						items_acc.push(infoTooltip);
						items_acc.push(moreInfo);
						this.selectFeatureEvent = true;
						
						// Reverse Geocoding
						var point = map.getLonLatFromPixel(evento.xy);
						var grid_rg = this.reverseGeocoding(point.lon, point.lat);
						var reverseGeocoding = new Ext.Panel({
			            	title: this.titleReverseGeocoding,
			            	autoScroll: true,
			            	layout: 'fit',
			            	items: [grid_rg]
			            });
						items_acc.push(reverseGeocoding);
						
						// Show the popup
						this.showPopup(feature, items_acc);
					},
					
					/**
					 * Method: clickHandler
					 * 
					 * Params: 
					 * 
					 * */
					clickHandler: function(feature){
						this.closePopUps();
						var items_acc = [];
						// GetFeatureInfo
						var info_control = new SiceCAT.Control.GetFeatureInfo();
						var grid = info_control.clickEvent(event);
						var moreInfo = new Ext.Panel({
			            	title: this.titleSeeMore,
			            	autoScroll: true,
			            	layout: 'fit',
			            	items: [grid]
			            });
						feature = event.xy;
						items_acc.push(moreInfo);
						
						// Reverse Geocoding
						var point = map.getLonLatFromPixel(feature);
						var grid_rg = this.reverseGeocoding(point.lon, point.lat);
						var reverseGeocoding = new Ext.Panel({
			            	title: this.titleReverseGeocoding,
			            	autoScroll: true,
			            	layout: 'fit',
			            	items: [grid_rg]
			            });
						items_acc.push(reverseGeocoding);
						
						// Show the popup
						this.showPopup(feature, items_acc);
					},
					
					/**
					 * Method: reverseGeocoding
					 * 
					 * Params: 
					 * 
					 **/
					reverseGeocoding: function(posX, posY){
						var colModel = new Ext.grid.ColumnModel([{
							dataIndex : 'property',
							header : this.nameProperty
						}, {
							dataIndex : 'value',
							header : this.valueProperty
						}]);
						var data_store = new Ext.data.SimpleStore({
					        fields: [{
					        	name: 'property'
					        },{
					        	name: 'value'
					        }]
						});
						var gridView = new Ext.grid.GridView({
							forceFit : true
						});
						var grid = new Ext.grid.GridPanel({
							autoHeight : true,
							store : data_store,
							colModel : colModel,
							view : gridView
						});
						
						var data = '<XLS xsi:schemaLocation="http://www.opengis.net/xls" version="1.2.0" xmlns="http://www.opengis.net/xls"'
										+ ' xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
										+ '<Request methodName="Geocode" requestID="123" '
										+ 'version="1.2.0" maximumResponses="' + false + '">'
										+ '<ReverseGeocodeRequest> <Position> <gml:Point srsName="EPSG:23031">' 
										+ '<gml:pos>' + posX + ' ' + posY
										+ '</gml:pos></gml:Point></Position></ReverseGeocodeRequest>'
										+ '</Request></XLS>';
						
						var store_rg = new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
								url: Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.CARTOGRAFIA, 'http://sigescat.pise.interior.intranet/openls'),
								method: 'POST',
								xmlData: data
							}),
							fields : [
							   {name: "lon", type: "number"},
							   {name: "lat", type: "number"},
							   {name: "place", type: "text"},
							   {name: "typePlace", type: "text"},
							   "text"
							],
							listeners:{
								load: function(store, records, options) {
									var json = this.getJsonFromRecords(records);
									data_store.loadData(json);
								},
								scope: this
							},
							reader: new SiceCAT.data.OpenLS_XLSReverseGeocodeReader()
						});
						store_rg.load();
						
						return grid;
					},
					
					/**
					 * Method: getJsonFromRecords
					 * 
					 * Params:
					 **/
					getJsonFromRecords: function(records){
						var json = [];
						for(r in records){
							var data = records[r].data;
							for(d in data){
								json.push([d, data[d]]);
							}
						}
						return json;
					}
				});
