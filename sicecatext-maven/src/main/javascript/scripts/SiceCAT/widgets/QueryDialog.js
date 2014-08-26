/* 
 * Copyright (C) 2014 Emergya
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * 
 * Authors:: Luis Román Gutiérrez (mailto:lroman@emergya.com)
 */

/**
 * @include widgets/QueryPanel.js
 */

/** api: (define)
 *  module = gxp
 *  class = QueryPanel
 *  base_link = `Ext.Window <http://extjs.com/deploy/dev/docs/?class=Ext.Window>`_
 */
Ext.namespace("SiceCAT");

SiceCAT.QueryDialog = Ext.extend(Ext.Window, {
    queryText: null,
    searchWFSDefaultStateText: null,
    errorDescribeFeatureNotFound: null,
    searchWFSNotFoundStateText: null,
    searchWFSFoundsStateText: null,
    errorWFSText: null,
    errorWFSDetailsTitleText: null,
    sicecatInstance: null,
    shadow: false,
    height: 450,
    width: 380,
    plain: true,
    closeAction: "hide",
    layout: "fit",
    loadingText: "Loading ...",
    initComponent: function() {
        SiceCAT.QueryDialog.superclass.initComponent.apply(this, arguments);

        var statusBar = this.statusBar = new Ext.ux.StatusBar({
            defaultText: this.searchWFSDefaultStateText,
            width: 335,
            height: 50
        });

        var sicecatInstance = this.sicecatInstance;

        Ext.QuickTips.init();
        var panel = new SiceCAT.QueryPanel({
            id: "queryPanel",
            width: "auto",
            map: map,
            maxFeatures: 200,
            bodyStyle: "padding:5px 0px 5px 5px; overflow-y: auto",
            layerStore: new Ext.data.JsonStore({
                data: {
                    layers: this.layers
                },
                root: "layers",
                fields: ["title", "name",
                    "namespace", "url", "schema"],
                sortInfo: {
                    field: 'title',
                    direction: 'ASC'
                }
            }),
            listeners: {
                storeload: this._onStoreLoad,
                loadexception: this._onLoadException,
                beforequery: function() {
                    this.statusBar.showBusy();
                },
                scope: this
            }
        });              

        var button = new Ext.Button({
            text: this.queryText,
            handler: function() {
                if(!this.loadMask) {
                    this.loadMask = new Ext.LoadMask(this.body, {
                    	msg: this.loadingText
                    });
                }
                this.loadMask.show();
                panel.query();
            },
            scope: this
        });

        panel.add(statusBar);
        panel.addButton(button);
        
        this.add(panel);

        this.addListener("beforehide", function() {
            this.statusBar.clearStatus({
                useDefaults: true
            });
        });
    },
    _onStoreLoad: function(panel, store) {
        this.loadMask.hide();
        if (store.getTotalCount() > 0) {
            var axiliaryLayerWFS = AuxiliaryLayer.getLayer(this.sicecatInstance.nombreCapaResultadoText);
            axiliaryLayerWFS.events.on({
                "featuresadded": function(obj, el) {
                    // Comprobamos que el control no este activo
                    if (actions["select"].control.active != null && actions["select"].control.active) {
                        actions["select"].control.deactivate();
                        actions["select"].control.activate();
                    }
                    if (actions["selectBox"].control.active != null && actions["selectBox"].control.active) {
                        actions["selectBox"].control.deactivate();
                        actions["selectBox"].control.activate();
                    }
                    if (actions["pointRadiusSelection"].control.active != null && actions["pointRadiusSelection"].control.active) {
                        actions["pointRadiusSelection"].control.deactivate();
                        actions["pointRadiusSelection"].control.activate();
                    }
                }
            });
            if (Sicecat.parentNode) {
                Sicecat.parentNode.expand();
            }
            // Nos quedamos con el control activo
            var active_control = null;
            if (actions["select"].control.active) {
                active_control = actions["select"].control;
            } else if (actions["selectBox"].control.active) {
                active_control = actions["selectBox"].control;
            } else if (actions["pointRadiusSelection"].control.active) {
                active_control = actions["pointRadiusSelection"].control;
            }
            // Antes de destruir las features hay que deseleccionarlas
            if (axiliaryLayerWFS.selectedFeatures.length > 0) {
                for (var i = 0; i < axiliaryLayerWFS.selectedFeatures.length; i++) {
                    active_control.unselect(axiliaryLayerWFS.selectedFeatures[i]);
                }
            }
            axiliaryLayerWFS.destroyFeatures();
            var features = [];
            var founds = 0;
            store.each(function(record) {
                features.push(record.get("feature"));
                founds++;
            });
            this.statusBar.setText(String.format(
                    this.searchWFSFoundsStateText,
                    founds,
                    this.sicecatInstance.nombreCapaResultadoText));
            axiliaryLayerWFS.addFeatures(features);
        } else {
            this.statusBar.setText(this.searchWFSNotFoundStateText);
        }
    },
    _onLoadException: function(e, e2, e3) {
        this.loadMask.hide();
        var title = this.errorWFSDetailsTitleText, msg;
        if (!!e.queryTypeSiceCAT) {
            msg = String.format(
                    this.errorDescribeFeatureNotFound,
                    e.url.replace("proxy.do?url=", ""),
                    e.queryTypeSiceCAT.substring(e.queryTypeSiceCAT.indexOf("=") + 1));
        } else if (!!e2
                && !!e2.response
                && !!e2.response.priv
                && !!e2.response.priv.responseText) {
            msg = e2.response.priv.responseText;
        } else if (!!e2
                && !!e2.response
                && !!e2.response.priv
                && !!e2.response.priv.responseXML) {
            msg = e2.response.priv.responseXML;
        } else {
            msg = 'Error en la consulta';
        }

        this.statusBar.setText(this.errorWFSText);
        if (!!Ext.get('error_msg_wfs_detail')) {
            Ext.get('error_msg_wfs_detail').on('click', function(e) {
                Ext.MessageBox.show({
                    title: title,
                    msg: msg,
                    width: 300,
                    icon: Ext.Msg.INFO,
                    buttons: Ext.Msg.OK
                });
            }, this);
        }
    }
});


Ext.reg('gxp_sicecat_querydialog', SiceCAT.QueryDialog);
