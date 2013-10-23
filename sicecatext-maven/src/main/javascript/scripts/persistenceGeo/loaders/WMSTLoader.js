/*
 * WMSTLoader.js Copyright (C) 2012 This file is part of SiceCAT project
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
 *  module = PersistenceGeoParser
 */
Ext.namespace("PersistenceGeo.loaders");

/** api: (define)
 *  module = PersistenceGeoParser.loaders
 *  class = WMSTLoader
 */
Ext.namespace("PersistenceGeo.loaders.WMSTLoader");

/**
 * Class: PersistenceGeoParser.laoders.WMSTLoader
 * 
 * Loader for WMS SIGESCAT Layers
 */ 
PersistenceGeo.loaders.WMSTLoader 
= Ext.extend(PersistenceGeo.loaders.AbstractLoader,{
		
		load: function (layerData, layerTree) {
			
			var layerOptions = {
					layerOp1: {
						layers: layerData.properties.layers,
		    			transparent: PersistenceGeoParser.AbstractLoader.toBoolean(layerData.properties.transparent)
					},
					layerOp2:{
						format: layerData.properties.format,
		    			//isBaseLayer: PersistenceGeoParser.AbstractLoader.toBoolean(layerData.properties.isBaseLayer),
		    			isBaseLayer: true,
		    			visibility: PersistenceGeoParser.AbstractLoader.toBoolean(layerData.properties.visibility),
		     			opacity: PersistenceGeoParser.AbstractLoader.toNumber(layerData.properties.opacity),
		    			resolutions: PersistenceGeoParser.AbstractLoader.parseStringToArrayNumbers(layerData.properties.resolutions),
		    			buffer : PersistenceGeoParser.AbstractLoader.toNumber(layerData.properties.buffer),
		    			maxExtent: map.maxExtent
					}
			};
			
			var layer = new SiceCAT.Layer.WMS_SIGESCAT(
					layerData.name,
					(OpenLayers.ProxyHost
							.indexOf("url2") != -1 ? OpenLayers.ProxyHost
							: "")
							+ layerData.server_resource,
					layerOptions.layerOp1,
					layerOptions.layerOp2, layerOptions);
			
			this.testLayer((OpenLayers.ProxyHost
							.indexOf("url2") != -1 ? OpenLayers.ProxyHost
							: "")
							+ layerData.server_resource, map, layerData, null);
			
			//TODO: Wrap 
			PersistenceGeoParser.AbstractLoader.postFunctionsWrapper(layerData, layer, layerTree);
			
			return layer;
		},
		
		/*
		 *  private: testLayer
		 */
		testLayer: function (url, map, layerToLoad, continueLoading){
			//Sicecat.testLayerGetCapabilities(url, map, layerToLoad, continueLoading);
			Sicecat.testLayerGetMap(url, map, layerToLoad, continueLoading);
		}
});
