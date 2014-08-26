/*
 * OverviewMap.js
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
 * @requires OpenLayers/Control/OverviewMap.js
 */

/**
 * Class: SiceCAT.Control.OverviewMap
 * The OverMap control creates a small overview map, useful to display the 
 * extent of a zoomed map and your main map and provide additional 
 * navigation options to the User.  By default the overview map is drawn in
 * the lower right corner of the main map. Create a new overview map with the
 * <OpenLayers.Control.OverviewMap> constructor.
 *
 * Inerits from:
 *  - <OpenLayers.Control.OverviewMap>
 */
SiceCAT.Control.OverviewMap = OpenLayers.Class(OpenLayers.Control.OverviewMap, {

    /**
     * Method: update
     * Update the overview map after layers move.
     */
    update: function() {
    	//if(Sicecat.isLogEnable) console.log("UPDATING OVERVIEW MAP");
    	
    	if(!!this.ovmap){
    		this.changeToResolution(this.ovmap.getResolution());
    	}
    	
    	OpenLayers.Control.OverviewMap.prototype.update.apply(this, arguments);
    },
    
    /**
     * Method: createMap
     * Construct the map that this control contains
     */
    createMap: function() {
    	//if(Sicecat.isLogEnable) console.log("CREATE OVERVIEW MAP");
    	
    	this.changeToResolution(350);
    	
    	OpenLayers.Control.OverviewMap.prototype.createMap.apply(this, arguments);
    },
    
    /**
     * Method: changeToResolution
     * Change the resolution of SiceCAT.Layer.WMS_SIGESCAT layers
     */
    changeToResolution: function(targetRes){
    	for (var i = 0; i< this.layers.length; i++){
    		var layer = this.layers[i];
    		if(layer instanceof SiceCAT.Layer.WMS_SIGESCAT){
    			layer.changeLayerNameFromRes(targetRes);
    		}
    	}
    },

    CLASS_NAME: 'OpenLayers.Control.OverviewMap'
});
