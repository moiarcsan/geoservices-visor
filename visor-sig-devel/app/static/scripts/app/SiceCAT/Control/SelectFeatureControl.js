/*
 * SelectFeatureControl.js
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
 * Class: OpenLayers.Control.SelectFeatureControl
 * 
 * Selects features by click.
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
 *  Alejandro Diaz Torres (adiaz@emergya.com)
 *  
 *  Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.SelectFeatureControl = OpenLayers
		.Class(
				OpenLayers.Control.SelectFeature,
				{
					/**
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "OpenLayers.Control.SelectFeatureControl",
					
					featuresSelected : new Array(),

					/**
					 * Method: activate Activates the control.
					 * 
					 * Returns: {Boolean} The control was effectively activated.
					 */
					activate : function(arguments) {
						this.setLayer(this.getVectorLayers());
						Sicecat.featuresSelected = this.featuresSelected;
						return OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
					},

					/**
					 * Method: deactivate Deactivates the control.
					 * 
					 * Returns: {Boolean} The control was effectively
					 * deactivated.
					 */
					deactivate : function(arguments) {
						this.unselectAll();
						return OpenLayers.Control.SelectFeature.prototype.deactivate.apply(this, arguments);
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
					
					onSelect : function(feature) {
						this.featuresSelected.push(feature);
						if (Sicecat.isLogEnable)
							console.log(this.featuresSelected.length);
					},
					
					unselect: function (feature) {
						OpenLayers.Util.removeItem(Sicecat.featuresSelected, feature);
						OpenLayers.Control.SelectFeature.prototype.unselect.apply(this, [feature]);
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
