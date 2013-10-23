/*
 * OpenLayers.Control.ZoomToSelection.js
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
 * Class: OpenLayers.Control.ZoomToSelection
 * 
 * The ZoomToSelection control is a button that zooms out to the bounds of
 * selected geometries
 * 
 * It is designed to be used with a <OpenLayers.Control.Panel>
 * 
 * Inherits from: - <OpenLayers.Control>
 * 
 * See also: - <AuxilaryLayer>
 */
OpenLayers.Control.ZoomToSelection = OpenLayers.Class(OpenLayers.Control, {

	/**
	 * Property: type {String} The type of <OpenLayers.Control> -- When added to
	 * a <Control.Panel>, 'type' is used by the panel to determine how to handle
	 * our events.
	 */
	type : OpenLayers.Control.TYPE_BUTTON,

	/*
	 * Method: trigger Do the zoom to selected features.
	 */
	trigger : function() {
		var bounds = new OpenLayers.Bounds();
		var found_feature = false;
		Ext.each(map.layers, function(layer, i) {
			Ext.each(layer.selectedFeatures, function(feature, j) {
				bounds.extend(feature.geometry.bounds);
				if (!found_feature)
					found_feature = true;
			});
		});

		if (found_feature) {
			if (this.logLevel == 'info') {
				if(Sicecat.isLogEnable) console.log("Zoom to " + bounds);
			}
			this.map.zoomToExtent(bounds, false);
		}

	},

	CLASS_NAME : "OpenLayers.Control.ZoomToSelection"
});
