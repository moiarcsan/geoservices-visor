/*
 * AreaPoligono.js
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
 * Authors: Mariano López Muñoz (mailto:mlopez@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.AreaPoligono
 * The AreaPoligono lets drawing polygons in different layers.
 *
 * Inherits from:
 *  - <OpenLayers.Control.DrawFeature>
 */
OpenLayers.Control.AreaPoligono = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
	 /**
     * Property: type
     * {String} The type of <OpenLayers.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    CLASS_NAME: "OpenLayers.Control.AreaPoligono",
    //type: OpenLayers.Control.TYPE_BUTTON,
    displayClass: "ControlAreaPoligono",
    
    /**
     * Parameters:
     * handler - {<OpenLayers.Handler>} 
     * options - {Object} 
     */
    initialize: function(element) {
     	var attrAnterior = element.getAttribute("onchange");
     	if (attrAnterior == undefined)
     		attrAnterior = "";
     	element.areaPoligono = this;
     	var accesoSeleccion = "";
     	if (element.type == 'select-one') {
     		accesoSeleccion = 'this.options[this.selectedIndex].layer';
     	} else if (element.type == 'input') {
     		accesoSeleccion = 'this.layer';
     	}
     	element.setAttribute("onchange", attrAnterior +
     			"if(Sicecat.isLogEnable) console.log(this.type + 'onchange: ' + " + accesoSeleccion + ");" +
     			";this.areaPoligono.setLayer(" + accesoSeleccion + ");");
    },

    setLayer: function(layer) {
		OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [layer, OpenLayers.Handler.Polygon]);
		this.activate();
	}
	
	
});

