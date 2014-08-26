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
/**
 * Property: classifiedFeatures
 * 
 * Array of features classified by parent layers.
 * 
 */
classifiedFeatures = [];
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
 * This file is licensed under the GPL.
 * 
 * Author:
 * 
 * Alejandro Diaz Torres (adiaz@emergya.com)
 * 
 * Edited by: Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.SelectFeatureControl = OpenLayers.Class(
		OpenLayers.Control.SelectFeature, {
			/**
			 * Property: CLASS_NAME
			 * 
			 * Class name, for CSS.
			 */
			CLASS_NAME : "OpenLayers.Control.SelectFeatureControl",
			/**
			 * Property: featuresSelected
			 * 
			 * Local array with the selected features.
			 */
			featuresSelected : new Array(),
			/**
			 * Constructor: OpenLayers.Control.ToolTipControl Create a new
			 * control for selecting features.
			 * 
			 * Parameters: layers - {<OpenLayers.Layer.Vector>}, or an array of
			 * vector layers. The layer(s) this control will select features
			 * from. options - {Object}
			 */
			initialize : function(layers, options) {
				OpenLayers.Control.SelectFeature.prototype.initialize.apply(
						this, [ layers, options ]);
			},
			/**
			 * Method: activate Activates the control.
			 * 
			 * Returns: {Boolean} The control was effectively activated.
			 */
			activate : function(arguments) {
				// Volcamos el array temporal en una variable local
				var tmpfeatSel = Sicecat.tmpSelectedFeatures;
				// Actualizamos el control con la capa activa
				this.setLayer(this.getVectorLayers());
				// Le asignamos el control activo a la ventana
				Sicecat.featureSelectedMonitor.setControl(this);
				var ret = OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
				Sicecat.featuresSelected = this.featuresSelected;
				// Recorremos las features guardadas y las volvemos aseleccionar
				for ( var i = 0; i < tmpfeatSel.length; i++) {
					if (tmpfeatSel[i] != null) {
						this.select(tmpfeatSel[i]);
					}
				}
				return ret;
			},
			/**
			 * Method: deactivate Deactivates the control.
			 * 
			 * Returns: {Boolean} The control was effectively deactivated.
			 */
			deactivate : function(arguments) {
				// Copiamos las features seleccionadas a un array temporal
				Sicecat.tmpSelectedFeatures = this.featuresSelected.slice(0);
				// Deseleccionamos las features
				this.unselectAll();
				// Ocultamos la ventana
				Sicecat.featureSelectedMonitor.hide();
				return OpenLayers.Control.SelectFeature.prototype.deactivate.apply(this, arguments);
			},
			/**
			 * Method: unselectAll Unselect all selected features. To unselect
			 * all except for a single feature, set the options.except property
			 * to the feature.
			 * 
			 * Parameters: options - {Object} Optional configuration object.
			 */
			unselectAll : function(options) {
				OpenLayers.Control.SelectFeature.prototype.unselectAll.apply(
						this, [ options ]);
				this.featuresSelected = new Array();
				Sicecat.featuresSelected = this.featuresSelected;
			},
			/**
			 * Method: onSelect
			 * 
			 * Method fires when a feature is selected.
			 * 
			 * Parameters: feature - {OpenLayers.Feature.Vector}
			 * 
			 */
			onSelect : function(feature) {
				// Mostramos la ventana
				Sicecat.featureSelectedMonitor.show();
				// Temporary case for Sirenes
				if(feature.data.estilo){
					var style = Sicecat.styles[feature.data.estilo + "_s"];
					feature.style = integrator.cloneObject(style);
					if(feature.data.type == integrator.ELEMENT_TYPE_INCIDENTE){
						feature.style.label = feature.data.pk_id.toString();
						feature.style.labelAlign = "rt";
						feature.style.labelXOffset = 20;
						feature.style.labelYOffset = 20;
					}
					feature.layer.redraw();
				}
				this.featuresSelected.push(feature);
				this.classifyFeature(feature);
				this.countFeaturesSelected();
			},
			/**
			 * Method: onSelect
			 * 
			 * Method fires when a feature is unselected.
			 * 
			 * Parameters: feature - {OpenLayers.Feature.Vector}
			 * 
			 */
			unselect : function(feature) {
				OpenLayers.Util.removeItem(Sicecat.featuresSelected, feature);
				// Temporary case for Sirenes
				if(feature.data.estilo){
					var name_style = feature.data.estilo.replace("_s", "");
					var style = Sicecat.styles[name_style];
					feature.style = integrator.cloneObject(style);
					if(feature.data.type == integrator.ELEMENT_TYPE_INCIDENTE){
						feature.style.label = feature.data.pk_id.toString();
						feature.style.labelAlign = "rt";
						feature.style.labelXOffset = 20;
						feature.style.labelYOffset = 20;
					}
					feature.layer.redraw();
				}
				this.unClassifyFeature(feature);
				this.countFeaturesSelected();
				OpenLayers.Control.SelectFeature.prototype.unselect.apply(this,
						[ feature ]);
			},
			/**
			 * Function: getVectorLayers
			 * 
			 * Get all vector layers from the map in order to update the control
			 * layers.
			 * 
			 */
			getVectorLayers : function() {
				var mapLayers = map.layers;
				var vectorLayers = [];
				Ext.each(mapLayers, function(l) {
					// Check if it's a vector layer
					if (l instanceof OpenLayers.Layer.Vector) {
						// Add layer to the array
						vectorLayers.push(l);
					}
				});
				return vectorLayers;
			},
			/**
			 * Function: removeSelection
			 * 
			 * Remove selection over all features.
			 * 
			 */
			removeSelection : function() {
				this.unselectAll();
			},
			/**
			 * Function: intersectElements
			 * 
			 * Intersect features with another layer.
			 * 
			 */
			intersectElements : function() {
				alert("Cruzando elementos...");
			},
			/**
			 * Function: classifyFeature
			 * 
			 * Classify each feature into its layer
			 * 
			 * Parameters: feature - {OpenLayers.Feature.Vector}
			 */
			classifyFeature : function(feature) {
				var parentLayer = null;
				var obj = null;
				var isAdded = false;
				if (feature != null && feature.layer && feature.layer.name) {
					parentLayer = feature.layer.name;
				}
				if (parentLayer != null) {
					Ext.each(classifiedFeatures, function(feat) {
						if (feat.name == parentLayer) {
							isAdded = true;
							feat.value.push(feature);
						}
					});
					if (!isAdded) {
						obj = {
							'name' : parentLayer,
							'value' : [ feature ]
						};
						classifiedFeatures.push(obj);
					}
				}
			},
			/**
			 * Function: unClassifyFeature
			 * 
			 * Remove the feature from its layers array.
			 * 
			 * Parameters: feature - {OpenLayers.Feature.Vector}
			 */
			unClassifyFeature : function(feature) {
				var parentLayer = null;
				var objToRemove = [];
				if (feature != null && feature.layer && feature.layer.name) {
					parentLayer = feature.layer.name;
				}
				if (parentLayer != null) {
					Ext.each(classifiedFeatures, function(feat) {
						if (feat.name == parentLayer) {
							OpenLayers.Util.removeItem(feat.value, feature);
						}
						if (feat.value.length == 0) {
							objToRemove.push(feat);
						}
					});
				}
				for ( var i = 0; i < objToRemove.length; i++) {
					OpenLayers.Util.removeItem(classifiedFeatures, objToRemove[i]);
				}
			},
			/**
			 * Function: countFeaturesSelected
			 * 
			 * Show on the grid window the number of features by layers.
			 * 
			 */
			countFeaturesSelected : function() {
				var arrayToLoad = [];
				Ext.each(classifiedFeatures, function(el) {
					if (el.value.length != 0) {
						arrayToLoad.push([ el.value.length, el.name ]);
					}
				});
				// Añadimos al store de la ventana global
				Sicecat.featureSelectedMonitor.features_selected_store.loadData(arrayToLoad);
			}
		});