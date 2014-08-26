/*
 * TreeNodeRadioButton.js
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
 * Author: María Arias de Reyna Domínguez (mailto:marias@emergya.com)
 * 
 */

 /**
  * @include GeoExt/plugins/TreeNodeRadioButton.js
  */
Ext.namespace("SiceCAT.plugins");

/** api: (define)
 *  module = SiceCAT.plugins
 *  class = TreeNodeRadioButton
 */

/** api: constructor
 *  A plugin to create tree node UIs with radio buttons. Can be plugged into
 *  any ``Ext.tree.TreePanel`` and will be applied to nodes that are extended
 *  with the :class:`GeoExt.Tree.TreeNodeUIEventMixin`, in particular
 *  :class:`GeoExt.tree.LayerNodeUI` nodes.
 *
 *  A tree with a ``GeoExt.plugins.TreeNodeRadioButton`` fires the additional
 *  ``radiochange`` event when a node's radio button is clicked.
 *
 *  Only if a node is configured ``radioGroup`` attribute, it will be rendered
 *  with a radio button next to its icon. The ``radioGroup`` works like a
 *  HTML checkbox with its ``name`` attribute, and ``radioGroup`` is a string
 *  that identifies the options group.
 * 
 */

/** api: example
 *  Sample code to create a tree with a node that has a radio button:
 *
 *  .. code-block:: javascript
 *
 *      var UIClass = Ext.extend(
 *          Ext.tree.TreeNodeUI,
 *          GeoExt.tree.TreeNodeUIEventMixin
 *      );
 *      var tree = new Ext.tree.TreePanel({
 *          plugins: [
 *              new GeoExt.plugins.TreeNodeRadioButton({
 *                  listeners: {
 *                      "radiochange": function(node) {
 *                          alert(node.text + "'s radio button was clicked.");
 *                      }
 *                  }
 *              })
 *          ],
 *          root: {
 *              nodeType: "node",
 *              uiProvider: UIClass,
 *              text: "My Node",
 *              radioGroup: "myGroupId"
 *          }
 *      }
 */

SiceCAT.plugins.TreeNodeRadioButton = Ext.extend(GeoExt.plugins.TreeNodeRadioButton, {
    
    /** private: method[constructor]
     *  :param config: ``Object``
     */
    constructor: function(config) {
        Ext.apply(this.initialConfig, Ext.apply({}, config));
        Ext.apply(this, config);

        this.addEvents(
            /** api: event[radiochange]
             *  Fires when a radio button is clicked.
             *
             *  Listener arguments:
             *  
             *  * node - ``Ext.TreeNode`` The node of the clicked radio button.
             */
            "radiochange",
            "onContextMenu",
            "onClickNode",
            "onStartDrag",
            "onEndDrag",
            "beforeNodeDrop",
            "checkchange"
        );

        SiceCAT.plugins.TreeNodeRadioButton.superclass.constructor.apply(this, arguments);
    },

    /** private: method[init]
     *  :param tree: ``Ext.tree.TreePanel`` The tree.
     */
    init: function(tree) {
        tree.on({
            "rendernode": this.onRenderNode,
            "rawclicknode": this.onRawClickNode,
            "beforedestroy": this.onBeforeDestroy,
            "contextmenu": this.onContextMenu,
            "startdrag":this.onStartDrag,
            "enddrag":this.onEndDrag,
            "beforenodedrop":this.beforeNodeDrop,
            "checkchange":this.OnCheckChange,
            scope: this
        });
    },
    
    /** private: method[beforeNodeDrop]
     *  :param node: ``Ext.tree.TreeNode``
     */
    OnCheckChange: function(node, checked) {
        this.fireEvent("checkchange", node, checked);
    },
    
    /** private: method[beforeNodeDrop]
     *  :param node: ``Ext.tree.TreeNode``
     */
    beforeNodeDrop: function(dropEvent) {
        this.fireEvent("beforeNodeDrop", dropEvent);
    },
    
    /** private: method[onStartDrag]
     *  :param node: ``Ext.tree.TreeNode``
     */
    onStartDrag: function(panel, node, e) {
        this.fireEvent("onStartDrag", node, e);
    },
    
    /** private: method[onEndDrag]
     *  :param node: ``Ext.tree.TreeNode``
     */
    onEndDrag: function(panel, node, e) {
        this.fireEvent("onEndDrag", node, e);
    },
    
    /** private: method[onRenderNode]
     *  :param node: ``Ext.tree.TreeNode``
     */
    onContextMenu: function(node, e) {
        this.fireEvent("onContextMenu", node, e);
    },
    
    /** private: method[onRawClickNode]
     *  :param node: ``Ext.tree.TreeNode``
     *  :param e: ``Ext.EventObject``
     */
    onRawClickNode: function(node, e) {
        var el = e.getTarget('.gx-tree-radio', 1); 
        this.fireEvent("onClickNode", node);
        if(el) {
            el.defaultChecked = el.checked;
            this.fireEvent("radiochange", node);
            return false;
        }
    }

});

/** api: ptype = gx_treenoderadiobutton */
Ext.preg("gx_treenoderadiobutton", SiceCAT.plugins.TreeNodeRadioButton);
