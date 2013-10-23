/*
 * ZoomToResultPanel.js
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

Ext.namespace("SiceCAT");

/** api: constructor
 *  .. class:: ZoomToResultPanel(config)
 *   
 *      Create a panel for assembling and issuing feature requests.
 */
SiceCAT.ZoomToResultPanel = Ext.extend(SiceCAT.QueryPanel, {
	
	filterBy: {
		"Comarcas": "ID",
		"Municipios": "INE_NUM",
		"PKs": "OBJECTID"
	},
    
    defaultIdProperty: "OBJECTID", 
    verbose: true,
	
    /** i18n **/
	searchWFSNotFoundStateText: "Error calling SIGESCAT's WFS",
	
	propertyFilterSiceCAT: null,
	
	idFilter: null,

	queryTypeSiceCAT: null,
	
	propertyFilter: null,
	
	indexes: null,
	
	searchers: null,
	
	layerResultName: null,
	
	bboxReaded: null,
    
    /**
     * Property: sicecatInstance
     * 
     * {SiceCAT} instance of application
     */
    sicecatInstance: null,
	
    
    /**
     * Property: sicecatInstance
     * 
     * {SiceCAT} instance of application
     */
    sicecatInstance: null,
    
    /** api: config[closest]
     *  ``Boolean`` Find the zoom level that most closely fits the specified
     *  extent. Note that this may result in a zoom that does not exactly
     *  contain the entire extent.  Default is true.
     */
    closest: true,
    
    /** api: config[doZoom]
     *  ``Boolean`` Adds the WFS result to a layer and do the zoom to it. 
     *  Default is true.
     */
    doZoom: true,
    
    /**
     * private: bboxReadr
     */
    bboxReadr: new Ext.data.XmlReader(
    		{ record: 'Layer'},
    		[
    		{name: 'name', mapping: 'Name'}
    		,{name: 'csr', mapping: 'BoundingBox > @CSR'}
    		,{name: 'minx', mapping: 'BoundingBox > @minx'}
    		,{name: 'miny', mapping: 'BoundingBox > @miny'}
    		,{name: 'maxx', mapping: 'BoundingBox > @maxx'}
    		,{name: 'maxy', mapping: 'BoundingBox > @maxy'}
    		]),

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
            "storeload", 
            
            "loadLayer",
            
            "zoomDone"

        );        

	    Ext.QuickTips.init();
	    
        this.initLayersAndIndexes();
        
        
        
        this.mapExtentField = new Ext.form.TextField({
            fieldLabel: "",
            readOnly: true,
            anchor: "100%",
            value: this.getFormattedMapExtent()
        });
        
        if(this.map){
	        this.map.events.on({
	            moveend: this.updateMapExtent,
	            scope: this
	        });
        }
        
        var panelContainer = this;

    },
    
    initLayersAndIndexes: function(){
    	
    	var layers;
		var indexes = {};
	    if(!!this.sicecatInstance.jsonSearchServices){
	    	layers = new Array();
	    	var j = 0;
	    	for(var i = 0; i<this.sicecatInstance.jsonSearchServices.length; i++){
	    		if(this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs" 
	    			&& !!this.sicecatInstance.jsonSearchServices[i]['mappedWith']){
	    				indexes[this.sicecatInstance.jsonSearchServices[i]["mappedWith"]] = j;
		    			layers[j++] = {
	    	                title: this.sicecatInstance.jsonSearchServices[i]["title"],
	    	                name: this.sicecatInstance.jsonSearchServices[i]["name"],
	    	                namespace: this.sicecatInstance.jsonSearchServices[i]["namespace"],
	    	                url: OpenLayers.ProxyHost + this.sicecatInstance.jsonSearchServices[i]["url"],
	    	                schema: OpenLayers.ProxyHost + this.sicecatInstance.jsonSearchServices[i]["schema"],
	    	                maxFeatures:this.sicecatInstance.jsonSearchServices[i]["maxFeatures"]
	    	            };
	    		}else if (this.sicecatInstance.jsonSearchServices[i]['type'] == "search_wfs_all"
						&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"]
						&& !!this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length
						&& this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length > 0) {
					var url = OpenLayers.ProxyHost
						+ this.sicecatInstance.jsonSearchServices[i]["url"];
					for(var k = 0; k < this.sicecatInstance.jsonSearchServices[i]["featureTypes"].length; k++){
						//if(Sicecat.isLogEnable) console.log("Registrando "+ this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k] + " en el indice "+j);
	    				indexes[this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k]] = j;
						layers[j++] = {
								title : this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k],
								name : this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k].split(":")[1],
								namespace : this.sicecatInstance.jsonSearchServices[i]["namespace"],
								url : url,
								schema : OpenLayers.ProxyHost
										+ this.sicecatInstance.jsonSearchServices[i]["schema_base"]
										+ this.sicecatInstance.jsonSearchServices[i]["featureTypes"][k],
								maxFeatures : this.sicecatInstance.jsonSearchServices[i]["maxFeatures"],
								styleMap : Sicecat.createStyleMap()
							
							};
					}
				}
		    }
	    }
	    this.searchers = layers;
	    this.indexes = indexes;
    },
    
    defaultUrl: "http://sigescat-pre.pise.interior.intranet/ows/wfs?",
    defaultSchemabase: "http://sigescat-pre.pise.interior.intranet/ows/wfs?version=1.1.0&request=DescribeFeatureType&typeName=",
    defaultMaxFeatures: 200,

	/**
	 * Method: getUnreconizedWFS
	 * 
	 * Load an WFS not recognized in indexes
	 */
    getUnreconizedWFS: function(featureType){
    	if(Sicecat.isLogEnable) console.log("Init new layer to search '"+featureType+"' features");
		var layer = {
				title : featureType,
				namespace : featureType.split(":")[0],
				name : featureType.split(":")[1],
				url : OpenLayers.ProxyHost + this.defaultUrl,
				schema : OpenLayers.ProxyHost
						+ this.defaultSchemabase
						+ featureType,
				maxFeatures : this.defaultMaxFeatures
			};

    	this.indexes[featureType] = this.searchers.length;
		this.searchers[this.searchers.length] = layer;
		return layer;
    },

	/**
	 * Method: getZoomToResult
	 * 
	 * Load features and zoom to it
	 */
	getZoomToResult: function (queryTypeSiceCAT, propertyFilter, idFilter, layerResultName, bounds) {
    	this.indexToGet = this.indexes[queryTypeSiceCAT];
    	if(!!!this.indexes[queryTypeSiceCAT]){
    		this.getUnreconizedWFS(queryTypeSiceCAT);
    		this.indexToGet = this.indexes[queryTypeSiceCAT];
    	}
    	if(Sicecat.isLogEnable) console.log("queryTypeSiceCAT --> "+queryTypeSiceCAT + "\nindexToGet --> "+this.indexToGet+ "\npropertyFilter --> "+propertyFilter);
		
		this.sicecatInstance = Sicecat;

        this.queryTypeSiceCAT = queryTypeSiceCAT;
        this.propertyFilterSiceCAT = propertyFilter; 
        this.idFilter = idFilter;
		
		this.layerResultName = layerResultName;
		
		this.bboxSiceCAT = !!bounds && bounds;
	    
        this.layerStore = new Ext.data.JsonStore({
            data: {
            	layers:this.searchers
            },
            root: "layers",
            autoLoad: true,
            listeners: {
            	load: function(store){
            		this.continueLoad(store);
            	},
            	scope:this
            },
            fields: ["title", "name", "namespace", "url", "schema"]
        });
        
        
	},
	
	continueLoad: function(store){
		
		var verbose = this.verbose;
		
		if(Sicecat.isLogEnable) console.log("continueLoad");
		this.layerStore = store;
		
		if(Sicecat.isLogEnable) console.log("this.layerStore --> " + this.layerStore 
				+ "\nthis.layerStore.getAt(this.indexToGet)" + this.layerStore.getAt(this.indexToGet)
				+ "\nname --> " + this.layerStore.getAt(this.indexToGet).get("name"));
		
		if(!!this.layerStore
				&& !!this.layerStore.getAt(this.indexToGet)
				&& !!this.layerStore.getAt(this.indexToGet).get("name")){ //Este if arregla errores en IE

	    	var searchWFSDefaultStateText = this.searchWFSDefaultStateText;
	    	var searchWFSNotFoundStateText = this.searchWFSNotFoundStateText;
		    var searchWFSFoundsStateText = this.searchWFSFoundsStateText;
		    
		    var sicecatInstance = this.sicecatInstance;
			var panel = this;
	        
	        var layerResultName = this.layerResultName;
	        
	        if(Sicecat.isLogEnable) console.log("configure listener");
	        
	        this.listeners= {
	            storeload: function(panel, store) {
	            	try{
		            	if(Sicecat.isLogEnable) console.log("storeload");
		            	var axiliaryLayerWFS;
		            	if(this.doZoom){
			            	axiliaryLayerWFS = AuxiliaryLayer.getLayer(layerResultName);
		            	}else{
		            		axiliaryLayerWFS = new OpenLayers.Layer.Vector(layerResultName);
		            	}
		            	axiliaryLayerWFS.destroyFeatures();
		            	this.axiliaryLayerWFS = axiliaryLayerWFS;
		                var features = [];
		                var founds = 0;
		                store.each(function(record) {
		                    features.push(record.get("feature"));
		                    founds++;
		                });
		                
		                if(Sicecat.isLogEnable) console.log("founds --> "+founds);
		                
		                this.founds = founds;
		                if(founds == 0){
		                	//statusBar.setText(searchWFSNotFoundStateText);
		                	//this.fireEvent("noResults", this);
		                }else{
		                	axiliaryLayerWFS.addFeatures(features);
		                	//Esta es
		                	var extent = this.getMaxLayerExtent();
		                	this.bboxReaded = extent;
		                	if(!!extent && !!this.map && this.doZoom){
		                		this.map.zoomToExtent(extent, this.closest);
		                		this.fireEvent("zoomDone", this, features);
		                	}
		                	if(!this.doZoom){
		                		this.fireEvent("zoomDone", this, features);
		                        this.fireEvent("loadLayer", this, this);
		                	}
		                }
	            	}catch (e){
	            		// TODO: handle or evict
	            	}
	            }, 
	            ready: function(){
	            	this.query();
	            }, 
            	loadexception: function(e, e2){
            		if(verbose){
	            		if(!!e2 && !!e2.response
	                    		&& !!e2.response.priv
	                    		&& !!e2.response.priv.responseText){
	                        var text = e2.response.priv.responseText;
	                        text = text.replace(/\&/g,'&'+'amp;').replace(/</g,' ')
					        	.replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;').replace(/\n/g,'<br />');
	                		Ext.MessageBox.alert(searchWFSNotFoundStateText, text);
	            		}else{
	                		Ext.MessageBox.alert(searchWFSNotFoundStateText, searchWFSNotFoundStateText);
	            		}
            		}else{
            			Sicecat.showHideMessageInformation(searchWFSNotFoundStateText);
            		}
            	},
	            scope: this
	        };
	        
	        var combo = new Ext.form.ComboBox({
	            //xtype: "combo",
	            name: "layer",
	            fieldLabel: this.layerText,
	            store: this.layerStore,
	            value: this.layerStore.getAt(this.indexToGet).get("name"),
	            displayField: "title",
	            valueField: "name",
	            mode: "local",
	            allowBlank: true,
	            editable: false,
	            triggerAction: "all",
	            listeners: {
	                beforeselect: function(combo, record) {
	                    return this.fireEvent("beforelayerchange", this, record);
	                },
	                select: function(combo, record) {
	                    this.createFilterBuilder(record, combo);
	                },
	            	loadexception: function(e, e2){
	            		if(verbose){
	            			Ext.MessageBox.alert(searchWFSNotFoundStateText, searchWFSNotFoundStateText);
	            		}else{
	            			Sicecat.showHideMessageInformation(searchWFSNotFoundStateText);
	            		}
	            	},
	                scope: this
	            }
	        });
	        
	        this.items = [combo];
	        
	        gxp.QueryPanel.superclass.initComponent.apply(this, arguments);
	        
	        this.createFilterBuilder(this.layerStore.getAt(this.indexToGet));
		}
	},

    /**
     * Method: getMaxLayerExtent
     *  
     * get layer extent
     */
    getMaxLayerExtent: function() {
        var layer;
        if(this.doZoom && this.map)
        	layer = AuxiliaryLayer.getLayer(this.layerResultName);
        else 
        	layer = this.axiliaryLayerWFS;
        var dataExtent = layer instanceof OpenLayers.Layer.Vector &&
            layer.getDataExtent();
        if(layer instanceof OpenLayers.Layer.WMS){
        	if(!layer.boundCalculated){
		        var store = new Ext.data.Store({
		        	url : this.getCapabilitiesUrl(layer.url),
		        	reader : this.bboxReadr,
		        	listeners:{
		            	load: function(){
		            		//alert("load");
		            		//load bbox from capabilities and zoom to it
		            		this.loadBBox(store, layer, this.doZoom);
		            	}, 
		            	scope: this
		            }
		        });
		        // load the store with records derived from the doc at the above url
		        store.load();
		        return null;
	        }else{
	        	return layer.boundCalculated;
	        }
        }else{
        	var mapExtent = null; 
        	if(this.map){
        		mapExtent = this.map.maxExtent;
        	}
        	return layer.restrictedExtent || dataExtent || layer.maxExtent || mapExtent;
        }
    },
    
    /**
     * Method: loadBBox
     *  
     * Calculate bbox of wms layer and zoom to it if doZoom = true
     * 
     * Parameters
     *  doZoom - <Boolean> do the zoom to result bbox
     */
    loadBBox: function (store, layer, doZoom) {
        
    	var bounds = new OpenLayers.Bounds();
    	var found = false;
        var records = store.getRange();
        
        for(var i = 0; i < records.length; i++){
        	var rec = records[i];
        	var layers = layer.params.LAYERS;
        	if(layers.contains(rec.get("name"))){
        		var bbox = new OpenLayers.Bounds(rec.data.minx, rec.data.miny, rec.data.maxx, rec.data.maxy);
        		if(!!bbox){
        			//alert("Bounds of " + rec.get("name") + " = " + bbox);
        			bounds.extend(bbox);
        			found = true;
        		}
        	}
        }
        
        if(found){
        	layer.boundCalculated = bounds;
        	if(this.doZoom){
        		this.map.zoomToExtent(bounds, this.closest);
        	}
        }
        
        return found;
    },
    
    transformBounds: function(bounds){
    	var proj_orig = new Proj4js.Proj(Ext.getCmp(
			'origin_projection').getValue());
		var proj_goal = new Proj4js.Proj(Ext.getCmp(
				'goal_projection').getValue());
		var point = new Proj4js.Point(Ext
				.getCmp('Origin_x').getValue(), Ext.getCmp(
				'Origin_y').getValue());
		
		Proj4js.transform(proj_orig, proj_goal, point);
    },
    
    /*
     * private
     * 
     * Gets capabilites url
     */
    getCapabilitiesUrl: function(url){
    	var capabilitiesUrl = OpenLayers.ProxyHost + url;
    	var index = capabilitiesUrl.indexOf("request=getCapabilities")
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
    	}
        return capabilitiesUrl;
    },

    /** api: method[getFilter]
     *  Get the filter representing the conditions in the panel.  Returns false
     *  if neither spatial nor attribute query is checked.
     */
    getFilter: function() {

    	if(Sicecat.isLogEnable) console.log("this.propertyFilterSiceCAT --> "+this.propertyFilterSiceCAT
    			+ "\nthis.idFilter --> " + this.idFilter
    			+ "\nthis.bboxSiceCAT --> " + this.bboxSiceCAT
    			);
    	
    	var attributeFilter = !!this.propertyFilterSiceCAT && new OpenLayers.Filter.Logical({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: this.propertyFilterSiceCAT,
            value: this.idFilter
        });
    	
        var spatialFilter = this.bboxSiceCAT && new OpenLayers.Filter.Spatial({
            type: OpenLayers.Filter.Spatial.BBOX,
            value: this.bboxSiceCAT
        });
        
        var filter;
        if (attributeFilter && spatialFilter) {
            filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: [spatialFilter, attributeFilter]
            });
        } else {
            filter = attributeFilter || spatialFilter;
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
        
        var projection = null;
        
        if(this.map){
        	projection = this.map.getProjection();
        }else if (this.sicecatInstance){
        	projection = this.sicecatInstance.projection;
        }else{
        	alert("No encuentro la proj");
        }
        
        this.featureStore = new gxp.data.WFSFeatureStore({
            fields: fields,
            srsName: projection,
            url: layer.get("url"),
            featureType: layer.get("name"),
            //featureNS:  layer.get("namespace"),
            geometryName: this.geometryName,
            schema: layer.get("schema"),
            maxFeatures: this.maxFeatures,
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
    }
    
});

/** api: xtype = gxp_sicecat_querypanel */
Ext.reg('gxp_sicecat_zoomtoresultpanel', SiceCAT.ZoomToResultPanel); 
