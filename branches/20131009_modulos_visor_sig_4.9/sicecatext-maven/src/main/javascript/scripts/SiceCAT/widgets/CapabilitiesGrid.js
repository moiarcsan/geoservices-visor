/*
 * CapabilitiesGrid.js
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
 * @include widgets/NewSourceWindow.js
 */

/** api: (define)
 *  module = SiceCAT.grid
 *  class = CapabilitiesGrid
 *  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
 *  
 *  See also
 *   <gxp.grid.CapabilitiesGrid>
 */
Ext.namespace("SiceCAT.grid");

/** api: constructor
 *  .. class:: CapabilitiesGrid(config)
 *  
 *      Create a new grid displaying the WMS cabilities of a URL, or the
 *      contents of a ``GeoExt.data.WMSCapabilitiesStore``\ .  The user can
 *      add layers to a passed-in ``GeoExt.MapPanel`` from the grid.
 */
SiceCAT.grid.CapabilitiesGrid = Ext.extend(gxp.grid.CapabilitiesGrid, {

    /** api: i18n[keys]
     * - nameHeaderText 
     * - titleHeaderText 
     * - queryableHeaderText 
     * - layerSelectionLabel
     * - layerAdditionLabel
     * - expanderTemplateText
     */
    nameHeaderText : "Name",
    titleHeaderText : "Title",
    queryableHeaderText : "Queryable",
    layerSelectionLabel: "View available data from:",
    layerAdditionLabel: "or add a new server.",
    expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>", 
    previewLayerText: "Preview of '{0}' layer",
    folderSaved: "Folder saved",
    folderSavedText: "The layer %s% have been saved correctly.",
    folderCancel: "Warning",
    folderCancelText: "Error to load layer. Try again.",
    
    activePreview: true,
    
    /** private: method[initComponent]
     *
     *  Initializes the CapabilitiesGrid. Creates and loads a WMS Capabilities 
     *  store from the url property if one is not passed as a configuration 
     *  option. 
     */
    initComponent: function(){
    	if(this.activePreview){
    		this.listeners= {
                rowdblclick: this.mapPreview,
                scope: this
            };
    	}
    	
    	SiceCAT.grid.CapabilitiesGrid.superclass.initComponent.call(this); 
    },
    
    /**
     * Method: mapPreview
     *  
     * Shows map preview of a layer
     * 
     * Parameters
     *  grid - <Ext.grid.GridPanel> grid with layers information
     *  index - <Integer> with layer index to load
     */
    mapPreview: function (grid, index) {
        var record = grid.getStore().getAt(index);
        var layer;
        
        layer = record.getLayer();
        /**
         * TODO: The WMSCapabilitiesReader should allow for creation
         * of layers in different SRS.
         */
        if (layer instanceof OpenLayers.Layer.WMS) {
        	var url_layer = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.CARTOGRAFIA, layer.url);
            layer = new OpenLayers.Layer.WMS(
                layer.name, url_layer,
                {layers: layer.params["LAYERS"]},
                {
                    attribution: layer.attribution,
                    maxExtent: OpenLayers.Bounds.fromArray(
                        record.get("llbbox")
                    )
//                    .transform(
//                        new OpenLayers.Projection("EPSG:4326"),
//                        this.mapPanel.map.getProjectionObject()
//                    )
                    ,
                    isBaseLayer: false //Default overlay
                }
            );
        }
        
        var win = new Ext.Window({
            title: String.format(this.previewLayerText, record.get("title")),
            width: 512,
            height: 256,
            layout: "fit",
            items: [{
                xtype: "gx_mappanel",
                layers: [layer],
                extent: record.get("llbbox")
            }]
        });
        win.show();
    },

    /** api: config[addSource]
     * A callback method that will be called when a url is entered into this 
     * grid's NewLayerWindow. It should expect the following parameters:
     *
     * .. list-table::
     *     :widths: 20 80
     *
     *     * - ``url`` 
     *       - the URL that the user entered
     *     * - ``success`` 
     *       - a callback to call after the successful addition of a source
     *     * - ``failure``
     *       - a callback to call after a failure to add a source
     *     * - ``scope`` 
     *       - the scope in which to run the callbacks
     *
     * If this is not provided, a default implementation will be used.  It is 
     * recommended that client code use handlers for the 'add' event on the 
     * metaStore rather than overriding this method.
     */
    addSource: function(url, success, failure, scope) {
        var capabilitiesUrl = this.getCapabilitiesUrl(url);
        scope = scope || this;
        var layerStore = new GeoExt.data.WMSCapabilitiesStore({url:capabilitiesUrl, autoLoad: true});
        this.metaStore.add(new this.metaStore.recordType({
            url: url,
            store: layerStore,
            identifier: url,
            name: url
        }));
        success.apply(scope);
    },
    
    /*
     * private
     * 
     * Gets capabilites url
     */
    getCapabilitiesUrl: function(url){
    	/* GetURLProxy */
		var capabilitiesUrl = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, url);
    	var index = capabilitiesUrl.indexOf("request=getCapabilities");
    	var indexService = capabilitiesUrl.indexOf("service=wms");
    	var index2 = capabilitiesUrl.indexOf("?");
	    var index3 = capabilitiesUrl.indexOf("&");
    	if(index < 0){
	        if((index2 > 0) 
	        		&& (index2 < (capabilitiesUrl.length - 1)) 
	        		&& (index3 < (capabilitiesUrl.length - 2))){
	        	//Contains '?' and not ends at '?' or '&'
	        	capabilitiesUrl += "&";
	        }else if(index2 < 0){
	        	//Not contains '?'
	        	capabilitiesUrl += "?";
	        }
	        capabilitiesUrl += "request=getCapabilities";
	        if(indexService < 0){
	        	capabilitiesUrl += "&service=wms";
	        }
    	}else if(indexService < 0){
    		capabilitiesUrl += "&service=wms";
    	}
        return capabilitiesUrl;
    },
    
    submitForm: function(){
    	// NEW WIN: Get the parameters inputs value
    	var nameLayer = this.control.nameLayer;
    	var nameFolder = this.control.nameFolder;
    	var nameParentFolder = this.control.nameParentFolder;
    	var folderID = this.control.folderID;
    	
    	var sm = this.getSelectionModel();

        //for now just use the first selected record
        //TODO: force single selection (until we allow
        //adding group layers)
        var records = sm.getSelections();

        var record, layer, newRecords = [];
        var params = null;
        var properties = null;
        for(var i = 0; i < records.length; i++){
            Ext.data.Record.AUTO_ID++;
            record = records[i].copy(Ext.data.Record.AUTO_ID);

            /*
             * TODO: deal with srs and maxExtent
             * At this point, we need to think about SRS if we want the layer to
             * have a maxExtent.  For our app, we are dealing with EPSG:4326
             * only.  This will have to be made more generic for apps that use
             * other srs.
             */
            if (this.alignToGrid) {
                layer = record.getLayer().clone();
                layer.maxExtent = new OpenLayers.Bounds(-180, -90, 180, 90);
            } else {
                layer = record.getLayer();
                /**
                 * TODO: The WMSCapabilitiesReader should allow for creation
                 * of layers in different SRS.
                 */
                if (layer instanceof OpenLayers.Layer.WMS) {
                	// NEW WIN: Nombre de la capa
                	layer.name = nameLayer
                	/* GetURLProxy */
            		var layer_url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.CARTOGRAFIA, layer.url);
                    layer = new OpenLayers.Layer.WMS(layer.name, layer_url,
                        {layers: layer.params["LAYERS"]},
                        {
                            attribution: layer.attribution,
                            maxExtent: OpenLayers.Bounds.fromArray(
                                record.get("llbbox")
                            ).transform(
                                new OpenLayers.Projection("EPSG:4326"),
                                this.map.getProjectionObject()
                            ),
                            isBaseLayer: false //Default overlay
                        }
                    );
                    layer.events.on({
            		    'added': function(){
            		        actions["tooltipcontrol"].control.activate();
            		    }
            		});
                    // Add the folder id to the layer
                    layer.groupLayersIndex = folderID;
                    // Get the layer params to save them
                    properties = {
                        	transparent: true,
                        	buffer: 0,
                        	visibility: false,
                        	opacity: 0.5,
                        	format: layer.params.FORMAT,
                        	maxExtent: layer.maxExtent.toString(),
                        	layers: layer.params.LAYERS,
                        	order: map.layers.length
                    };
                    
                    if(this.sourceComboBox.selectedIndex 
                    		&& this.sourceComboBox 
                    		&& this.sourceComboBox.getStore()
                    		&& this.sourceComboBox.getStore().getAt(this.sourceComboBox.selectedIndex)
                    		&& this.sourceComboBox.getStore().getAt(this.sourceComboBox.selectedIndex).data
                    		&& this.sourceComboBox.getStore().getAt(this.sourceComboBox.selectedIndex).data.store
                    		&& this.sourceComboBox.getStore().getAt(this.sourceComboBox.selectedIndex).data.store.baseParams
                    		&& this.sourceComboBox.getStore().getAt(this.sourceComboBox.selectedIndex).data.store.baseParams.SECURITY){
                    	properties.security = true;
                    }
                    
                    var url = layer.url;
                    
                    if(url.indexOf(OpenLayers.ProxyHost) > -1){
                    	url = url.substring(url.indexOf(OpenLayers.ProxyHost) + OpenLayers.ProxyHost.length);
                    }
                    
                    params = {
                    		name: nameLayer,
                			server_resource: url,
                			type: layer.params.SERVICE,
                			folderId: folderID,
                			properties: properties
                	};

            		if(Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
            			params.properties.isBaseLayer = this.control.form.get("inputIsBaseLayer").getValue();
            		}

                    var this_ = this;

                    //Layer save
            		if(!!Sicecat.SELECTED_GROUP){
            			PersistenceGeoParser.saveLayerByGroup(Sicecat.SELECTED_GROUP, params,
            	        		function(form, action){
            	        			/*
            	        			 * ON SUCCESS
            	        			 */
            	        			var json = Ext.util.JSON.decode(action.response.responseText);
            	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
            	        			Sicecat.addLayer(layer);
            	        			this_.windowLocationLayer.close();
            	        		},
            	        		function(form, action){
            	        			/*
            	        			 * ON FAILURE 
            	        			 */
            	        			var json = Ext.util.JSON.decode(action.response.responseText);
            	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
            	        			Sicecat.addLayer(layer);
            	        			this_.windowLocationLayer.close();
            	        });
            		}else{
            			PersistenceGeoParser.saveLayerByUser(Sicecat.user.login, params,
            	        		function(form, action){
            	        			/*
            	        			 * ON SUCCESS
            	        			 */
            	        			var json = Ext.util.JSON.decode(action.response.responseText);
            	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
            	        			Sicecat.addLayer(layer);
            	        			this_.windowLocationLayer.close();
            	        		},
            	        		function(form, action){
            	        			/*
            	        			 * ON FAILURE 
            	        			 */
            	        			var json = Ext.util.JSON.decode(action.response.responseText);
            	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
            	        			Sicecat.addLayer(layer);
            	        			this_.windowLocationLayer.close();
            	        });
            		}
                }
            }

            record.data["layer"] = layer;
            record.commit(true);
            
            newRecords.push(record);
        }
    },

    /** api: method[addLayers]
     * :param: base: a boolean indicating whether or not to make the new layer
     *     a base layer.
     *
     * Adds a layer to the :class:`GeoExt.MapPanel` of this instance.
     */
    addLayers : function(base){
    	// NEW WIN: Mostrar ventana de introduccion de nombre y seleccion de carpeta
    	this.control = new OpenLayers.Control.LoadKML();
    	this.control.map = map;
    	var this_ = this;
    	this.control.submitForm = function(){
    		this_.submitForm();
    	};
		this.windowLocationLayer = this.control.createWindowLocationLayer();
		this.windowLocationLayer.show();
    	// NEW WIN: a quitar cuando se recupere el codigo de la ventana
    	//this.submitForm();
    }
});

/** api: xtype = gxp_capabilitiesgrid */
Ext.reg('gxp_sicecat_capabilitiesgrid', SiceCAT.grid.CapabilitiesGrid); 
