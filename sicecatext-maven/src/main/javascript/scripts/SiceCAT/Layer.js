/*
 * Layer.js
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
 * @requires OpenLayers/Layer.js
 */

/**
 * Class: Layer 
 * 
 * Layer to be stored from SICECAT
 * II and used in SiceCAT SIG client.
 * 
 * Inherits from: - <OpenLayers.Class>
 */
SiceCAT.Layer = OpenLayers.Class({
	/**
	 * Property: id
	 * 
	 * Id of the layer to be renamed
	 */
	id: null,

	/**
	 * Property: name
	 * 
	 * New layer name
	 */
	name: null,

    /**
     * Constructor: SiceCAT.Layer
     *
     * Parameters:
     * id - {String} The layer id
     * name - {String} The layer name
     */
    initialize: function(id, name) {

        this.id = id;

        this.name = name;
    }
});