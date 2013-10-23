/*
 * SeleccionPuntoRadio.js
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
 * Class: OpenLayers.Control.SeleccionPuntoRadio
 * 
 * Point and radius selection. It allows to select elements in the map that are
 * into the indicated range.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control.SelecFeature>
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
 *  Juan Luis Rodríguez Ponce (jlrodriguez@emergya.com)
 *  
 *  Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.SeleccionPuntoRadio = OpenLayers
		.Class(
				OpenLayers.Control.SelectFeature,
				{
					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "SeleccionPuntoRadio",

					/*
					 * Property: window
					 * 
					 * Last window opened
					 */
					window : null,
					/*
					 * Property: layer_position
					 * 
					 * Where we paint the position marker
					 */
					layer_position : new OpenLayers.Layer.Vector('OpenLayers.Control.SeleccionPuntoRadio'),

					/*
					 * Property: circle_feature
					 */
					circle_feature : null,

					/*
					 * Property: point_feature
					 */
					point_feature : null,

					/*
					 * Property: radioText
					 * 
					 * <String> text to show
					 */
					radioText : "Radio:",

					/*
					 * Property: puntoSeleccionadoText
					 * 
					 * <String> text to show
					 */
					puntoSeleccionadoText : "Punto seleccionado:",

					/*
					 * Property: seleccionPuntoRadioText
					 * 
					 * <String> text to show
					 */
					seleccionPuntoRadioText : "Selección por punto y radio",

					/*
					 * Property: seleccionarText
					 * 
					 * <String> text to show
					 */
					seleccionarText : "Seleccionar",

					/*
					 * Property: closeText
					 * 
					 * <String> text to show
					 */
					closeText : "Cerrar",
					
					/*
					 * Property: maMaskText
					 * 
					 * <String> text to show
					 */
					myMaskText : "Procesando",
					
					myMask: null,
					
					/*
					 * Property: featuresSelected
					 * 
					 * <Array> features to save
					 */
					featuresSelected : new Array(),
					
					/**
				     * Constructor: OpenLayers.Control.ToolTipControl
				     * Create a new control for selecting features.
				     *
				     * Parameters:
				     * layers - {<OpenLayers.Layer.Vector>}, or an array of vector layers. The
				     *     layer(s) this control will select features from.
				     * options - {Object} 
				     */
					initialize : function(layers, options) {
						OpenLayers.Control.SelectFeature.prototype.initialize.apply(this, [ layers, options ]);
						this.layer_position.displayInLayerSwitcher = false;
						this.myMask = new Ext.LoadMask(Ext.getBody(), {
							msg : this.myMaskText
						});
						map.addLayer(this.layer_position);
					},
					/**
					 * Method: activate Activates the control.
					 * 
					 * Returns: {Boolean} The control was effectively activated.
					 */
					activate : function(arguments) {
						this.setLayer(this.getVectorLayers());
						Sicecat.featuresSelected = this.featuresSelected;
						var res = OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
						this.showWindow();
						return res;
					},
					/**
					 * Method: deactivate Deactivates the control.
					 * 
					 * Returns: {Boolean} The control was effectively
					 * deactivated.
					 */
					deactivate : function(arguments) {
						this.unselectAll();
						OpenLayers.Control.SelectFeature.prototype.deactivate.apply(this, []);
						this.hideWindow();
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
						OpenLayers.Control.SelectFeature.prototype.unselectAll.apply(this, [ options ]);
						this.featuresSelected = new Array();
						Sicecat.featuresSelected = this.featuresSelected;
					},
					/**
					 * Method: selectFeature
					 * 
					 * Selects feature from a layer and include it in layer's
					 * selectedFeature array with method select
					 * 
					 * Parameters: layer - {<OpenLayers.Layer.Vector>}
					 */
					selectFeature : function(layer) {
						var control = this;
						var select = false;
						Ext.each(layer.features, function(e, i) {
							if (e.seleccionar == false) {
								select = e.seleccionar;
							} else {
								select = true;
							}
							if (select && control.circle_feature.geometry.intersects(e.geometry)) {
								control.select(e);
								control.featuresSelected.push(e);
							}
						});
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
					/**
					 * Function: showWindow
					 * 
					 * Show the window in which select the radius and point options
					 * 
					 */
					showWindow : function() {
						if (this.map == null || this.map.div == null)
							return;

						var capaText = this.capaText;
						var radioText = this.radioText;
						var puntoSeleccionadoText = this.puntoSeleccionadoText;
						var seleccionPuntoRadioText = this.seleccionPuntoRadioText;

						var layer_ = this.layer;
						if (layer_ == null) {
							layer_ = new Object();
							layer_.name = "--";
						}

						var radius_label = new Ext.form.Label({
							xtype : 'label',
							forId : 'radius_label',
							text : radioText,
							margins : '10 10 10 10'
						});

						var radius = new Ext.form.ComboBox({
							id : 'radius',
							typeAhead : true,
							triggerAction : 'all',
							lazyRender : true,
							mode : 'local',
							editable: false,
							store : new Ext.data.ArrayStore(
									{
										id : 0,
										fields : [ 'myId', 'displayText' ],
										data : [ [ 100, '100 m' ],
												[ 250, '250 m' ],
												[ 500, '500 m' ],
												[ 1000, '1 km' ],
												[ 2500, '2,5 km' ],
												[ 5000, '5 km' ],
												[ 10000, '10 km' ],
												[ 25000, '25 km' ] ]
									}),
							valueField : 'myId',
							displayField : 'displayText'
						});

						var this_ = this;
						radius.on('select', function(e) {
							this_.updateFeatures();
						});

						var x_label = new Ext.form.Label({
							xtype : 'label',
							text : 'X:',
							margins : '1 1 1 1'
						});
						var x = new Ext.form.NumberField({
							xtype : 'numberfield',
							fieldLabel : 'X',
							decimalPrecision : 5,
							allowBlank : false,
							width : 80,
							name : "point_x",
							id : "point_x",
							allowDecimals : true,
							fieldLabel : "X",
							anchor : "0",
							value : "0.0"
						});

						var y_label = new Ext.form.Label({
							xtype : 'label',
							text : 'Y:',
							margins : '1 1 1 1'
						});
						var y = new Ext.form.NumberField({
							xtype : 'numberfield',
							fieldLabel : 'Y',
							allowBlank : false,
							decimalPrecision : 5,
							width : 80,
							name : "point_y",
							id : "point_y",
							fieldLabel : "Y",
							allowDecimals : true,
							emptyText : '0.0',
							anchor : "0",
							value : "0.0"
						});

						var point_label = new Ext.form.Label({
							xtype : 'label',
							forId : 'point_label',
							text : puntoSeleccionadoText,
							margins : '10 10 10 10'
						});
						var point = new Ext.form.CompositeField({
							xtype : 'compositefield',
							items : [ x_label, x, y_label, y ]
						});

						if (this.window == null || this.window.isDestroyed) {
							var formPanel = new Ext.Window({
								width : 350,
								title : seleccionPuntoRadioText,
								maximizable : true,
								control : this,
								onShow : function() {
									Ext.get(this.control.map.div).addListener("click",
											this.control.pointSelectionHandler,
											this.control);
								},
								items : [ radius_label, radius, point_label,
										point ]
							});
							var control_ = this;

							formPanel.addButton({
										text : this.seleccionarText,
										handler : function() {
											control_.myMask.enable(true);
											control_.myMask.show();
											(function(){
												control_.myMask.hide();
											}).defer(2000);
											var radius = Ext.getCmp("radius").value;
											var lonlat = new OpenLayers.LonLat(
													Ext.getCmp("point_x").value,
													Ext.getCmp("point_y").value);

											var layer = layer_;

											if (Sicecat.isLogEnable)
												console.log(layer.name + "-"+ radius + "-"+ lonlat);

											control_.selectedFeatures = [];
											this_.unselectAll();
											
											Ext.each(layer.layers, function(e, i) {
												this_.selectFeature(e);
											});
											layer.redraw();
											if(Sicecat.isLogEnable)
											console.log("selectedFeatures: "+ Sicecat.featuresSelected.length);
										},
										scope : formPanel
								});
							
							
							var onClose = function() {
								Ext.get(map.div).removeListener("click",
										control_.pointSelectionHandler,
										control_);
								control_.layer_position.setVisibility(false);
								if (actions['pointRadiusSelection'].items[0].pressed) {

									actions['pointRadiusSelection'].items[0]
											.toggle();
								}
							};
							formPanel.on('close', onClose);

							formPanel.addButton({
								text : this.closeText,
								handler : onClose,
								scope : formPanel
							});

							this.window = formPanel;

						}

						this.window.show();

					},
					/**
					 * Function: updateFeatures
					 * 
					 * Updates the control features to show where is the
					 * selection going to happen.
					 */
					updateFeatures : function() {

						this.layer_position.setVisibility(true);
						this.layer_position.removeAllFeatures();
						if (Ext.getCmp("point_x") != null && Ext.getCmp("point_y") != null) {
							var point = new OpenLayers.Geometry.Point(
									Ext.getCmp("point_x").getValue(), 
									Ext.getCmp("point_y").getValue()
							);
							
							this.point_feature = new OpenLayers.Feature.Vector(point, {}, {
										graphicHeight : 20,
										graphicWidth : 20,
										strokeWidth : 2,
										strokeColor : "#efefef",
										graphicName : "x"
							});
							
							this.point_feature.seleccionar = false;
							this.layer_position.addFeatures(this.point_feature);

							var radius = Ext.getCmp("radius").getValue();
							if (radius != null && radius > 0) {

								var rad = radius;
								var poly = new OpenLayers.Geometry.Polygon.createRegularPolygon(
										point, rad, 60, 0);

								this.circle_feature = new OpenLayers.Feature.Vector(
										poly, {}, {
											strokeWidth : 1,
											fillColor : "#efefef",
											strokeColor : "#DCDCDC",
											fillOpacity : 0.5
										});
								this.circle_feature.seleccionar = false;
								this.layer_position.addFeatures(this.circle_feature);
							}

						}
					},
					/**
					 * Function: pointSelectionHandler
					 * 
					 * Listens for selected point in map and update components.
					 */
					pointSelectionHandler : function(event, el, obj) {
						var lonlat = this.map.getLonLatFromPixel({
							x : event.getXY()[0]
									- Ext.get(this.map.div).getLeft(),
							y : event.getXY()[1]
									- Ext.get(this.map.div).getTop()
						});
						if (Ext.getCmp("point_x") != null
								&& Ext.getCmp("point_y") != null) {
							Ext.getCmp("point_x").setValue(lonlat.lon);
							Ext.getCmp("point_y").setValue(lonlat.lat);
						}
						this.updateFeatures();
					},
					/**
					 * Function: hideWindow
					 * 
					 * Function to close the window.
					 */
					hideWindow : function() {
						if (this.window) {
							this.window.close();
						}

					}
				});