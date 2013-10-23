/*
 * SiceCAT.PKSearchPanel
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
Ext.namespace("SiceCAT");

/** api: constructor
 *  .. class:: QueryPanel(config)
 *   
 *      Create a panel for assembling and issuing feature requests.
 */
SiceCAT.PKSearchPanel = Ext.extend(Ext.Panel, {

    /** i18n */
    roadText: "Road",
    kmText: "KM",
    resultText: "Search '{0} km {1}' results",
    idHeaderText: "Id",
    entitatHeaderText: "Entity",
    nomHeaderText: "Name",
    searchText: "Search",
    valorHeaderText: "Value",
    errorTitleText: "Error",
    errorBodyText: "Error calling SIGESCAT's <strong>cercaCarreteres</strong> service",
    
    /**private: property[url]
     */
    url: 'rest/cercaCarreteres/',
    
    /**private: property[urlConstructor]
     */
    urlConstructor: "{0} km {1}",
    
    queryParameter: null,
    
    /**private: property[roadName]
     */
    roadName: null,
    
    /**private: property[km]
     */
    km: null,
    
    /**private: property[store]
     */
    store:null,
    
    /**private: property[roadField]
     */
    roadField:null,
    
    /**private: property[pkField]
     */
    pkField:null,
    
    /**private: property[buttonQuery]
     */
    buttonQuery:null,
    
    /**private: property[store]
     */
    store:null,
    
    /**private: property[grid]
     */
    grid:null,
    
    /**private: property[window]
     */
    window:null,
    
    multiStore: null,

    /** private: method[initComponent]
     */
    initComponent: function() {   
    	
    	this.map = map;
        
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
    	
        SiceCAT.PKSearchPanel.superclass.initComponent.apply(this, arguments);

    },
    
    /** private: method[query]
     */
    query: function(){
    	this.createDataStore();
    	this.store.load();
    },

    /** private: method[createDataStore]
     */
	createDataStore: function(){

        //JSON example: {"lst":[{"id":9549,"entitat":"y","nom":"AP-7","valor":1.0}]}
		
		var url = this.url + this.queryParameter;
		
        this.store = new Ext.data.Store({
        	url: url,
            reader: new Ext.data.JsonReader({
                idProperty: 'id',
                root: "lst",
                fields: [
                    {
                    	name:'id',
                        mapping: 'id' 
                    },
                    {
                        name: 'entitat',
                        mapping: 'entitat'
                    },
                    {
                        name: 'nom',
                        mapping: 'nom'
                    },
                    {
                        name: 'valor',
                        mapping: 'valor',
                        convert: function(v, record){
            		        if(record.valor == null){
            		        	return "";
            		        }
            		    }
                    }
                ]
            }),
            listeners: {
                load: function(store, records, options) {
                    this.fireEvent("storeload", this, store, records, options);
                    // Create a data source to put into the multistore
                    var dataSource = {
                    		records: this.store.data.items
                    };
                    for(var i=0; i<dataSource.records.length; i++){
                    	dataSource.records[i].data.type = "pksearch";
                    }
                    // Load the store records to put into the multistore
                    this.multiData.records = this.multiData.records.concat(dataSource.records);
                    this.multiStore.loadRecords(this.multiData, {add: false}, null);
                },
                loadexception: function(exception) {
                	Sicecat.showHideMessageInformation(String.format(this.errorBodyText, this.url), 6000);
                },
                scope: this
            }
        });
	}, 
	
	/*loadWFSResult: function (grid, index){
		var record = grid.getStore().getAt(index);
		if(Sicecat.isLogEnable) console.log('searching by id ' + record.get("id"));
		this.getZoomToResult("s:y", "OBJECTID", record.get("id"));
	},
	
	/**
	 * Method: init_toolbarLocalizacion
	 * 
	 * Load this.localizator
	 */
	getZoomToResult: function (queryTypeSiceCAT, propertyFilter, idFilter) {
		this.sicecatInstance = Sicecat;
	    var panel = new SiceCAT.ZoomToResultPanel({
	    	closest: this.closest,
	    	sicecatInstance: this.sicecatInstance,
	    	map: this.sicecatInstance.map
	    });
	    panel.getZoomToResult(queryTypeSiceCAT, propertyFilter, idFilter,String.format(this.resultText, this.roadName, this.km));
	}
    
});

/** api: xtype = gxp_sicecat_querypanel */
Ext.reg('gxp_sicecat_pksearchpanel', SiceCAT.PKSearchPanel); 