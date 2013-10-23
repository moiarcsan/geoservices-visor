/*
 * GeoCalculator.js
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
 * Class: OpenLayers.Control.GeoCalculator
 * 
 * Geographic calculator. It allows to calculate coordinates between the following projections:
 * EPSG23031, EPSG25831, EPSG4326, EPSG4258
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
 *  María Arias de Reyna Domínguez(marias@emergya.com)
 */
OpenLayers.Control.GeoCalculator = OpenLayers
		.Class(
				OpenLayers.Control,
				{

					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "GeoCalculator",
					/*
					 * Property: displayClass
					 * 
					 * Display class name, for CSS.
					 */
					displayClass : "GeoCalculator",
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
					 * Property: coordenadasOriginalesText
					 * 
					 * <String> text to show
					 */
					coordenadasOriginalesText : "Coordenadas Originales:",
					/*
					 * Property: resultadoText
					 * 
					 * <String> text to show
					 */
					resultadoText : "Resultado:",
					/*
					 * Property: titleText
					 * 
					 * <String> text to show
					 */
					titleText : "Ir A:",
					/*
					 * Property: labelText
					 * 
					 * <String> text to show
					 */
					labelText : "Coordenadas:",
					/*
					 * Property: actionText
					 * 
					 * <String> text to show
					 */
					actionText : "Ir A",
					/*
					 * Property: closeText
					 * 
					 * <String> text to show
					 */
					closeText : "Cerrar",
					/*
					 * Property: Latitude
					 * 
					 */
					latitude : "Latitude",
					/*
					 * Property: Longitude
					 */
					longitude : "Longitude",
					/*
					 * Property: X
					 * 
					 */
					X : "X",
					/*
					 * Property: Y
					 * 
					 */
					Y : "Y",
					/*
					 * Property: gotoText
					 * 
					 * <String> text to show
					 * 
					 */
					gotoText : "Ir a",
					/*
					 * Property: errorMessage
					 * 
					 * Error message if the coordinates are too far.
					 */
					errorMessage : "The coordinates must be inside the map extent",
				    
				    /** 
				     * APIProperty: numDigits
				     * {Integer}
				     */
				    numDigits: 2,
				    
				    numDigitsPerProjection:{
				    	"EPSG:4326": 6	
				    },

					getProjectionArrayStore : function(idField, displayField,
							defaultProjectionID) {

						var projections = [
								[ 'EPSG:23031', 'EPSG:23031 (UTM 31N / ED50)' ],
								[ 'EPSG:25831', 'EPSG:25831 (UTM 31N / ETRS89)' ],
								[ 'EPSG:4326', 'EPSG:4326 (Lat/Lon WGS84)' ],
								[ 'EPSG:4258', 'EPSG:4258 (Lat/Lon ETRS89)' ] ];

						var fields = [ idField, displayField ];

						return new Ext.data.ArrayStore({
							id : defaultProjectionID,
							fields : fields,
							data : projections
						});
					},
					/*
					 * Function: getProjectionCombo
					 * 
					 * Returns a Combobox with all the available projections for
					 * the geographic calculator.
					 * 
					 * See Also:
					 * 
					 * <Ext.form.ComboBox>
					 */
					getProjectionCombo : function(defaultProjectionID, id) {
						var idField = 'projId';
						var displayField = 'displayText';
						var combo = new Ext.form.ComboBox({
							id : id,
							xtype : 'combobox',
							mode : 'local',
							width : 220,
							allowBlank : false,
							forceSelection : true,
							editable : false,
							lazyRender : false,
							triggerAction : 'all',
							selectOnFocus : true,
							store : this.getProjectionArrayStore(idField,
									displayField, defaultProjectionID),
							valueField : idField,
							displayField : displayField
						});

						return combo;
					},
					/*
					 * Function: getFormFields
					 * 
					 * Returns the fields to identify projection and
					 * coordinates.
					 * 
					 */
					getFormFields : function(stringID, combo, disabled) {

						var x_label = new Ext.form.Label({
							id : stringID + "_x_label",
							width : 60,
							xtype : 'label',
							text : this.X + ":",
							margins : '1 1 1 1'
						});
						var x = new Ext.form.NumberField({
							xtype : 'numberfield',
							fieldLabel : 'X',
							decimalPrecision : 6,
							allowBlank : false,
							width : 110,
							name : stringID + "_x",
							id : stringID + "_x",
							allowDecimals : true,
							fieldLabel : "X",
							anchor : "0",
							value : "0.0"
						});

						var y_label = new Ext.form.Label({
							id : stringID + "_y_label",
							width : 60,
							xtype : 'label',
							text : this.Y + ":",
							margins : '1 1 1 1'
						});
						var y = new Ext.form.NumberField({
							xtype : 'numberfield',
							fieldLabel : 'Y',
							allowBlank : false,
							decimalPrecision : 6,
							width : 110,
							name : stringID + "_y",
							id : stringID + "_y",
							fieldLabel : "Y",
							allowDecimals : true,
							emptyText : '0.0',
							anchor : "0",
							value : "0.0"
						});

						if (disabled) {
							x.on('change', function() {
								Ext.getCmp(stringID + "_x").setValue(
										this.startValue);
							});
							y.on('change', function() {
								Ext.getCmp(stringID + "_y").setValue(
										this.startValue);
							});
							x.readOnly = true;
							y.readOnly = true;
						}

						combo.latitude = this.latitude + ":";
						combo.longitude = this.longitude + ":";
						combo.X = this.X + ":";
						combo.Y = this.Y + ":";

						combo.on('change', function() {
							if (combo.getValue().indexOf("EPSG:4") == 0) {
								Ext.getCmp(stringID + "_x_label").setText(
										combo.longitude);
								Ext.getCmp(stringID + "_y_label").setText(
										combo.latitude);
							} else {
								Ext.getCmp(stringID + "_x_label").setText(
										combo.X);
								Ext.getCmp(stringID + "_y_label").setText(
										combo.Y);
							}

						});

						return new Ext.form.CompositeField({
							xtype : 'compositefield',
							items : [ x_label, x, y_label, y, combo ]
						});
					},
					/*
					 * Function: trigger
					 * 
					 * At the end of the wizard, it loads the file selected on
					 * the form.
					 * 
					 */
					trigger : function() {
						var errorMsg = this.errorMessage;
						if (typeof layerGoTo_ === "undefined" || !layerGoTo_) {
							layerGoTo_ = new OpenLayers.Layer.Vector(
									'OpenLayers.Control.GoTo');
						}
						var coordenadasOriginalesText = this.coordenadasOriginalesText;
						var resultadoText = this.resultadoText;
						var calcularText = this.calcularText;
						var iraText = this.actionText;

						var origin_label = new Ext.form.Label({
							xtype : 'label',
							forId : 'origin_label',
							text : coordenadasOriginalesText,
							margins : '10 10 10 10'
						});
						var origin = this.getFormFields("Origin", this
								.getProjectionCombo('3', 'origin_projection'),
								false);

						var goal_label = new Ext.form.Label({
							xtype : 'label',
							forId : 'goal_label',
							text : resultadoText,
							margins : '10 10 10 10'
						});
						var goal = this.getFormFields("Goal", this
								.getProjectionCombo('1', 'goal_projection',
										true), true);

						var items = [ origin_label, origin, goal_label, goal ];

						var this_ = this;
						
						// Handler calcule function
						var handler = function() {
							var proj_orig = new Proj4js.Proj(Ext.getCmp(
									'origin_projection').getValue());
							var proj_goal = new Proj4js.Proj(Ext.getCmp(
									'goal_projection').getValue());
							var point = new Proj4js.Point(Ext
									.getCmp('Origin_x').getValue(), Ext.getCmp(
									'Origin_y').getValue());

							Proj4js.transform(proj_orig, proj_goal, point);

					    	var numDigits = this_.numDigitsPerProjection[proj_goal.srsCode] | this_.numDigits;
					        var digits = parseInt(numDigits);
							Ext.getCmp('Goal_x').setValue(point.x.toFixed(digits));
							Ext.getCmp('Goal_y').setValue(point.y.toFixed(digits));
						};

						// Handler to do go to functionality
						var handlerGoTo = function() {
							var proj_orig = new Proj4js.Proj(Ext.getCmp(
									'origin_projection').getValue());
							var proj_goal = new Proj4js.Proj(map.projection);
							var point = new Proj4js.Point(Ext.getCmp('Origin_x').getValue(), 
									Ext.getCmp('Origin_y').getValue());
							Proj4js.transform(proj_orig, proj_goal, point);

							var ll = new OpenLayers.LonLat(point.x, point.y);

							var bounds;

							if (map.restrictedExtent != null
									&& map.restrictedExtent.toString() != "0") {
								bounds = map.restrictedExtent;
							} else if (map.maxExtent != null
									&& map.maxExtent.toString() != "0") {
								bounds = map.getMaxExtent();
							} else if (map.initialExtent != null
									&& map.initialExtent.toString() != "0") {
								bounds = map.initialExtent;
							} else {
								bounds = new OpenLayers.Bounds(258000, 4485000,
										536000, 4752000);
							}

							if (!!bounds && bounds.containsLonLat(ll, true)) {
								if (map.getZoom() < 5)
									map.zoomTo(5);
								map.panTo(ll);
								var feature = new OpenLayers.Feature.Vector(
										new OpenLayers.Geometry.Point(point.x,
												point.y), {}, {
											pointRadius : 10,
											/* strokeColor : "#efefef", */
											graphicName : "x",
											strokeColor : "red",
											strokeWidth : 2,
											fillColor : "orange",
											fillOpacity : 0.6
										});
								if (map
										.getLayersByName("OpenLayers.Control.GoTo").length == 0) {
									map.addLayer(layerGoTo_);
								}
								layerGoTo_.removeAllFeatures();
								layerGoTo_.addFeatures(feature);

							} else {
								if (Sicecat.isLogEnable)
									console.log("bounds --> " + bounds);
								alert(errorMsg);
							}
						};

						var titleText = this.titleText;
						this.showWindow(items, handler, handlerGoTo);
					},
					/*
					 * Function: showWindow
					 * 
					 * Shows the popup window
					 */
					showWindow : function(items, handlerCalc, handlerGoTo) {
						if (this.window != null)
							this.window.show();
						else {

							var formPanel = new Ext.Window({
								title : this.titleText,
								width : 593,
								closeAction : "close",
								maximizable : false,
								items : items
							});

							// Add 'Go To' button
							formPanel.addButton({
								text : this.gotoText,
								handler : handlerGoTo,
								scope : formPanel
							});

							formPanel.addButton({
								text : this.actionText,
								handler : handlerCalc,
								scope : formPanel
							});

							formPanel.addButton({
								text : this.closeText,
								handler : function() {
									this.close();
								},
								scope : formPanel
							});

							var this_ = this;
							formPanel.on('close', function() {
								this_.window = null;
								layerGoTo_.destroy();
								layerGoTo_ = null;
							});

							formPanel.on('show', function() {
								this_.window = this;
								Ext.each(this.items.items, function(e, i) {
									if (e.xtype == "compositefield")
										Ext.each(e.items.items, function(e, i) {
											if (e.xtype == 'combobox') {
												var store = e.store;
												var data = store.data;
												var items = store.data.items;
												var data = items[0].data;
												var item = data.projId;
												e.setValue(item);
											}
										});
								});
							});
							formPanel.show();
						}
					},
					/*
					 * Function: initialize
					 * 
					 * Overrides the initialize function to activate this
					 * control.
					 * 
					 * Parameter:
					 * 
					 * handler - {<OpenLayers.Handler>} options - {Object}
					 */
					initialize : function(handler, options) {
						OpenLayers.Control.prototype.initialize.apply(this,
								[ options ]);
						this.activate();
					}
				});
