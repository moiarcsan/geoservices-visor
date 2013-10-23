/*
 * QueryPanel.js
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
 * @include widgets/FilterBuilder.js
 * @include data/WFSFeatureStore.js
 */

/** api: (define)
 *  module = gxp
 *  class = QueryPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("SiceCAT");

/** api: constructor
 *  .. class:: QueryPanel(config)
 *   
 *      Create a panel for assembling and issuing feature requests.
 */
SiceCAT.QueryPanel = Ext.extend(gxp.QueryPanel, {

    /** private: property[maxFeaturesAutorized]
     *  ``Integer``
     *  Mas features authorized to load in a query.
     */
    maxFeaturesAutorized: 1000,
    
    intersectQuery: true,
    
    //url: "http://localhost:8080/Visor-SPM20/proxy.do?url=http://10.136.200.76/ows/wfs",
    
    index: 0,

    /** i18n */
    maxFeaturesText: "Max query results",
    queryByCrossedFeature: "Crossed Features",
    emptyTextLayer: "Select a layer",
    emptyNameLayerText: "Without description ({0})",

    /** private: method[initComponent]
     */
    initComponent: function() {
        
        this.addEvents(
            
            /** api: events[ready]
             *  Fires when the panel is ready to issue queries (after the
             *  internal attribute store has loaded).
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * store - ``GeoExt.data.FeatureStore`` The feature store.
             */
            "ready",

            /** api: events[beforelayerchange]
             *  Fires before a new layer is selected.  Return false to stop the
             *  layer selection from changing.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * record - ``Ext.data.Record`` Record representing the newly
             *      selected layer.
             */
            "beforelayerchange",

            /** api: events[layerchange]
             *  Fires when a new layer is selected, as soon as this panel's
             *  ``attributesStore`` and ``geometryType`` attributes are set.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * record - ``Ext.data.Record`` Record representing the selected
             *      layer.
             */
            "layerchange",

            /** api: events[beforequery]
             *  Fires before a query for features is issued.  If any listener
             *  returns false, the query will not be issued.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             */
            "beforequery",

            /** api: events[query]
             *  Fires when a query for features is issued.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * store - ``GeoExt.data.FeatureStore`` The feature store.
             */
            "query",

            /** api: events[storeload]
             *  Fires when the feature store loads.
             *
             *  Listener arguments:
             *  * panel - :class:`gxp.QueryPanel` This query panel.
             *  * store - ``GeoExt.data.FeatureStore`` The feature store.
             *  * records - ``Array(Ext.data.Record)`` The records that were
             *      loaded.
             *  * options - ``Object`` The loading options that were specified.
             */
            "storeload"

        );        
        
        this.mapExtentField = new Ext.form.TextField({
            fieldLabel: this.currentTextText,
            readOnly: true,
            anchor: "100%",
            value: this.getFormattedMapExtent()
        });
        this.map.events.on({
            moveend: this.updateMapExtent,
            scope: this
        });
        
        this.createFilterBuilder(this.layerStore.getAt(0));
        
        var panelContainer = this;
        
        this.items = [{
        	id: "comboLayer",
            xtype: "combo",
            name: "layer",
            fieldLabel: this.layerText,
            store: this.layerStore,
            value: this.layerStore.getAt(0).data.title,
            displayField: "title",
            valueField: "name",
            mode: "local",
            allowBlank: true,
            editable: false,
            triggerAction: "all",
            listeners: {
                beforeselect: function(combo, record, index) {
                    return this.fireEvent("beforelayerchange", this, record);
                },
                select: function(combo, record, index) {
                    this.createFilterBuilder(record);
                },
                scope: this
            }
        }, {
        	xtype: 'numberfield',
            anchor: '70%',
            name: 'maxNumFeatures',
            fieldLabel: this.maxFeaturesText,
            value: this.maxFeatures || this.maxFeaturesAutorized,
            maxValue: this.maxFeaturesAutorized,
            minValue: 0,
            listeners: {
            	change: function(panelContainer, value) {
                    value = parseInt(value, 10);
                    panelContainer.maxFeatures = value;
                    this.maxFeatures = value;
                    this.createFeatureStore();
                },
                scope: this
            }
        }, {
            xtype: "fieldset",
            itemId: "fieldsetExtent",
            title: this.queryByLocationText,
            checkboxToggle: true,
            collapsed: !this.spatialQuery,
            anchor: "95%",
            items: [this.mapExtentField],
            listeners: {
                collapse: function() {
                    this.spatialQuery = false;
                },
                expand: function() {
                    this.spatialQuery = true;
                },
                scope: this
            }
        }, {
            xtype: "fieldset",
            itemId: "fieldsetAtr",
            title: this.queryByAttributesText,
            checkboxToggle: true,
            collapsed: !this.attributeQuery,
            anchor: "95%",
            items: [this.filterBuilder],
            listeners: {
                collapse: function() {
                    this.attributeQuery = false;
                },
                expand: function() {
                    this.attributeQuery = true;
                },
                scope: this
            }            
        },{
            xtype: "fieldset",
            itemId: "fieldsetCross",
            title: this.queryByCrossedFeature,
            checkboxToggle: true,
            collapsed: !this.attributeQuery,
            anchor: "95%",
            listeners: {
                collapse: function() {
                    this.intersectQuery = false;
                },
                expand: function() {
                    this.intersectQuery = true;
                },
                scope: this
            }            
        }];
        
        gxp.QueryPanel.superclass.initComponent.apply(this, arguments);

    },
    
    /** private: method[createFilterBuilder]
     *  :arg record: ``Ext.data.Record``  A record representing the feature
     *      type.
     *  
     *  Remove any existing filter builder and create a new one.  This method
     *  also sets the currently selected layer and stores the name for the
     *  first geometry attribute found when the attribute store loads.
     */
    createFilterBuilder: function(record) {
    	//Show error if schema not found
    	var this_ = this;
		Ext.Ajax.request({
			url: record.get("schema"),
			method: 'GET',
			failure: function ( result, request) {
				this_.url = record.get("schema");
				this_.queryTypeSiceCAT = this_.url.substring(this_.url.indexOf("typeName"));
				while (this_.queryTypeSiceCAT.indexOf("&") > 0){
					this_.queryTypeSiceCAT = this_.queryTypeSiceCAT.substring(this_.queryTypeSiceCAT.indexOf("&"));
				}
				this_.touched = true;
                this_.fireEvent("loadexception", this_, result);
			} 
		});

		gxp.QueryPanel.prototype.createFilterBuilder.apply(this, arguments);
        
    },
    
    /** api: method[getFilter]
     *  Get the filter representing the conditions in the panel.  Returns false
     *  if neither spatial nor attribute query is checked.
     */
    getFilter: function() {
    	var a = this.node;
    	// Filtro de atributos
        var attributeFilter = this.attributeQuery && this.filterBuilder.getFilter();
        // Filtro de bbox
        var spatialFilter = this.spatialQuery && new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.map.getExtent()
        });
        var intersectFilter = null;
        var filters_intersect = [];
        // Filtro por cruce con geometrias
        if(Sicecat.featuresSelected.length > 1){
        	// Hay m�s de una feature seleccionada
        	var filter_intersect = null;
        	for(var i = 0; i<Sicecat.featuresSelected.length; i++){
        		var geom = Sicecat.featuresSelected[i].geometry;
        		filter_intersect = new OpenLayers.Filter.Spatial({
                	type: OpenLayers.Filter.Spatial.INTERSECTS,
                	value: geom
                });
        		filters_intersect.push(filter_intersect);
        	}
        	intersectFilter =this.intersectQuery && new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.OR,
                filters: filters_intersect
            });
        }else if(Sicecat.featuresSelected.length == 1){
        	// Hay s�lo una feature seleccionada
        	var geom = Sicecat.featuresSelected[0].geometry;
        	intersectFilter = this.intersectQuery && new OpenLayers.Filter.Spatial({
            	type: OpenLayers.Filter.Spatial.INTERSECTS,
            	value: geom
            });
        }
        var filter;
        var filters = [];
        if(spatialFilter){
        	filters.push(spatialFilter);
        }
        if(attributeFilter){
        	filters.push(attributeFilter);
        }
        if(intersectFilter){
        	filters.push(intersectFilter);
        }
        if(filters.length > 1){
        	filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: filters
            });
        }else if(filters.length == 1){
        	filter = filters[0];
        }
        return filter;
    },
    
    /** private: method[createFeatureStore]
     *  Create the feature store for the selected layer.  Queries cannot be
     *  issued until this store has been created.  This method is called
     *  when the required attribute store loads.
     */
    createFeatureStore: function() {
        var fields = [];
        this.attributeStore.each(function(record) {
            fields.push({
                name: record.get("name"),
                type: this.getFieldType(record.get("type"))
            });
        }, this);
        
        var layer = this.selectedLayer;
        
        this.featureStore = new gxp.data.WFSFeatureStore({
            fields: fields,
            srsName: this.map.getProjection(),
            url: layer.get("url"),
            featureType: layer.get("name"),
            featureNS:  layer.get("namespace"),
            geometryName: this.geometryName,
            schema: layer.get("schema"),
            maxFeatures: this.maxFeatures || this.maxFeaturesAutorized,
            autoLoad: false,
            autoSave: false,
            listeners: {
                load: function(store, records, options) {
                    this.fireEvent("storeload", this, store, records, options);
                },
                loadexception: function(e) {
                    this.fireEvent("loadexception", this, e);
                },
                scope: this
            }
        });
        this.fireEvent("ready", this, this.featureStore);
    },
    
    /** api: method[query]
     *  Issue a request for features.  Should not be called until the "ready"
     *  event has fired.  If called before ready, no query will be issued.
     */
    /*query: function() {
        if (this.featureStore) {
        	for(var i = 0; i<Sicecat.featuresSelected.length; i++){
        		this.index = i;
        		if (this.fireEvent("beforequery", this) !== false) {
                    this.featureStore.setOgcFilter(this.getFilter());
                    this.featureStore.load();
                    this.fireEvent("query", this, this.featureStore);
                }
        	}
        }
    },*/
    
});

/** api: xtype = gxp_sicecat_querypanel */
Ext.reg('gxp_sicecat_querypanel', SiceCAT.QueryPanel); 