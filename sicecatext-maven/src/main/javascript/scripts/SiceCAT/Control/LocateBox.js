/*
 * SiceCAT.Control.LocateBox.js
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
 * @requires OpenLayers/Control/ZoomBox.js
 */

/**
 * Class: SiceCAT.Control.LocateBox
 * The LocateBox control enables get BBOX to a given extent, by drawing 
 * a box on the map. The box is drawn when this control is active, whilst dragging 
 * the mouse.
 *
 * Inherits from:
 *  - <OpenLayers.Control.ZoomBox>
 */
SiceCAT.Control.LocateBox = OpenLayers.Class(OpenLayers.Control.ZoomBox, {
	
	/** i18n */ 
	toolTipText: "Draw a rectangle to send it to search resources",
	layerText: "Search box layer",

    /**
     * Method: draw
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
                            {done: this.zoomBox}, 
                            {layerOptions: {
                                styleMap: this.createStyleMap()
                            }} );
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    zoomBox: function (position) {
    	/*var layer_old = AuxiliaryLayer.map.getLayersByName(this.layerText);
    	if(layer_old.length > 0){
    		AuxiliaryLayer.map.removeLayer(layer_old[0]);
    	}*/
    	var layer = this.getLayer(this.layerText);
        var bounds;
        if (position instanceof OpenLayers.Bounds) {
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.left, position.bottom));
                var maxXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.right, position.top));
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
        } else { // it's a pixel
        	bounds = new OpenLayers.Bounds();
            if (!this.out) {
                bounds.extend(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() + 1);
            } else {
            	bounds.extend(this.map.getLonLatFromPixel(position),
                               this.map.getZoom() - 1);
            }
        }
        if(!!bounds){
        	var coords = bounds.toBBOX().split(",");
        	var feature = new OpenLayers.Feature.Vector(bounds.toGeometry());
        	layer.addFeatures(feature);
        	integrator.msAplRectangleSelected(coords[0],coords[1],coords[2],coords[3]);
        }
    },
    
    getLayer : function(layername) {
		var vectorLayer = map.getLayersByName(layername);
		if (vectorLayer.length == 0){
			var vectorLayer = new OpenLayers.Layer.Vector(layername, {
				styleMap: this.createStyleMap()
			});
			vectorLayer.id = layername;
			map.addLayer(vectorLayer);	
		}else{
			vectorLayer = vectorLayer[0];
		}
		return vectorLayer;
	},

    /** private: method[createStyleMap]
     *  Creates the default style map.
     *
     *  :return: ``OpenLayers.StyleMap`` The style map.
     */
    createStyleMap: function() {
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 0.3,
                strokeWidth: 1,
                strokeOpacity: 0.2,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 2,
                fillOpacity: 0.3,
                strokeOpacity: 0.2,
                strokeColor: "#666666",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 0.2,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        return new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({symbolizer: sketchSymbolizers})]
            })
        });
    },
    
    /**
     * APIMethod: deactivate
     * Deactivates a control and it's associated handler if any.  The exact
     * effect of this depends on the control itself.
     * 
     * Returns:
     * {Boolean} True if the control was effectively deactivated or false
     *           if the control was already inactive.
     */
    deactivate: function () {
        OpenLayers.Control.prototype.deactivate.apply(this, arguments);
        AuxiliaryLayer.deleteLayer(this.layerText);
    },

    CLASS_NAME: "OpenLayers.Control.ZoomBox"
});
