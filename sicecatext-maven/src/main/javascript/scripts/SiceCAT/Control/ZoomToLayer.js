/*
 * OpenLayers.Control.ZoomToLayer.js
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
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ZoomToLayer
 * 
 * The ZoomToLayer control is a button that zooms out to the bounds
 * of layer bounds
 *  
 * It is designed to be used with a 
 * <OpenLayers.Control.Panel>
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 *  
 * See also:
 *  - <AuxilaryLayer>
 */
OpenLayers.Control.ZoomToLayer = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: type
     * {String} The type of <OpenLayers.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: OpenLayers.Control.TYPE_BUTTON,
    
    /**
     * Property: sicecatInstance
     * 
     * {SiceCAT} instance of application
     */
    sicecatInstance: null,
    
    /**
     * Property: layer
     * 
     * {OpenLayers.Layer} to do the zoom
     */
    layer: null,
    
    layers: [],
    layerIndex: 0,
    
    /** api: config[closest]
     *  ``Boolean`` Find the zoom level that most closely fits the specified
     *  extent. Note that this may result in a zoom that does not exactly
     *  contain the entire extent.  Default is false.
     */
    closest: false,
    
    /**
     * private: bboxReadr
     */
    bboxReadr: new Ext.data.XmlReader(
    		{ record: 'Layer'},
    		[
    		{name: 'name', mapping: 'Name'}
    		,{name: 'csr', mapping: 'BoundingBox > @CSR'}
    		,{name: 'minx', mapping: 'BoundingBox > @minx'}
    		,{name: 'miny', mapping: 'BoundingBox > @miny'}
    		,{name: 'maxx', mapping: 'BoundingBox > @maxx'}
    		,{name: 'maxy', mapping: 'BoundingBox > @maxy'}
    		]),
    
    /*
     * Method: trigger
     * Do the zoom to selected features.
     */
    trigger: function() {
    	if(!!this.sicecatInstance && !!this.sicecatInstance.activeLayer) {
    		this.layer = this.sicecatInstance.activeLayer; 
    	}
        if (!!this.map && !!this.layer) {
        	var extent = this.getMaxLayerExtent();
        	if(!!extent){
        		this.map.zoomToExtent(extent, this.closest);
        	}
    	}
    },

    /**
     * Method: getMaxLayerExtent
     *  
     * get layer extent
     */
    getMaxLayerExtent: function() {
        var layer = this.layer;
        var dataExtent = layer instanceof OpenLayers.Layer.Vector &&
            layer.getDataExtent();
        if(layer instanceof OpenLayers.Layer.WMS){
        	if(!layer.boundCalculated){
        		if(Sicecat.isLogEnable) console.log("Calculating bbox of "+layer.name);
        		this.getCapabilitiesWMS(layer);
		        return null;
	        }else{
	        	if(Sicecat.isLogEnable) console.log( "Bbox of "+layer.name+ "as been calculate previusly = "+layer.boundCalculated);
	        	return layer.boundCalculated;
	        }
        }else{
        	return layer.restrictedExtent || dataExtent || layer.maxExtent || this.map.maxExtent;
        }
    },

	/**
	 * Method: getCapabilitiesWMS
	 * 
	 * Shows and return a grid panel with WMS getCapabilites
	 * request
	 * 
	 * Parameters layer - <OpenLayers.Layer.WMS> to obtain
	 * capabilities
	 */
	getCapabilitiesWMS : function(layer) {
		var self = this;
		// Nos traemos el extent del getcapabilities
		var funcResCap = function(result){
			var format = new OpenLayers.Format.WMSCapabilities();
			var capabilities = format.read(result.responseText);
			var layers = capabilities.capability.layers;
			var layer = self.layer;
			var nameLayer = layer.params["LAYERS"];
			var layerFind = null;
			var find = false;
			for(var i=0; i<layers.length; i++){
				if(!find && nameLayer == layers[i].name){
					find == true;
					layerFind = layers[i];
				}
			}
			if(layerFind){
				var bbox = layerFind.bbox[layer.projection.projCode].bbox;
				var bounds = new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3]);
				self.layer.boundCalculated = bounds;
		    	self.map.zoomToExtent(self.layer.boundCalculated, self.closest);
			}
		};
		Sicecat.testLayerInformation(layer.url, map, layer, funcResCap);
	},

    CLASS_NAME: "OpenLayers.Control.ZoomToLayer"
});

//TODO: Depurar el reader para SIGESCAT
///**
// * @requires OpenLayers/Control.js
// */
//
///**
// * Class: OpenLayers.Control.ZoomToLayer
// * 
// * The ZoomToLayer control is a button that zooms out to the bounds
// * of layer bounds
// *  
// * It is designed to be used with a 
// * <OpenLayers.Control.Panel>
// *
// * Inherits from:
// *  - <OpenLayers.Control>
// *  
// * See also:
// *  - <AuxilaryLayer>
// */
//OpenLayers.Control.ZoomToLayer = OpenLayers.Class(OpenLayers.Control, {
//
//    /**
//     * Property: type
//     * {String} The type of <OpenLayers.Control> -- When added to a 
//     *     <Control.Panel>, 'type' is used by the panel to determine how to 
//     *     handle our events.
//     */
//    type: OpenLayers.Control.TYPE_BUTTON,
//    
//    /**
//     * Property: sicecatInstance
//     * 
//     * {SiceCAT} instance of application
//     */
//    sicecatInstance: null,
//    
//    /**
//     * Property: layer
//     * 
//     * {OpenLayers.Layer} to do the zoom
//     */
//    layer: null,
//    
//    /** api: config[closest]
//     *  ``Boolean`` Find the zoom level that most closely fits the specified
//     *  extent. Note that this may result in a zoom that does not exactly
//     *  contain the entire extent.  Default is true.
//     */
//    closest: true,
//    
//    /**
//     * private: bboxReadr
//     */
//    bboxReadr: new Ext.data.XmlReader(
//    		{ record: 'Layer'},
//    		[
//    		{name: 'name', mapping: 'Name'}
//    		,{name: 'csr', mapping: 'BoundingBox > @SRS'}
//    		,{name: 'minx', mapping: 'BoundingBox > @minx'}
//    		,{name: 'miny', mapping: 'BoundingBox > @miny'}
//    		,{name: 'maxx', mapping: 'BoundingBox > @maxx'}
//    		,{name: 'maxy', mapping: 'BoundingBox > @maxy'}
//    		]),
//    
//    /*
//     * Method: trigger
//     * Do the zoom to selected features.
//     */
//    trigger: function() {
//    	this.bboxReadr.read = function(response){
//			if(!response.responseXML && !!response.responseText){
//				response.responseXML = response.responseText;
//			}
//			Ext.data.XmlReader.prototype.read.apply(this, arguments);
//		};
//    	
//    	if(!!this.sicecatInstance && !!this.sicecatInstance.activeLayer) {
//    		this.layer = this.sicecatInstance.activeLayer; 
//    	}
//        if (!!this.map && !!this.layer) {
//        	var extent = this.getMaxLayerExtent();
//        	if(!!extent){
//        		this.map.zoomToExtent(extent, this.closest);
//        	}
//    	}
//    },
//
//    /**
//     * Method: getMaxLayerExtent
//     *  
//     * get layer extent
//     */
//    getMaxLayerExtent: function() {
//        var layer = this.layer;
//        var dataExtent = layer instanceof OpenLayers.Layer.Vector &&
//            layer.getDataExtent();
//        if(layer instanceof OpenLayers.Layer.WMS){
//        	if(!layer.boundCalculated){
//		        var store = new Ext.data.Store({
//		        	url : OpenLayers.ProxyHost + layer.url + "request=getCapabilities",
//		        	reader : this.bboxReadr,
//		        	listeners:{
//		        		beforeread:function(){
//		        			if(Sicecat.isLogEnable) console.log("beforeread");
//		        		},
//		            	load: function(){
//		            		//alert("load");
//		            		//load bbox from capabilities and zoom to it
//		            		this.loadBBox(store, layer, true);
//		            	}, 
//		            	scope: this
//		            }
//		        });
//		        // load the store with records derived from the doc at the above url
//		        store.load();
//		        return null;
//	        }else{
//	        	return layer.boundCalculated;
//	        }
//        }else{
//        	return layer.restrictedExtent || dataExtent || layer.maxExtent || this.map.maxExtent;
//        }
//    },
//    
//    /**
//     * Method: loadBBox
//     *  
//     * Calculate bbox of wms layer and zoom to it if doZoom = true
//     * 
//     * Parameters
//     *  doZoom - <Boolean> do the zoom to result bbox
//     */
//    loadBBox: function (store, layer, doZoom) {
//        
//    	var bounds = new OpenLayers.Bounds();
//    	var found = false;
//        var records = store.getRange();
//        
//        for(var i = 0; i < records.length; i++){
//        	var rec = records[i];
//        	var layers = layer.params.LAYERS;
//        	if(layers.contains(rec.get("name"))){
//        		var bbox = new OpenLayers.Bounds(rec.data.minx, rec.data.miny, rec.data.maxx, rec.data.maxy);
//        		if(!!bbox){
//        			//alert("Bounds of " + rec.get("name") + " = " + bbox);
//        			bounds.extend(bbox);
//        			found = true;
//        		}
//        	}
//        }
//        
//        if(found){
//        	layer.boundCalculated = bounds;
//        	if(doZoom){
//        		this.map.zoomToExtent(bounds, this.closest);
//        	}
//        }
//        
//        return found;
//    },
//
//    CLASS_NAME: "OpenLayers.Control.ZoomToLayer"
//});