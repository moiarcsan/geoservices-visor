/*
 * WMS_SIGESCAT.js
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
 * Author:
 * 
 *  Alejandro Díaz Torres(adiaz@emergya.com)
 * 
 */

/**
 * @requires OpenLayers/Layer/WMS.js
 */

/**
 * Class: SiceCAT.Layer.WMS_SIGESCAT
 * Instances of OpenLayers.Layer.WMS are used to display data from OGC Web
 *     Mapping Services. Create a new WMS layer with the <OpenLayers.Layer.WMS>
 *     constructor.
 * This class calculate the name of the layer to be requested at zoom level 
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.WMS>
 */
SiceCAT.Layer.WMS_SIGESCAT = OpenLayers.Class(OpenLayers.Layer.WMS, {
	
	map: null,
	
	layerConf: null,
	
	resolutionsAllowed:
		[50,0.16,350,100,0.5,25,5,200,2,1,10],
	
	/**
     * Constructor: OpenLayers.Layer.WMS
     * Create a new WMS layer object
     *
     * Examples:
     *
     * The code below creates a simple WMS layer using the image/jpeg format.
     * (code)
     * var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {layers: "modis,global_mosaic"});
     * (end)
     * Note the 3rd argument (params). Properties added to this object will be
     * added to the WMS GetMap requests used for this layer's tiles. The only
     * mandatory parameter is "layers". Other common WMS params include
     * "transparent", "styles" and "format". Note that the "srs" param will
     * always be ignored. Instead, it will be derived from the baseLayer's or
     * map's projection.
     *
     * The code below creates a transparent WMS layer with additional options.
     * (code)
     * var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {
     *                                        layers: "modis,global_mosaic",
     *                                        transparent: true
     *                                    }, {
     *                                        opacity: 0.5,
     *                                        singleTile: true
     *                                    });
     * (end)
     * Note that by default, a WMS layer is configured as baseLayer. Setting
     * the "transparent" param to true will apply some magic (see <noMagic>).
     * The default image format changes from image/jpeg to image/png, and the
     * layer is not configured as baseLayer.
     *
     * Parameters:
     * name - {String} A name for the layer
     * url - {String} Base url for the WMS
     *                (e.g. http://wms.jpl.nasa.gov/wms.cgi)
     * params - {Object} An object with key/value pairs representing the
     *                   GetMap query string parameters and parameter values.
     * options - {Object} Hashtable of extra options to tag onto the layer.
     *     These options include all properties listed above, plus the ones
     *     inherited from superclasses.
     * layerConf - {HashMap} with configuration for this layer
     */
    initialize: function(name, url, params, options, layerConf) {
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, arguments);
    	this.layerConf = layerConf;
    },
    
    /**
     * Method: getURL
     * Return a GetMap query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox for the
     *                                request.
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters.
     */
    getURL: function (bounds) {
    	this.changeLayerName(this.layerConf);
    	return OpenLayers.Layer.WMS.prototype.getURL.apply(this, arguments);
    },
    
    /**
     * Method: changeLayerName
     * Rename layer name with map resolution
     *
     * Parameters:
     * layerConf - {<HashMap>} With layer configuration.
     */
    changeLayerName: function(layerConf){
    	
    	//if(Sicecat.isLogEnable) console.log("this.map.resolution --> "+this.map.resolution);
    	
    	if(!!this.map.resolution){
    		this.changeLayerNameFromRes(this.map.resolution);
    	}
    },
    
    /**
     * Method: changeLayerName
     * Rename layer name with map resolution
     *
     * Parameters:
     * layerConf - {<HashMap>} With layer configuration.
     */
    changeLayerNameFromRes: function(resolution){
    	
    	//if(Sicecat.isLogEnable) console.log("resolution --> "+resolution);
    	
    	this.resolution = resolution;
    	
    	if(!!resolution){
	    	var options1 = this.layerConf['layerOp1'];
			var layersOp1;
			if(options1.layers.indexOf("_") < 0){
				layersOp1 = options1.layers + "_" + resolution;
				options1.layers = layersOp1;
			}else{
				layersOp1 = options1.layers.replace(options1.layers.split("_")[1], resolution);
				options1.layers = layersOp1;
			}
			
			//if(Sicecat.isLogEnable) console.log("layersOp1 --> " + layersOp1);
			
			var visiblity = (this.layerConf['isBasevisiblity'] == "true");
			var isBaseLayer = (this.layerConf['isBaseLayer'] == "true");
			this.mergeNewParams({layers:layersOp1});
    	}
    },

    /**
     * APIMethod: redraw
     * Redraws the layer.  Returns true if the layer was redrawn, false if not.
     *
     * Parameters:
     * force - {Boolean} Force redraw by adding random parameter.
     *
     * Returns:
     * {Boolean} The layer was redrawn.
     */
    redraw: function(force) {
    	var allowed = false;
    	if(!!this.resolution && !!this.resolutionsAllowed){
    		for(var i = 0; i<this.resolutionsAllowed.length; i++){
    			if(this.resolutionsAllowed[i] == this.resolution){
    				allowed = true;
    				break;
    			}
    		}	    	
    	}
    	
    	if(allowed){
    		return OpenLayers.Layer.Grid.prototype.redraw.apply(this, arguments);
    	}else{
    		return false;
    	}
    },

    
    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.WMS_SIGESCAT>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new SiceCAT.Layer.WMS_SIGESCAT(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions(), this.layerConf);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.WMS.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        obj.layerConf = this.layerConf;
        
        if(Sicecat.isLogEnable) console.log("cloned --> " + obj.name +" as "+obj.CLASS_NAME);

        return obj;
    },    

    CLASS_NAME: "SiceCAT.Layer.WMS_SIGESCAT"
});

/** private: method[supports]
 *  Private overrides <SiceCAT.Layer.WMS_SIGESCAT> not supported
 */
GeoExt.WMSLegend.supports = function(layerRecord) {
    return (layerRecord.getLayer() instanceof OpenLayers.Layer.WMS) && !(layerRecord.getLayer() instanceof SiceCAT.Layer.WMS_SIGESCAT);
};