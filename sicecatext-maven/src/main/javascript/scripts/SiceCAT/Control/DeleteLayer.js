/*
 * OpenLayers.Control.DeleteLayer.js
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
 * Authors: Moisés Arcos Santiago (mailto:marcos@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.DeleteLayer
 * 
 * The DeleteLayer control is a button that deletes a selected layer
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
OpenLayers.Control.DeleteLayer = OpenLayers.Class(OpenLayers.Control, {
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
    
    deleteSuccess: "Delete success",
    deleteFailure: "Delete failure",
    deleteSuccessText: "Success to remove the layer",
    deleteFailureText: "Error to remove the layer",
    
    /**
     * Method: trigger
     * Do the delete layer action 
     */
    trigger: function() {
    	
    	if(!!this.layer
    			&& !this.layer.layerID){
    		//Remove search result #75263
			try{
				this.layer.destroyFeatures();
				map.removeLayer(this.layer);
				// Remove the layer from tree layer
				Sicecat.parentNode = this.node.parentNode;
				this.node.parentNode.removeChild(this.node);
				//parentNode.expanded = true;
			}catch(e){
				console.log(e.stack);
			}
			return;
		}
    	var layerID = this.layer.layerID.toString();
    	var self = this;
    	PersistenceGeoParser.deleteLayerByLayerId(layerID, 
    		function(form, action){
    			/*
    			 * ON SUCCESS
    			 */
    			map.removeLayer(self.layer);
    			var jsonResponseObject = Ext.util.JSON.decode(action.response.responseText);
    			// Show the message
    			if(jsonResponseObject.success){
    				Ext.Msg.alert(self.deleteSuccess, self.deleteSuccessText);
    			}
    		}, 
    		function(form, action){
    			/*
    			 * ON FAILURE
    			 */
    			var jsonResponseObject = Ext.util.JSON.decode(action.response.responseText);
    			if(!jsonResponseObject.success){
    				Ext.Msg.alert(self.deleteFailure, self.deleteFailureText);
    			}
    		}
    	);
    },
    
    CLASS_NAME: "OpenLayers.Control.DeleteLayer"
});