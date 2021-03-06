/*
 * DefaultToolTipControl.js
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
 * Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.DefaultToolTipControl = OpenLayers
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
					CLASS_NAME : "OpenLayers.Control.DefaultToolTipControl",
					
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
						return OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
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
					 * Function: createCallbacks
					 * 
					 * Function to crate the envents on the control to show 
					 * the tooltip and the events on the map to addLayer and removeLayer
					 */
					createCallbacks : function() {

						map.events.un({
							"removelayer" : this.updateLayers,
							"addlayer" : this.updateLayers
						});

						map.events.on({
							"removelayer" : this.updateLayers,
							"addlayer" : this.updateLayers
						});

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
					}
				});
