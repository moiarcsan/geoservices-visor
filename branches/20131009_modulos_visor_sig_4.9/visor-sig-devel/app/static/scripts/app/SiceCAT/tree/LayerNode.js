/*
 * LayerNode.js
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

/** api: (define)
 *  module = GeoExt.tree
 *  class = LayerNode
 *  base_link = `Ext.tree.TreeNode <http://dev.sencha.com/deploy/dev/docs/?class=Ext.tree.TreeNode>`_
 */

Ext.namespace("SiceCAT.tree");

/** api: constructor
 *  .. class:: LayerNode(config)
 * 
 *      A subclass of ``Ext.tree.TreeNode`` that is connected to an
 *      ``OpenLayers.Layer`` by setting the node's layer property. Checking or
 *      unchecking the checkbox of this node will directly affect the layer and
 *      vice versa. The default iconCls for this node's icon is
 *      "gx-tree-layer-icon", unless it has children.
 * 
 *      Setting the node's layer property to a layer name instead of an object
 *      will also work. As soon as a layer is found, it will be stored as layer
 *      property in the attributes hash.
 * 
 *      The node's text property defaults to the layer name.
 *      
 *      If the node has a checkedGroup attribute configured, it will be
 *      rendered with a radio button instead of the checkbox. The value of
 *      the checkedGroup attribute is a string, identifying the options group
 *      for the node.
 * 
 *      To use this node type in a ``TreePanel`` config, set ``nodeType`` to
 *      "gx_layer".
 */
SiceCAT.tree.LayerNode = Ext.extend(GeoExt.tree.LayerNode, {
	
	/** i18n **/
	wmsSigescatQtipText: "<h3>WMS-C layer (SIGESCAT)</h3><p>Only layer opacity allowed</p>",
	wmsQtipText: "<h3>WMS layer</h3><p>Functions allowed:<ul><li>View layer information</li><li>Zoom to layer</li><li>Layer opacity</li></ul></p>",
	vectorQtipText: "<h3>Vector layer</h3><p>Functions allowed:<ul><li>Edit layer style</li><li>Zoom to layer</li><li>Export layer selected to CSV file</li><li>Export layer selected to GML/KML file</li></ul></p>",
	editableQtipText: "<h3>WFS-T layer</h3><p>Functions allowed:<ul><li>Edit layer style</li><li>Zoom to layer</li><li>Export layer selected to CSV file</li><li>Export layer selected to GML/KML file</li><li>Rename Layer</li><li>Edit Layer</li></ul></p>",
    
    /** private: method[constructor]
     *  Private constructor override. Adds diferent icon for type-layer
     */
    constructor: function(config) {
        config.leaf = config.leaf || !(config.children || config.loader);
        
        if(!config.iconCls && !config.children) {
        	if(!!config.layer){
        		if(config.layer instanceof SiceCAT.Layer.WMS_SIGESCAT){
        			config.iconCls = "gx-tree-layer-icon_WMS_SIGESCAT";
        			config.qtip =  this.wmsSigescatQtipText;
        		}else if(config.layer instanceof OpenLayers.Layer.WMS){
        			config.iconCls = "gx-tree-layer-icon_WMS";
        			config.qtip =  this.wmsQtipText;
        		}else if(config.layer instanceof OpenLayers.Layer.Vector 
        				&& (!config.layer.strategies 
        						|| config.layer.strategies.length == 0)){
        			config.iconCls = "gx-tree-layer-icon_Vector";
        			config.qtip =  this.vectorQtipText;
        		}else if(!!config.layer.groupLayers){
        			config.iconCls = "gx-tree-layer-icon_"+config.layer.groupLayers;
        			config.qtip =  this.editableQtipText;
        		}
        		
        	}else{
        		config.iconCls = "gx-tree-layer-icon";
        	}
        }
        if(config.loader && !(config.loader instanceof Ext.tree.TreeLoader)) {
            config.loader = new GeoExt.tree.LayerParamLoader(config.loader);
        }
        
        this.defaultUI = this.defaultUI || GeoExt.tree.LayerNodeUI;
        
        Ext.apply(this, {
            layer: config.layer,
            layerStore: config.layerStore
        });
        if (config.text) {
            this.fixedText = true;
        }
        GeoExt.tree.LayerNode.superclass.constructor.apply(this, arguments);
    }
});

/**
 * NodeType: gx_layer
 */
Ext.tree.TreePanel.nodeTypes.gx_layer = SiceCAT.tree.LayerNode;
