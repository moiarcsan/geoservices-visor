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
 * Authors: Moisés Arcos Santiago (mailto:marcos@emergya.com)
 */

SiceCAT.CombinedSearchField = Ext.extend(Ext.form.TextField, {
    emptyText: "Search...",
    width: 240,
    num_results: [],
    titlesForLayer : VisorConfig.LAYER_TITLES,
    data: "<XLS xsi:schemaLocation=\"http://www.opengis.net/xls ...\" " +
            "version=\"1.2.0\" xmlns=\"http://www.opengis.net/xls\" " +
            "xmlns:gml=\"http://www.opengis.net/gml\" " +
            "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
            "<Request methodName=\"Geocode\" requestID=\"123\" version=\"1.2.0\" maximumResponses=\"10\"> " +
            "<GeocodeRequest> " +
            "<Address countryCode=\"ES\"> " +
            "<FreeFormAddress>{0}</FreeFormAddress>" +
            "</Address>" +
            "</GeocodeRequest>" +
            "</Request>" +
            "</XLS>",
    entitatsForNamespace: {
        "s": ["a", "ab", "ae", "ap", "aps", "b", "c", "c112", "ca", "cd", "co",
            "d", "db", "e", "ef", "ei", "en", "f", "fo", "g", "h", "i", "ir",
            "k", "lf", "np", "nv", "p", "pi", "plo", "pn", "po", "rpo", "s1",
            "s5", "sc", "soc", "sp", "sv", "svm", "tf", "tt", "vu", "x", "y",
            "z", "z1", "z3", "zt"],
        "p": ["pap", "pas", "pb", "pe", "pl", "pm", "psa", "pse", "t"],
        "r": ["ra", "rl", "rp"]
    },
    // We use this variable as a semaphore so we don't show the results window
    // unless this value is 0, as that will mean that all requests have finished.
    finish_load: 0,
    // The search results window.
    searcher_win_new: null,
    searcher_mask: null,
    
    // i18n:
    titleAddressPanel: "",
    msgResults: "",
    titleGeneralPanel: "",
    msgErrorServer: "",
    msgWarningPanel: "",
    titleWarningPanel: "",
    titleWayPanel: "",
   
    
    initComponent: function() {
        SiceCAT.CombinedSearchField.superclass.initComponent.apply(this, arguments);

        this._createSearchResultsWindow();
        this.searcher_mask = new Ext.LoadMask(Ext.getBody());

        this.addListener("specialkey", this.onKeyPressed, this);
    },
    _createSearchResultsWindow: function() {
        this.searcher_win_new = new Ext.Window({
            height: 180,
            width: 400,
            modal: false,
            plain: true,
            frame: false,
            shadow: false,
            border: false,
            layout: 'vbox',
            layoutConfig: {
                // layout-specific configs go here
                //titleCollapse: true,
                //animate: true,
                //collapseFirst: true
                pack: "start"
            },
            resizable: false,
            draggable: false,
            closable: false,
            items: [{
                    id: 'addressPanel',
                    cls: 'addressPanelStyle',
                    title: this.titleAddressPanel,
                    autoScroll: true,
                    ref: "addressPanel",
                    width: '100%',
                    collapsible: true,
                    flex: 1,    
                    height: 200,
                    titleCollapse: true,
                    listeners: {
                        collapse: this._handleWindowHeight,
                        expand: this._handleWindowHeight,
                        scope: this
                    }
                }, {
                    id: 'wayPanel',
                    cls: 'wayPanelStyle',
                    title: this.titleWayPanel,
                    autoScroll: true,
                    width: '100%',
                    ref: "wayPanel",
                    height: 200,
                    collapsible: true,
                    style: "position:relative !important",
                    flex: 1,
                    titleCollapse: true,
                    listeners: {
                        collapse: this._handleWindowHeight,
                        expand: this._handleWindowHeight,
                        scope: this
                    }
                }, {
                    id: 'generalPanel',
                    cls: 'generalPanelStyle',
                    title: this.titleGeneralPanel,
                    autoScroll: true,
                    width: '100%',
                    ref: "generalPanel",
                    height: 200,
                    titleCollapse: true,
                    collapsible: true,
                    style: "position:relative !important",
                    flex: 1,
                    listeners: {
                        collapse: this._handleWindowHeight,
                        expand: this._handleWindowHeight,
                        scope: this
                    }
                }]
        });


        Ext.getBody().on('click', function(e, t) {
            var el = this.searcher_win_new.getEl();
            if (!!el && !(el.dom === t || el.contains(t))) {
                this.searcher_win_new.hide();
            }
        }, this);
    },
    getNamespace: function(entitat) {
        for (var index in this.entitatsForNamespace) {
            for (var i = 0; i < this.entitatsForNamespace[index].length; i++) {
                if (this.entitatsForNamespace[index][i] === entitat) {
                    return index;
                }
            }
        }
    },
    // Method to get the data formated
    getJsonFromFeature: function(feature, type) {
        var json = [];
        var data = null;
        var json_data = null;
        var place = null;
        var nom = null;
        var municipi = null;
        var number, valor, entitat, objectid;
        for (var i = 0; i < feature.length; i++) {
            data = feature[i].data;
            json_data = feature[i].json;
            // Diferenciamos entre los tipos de resultados
            if (type === 0) {
                // Direcciones
                var format = new SiceCAT.data.OpenLS_XLSReader();
                place = data[format.place];
                nom = data[format.street];
                number = data[format.number];
                var cadena = "";
                if (nom != null) {
                    cadena += nom;
                }
                if (number != null && nom != null) {
                    cadena += " " + number;
                } else {
                    cadena += number;
                }
                if (place != null && nom != null) {
                    cadena += "<br/>" + place;
                } else if (municipi != null && nom == null) {
                    cadena += municipi;
                }
                json.push([cadena, data[format.lon], data[format.lat], null, null, data]);
            } else if (type == 1) {
                // Vía PK
                nom = json_data.nom;
                valor = json_data.valor;
                entitat = json_data.entitat;
                objectid = json_data.id;
                var layer = this.titlesForLayer[entitat];
                var cadena = "";
                if (nom != null) {
                    cadena += nom;
                    if (valor != null) {
                        cadena += ", km " + valor;
                    }
                }
                if (layer != null && (nom != null || valor != null)) {
                    cadena += "<br/>" + layer;
                } else {
                    cadena += layer;
                }
                json.push([cadena, data.utmX, data.utmY, entitat, objectid, null]);
            } else if (type == 2) {
                // General
                nom = json_data.nom;
                municipi = json_data.municipi;
                entitat = json_data.entitat;
                var layer = this.titlesForLayer[entitat];
                var cadena = "";
                if (nom != null) {
                    cadena += nom;
                }
                if (layer != null) {
                    cadena += "<br/>" + layer;
                }
                if (municipi != null && layer != null) {
                    cadena += ", " + municipi;
                } else if (municipi != null && layer == null) {
                    cadena += "<br/>" + municipi;
                }
                json.push([cadena, data.utmX, data.utmY, null, null, data]);
            }
        }
        return json;
    },
    // Method to get the grid address panel
    getGridPanel: function(feature, type) {
        var colModel = new Ext.grid.ColumnModel([{
                dataIndex: 'text',
                width: 400
            }]);
        var data_store = new Ext.data.SimpleStore({
            fields: [{
                    name: 'text'
                }, {
                    lon: 'text'
                }, {
                    lat: 'text'
                }, {
                    entitat: 'text'
                }, {
                    objectid: 'text'
                }]
        });

        var json = this.getJsonFromFeature(feature, type);
        data_store.loadData(json);

        var gridView = new Ext.grid.GridView({
            forceFit: true,
        });

        var grid = new Ext.grid.GridPanel({
            autoHeight: true,
            hideHeaders: true,
            border: false,
            store: data_store,
            colModel: colModel,
            view: gridView,
            listeners: {
                'cellclick': function(grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    var text = record.json[0];
                    if (text.indexOf("<br/>") != -1) {
                        text = text.replace("<br/>", ", ");
                    }
                    var lon = record.json[1];
                    var lat = record.json[2];
                    var entitat = record.json[3];
                    var objectid = record.json[4];
                    var data = record.json[5];
                    var searchbar = Ext.getCmp('searchbar');
                    searchbar.setValue(text);
                    // Create the result layer
                    var layer = new OpenLayers.Layer.Vector(text, {
                        strategies: [new OpenLayers.Strategy.Save()],
                        styleMap: Sicecat.createStyleMap()
                    });
                    // Add layer to map
                    map.addLayer(layer);
                    var position = new OpenLayers.LonLat(lon, lat);
                    if (lon != null && lat != null && lon != "" && lat != "") {
                        var src = new OpenLayers.Projection(VisorConfig.OPENLS_SRS);
                        var dest = map.getProjectionObject();
                        position.transform(src, dest);
                        var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(position.lon, position.lat));
                        if (data != null) {
                            feature.data = data;
                        }
                        feature.style = integrator.cloneObject(Sicecat.styles['resultatCerca']);
                        layer.removeAllFeatures();
                        layer.addFeatures(feature);
                        // zoom in the location
                        map.setCenter(position, 8);
                    } else if (entitat != null) {
                        Sicecat.search_tool_origin = true;
                        var panel = new SiceCAT.ZoomToResultPanel({
                            closest: false,
                            sicecatInstance: Sicecat,
                            map: Sicecat.map
                        });
                        panel.getZoomToResult(this.getNamespace(entitat) + ":" + entitat, "OBJECTID", objectid, text);
                    } else {
                        Ext.MessageBox.show({
                            title: this.titleWarningPanel,
                            msg: this.msgWarningPanel,
                            width: 300,
                            icon: Ext.Msg.INFO,
                            buttons: Ext.Msg.OK
                        });
                    }
                    // close the window
                    this.searcher_win_new.hide();
                },
                scope: this
            }
        });

        return grid;
    },
    finishLoad: function() {
        this.searcher_win_new.show();
        this.searcher_win_new.alignTo(this.getId(), "tl-bl");
        var layout = null;
        for (var i = 0; i < this.num_results.length; i++) {
            if (this.num_results[i].records === 0) {               
                if (!Ext.getCmp(this.num_results[i].panel).collapsed) {
                    Ext.getCmp(this.num_results[i].panel).collapse();
                } else {
                    
                }
            } else {
                Ext.getCmp(this.num_results[i].panel).expand();
            }
        }
        this.num_results = [];
        this.searcher_mask.hide();
        this._handleWindowHeight();
    },
    loadOpenLS: function(store, records, options) {
        // Set the title with the records size
        var titletoset = "";
        var exception = false;
        if (options != null && options.type != null && options.type == "exception") {
            exception = true;
            titletoset = String.format(this.titleAddressPanel, this.msgErrorServer);
        } else {
            titletoset = String.format(this.titleAddressPanel, records.length + " " + this.msgResults);
        }
        var addressPanel = Ext.getCmp('addressPanel');
        addressPanel.setTitle(titletoset);
        if (records.length == 0 || exception) {
            addressPanel.setDisabled(true);
            this.num_results[0] = {panel: 'addressPanel', records: 0};
        } else {
            addressPanel.setDisabled(false);
            this.num_results[0] = {panel: 'addressPanel', records: records.length};
        }
        // Set the content panel with the grid result
        var gridAddressPanel = this.getGridPanel(records, 0);
        addressPanel.removeAll();
        addressPanel.add(gridAddressPanel);
        this.finish_load--;
        if (this.finish_load === 0) {
            this.finishLoad();
        }
    },
    submitOpenLS: function(query) {
        var openls_data = String.format(this.data, query);
        var store_rg = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: OpenLayers.ProxyHost +  Sicecat.defaultWMSServer.replace("ows/wms?", "openls"),
                method: 'POST',
                xmlData: openls_data
            }),
            fields: [
                {name: "lon", type: "number"},
                {name: "lat", type: "number"},
                "text"
            ],
            listeners: {
                load: this.loadOpenLS,
                exception: function(e, records, options) {
                    this.loadOpenLS(null, [], {type: 'exception'});
                },
                scope: this
            },
            reader: new SiceCAT.data.OpenLS_XLSReader()
        });
        store_rg.load();
        this.searcher_mask.show();
    },
    loadCercaGeneral: function(store, records, options) {
        // Set the Via PK title panel
        var titletosetway = "";
        var exceptionWay = false;
        if (options != null && options.type != null && options.type == "exception") {
            exceptionWay = true;
            titletosetway = String.format(this.titleWayPanel, this.msgErrorServer);
        } else {
            titletosetway = String.format(this.titleWayPanel, this.roadResponseSize + " " + this.msgResults);
        }
        var wayPanel = Ext.getCmp('wayPanel');
        wayPanel.setTitle(titletosetway);
        if (this.roadResponseSize == 0 || exceptionWay) {
            wayPanel.setDisabled(true);
            this.num_results[1] = {panel: 'wayPanel', records: 0};
        } else {
            wayPanel.setDisabled(false);
            this.num_results[1] = {panel: 'wayPanel', records: this.roadResponseSize};
        }
        // Set the content panel with the grid result
        var featureWay = records.slice(0, this.roadResponseSize);
        var gridWayPanel = this.getGridPanel(featureWay, 1);
        wayPanel.removeAll();
        wayPanel.add(gridWayPanel);
        // Set the General title panel
        var titletosetgeneral = "";
        var exceptionGeneral = false;
        if (options != null && options.type != null && options.type == "exception") {
            exceptionGeneral = true;
            titletosetgeneral = String.format(this.titleGeneralPanel, this.msgErrorServer);
        } else {
            titletosetgeneral = String.format(this.titleGeneralPanel, this.solrResponseSize + " " + this.msgResults);
        }
        var generalPanel = Ext.getCmp('generalPanel');
        generalPanel.setTitle(titletosetgeneral);
        if (this.solrResponseSize === 0 || exceptionGeneral) {
            generalPanel.setDisabled(true);
            this.num_results[2] = {panel: 'generalPanel', records: 0};
        } else {
            generalPanel.setDisabled(false);
            this.num_results[2] = {panel: 'generalPanel', records: this.solrResponseSize};
        }
        // Set the content panel with the grid result
        var featureGeneral = records.slice(this.roadResponseSize, records.length);
        var gridGeneralPanel = this.getGridPanel(featureGeneral, 2);
        generalPanel.removeAll();
        generalPanel.add(gridGeneralPanel);
        this.finish_load--;
        if (this.finish_load === 0) {
            this.finishLoad();
        }
    },
    submitCercaGeneral: function(query) {
        var url_cerca = "rest/cercaGeneral/" + encodeURIComponent(query);
        var self = this;
        var store_cg = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: url_cerca,
                method: 'POST'
            }),
            fields: [
                {name: "lon", type: "number"},
                {name: "lat", type: "number"},
                "text"
            ],
            listeners: {
                load: this.loadCercaGeneral,
                exception: function(e, records, options) {
                    this.loadCercaGeneral(null, [], {type: 'exception'});
                },
                scope: this
            },
            reader: new Ext.data.JsonReader({
                idProperty: 'id',
                root: function(o) {
                    var out = [];
                    self.roadResponseSize = o.roadResponse.lst.length;
                    self.solrResponseSize = o.solrResponse.lst.length;
                    return out.concat(o.roadResponse.lst, o.solrResponse.lst);
                },
                totalProperty: "totalHits",
                fields: [
                    {name: 'id', mapping: 'id'},
                    {name: 'entitat', mapping: 'entitat'},
                    {name: 'nom', mapping: 'nom'},
                    {name: 'municipi', mapping: 'municipi',
                        convert: function(v, record) {
                            if (!record.municipi) {
                                return "";
                            }
                        }
                    },
                    {name: 'score', mapping: 'score',
                        convert: function(v, record) {
                            if (!record.score) {
                                return "";
                            }
                        }
                    },
                    {name: 'utmX', mapping: 'utmX'},
                    {name: 'utmY', mapping: 'utmY'}
                ]
            })
        });
        store_cg.load();
    },
    
    _handleWindowHeight: function() {
        var height = 0;
        Ext.each([
            this.searcher_win_new.wayPanel,
            this.searcher_win_new.generalPanel,
            this.searcher_win_new.addressPanel
        ], function(panel) {
            height += panel.getHeight();
        });
        
        this.searcher_win_new.setHeight(height);
    },
    
    onKeyPressed: function(field, event) {
        if (event.getKey() === event.ENTER) {
            var value = field.getValue();
            this.submitOpenLS(value);
            this.finish_load++;
            this.submitCercaGeneral(value);
            this.finish_load++;
        }
    }
});


