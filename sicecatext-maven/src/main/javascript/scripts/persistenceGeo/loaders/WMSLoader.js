/*
 * WMSLoader.js Copyright (C) 2012 This file is part of PersistenceGeo project
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
 *  class = WMSLoader
 */
Ext.namespace("PersistenceGeo.loaders.WMSLoader");

/**
 * Class: PersistenceGeo.WMSLoader
 * 
 * Loader for WMS Layers
 * 
 */
PersistenceGeo.loaders.WMSLoader 
	= Ext.extend(PersistenceGeo.loaders.AbstractLoader,{

		load: function (layerData, layerTree){
			var visibility = false;
			var transparent = true;
			var isBaseLayer = false;
			var opacity = 0.5;
			var buffer = 0;
			var format = 'image/png';
			var layers = layerData.name;
			var security = false;
			var layer_url = null;
			var params = null;
			
			if(!!layerData.properties){
				visibility = this.toBoolean(layerData.properties.visibility) || false;
				transparent = this.toBoolean(layerData.properties.transparent) || true;
				isBaseLayer = this.toBoolean(layerData.properties.isBaseLayer) || false;
				opacity = this.toNumber(layerData.properties.opacity) || 0.5;
				buffer = this.toNumber(layerData.properties.buffer) || 0;	
				format = layerData.properties.format;
				layers = layerData.properties.layers;
				security = this.toBoolean(layerData.properties.security) || false;
			}
			/* GetURLProxy */
			if(security){
				layer_url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, layerData.server_resource);
				var wmssecurized = Global_TMP.WMSSecured.wmssecurized;
				var user = null;
				var pass = null;
				for(server in wmssecurized){
					if(this.urlCompare(layer_url, server)){
						user = Global_TMP.WMSSecured.wmssecurized[server]["user"];
						pass = Global_TMP.WMSSecured.wmssecurized[server]["pass"];
						layer_url += "user=" + user + "&pass=" + pass;
					}
				}
			}else{
				layer_url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.CARTOGRAFIA, layerData.server_resource);
			}
			params = {
				layers: layers,
	    		transparent: transparent,
	    		security: security
	    	};
			
			var options = {
				format: format,
	    		isBaseLayer: isBaseLayer,
	    		visibility: visibility,
	     		opacity: opacity,
	    		buffer : buffer
			};
			
			var layer = new OpenLayers.Layer.WMS(layerData.name, layer_url, params, options);
			
			this.postFunctionsWrapper(layerData, layer, layerTree);
			
			return layer;
		},
		
		/**
		 * Method: urlCompare
		 * 
		 * Devuelve true si las dos url son iguales
		 * 
		 * @param urlCompare
		 * @param target_url
		 * 
		 * @returns {Boolean}
		 */
		urlCompare: function (source_url, target_url){
			var url_array = this.urlSplit(target_url);
			var ret = true;
			for(var i=0; i<url_array.length; i++){
				if(source_url.indexOf(url_array[i]) != -1){
					ret = ret && true;
				}else{
					ret = ret && false;
				}
			}
			return ret;
		},
		
		/**
		 * Method: urlSplit
		 * 
		 * Devuelve un array con las partes que conforman una url
		 * Formato: http://host:port/additionalpath
		 * 
		 * @param url
		 * 
		 * @returns {Array}
		 */
		urlSplit: function(url){
			var urlsplit, urlhttp, urladd, urlsplit2 = null;
			if(url!=null){
				urlsplit = server.split("//");
				if(urlsplit.length > 0){
					urlhttp = urlsplit[0];
					urladd = urlsplit[1];
				}
				urlsplit2 = urladd.split("/");
				if(urlsplit2.length > 0){
					return urlsplit2;
				}
			}
		}
});
