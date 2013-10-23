/*
 * MousePositionSiceCAT.js
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
 * Authors: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Control/MousePosition.js
 */

/**
 * Class: OpenLayers.Control.MousePositionSiceCAT
 * 
 * The MousePosition control displays geographic coordinates of the mouse
 * pointer, as it is moved about the map in varius projections. 
 *
 * Inherits from:
 *  - <OpenLayers.Control.MousePosition>
 */
OpenLayers.Control.MousePositionSiceCAT = OpenLayers.Class(OpenLayers.Control.MousePosition, {
    
    /** 
     * APIProperty: numDigits
     * {Integer}
     */
    numDigits: 2,
    
    numDigitsPerProjection:{
    	"WGS84": 6	
    },
    
    /** 
     * APIProperty: projectionsToShow
     * {Array<String>}
     */
    projectionsToShow: null,
    
    /** 
     * APIProperty: projectionsToShow
     * {Array<String>}
     */
    projectionsNameToShow: null,
   
    /**
     * Method: redraw  
     */
    redraw: function(evt) {

        var lonLat;

        if (evt == null) {
            this.reset();
            return;
        } else {
            if (this.lastXy == null ||
                Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
                Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
            {
                this.lastXy = evt.xy;
                return;
            }

            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) { 
                // map has not yet been properly initialized
                return;
            }    
            if (this.displayProjection) {
            	if(this.projectionsToShow != null){
            		var lonLats = new Array();
        			var newHtml = "";
            		for(var i = 0; i<this.projectionsToShow.length; i++){
            			lonLats[i] = lonLat.clone();
            			var proj4js = new OpenLayers.Projection(this.projectionsToShow[i]);
            			lonLats[i].transform(this.map.getProjectionObject(),proj4js);
                		newHtml += this.formatOutput(lonLats[i], this.projectionsNameToShow[i]);
                		if(i<this.projectionsToShow.length-1){
                			newHtml += "<br/>";
                		}
            		}
            	}else{
            		lonLat.transform(this.map.getProjectionObject(), 
                                 this.displayProjection );
            	}
            }      
            this.lastXy = evt.xy;
            
        }
        
        if(this.projectionsToShow == null){
        	var newHtml = this.formatOutput(lonLat);    
        }
        
        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
        
    },

    /**
     * Method: formatOutput
     * Override to provide custom display output
     *
     * Parameters:
     * lonLat - {<OpenLayers.LonLat>} Location to display
     */
    formatOutput: function(lonLat, projection) {
    	var newHtml = "";
    	if (this.displayProjection) {
    		if(!!projection){
    			newHtml += projection.toString() + ": (";
    		}else{
    			newHtml += this.map.projection + ": (";
    		}
    	}
    	var numDigits = this.numDigitsPerProjection[projection.toString()] | this.numDigits;
        var digits = parseInt(numDigits);
        newHtml +=
            this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator + 
            lonLat.lat.toFixed(digits) +
            this.suffix;
        
    	if (this.displayProjection) {
    		newHtml += ")"; 
    	}
    	
        return newHtml;
    },

    CLASS_NAME: "OpenLayers.Control.MousePosition" //Uses class_name MousePosition
});
