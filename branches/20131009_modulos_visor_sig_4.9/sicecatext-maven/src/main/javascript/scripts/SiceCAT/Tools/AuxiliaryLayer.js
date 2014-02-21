/*
 * AuxiliaryLayer.js
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
 * Class: AuxiliaryLayer
 * 
 The AuxiliaryLayer provides an API to access
 * the auxiliary layers.
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
 *  Example of usage:
 *  
 *  var layername = "auxiliar";
 *  var feature = {};
 *  feature.position = new Array();
 *  feature.position[0] = 4.21;
 *  feature.position[1] = 40.24;
 *  feature.width = 30;
 *  feature.height = 30;
 *  feature.id = 0; 
 *  feature.description='<p style="width:400px;"><b>lalala</b>lalala</p><p><a href="http://google.es">alsdkfj</a></p>';
 *  feature.icon = "http://icons.iconarchive.com/icons/turbomilk/animals/256/skunk-icon.png";
 *  AuxiliaryLayer.addFeature(layername, feature); 
 *  feature.position[0] += 0.5; 
 *  feature.position[1] -= 0.5; 
 *  AuxiliaryLayer.addFeature(layername, feature); 
 *  layername = "otra";  
 *  feature.position[0] -= 1.5; 
 *  feature.position[1] -= 1.5; 
 *  AuxiliaryLayer.addFeature(layername, feature); 
 * 
 */
AuxiliaryLayer = {
	/*
	 * Property: map
	 * 
	 * Map where the auxiliaryLayer works.
	 */
	map : null,
	auxId : 1000,
	/*
	 * Function: setMap
	 * 
	 * Needed to set the map where the auxiliaryLayer works.
	 */
	setMap : function(map) {
		this.map = map;
	},
	/*
	 * Function: createLayer
	 * 
	 * Creates a new <OpenLayers.Layer.Vector> on the <map>.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer which will be created.
	 */
	createLayer : function(layername, id) {
		var layer = new OpenLayers.Layer.Vector(layername, {
			strategies : [ 
			        //new OpenLayers.Strategy.BBOX(), //Las capas vectoriales no tienen BBOX #55018
					new OpenLayers.Strategy.Save() ],
					styleMap : Sicecat.createStyleMap()
		});
		AuxiliaryLayer.map.addLayer(layer);
		if (id) {
			layer.id = id;
		} else {
			layer.id = layername;
		}
		layer.events.on({
		    'added': function(){
		        actions["tooltipcontrol"].control.activate();
		    }
		});
		return layer;
	},
	/*
	 * Function: getLayer
	 * 
	 * Returns the <OpenLayers.Layer.Vector> of the <map> with the parameter
	 * name. If there are no layer with that name, it creates a new one with
	 * <createLayer>.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer
	 * 
	 * Returns:
	 * 
	 * the layer
	 * 
	 */
	getLayer : function(layername) {
		var vectorLayer = AuxiliaryLayer.map.getLayersByName(layername);

		if (vectorLayer.length == 0)
			vectorLayer = AuxiliaryLayer.createLayer(layername);
		else
			vectorLayer = vectorLayer[0];

		return vectorLayer;
	},
	getLayerById : function(layerid) {
		var vectorLayer = AuxiliaryLayer.map.getLayersBy("id", id);

		if (vectorLayer.length == 0)
			vectorLayer = AuxiliaryLayer.createLayer(id, id);
		else
			vectorLayer = vectorLayer[0];

		return vectorLayer;
	},
	
	
	/*
	 * Function: emptyLayer
	 * 
	 * Removes all the features of the <OpenLayers.Layer.Vector> of the <map>
	 * with the parameter name.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer
	 */
	emptyLayer : function(layername) {
		var vectorLayer = AuxiliaryLayer.getLayer(layername);
		vectorLayer.destroyFeatures();
	},
	/*
	 * Function: deleteLayer
	 * 
	 * Removes the <OpenLayers.Layer.Vector> of the <map> with the parameter
	 * name.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer
	 */
	deleteLayer : function(layername) {
	    try{
    		var vectorLayer = this.getLayer(layername);
	    	this.map.removeLayer(vectorLayer);
	    }catch (e){
	        //NOTHING
	    }
	},
	/*
	 * Function: generateStyle
	 * 
	 * Given a <OpenLayers.Feature.Vector> and a pre-generated style, it merges
	 * both styles.
	 * 
	 * Parameter:
	 * 
	 * feature - The feature style - The pre-generated style
	 * 
	 * Returns:
	 * 
	 * style
	 * 
	 */
	generateStyle : function(style, feature) {

		if (feature.icon != null) {
			style.externalGraphic = feature.icon;

			if (feature.height != null)
				style.graphicHeight = feature.height;
			else
				style.graphicHeight = 15;
			if (feature.width != null)
				style.graphicWidth = feature.width;
			else
				style.graphicWidth = 15;
			if (feature.opacity != null)
				style.graphicOpacity = feature.opacity;

			delete style.fillColor;
			delete style.fillOpacity;
			delete style.pointRadius;
			delete style.graphicName;

		} else if (feature.strokeColor != null) {
			style.strokeColor = feature.strokeColor;

			if (feature.fillColor != null)
				style.fillColor = feature.fillColor;
			if (feature.opacity != null)
				style.fillOpacity = feature.opacity;
			if (feature.pointRadius != null)
				style.pointRadius = feature.pointRadius;
			if (feature.graphicName != null)
				style.graphicName = feature.graphicName;

			delete style.externalGraphic;
			delete style.graphicHeight;
			delete style.graphicWidth;
			delete style.graphicWidth;
			delete style.graphicOpacity;
		}

		if (feature.fontColor != null)
			style.fontColor = feature.fontColor;
		else
			delete style.fontColor;

		style = OpenLayers.Util.extend(OpenLayers.Util
				.extend(OpenLayers.Feature.Vector.style['default']), style);

		return style;
	},
	/*
	 * Function: addFeature
	 * 
	 * Adds a new feature to the layer
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer. feature - The feature to add
	 */
	addFeature : function(layername, feature) {
		var vectorLayer = AuxiliaryLayer.getLayer(layername);

		if (feature.style == null)
			feature.style = {};

		// adiaz: Feature styling
		var style = feature.style;
		if (!style) {
			// If feature.style is not defined, generate style
			style = AuxiliaryLayer.generateStyle(feature.style, feature);
		}

		var data = {};
		data.pk_id = feature.id;
		data.type = feature.type;
		data.name = feature.name;
		data.style = feature.style;
		//Save feature style
		data.estilo = feature.estilo;
		data.description = feature.description;

		var geom = new OpenLayers.Geometry.Point(feature.position[0],
				feature.position[1]);

		var feature2 = new OpenLayers.Feature.Vector(geom, data, style);
		vectorLayer.addFeatures(feature2);
		
		data.sicecat_feature = new SiceCAT.Feature(feature2);
		
		AuxiliaryLayer.map.addLayer(vectorLayer);
		// Deactivate the tooltip control to register all features
		actions['tooltipcontrol'].control.deactivate();
		// Activate the tooltip control to register all features
		actions['tooltipcontrol'].control.activate();
	},
	/*
	 * Function: addFeatureToLayerId
	 * 
	 * Adds a new feature to the layer
	 * 
	 * Parameter:
	 * 
	 * layerid - ID of the layer. 
     * feature - The feature to add.
	 * 
	 */
	addFeatureToLayerId : function(layerid, feature) {
		var vectorLayer = AuxiliaryLayer.getLayerById(layerid);

		if (feature.style == null)
			feature.style = {};

		// adiaz: Feature styling
		var style = feature.style;
		if (!style) {
			// If feature.style is not defined, generate style
			style = AuxiliaryLayer.generateStyle(feature.style, feature);
		}

		var data = {};
		data.pk_id = feature.id;
		data.type = feature.type;
		data.name = feature.name;
		data.style = feature.style;
		//Save feature style
		data.estilo = feature.estilo;
		data.description = feature.description;

		var geom = new OpenLayers.Geometry.Point(feature.position[0],
				feature.position[1]);

		var feature2 = new OpenLayers.Feature.Vector(geom, data, style);
		vectorLayer.addFeatures(feature2);
		
		data.sicecat_feature = new SiceCAT.Feature(feature2);
		
		AuxiliaryLayer.map.addLayer(vectorLayer);
	},
	/*
	 * Function: updateFeature
	 * 
	 * Update the feature on the layer.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer. feature - The feature to update
	 */
	updateFeature : function(layername, feature) {
		var layer = AuxiliaryLayer.getLayer(layername);
		var features = AuxiliaryLayer.searchFeature(layername, feature);
		Ext.each(features, function(f, index) {
			AuxiliaryLayer.removeFeature(layername, f);

		});
		AuxiliaryLayer.addFeature(layername, feature);
		layer.refresh({
			force : true
		});
	},
	/*
	 * Function: removeFeature
	 * 
	 * Removes the feature from the layer.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer. feature - The feature to remove
	 */
	removeFeature : function(layername, feature) {
		var f = AuxiliaryLayer.searchFeature(layername, feature);
		var vectorLayer = AuxiliaryLayer.map.getLayersByName(layername);
		if (vectorLayer.length == 0){
			vectorLayer.destroyFeatures(f);
		}
	},
	/*
	 * Function: searchFeature
	 * 
	 * Find the feature on the layer and returns it.
	 * 
	 * Parameter:
	 * 
	 * layername - Name of the layer. feature - The feature to find
	 * 
	 * Returns:
	 * 
	 * feature
	 */
	searchFeature : function(layername, feature) {
		var layer = AuxiliaryLayer.getLayer(layername);
		var f = new Array();
		Ext.each(AuxiliaryLayer.map.layers, function(layer, index) {
			if (layer.name == layername) {
				Ext.each(layer.features, function(fet, index) {
					if (fet.data.pk_id == feature.id
							|| fet.id == feature.id)
						f.push(fet);
				});
			}
		});
		return f;
	}
};