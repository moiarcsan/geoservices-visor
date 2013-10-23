/*
 * GeoSearch.js
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
 * @include GeoExt.ux/GeoNamesSearchCombo.js
 */

Ext.namespace("SiceCAT");


/** api: (define)
 *  module = gxp
 *  class = QueryPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
SiceCAT.GeoSearch = Ext.extend(Ext.Panel, {
    /** api: config[map]
     *  ``OpenLayers.Map or Object``  A configured map or a configuration object
     *  for the map constructor, required only if :attr:`zoom` is set to
     *  value greater than or equal to 0.
     */
    /** private: property[map]
     *  ``OpenLayers.Map``  The map object.
     */
    map: null,
    
    /** private: property[geoNamesZoom]
     *  Url of the GeoNames service: http://www.GeoNames.org/export/GeoNames-search.html
     */
    geoNamesZoom: null,
    
    /** private: property[geoNamesWidth]
     *  Url of the GeoNames service: http://www.GeoNames.org/export/GeoNames-search.html
     */
    geoNamesWidth: null,

    /** private: property[geoNamesSearcherUrl]
     *  Url of the GeoNames service: http://www.GeoNames.org/export/GeoNames-search.html
     */
    geoNamesSearcherUrl: "http://ws.geonames.org/searchJSON?",

    /** private: property[geoNamesSearcherUrl]
     *  Url of the rest service http://redmine.emergya.es/projects/sicecat/repository/show/trunk/maven-packages/sigescat-searcher-rest
     */
    restSearcherUrl: "rest/",
    
    /** i18n */
    defaultSearchText: "Free search", // Búsqueda tipo google
    placeNameSearchText: "Place names search", // Localización por topónimo
    singularElementsSearchText: "Singular elements search", //Localización de elementos singulares disponibles en la cartografía base (escuelas, polideportivos, etc...)
    anyItemSearchText: "Any item search", // Localización de cualquier ítem de la cartografía
    pkSearchText: "PK search", // Localización de elementos de la red viaria por nombre o punto kilométrico (PK), incluidos cruces
    streetsSearchText: "Streets search", // Localización de direcciones en zonas con callejeros, incluidos cruces
    reverseGeocodeText: "Reverse search", // Busqueda de direcciones por puntos
    

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
            "ready"

        );        
        
        this.items = [{
            xtype: "tabpanel",
            anchor: "95%",
            activeTab: 0,
            items: [
				{
				    xtype: "gx_sicecat_sigescatcercasolrgeneralsearchercombo",
				    map: this.map,
		            url: this.restSearcherUrl + "cercaSolrGeneral/",
				    title: this.placeNameSearchText,
				    zoom: this.geoNamesZoom,
				    width: this.geoNamesWidth
				},
//    			{
//    	            xtype: "tabpanel",
//    	            title: this.singularElementsSearchText,
//    	            anchor: "95%",
//    	            items: []
//    	        },{
//    	            xtype: "tabpanel",
//    	            title: this.anyItemSearchText,
//    	            anchor: "95%",
//    	            items: []
//    	        },
    	        {
    	            xtype: "gxp_sicecat_pksearchpanel",
    	            title: this.pkSearchText,
    	            url: this.restSearcherUrl + "cercaCarreteres/",
    	            sicecatInstance: this.sicecatInstance,
    	            anchor: "90%"
    	        },
                {
                    xtype: "gx_sicecat_sigescatcercaopenlscombo",
                    map: this.map,
                    title: this.streetsSearchText,
    	            url: this.geoNamesSearcherUrl,
        		    zoom: this.geoNamesZoom,
        	   	    width: this.geoNamesWidth
                },
    	        {
    	            xtype: "gx_sicecat_sigescatreversegeocodeopenlspanel",
    			    map: this.map,
    	            url: this.geoNamesSearcherUrl,
    	            title: this.reverseGeocodeText,
    	            anchor: "90%"
    	        }
//            ,
//	        {
//	            xtype: "tabpanel",
//	            title: this.defaultSearchText,
//	            anchor: "95%",
//	            items: []
//	        }
	        ]
        }];
        
        SiceCAT.GeoSearch.superclass.initComponent.apply(this, arguments);

    },
    
    /**
     * private:method[pointListener]
     */
	pointListener: function(event, el, obj){
		if(!!this.items && !!this.items.items && !!this.items.items[0]
			&& !!this.items.items[0].items
			&& !!this.items.items[0].items.items){
			for(var i = 0;i <this.items.items[0].items.items.length; i++){
				if(!!this.items.items[0].items.items[i] && this.items.items[0].items.items[i].pointSelectionHandler){
					this.items.items[0].items.items[i].pointSelectionHandler(event, el, obj);
				}
			}
		}
	},
    
	/**
     * private:method[onShowPanels]
     */
	onShowPanels: function(){
		Ext.get(this.map.div).addListener(
				"click",
				this.pointListener,
				this);
	},

    /**
     * private:method[onHidePanels]
     */
	onHidePanels: function(){
		Ext.get(this.map.div).removeListener("click",
				this.pointListener,
				this);
		AuxiliaryLayer.getLayer("OpenLayers.Control.OpenlsSigescatReverseGeocodeCombo").setVisibility(false);
	}
});

/** api: xtype = gx_sicecat_geosearch */
Ext.reg('gx_sicecat_geosearch', SiceCAT.GeoSearch);
