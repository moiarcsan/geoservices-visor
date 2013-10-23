/*
 * SiceCAT.widgets.OpenlsSigescatReverseGeocodePanel
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
 *  module = SiceCAT
 *  class = PKSearchPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("SiceCAT.widgets");

/** api: constructor
 *  .. class:: QueryPanel(config)
 *   
 *      Create a panel for assembling and issuing feature requests.
 */
SiceCAT.widgets.OpenlsSigescatReverseGeocodePanel = Ext.extend(Ext.Panel, {

    /** i18n */
	posXText: "X",
	posYText: "Y",
	projText: "Projection",
	direccionText: "Address",
    notFoundText: "Address Not Found",
    searchText: "Search",
    emptyText: "Select a point in map and press 'Search' to get the adress",
    errorTitleText: "Error",
    errorBodyText: "Error calling SIGESCAT's <strong>reverse geocode</strong> service",
    
    verbose: true,
    
    /**private: property[url]
     */
	url: 'proxy.do?url=http://sigescat-pre.pise.interior.intranet/openls',
	
	idProjCombo:'origin_projection_openls_panel',
    
    /**private: property[store]
     */
    store:null,
    
    /**private: property[map]
     */
    map:null,
    
    /**private: property[window]
     */
    window:null,
    
    /**private: property[posX]
     */
    posX:null,
    
    /**private: property[direccion]
     */
    direccion:null,
    
    /**private: property[doZoom]
     */
    doZoom: true,
    
	/*
	 * Property: layer_position
	 * 
	 * Where we paint the position marker
	 */
	layer_position : new OpenLayers.Layer.Vector('OpenLayers.Control.OpenlsSigescatReverseGeocodeCombo'),

    /** private: method[initComponent]
     */
    initComponent: function() {   
        
    	this.addEvents(

                /** api: events[storeload]
                 *  Fires when the feature store loads.
                 *
                 *  Listener arguments:
                 *  * panel - :class:`gxp.QueryPanel` This query panel.
                 *  * store - ``Ext.data.Store`` The feature store.
                 *  * records - ``Array(Ext.data.Record)`` The records that were
                 *      loaded.
                 *  * options - ``Object`` The loading options that were specified.
                 */
                "storeload"

            );       
        
        this.posX = new Ext.form.NumberField({
            anchor: "50%",
            name: 'posX',
            fieldLabel: this.posXText,
            decimalPrecision: 10,
            listeners: {
            	change: function(value) {
            		value = parseDouble(value, 20);
                    this.posXSelected = value;
                    if(!!this.posYSelected){
                    	this.createDataStore();
                    }
                },
                scope: this
            }
        });
        
        this.posY = new Ext.form.NumberField({
            anchor: '40%',
            name: 'posY',
            fieldLabel: this.posYText,
            decimalPrecision: 10,
            listeners: {
            	change: function(value) {
            		value = parseDouble(value, 20);
                    this.posYSelected = value;
                    if(!!this.posXSelected){
                    	this.createDataStore();
                    }
                },
                scope: this
            }
        });
        
        this.direccion = new Ext.form.TextField({
            anchor: '90%',
            name: 'posY',
            fieldLabel: this.direccionText,
            value: this.emptyText,
            readOnly: true
        });
        
        var panelContainer = this;
        this.buttonQuery = new Ext.Button({
                text: this.searchText,
                style: {
                	float: 'right'
                },
                handler: function() {
                	panelContainer.query();
                }
            });
        
        this.items = 
        	[{
	            xtype: "fieldset",
	            title: this.title,
	            checkboxToggle: false,
	            collapsed: false,
	            anchor: "95%",
	            height:"100px",
	            items:[this.posX,this.posY,
	                   this.getProjectionCombo('1', this.idProjCombo),
	                   this.direccion, this.buttonQuery]
        	}];


		this.layer_position.displayInLayerSwitcher = false;
		this.layer_position.id = this.layer_position.name;
		map.addLayer(this.layer_position);
        
        SiceCAT.widgets.OpenlsSigescatReverseGeocodePanel.superclass.initComponent.apply(this, arguments);
    },
	/*
	 * Function: getProjectionCombo
	 * 
	 * Returns a Combobox with all the available projections for
	 * the geographic calculator.
	 * 
	 * See Also:
	 * 
	 * <Ext.form.ComboBox>
	 */
	getProjectionCombo : function(defaultProjectionID, id) {
		if(!!!this.combo){
			var idField = 'projId';
			var displayField = 'displayText';
			this.combo = new Ext.form.ComboBox({
				xtype : 'combobox',
				mode : 'local',
				width : 190,
				allowBlank : false,
				forceSelection : true,
				editable : false,
	            fieldLabel: this.projText,
				lazyRender : false,
				triggerAction : 'all',
				selectOnFocus : true,
				store : this.getProjectionArrayStore(idField,
						displayField, defaultProjectionID),
				valueField : idField,
				displayField : displayField
			});
			
			this.combo.setValue(this.map.projection);
		}

		return this.combo;
	},

	getProjectionArrayStore : function(idField, displayField,
			defaultProjectionID) {

		var projections = [
				[ 'EPSG:23031', 'EPSG:23031 (UTM 31N / ED50)' ],
				[ 'EPSG:25831', 'EPSG:25831 (UTM 31N / ETRS89)' ],
				[ 'EPSG:4326', 'EPSG:4326 (Lat/Lon WGS84)' ],
				[ 'EPSG:4258', 'EPSG:4258 (Lat/Lon ETRS89)' ] ];

		var fields = [ idField, displayField ];

		return new Ext.data.ArrayStore({
			fields : fields,
			data : projections
		});
	},
    
	/*
	 * Function: pointSelectionHandler
	 * 
	 * Listens for selected point in map and update components.
	 */
	pointSelectionHandler : function(event, el, obj) {
		// EPSG 23031
		//if(Sicecat.isLogEnable) console.log(event);
		var lonlat = this.map.getLonLatFromPixel({
			x : event.getXY()[0]
					- Ext.get(this.map.div).getLeft(),
			y : event.getXY()[1]
					- Ext.get(this.map.div).getTop()
		});
		if (this.posX != null
				&& this.posY != null) {
			this.posX.setValue(lonlat.lon);
			this.posY.setValue(lonlat.lat);
            this.posXSelected = lonlat.lon;
            this.posYSelected = lonlat.lat;
		}
		
		this.combo.setValue(this.map.projection);
		this.updateFeatures();
	},
    
    /** private: method[query]
     */
    query: function(){
    	this.createDataStore();
    	this.store.load();
    },
	
	getLang: function(){
		if(GeoExt.lang == "ca")
			return "CA";
		else if(GeoExt.lang == "en")
			return "EN";
		else
			return "ES";
	},

    /** private: method[createDataStore]
     */
	createDataStore: function(){
		this.updateFeatures();		
		this.reverseGeocode(this.posXSelected, this.posYSelected, 1, ' ');
	}, 
	
	/** private: method[showResults]
     */
	showResults: function (store, records, options){
		this.loadResultRecord(records[0]);
	},
	
	loadResult: function (grid, index){
		var record = grid.getStore().getAt(index);
		this.loadResultRecord(record);
	},
	
	loadResultRecord: function (record){
		if(!!record && !!record.get("text")){
			this.direccion.setValue(record.get("text"));
	
			if(this.doZoom){
				var position = new OpenLayers.LonLat(record.get("lon"), record.get("lat"));
				var proj_orig = new OpenLayers.Projection(this.combo.getValue());
				// Reproject (if required)
				position.transform(
						proj_orig,
						map.getProjectionObject()
				);
				// zoom in on the location
				this.map.setCenter(position, true);
				this.map.zoomTo(7);
			}
		}else{
			this.direccion.setValue(this.notFoundText);
		}

        this.fireEvent("addressload", this.direccion.getValue());
	},
	/*
	 * Function: updateFeatures
	 * 
	 * Updates the control features to show where is the
	 * selection going to happen.
	 */
	updateFeatures : function() {

		this.layer_position.setVisibility(true);
		this.layer_position.removeAllFeatures();
		if (this.posXSelected != null
				&& this.posYSelected != null) {
			var point = new OpenLayers.Geometry.Point(this.posXSelected, this.posYSelected);
			this.point_feature = new OpenLayers.Feature.Vector(
					point, {}, {
						graphicHeight : 20,
						graphicWidth : 20,
						strokeWidth : 2,
						strokeColor : "#efefef",
						graphicName : "x"
					});

			this.layer_position.addFeatures(this.point_feature);
		}
	},
	
	/**
     * Execute a query to get reverse geocode
     * @param {String} posX
     * @param {String} posY
     * @param {Boolean} maxiumResponses 
     * @param {Boolean} separator for the query 
     */
    reverseGeocode : function(posX, posY, maxiumResponses, separator){
    	
	    var locale=this.getLang();
		var data = '<XLS xsi:schemaLocation="http://www.opengis.net/xls" version="1.2.0" xmlns="http://www.opengis.net/xls"'
						+ ' xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
						+ '<Request methodName="Geocode" requestID="123" '
						+ 'version="1.2.0" maximumResponses="' + maxiumResponses + '">'
						+ '<ReverseGeocodeRequest> <Position> <gml:Point srsName="EPSG:23031">' 
						+ '<gml:pos>' + posX + separator + posY
						+ '</gml:pos></gml:Point></Position></ReverseGeocodeRequest>'
						+ '</Request></XLS>';

		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url: this.url,
								method: 'POST',
								xmlData: data
							}),
					fields : [
						{name: "lon", type: "number"},
						{name: "lat", type: "number"},
						"text"
					],
					
					listeners:{
						load: function(store, records, options) {
		                    this.fireEvent("storeload", this, store, records, options);
		                    this.showResults(store, records, options);
		                },
		                loadexception: function(e){
		                	this.fireEvent("loadexception", this, e);
		                	if(this.verbose){
		                		Ext.MessageBox.alert(this.errorTitleText, this.errorBodyText);
		                	}else{
		            			Sicecat.showHideMessageInformation(this.errorBodyText);
		            		}
		                },
		                scope: this
					},

					reader: new SiceCAT.data.OpenLS_XLSReverseGeocodeReader()
				});
		this.store.load();
    }
    
});

/** api: xtype = gx_sicecat_sigescatreversegeocodeopenlspanel */
Ext.reg('gx_sicecat_sigescatreversegeocodeopenlspanel', SiceCAT.widgets.OpenlsSigescatReverseGeocodePanel); 