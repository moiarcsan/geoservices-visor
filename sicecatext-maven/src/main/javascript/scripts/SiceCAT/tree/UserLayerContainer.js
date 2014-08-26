/*
 * UserLayerContainer.js
 * Copyright (C) 2011, Cliente <cliente@email.com>
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
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 * 
 */

/**
 * @requires SiceCAT/tree/OverlayLayerContainer.js
 */
Ext.namespace("SiceCAT.tree");

/** api: (define)
 *  module = SiceCAT.tree
 *  class = UserLayerContainer
 */

/** api: (extends)
 * SiceCAT/tree/OverlayLayerContainer.js
 */

/** api: constructor
 * .. class:: UserLayerContainer
 * 
 *     A layer container that will collect all overlay layers of an OpenLayers
 *     map. Only layers that have displayInLayerSwitcher set to true will be
 *     included and not contains a property called 'groupLayers' with value in this.notGroupLayers.
 * 
 *     To use this node type in ``TreePanel`` config, set nodeType to
 *     "gx_sicecat_userlayercontainer".
 */
SiceCAT.tree.UserLayerContainer = Ext.extend(SiceCAT.tree.OverlayLayerContainer, {
	/** api: property[groupLayers]
     *  ``String``
     *  The layer group to be show
     */
	groupLayers: null,
	
	/** api: property[notGroupLayers]
     *  ``Array<String>``
     *  The layer group not be show
     */
	notGroupLayers: ["editables"]
});

/**
 * NodeType: gx_overlaylayercontainer
 */
Ext.tree.TreePanel.nodeTypes.gx_sicecat_userlayercontainer = SiceCAT.tree.UserLayerContainer;
