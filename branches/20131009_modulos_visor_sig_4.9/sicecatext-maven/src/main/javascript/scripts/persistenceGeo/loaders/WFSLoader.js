/*
 * WFSLoader.js Copyright (C) 2012 This file is part of PersistenceGeo project
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
 */

/** api: (define)
 *  module = PersistenceGeo
 */
Ext.namespace("PersistenceGeo.loaders");

/** api: (define)
 *  module = PersistenceGeo.loaders
 *  class = WSLoader
 */
Ext.namespace("PersistenceGeo.loaders.WFSLoader");

/**
 * Class: PersistenceGeoParser.laoders.WFSLoader
 * 
 * Loader for WFS Layers
 */ 
PersistenceGeo.loaders.WFSLoader 
	= Ext.extend(PersistenceGeo.loaders.AbstractLoader,{
		load: function (layerData, layerTree){

			var _strategies = [
					new OpenLayers.Strategy.BBOX(),
					new OpenLayers.Strategy.Refresh({
						interval : 5000
					})];

			if(!!layerData['properties']['editable']
					&& this.toBoolean(layerData['properties']['editable'])){
				_strategies.push(new OpenLayers.Strategy.Save({auto: true}));
			}

			var maxFeatures = this.toNumber(layerData['properties']['maxFeatures']);
			var visibility = this.toBoolean(layerData['visibility']);
			
			var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
			/* GetURLProxy */
			var layer_url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, layerData['properties']['url'] ? layerData['properties']['url'] : layerData.server_resource);
			var options = {
				url : layer_url,
	            maxFeatures: maxFeatures,
	            featureType: layerData['properties']['featureType'],
	            featureNS: layerData['properties']['featureNS'],
	            featurePrefix: layerData['properties']['featurePrefix'],
	            geometryName: layerData['properties']['geometryName'],
	            schema: layerData['properties']['schema']
			};

			this.copyAllPosibleProperties(layerData['properties'], options);

			options['version'] = '1.0.0';

			// Get layer style
			var styleMap = this.preFunctionStyle(layerData);
			var layer = new OpenLayers.Layer.Vector(
					layerData['name'],
					{
						'groupLayers' : layerData['groupLayers'],
						'visibility' : visibility,
						'strategies' : _strategies,
						'protocol' : new OpenLayers.Protocol.WFS(options),
						styleMap: styleMap
						// ,
						// 'renderers' : renderer
					});
			
			this.postFunctionsWrapper(layerData, layer, layerTree);
			
			// Dinstict load depends on role user
			if(Global_TMP.permisos.contains('admin')){
				// He's an admin
				if(layerData['properties']['editable'] && this.toBoolean(layerData['properties']['editable'])){
					// It's an editable layer
					if(layerData['properties']['inUse'] && this.toBoolean(layerData['properties']['inUse'])){
						// In use layer
						layer.visibility = false;
						layer.groupLayers = "in_edition";
						layer.subgroupLayers = "in_edition";
					}else if(layerData['properties']['available'] && this.toBoolean(layerData['properties']['available'])){
						// Available layer
						layer.groupLayers = "available";
						layer.subgroupLayers = "available";
						if(!!layerData['properties']['geometry'] 
							&& !!Sicecat
							&& !!Sicecat.poolWFSAvalaibles
							&& !!Sicecat.poolWFSAvalaibles[layerData['properties']['geometry']]){
							Sicecat.poolWFSAvalaibles[layerData['properties']['geometry']].push(layer);
						}
					}else{
						// Occupied layer
						layer.groupLayers = "occupied";
						layer.subgroupLayers = "occupied";
					}
				}else{
					// It's not an editable layer
					layer.visibility = false;
				}
			}else{
				// He's an user
				if(layerData['properties']['editable'] && this.toBoolean(layerData['properties']['editable'])){
					if(layerData['properties']['inUse'] && this.toBoolean(layerData['properties']['inUse'])){
						// In use layer
						layer.groupLayers = "editables";
						layer.subgroupLayers = "editables";
					}else if(layerData['properties']['available'] && this.toBoolean(layerData['properties']['available'])){
						// Available layer
						layer.groupLayers = 'false';
						layer.subgroupLayers = 'false';
						layer.displayInLayerSwitcher = false;
						layer.visibility = false;
						if(!!layerData['properties']['geometry'] 
							&& !!Sicecat
							&& !!Sicecat.poolWFSAvalaibles
							&& !!Sicecat.poolWFSAvalaibles[layerData['properties']['geometry']]){
							Sicecat.poolWFSAvalaibles[layerData['properties']['geometry']].push(layer);
						}
					}else{
						// Occupied layer
						layer.groupLayers = 'false';
						layer.subgroupLayers = 'false';
						layer.displayInLayerSwitcher = false;
						layer.visibility = false;
					}
				}else{
					// It's not an editable layer
					layer.visibility = false;
				}
			}
			
			var mask_wfs = Sicecat.createLoadingMask();
			
			layer.events.register("loadstart", layer, function(object, element){
				mask_wfs.show();
				// Show a message when It's not loaded in 5 seconds
				setTimeout(function(){
					mask_wfs.hide();
					var msg = Sicecat.createTextMsg();
					Ext.Msg.alert(msg.title, msg.msg);
				}, 5000);
			});
			layer.events.register("loadend", layer, function(object, element){
				mask_wfs.hide();
			});
			
			// To prevent loading
			layer.visibility = false;			

			return layer;
		},

		//overwrite
	    copyAllPosibleProperties: function (fromMap, toMap){
	        for(var key in fromMap){
	            if (!!fromMap[key]
	                && ((typeof fromMap[key] == "string")
	                    || (typeof fromMap[key] == "number")
	                    || (typeof fromMap[key] == "boolean"))
	                && fromMap[key] != "[object Object]"
	                && key != "visibility") {
            		toMap[key] = fromMap[key];
	            }
	        }
	    }
});
