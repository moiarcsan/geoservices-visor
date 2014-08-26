/*
 * GoTo.js
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
 * Shows a popup so the user can position the map to certain coordinates.
 * 
 * Inherits from: 
 * 
 * 
 * <OpenLayers.Control.GeoCalculator>
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
OpenLayers.Control.GoTo = OpenLayers
		.Class(
				OpenLayers.Control.GeoCalculator,
				{
					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "GoTo",
					/*
					 * Property: displayClass
					 * 
					 * Display class name, for CSS.
					 */
					displayClass : "GoTo",
					/*
					 * Property: errorMessage
					 * 
					 * Error message if the coordinates are too far.
					 */
					errorMessage : "The coordinates must be inside the map extent",
					/*
					 * Property: layer
					 * 
					 * Where we paint the position marker
					 */
					layer : new OpenLayers.Layer.Vector(
							'OpenLayers.Control.GoTo'),
					/*
					 * Function: trigger
					 * 
					 * At the end of the wizard, it loads the file selected on
					 * the form.
					 * 
					 */
					trigger : function() {
						if (typeof layerGoTo_ === "undefined" || !layerGoTo_) {
							layerGoTo_ = new OpenLayers.Layer.Vector(
									'OpenLayers.Control.GoTo');
						}
						var actionText = this.actionText;

						var label = new Ext.form.Label({
							xtype : 'label',
							forId : 'label_fields',
							text : this.labelText,
							margins : '10 10 10 10'
						});

						var fields = this.getFormFields("coordinate", this
								.getProjectionCombo('1', 'projection'), false);

						var items = [ label, fields ];
						var errorMsg = this.errorMessage;

						var handler = function(evt) {
							var proj_orig = new Proj4js.Proj(Ext.getCmp(
									'projection').getValue());
							var proj_goal = new Proj4js.Proj(map.projection);
							var point = new Proj4js.Point(Ext.getCmp(
									'coordinate_x').getValue(), Ext.getCmp(
									'coordinate_y').getValue());
							Proj4js.transform(proj_orig, proj_goal, point);

							var ll = new OpenLayers.LonLat(point.x, point.y);

							var bounds;

							if (map.restrictedExtent != null
									&& map.restrictedExtent.toString() != "0") {
								bounds = map.restrictedExtent;
							} else if (map.maxExtent != null
									&& map.maxExtent.toString() != "0") {
								bounds = map.maxExtent;
							} else if (map.initialExtent != null
									&& map.initialExtent.toString() != "0") {
								bounds = map.initialExtent;
							} else {
								bounds = new OpenLayers.Bounds(258000, 4485000,
										536000, 4752000);
							}

							// if(Sicecat.isLogEnable) console.log("point.x -->
							// "+point.x);
							// if(Sicecat.isLogEnable) console.log("point.y -->
							// "+point.y);
							// if(Sicecat.isLogEnable) console.log("ll -->
							// "+ll);

							if (!!bounds && bounds.containsLonLat(ll, true)) {
								if (map.getZoom() < 5)
									map.zoomTo(5);
								map.panTo(ll);
								var feature = new OpenLayers.Feature.Vector(
										new OpenLayers.Geometry.Point(point.x,
												point.y), {}, {
											pointRadius: 10,
											/*strokeColor : "#efefef",*/
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

						this.showWindow(items, handler);

						this.window.on('close', function() {
							layerGoTo_.destroy();
							layerGoTo_ = null;
						});
					}
				});
