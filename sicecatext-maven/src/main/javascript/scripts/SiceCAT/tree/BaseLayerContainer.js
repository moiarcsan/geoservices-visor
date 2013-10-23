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

/**
 * @requires GeoExt/widgets/tree/LayerContainer.js
 */
Ext.namespace("SiceCAT.tree");

/** api: (define)
 *  module = SiceCAT.tree
 *  class = BaseLayerContainer
 */

/** api: (extends)
 * GeoExt/widgets/tree/LayerContainer.js
 */

/** api: constructor
 *  .. class:: BaseLayerContainer
 * 
 *     A layer container that will collect all base layers of an OpenLayers
 *     map. Only layers that have displayInLayerSwitcher set to true will be
 *     included. The childrens' iconCls defaults to "gx-tree-baselayer-icon".
 *     
 *     Children will be rendered with a radio button instead of a checkbox,
 *     showing the user that only one base layer can be active at a time.
 * 
 *     To use this node type in ``TreePanel`` config, set nodeType to
 *     "gx_baselayercontainer".
 */
SiceCAT.tree.BaseLayerContainer = Ext.extend(GeoExt.tree.LayerContainer, {

    /** private: method[constructor]
     *  Private constructor override.
     */
    constructor: function(config) {
        config = Ext.applyIf(config || {}, {
            text: "Base Layer",
            loader: {}
        });
        config.loader = Ext.applyIf(config.loader, {
            baseAttrs: Ext.applyIf(config.loader.baseAttrs || {}, {
                //iconCls: 'gx-tree-baselayer-icon',
                checkedGroup: 'baselayer'
            }),
            filter: function(record) {
                var layer = record.getLayer();
                return layer.displayInLayerSwitcher === true &&
                    layer.isBaseLayer === true;
            }
        });

        GeoExt.tree.BaseLayerContainer.superclass.constructor.call(this,
            config);
    }
});

/**
 * NodeType: gx_baselayercontainer
 */
Ext.tree.TreePanel.nodeTypes.gx_baselayercontainer = SiceCAT.tree.BaseLayerContainer;
