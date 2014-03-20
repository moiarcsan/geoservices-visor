/*
 * OpenLayers.Control.ZoomToMunicipioComarca.js
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

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ZoomToMunicipioComarca
 * 
 * The ZoomToLayer control is a button that zooms out to the bounds
 * of layer bounds
 *  
 * It is designed to be used with a 
 * <OpenLayers.Control.Panel>
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 *  
 * See also:
 *  - <AuxilaryLayer>
 */
OpenLayers.Control.ZoomToMunicipioComarca = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: type
     * {String} The type of <OpenLayers.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: OpenLayers.Control.TYPE_BUTTON,
    
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
  
    /** api: config[wfsUrl]
     *  ``String`` WFS service url.
     */
    wfsUrl: 'http://sigescat.pise.interior.intranet/ows/wfs',
    
    /** api: config[queryUrlParameters]
     *  ``String`` Parameters to make a query.
     */
    queryUrlParameters: 'version=1.1.0&request=DescribeFeatureType&typeName={0}',
    
    /** i18n*/
    selectRegionText: "Write to search a region",
    selectTownText: "Write to search a town",
    windowSelecterTitle: "Region/Town zoom in",
    townLayerText: "Town '{0}' search",
    regionLayerText: "Region '{0}' search",
    regionText: "Region",
    townText: "Town",
    helpText: "<ol><li>Select a town or a region at combo boxes</li><li>Press at 'ZoomIn' button</li></ol>",
    zoomingText: "Doing the zoom to '{0}'",
    buttonText: "ZoomIn",
    doneText: "Zoom to '{0}' done",
    errorText: "Error ocurred in WFS. <a href='#' onclick=\"Ext.MessageBox.alert('Detalles', '{0}');\">More information</a>",
    errorDescribeFeatureNotFound: "Failed to access the <a href={0}>{1} entity  scheme</ a>",
    errorTraceText: "Trace: {0}",
    
    /*
     * private: window to show
     */
    windowSelecter: null,
    
    lastTypeSelected: null,
    idSelected: null,
    nameSelected: null,
    lastLayerCreated: null,
    
    /*
     * private: urls con comarcas y municipios
     */
    urlRegions: "files.do/comarcas_cat.json.do",
    urlTown: "files.do/municipios_cat.json.do",
    
    /*
     * Method: trigger
     * Do the zoom to selected features.
     */
    trigger: function() {
        if(this.windowSelecter == null){
            var storeReg = new  Ext.data.Store({
                 proxy: new Ext.data.HttpProxy({url: this.urlRegions}),
                 reader: new Ext.data.JsonReader({
                     root: 'comarcas',
                     fields: [{name:'id'},{name:'name'}]
                 })
            });
            storeReg.load();
            this.comboComarcas = new Ext.form.ComboBox({
                fieldLabel: this.regionText,
                witdh:300,
                typeAhead: true,
                triggerAction: 'all',
                lazyRender:true,
                mode: 'local',
                store: storeReg,
                valueField: 'id',
                displayField: 'name',
                loadingText: "Loading...",
                emptyText: this.selectRegionText,
                listeners: {
                    select: function(combo, record, index){
                        this.lastTypeSelected = this.SELECT_TYPE_R;
                        this.idSelected = this.comboComarcas.value; 
                        this.nameSelected = record.get(this.comboComarcas.displayField);
                        this.comboTowns.clearValue();
                    },
                    scope: this}
            });

            var storeTowns = new  Ext.data.Store({
                 proxy: new Ext.data.HttpProxy({url: this.urlTown}),
                 reader: new Ext.data.JsonReader({
                     root: 'municipios',
                     fields: [{name:'id'},{name:'name'}]
                 })
            });
            storeTowns.load();
            this.comboTowns = new Ext.form.ComboBox({
                fieldLabel: this.townText,
                witdh:300,
                typeAhead: true,
                triggerAction: 'all',
                lazyRender:true,
                mode: 'local',
                store: storeTowns,
                valueField: 'id',
                displayField: 'name',
                loadingText: "Loading...",
                emptyText: this.selectTownText,
                listeners: {
                    select: function(combo, record, index){
                        this.lastTypeSelected = this.SELECT_TYPE_T;
                        this.idSelected = this.comboTowns.value; 
                        this.nameSelected = record.get(this.comboTowns.displayField);
                        this.comboComarcas.clearValue();
                    },
                    scope: this}
            });

            
            this.statusBar = new Ext.ux.StatusBar({
                defaultText: this.helpText,
                width: 480,
                height: 50});
            
            var button = new Ext.Button({
                    text: this.buttonText,
                    menuAlign: "b",
                    cls: "formZoomToMunicipioComarca",
                    handler: function() {
                        this.statusBar.setText(String.format(this.zoomingText, this.nameSelected));
                        if(this.lastTypeSelected == this.SELECT_TYPE_T){
                            this.selectTown(this.idSelected, this.nameSelected);
                        }else{
                            this.selectRegion(this.idSelected, this.nameSelected);
                        }
                    },
                    scope: this
                });
            
            var formPanel = new Ext.form.FormPanel({ 
                width: 490,
                items: [this.comboComarcas,this.comboTowns]});
            formPanel.addButton(button);
            
            this.windowSelecter = new Ext.Window({
                title: this.windowSelecterTitle, 
                closeAction: 'hide',
                width:500,
                items: [formPanel,this.statusBar],
                listeners:{
                    close:function(){
                        if(!!this.lastLayerCreated){
                            AuxiliaryLayer.deleteLayer(this.lastLayerCreated);
                        }
                    },
                    scope: this
                }
            });
            
            this.windowSelecter.show();
        }else{
            this.statusBar.setText(this.helpText);
            this.windowSelecter.show();
        }
    },
    
    selectRegion: function(idRegion, comarca){
        if(Sicecat.isLogEnable) console.log("Zooming to region "+idRegion);
        this.getZoomToResult("s:k", "OBJECTID", idRegion, String.format(this.regionLayerText,comarca));
    },
    
    selectTown: function(idMunicipio, municipio){
        if(Sicecat.isLogEnable) console.log("Zooming to town "+idMunicipio);
        this.getZoomToResult("s:i", "OBJECTID", idMunicipio, String.format(this.townLayerText, municipio));
    },

    /**
     * Method: init_toolbarLocalizacion
     * 
     * Load this.localizator
     */
    getZoomToResult: function (queryTypeSiceCAT, propertyFilter, idFilter, layerName) {
        this.lastLayerCreated = layerName;
        var errorText = this.errorText;
        this.sicecatInstance = Sicecat;
        try{
            var this_ = this;
            var url = this.getQueryUrl(queryTypeSiceCAT);
            Ext.Ajax.request({
                url: url,
                params : { action : 'getDate' },
                method: 'GET',
                success: function ( result, request ) { 
                    this_.continueZoom(queryTypeSiceCAT, propertyFilter, idFilter, layerName);
                },
                failure: function ( result, request) {
                    this_.statusBar.setText(String.format(errorText, String.format(this_.errorDescribeFeatureNotFound, url, queryTypeSiceCAT)));
                    //Ext.MessageBox.alert('Failed', result.responseText);
                } 
            });
            
            
        }catch(e){
            console.log(e);
        }
    },

    /**
     * Method: getQueryUrl
     * 
     * Obtain query url to make a query for a queryType
     */
    getQueryUrl: function(queryType){
        return Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, this.wfsUrl + '?' + String.format(this.queryUrlParameters, queryType));
    },
    
    /**
     * Method: continueZoom
     * 
     * Continue zoom to result if the describeFeature exists
     */
    continueZoom : function(queryTypeSiceCAT, propertyFilter, idFilter,layerName){
        var panel = new SiceCAT.ZoomToResultPanel({
            closest: this.closest,
            verbose: false,
            sicecatInstance: this.sicecatInstance,
            map: this.sicecatInstance.map,
            listeners:{
                zoomDone:function(){
                    this.statusBar.setText(String.format(this.doneText,this.nameSelected) + this.helpText);
                }, 
                loadexception: function(exception, exc2){
                    //this.statusBar.setText(this.errorText + String.format(this.errorTraceText, exception));
                    var excText = exc2.response.priv.responseText;
                    excText = excText.replace(/\"/g, '');
                    excText = excText.replace(/\n/g, ' ');
                    var error = String.format(this.errorText, excText);
                    this.statusBar.setText(error);
                },
                scope: this
            }
        });
        var name = "Comarca/Municipio";
        if(!!layerName){
            name = layerName;
        }
        panel.getZoomToResult(queryTypeSiceCAT, propertyFilter, idFilter, name);
    },

    SELECT_TYPE_R: "REGION",
    SELECT_TYPE_T: "TOWN",  
    
    CLASS_NAME: "OpenLayers.Control.ZoomToMunicipioComarca"
});
