/*
 * SiceCATGeoParser.js Copyright (C) 2012 This file is part of SiceCAT project
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


/** api: (define)
 *  module = SiceCATGeoParser
 */
Ext.namespace("PersistenceGeoParser");

/**
 * Class: SiceCATGeoParser
 * 
 * The SiceCATGeoParser is designed to parse data behind persistenceGeo 
 * library and sicecat viewer
 */
SiceCATGeoParser = Ext.extend(PersistenceGeo.Parser,{
						
    FOLDERS_ADDED:{},
    INDEX_FOLDER: 1,

    LOADERS:{
        "WMS":1,
        "WFS":2,
        "KML":3,
        "GML":5,
        "TEXT":6,
        "WMST":7
    },

    initComponent: function() {

        // Change parser for WMST
        this.LOADERS_CLASSES["WMST"] = new PersistenceGeo.loaders.WMSTLoader({
            restBaseUrl: this.getRestBaseUrl(),
            map: this.map
        });
        // Change parser for TEXT load
        this.LOADERS_CLASSES["TEXT"] = new PersistenceGeo.loaders.TEXTLoader({
            restBaseUrl: this.getRestBaseUrl(),
            map: this.map
        });

        SiceCATGeoParser.superclass.initComponent.call(this);
    },

    /**
     * Include layerTree on treeConfigObject
     * 
     */
    parseLayerTreeConfig: function(treeConfigObject, layerTree, notGroupLayers){
        var rootFolder = layerTree;

        for ( var i = 0; i < rootFolder.length; i++) {	
            if (rootFolder[i].text != 'overlays'
                && rootFolder[i].text != 'Overlays') {
                treeConfigObject.push(rootFolder[i]);
            } else {
                rootFolder.visible = false;
            }

        }
        var treeConfig = new OpenLayers.Format.JSON().write(
                treeConfigObject, true);	
        return treeConfig;
    },

    sendFormPostData: function (url, params, method, onsuccess, onfailure){
        var tempForm = new Ext.FormPanel({
            url: url,
            method: method,
            title: 'Save layer Form',
            fileUpload: true,	   
            items: [],
            buttons: []
        });

        tempForm.getForm().load({
            url: url,
            headers: {Accept: 'application/json, text/javascript, */*; q=0.01'},
            waitMsg: method==="GET"?null:"loading...",
            params : params,
            fileUpload: true,
            success: onsuccess ? onsuccess : function(){},
            failure: onfailure ? onfailure: function(){}
        });
    }
});


var loadingAwareSendFormPostData = function (url, params, method, onsuccess, onfailure){
    var tempForm = new Ext.FormPanel({
        url: url,
        method: method,
        title: 'Save layer Form',
        fileUpload: true,	   
        items: [],
        buttons: []
    });

    tempForm.getForm().load({
        url: url,
        headers: {Accept: 'application/json, text/javascript, */*; q=0.01'},
        waitMsg: !!loadingIndicator?null:"loading...",
        params : params,
        fileUpload: true,
        success: onsuccess ? onsuccess : function(){},
        failure: onfailure ? onfailure: function(){}
    });
};

SiceCATGeoParser.prototype.sendFormPostData = loadingAwareSendFormPostData;
PersistenceGeoParser.sendFormPostData = loadingAwareSendFormPostData;