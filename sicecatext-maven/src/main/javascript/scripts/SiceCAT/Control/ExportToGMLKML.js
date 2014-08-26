/*
 * SiceCAT.Control.ExportToGMLKML.js
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
 * Class: SiceCAT.Control.ExportToGMLKML
 * 
 * The ExportToGMLKML control exports the layer selected to an GML or KML format
 *  
 * It is designed to be used with a 
 * <OpenLayers.Control.Panel>
 *
 * Inherits from:
 *  - <SiceCAT.Control.Exporter>
 *  
 * See also:
 *  - <OpenLayers.Format.GML.Base>
 *  - <OpenLayers.Format.GML.v2>
 *  - <OpenLayers.Format.GML.v3>
 *  - <OpenLayers.Format.KML>
 *  - <SiceCAT>
 */
SiceCAT.Control.ExportToGMLKML = OpenLayers.Class(SiceCAT.Control.Exporter, {
    
    /** i18n*/
    selectTypeText: "Select KML or GML export",
    helpText: "<ul><li>Select the file type to export the layer</li><li>If you have selected any feature at map the exporter only export these</li><ul>",
    exportingText: "Exporting the layer...",
    labelComboText: "Type",
    windowSelecterTitle: "GML/KML export of {0}",
    exportText: "Export",
    downloadFileText: "{0}_{1}.{2}",
    
    /*
     * private: windowSelecter
     */
    windowSelecter: null,
    
    /*
     * private: statusBar
     */
    statusBar: null,
    
    /*
     * private: idTypeSelected
     */
    idTypeSelected: null,
    /*
     * private: nameTypeSelected
     */
    nameTypeSelected: null,
    /*
     * private: fileName
     */
    fileName: null,
    /*
     * private: data
     */
    data: null,
    
    /*
     * Method: trigger
     * Do the zoom to selected features.
     */
    trigger: function() {
        
        if(this.windowSelecter == null){
            var storeType = new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'myId',
                    'displayText'
                ],
                data: [[2, this.TYPE_GML_V2], [3, this.TYPE_GML_V3], [4, this.TYPE_KML]]
            });
            //storeType.load();
            var comboType = new Ext.form.ComboBox({
                editable: false,
                typeAhead: true,
                triggerAction: 'all',
                lazyRender:true,
                mode: 'local',
                store: storeType,
                valueField: 'myId',
                displayField: 'displayText',
                fieldLabel: this.labelComboText,
                width: 245,
                emptyText: this.selectTypeText,
                listeners: {
                    select: function(combo, record, index){
                        this.idTypeSelected = comboType.value;
                        this.nameTypeSelected = record.get(comboType.displayField);
                        this.exportType(this.idTypeSelected, this.nameTypeSelected);
                    },
                    scope: this}
            });

            
            this.statusBar = new Ext.ux.StatusBar({
                defaultText: this.helpText,
                width: 480,
                height: 50});
            
            var button = new Ext.Button({
                    text: this.exportText,
                    menuAlign: "br",
                    handler: function() {
                        this.statusBar.setText(this.exportingText);
                        this.exportType(this.idTypeSelected, this.nameTypeSelected);
                    },
                    scope: this
                });
            
            var embeddedDownloadify = this.getEmbeddedDownloadify("exportButton_"+this.layer.name);
            
            this.formPanel = new Ext.form.FormPanel({ 
                width: 493,
                height: 130,
                items: [comboType,this.statusBar
                        ,embeddedDownloadify
                        ]});        

            
            this.windowSelecter = new Ext.Window({
                title: String.format(this.windowSelecterTitle, this.layer.name), 
                width: 510,
                height: 150,
                closeAction: 'hide',
                items: [this.formPanel]});
        }
            
        this.windowSelecter.show();
    },

    /**
     * Method: init_toolbarLocalizacion
     * 
     * Export a layer to GML or KML
     */
    exportType: function(idType, type){
        if(Sicecat.isLogEnable) console.log("Exporting layer to "+type);
        var exporter;
        if(type == this.TYPE_GML_V3){
            exporter = new OpenLayers.Format.GML.v3();
        }else if(type == this.TYPE_GML_V2){
            exporter = new OpenLayers.Format.GML.v2();
        }else {
            exporter = new OpenLayers.Format.KML({
                extractAttributes: true,
                maxDepth: 10,
                extractStyles: true
            });
        }   
        if(!!this.map.projection)
            exporter.srsName = new OpenLayers.Projection("EPSG:4326"); 
            // force EPSG:4326 instead exporter.srsName = this.map.projection;  
        this.exportLayer(exporter);
    },
    
    /**
     * Method: exportLayer
     * 
     * Export the layer to exporter format
     */
    exportLayer: function(exporter){
        
        if(!!this.layer
                && !!this.layer.features
                && (this.layer.features.length > 0)
                && !!exporter){
            
            var projOrig = new OpenLayers.Projection(this.map.projection);
            var projTarget = new OpenLayers.Projection("EPSG:4326");
            
            var features; 
            var this_ = this;
            if(!!this.layer.selectedFeatures 
                    && this.layer.selectedFeatures.length > 0){
                //Only selected features
                features = new Array();
                Ext.each(this.layer.selectedFeatures, function(feature, j) {
                    features.push(this_.exportFeature(feature, projOrig, projTarget, this.layer.styleMap));
                });
            }else{
                //All features
                features = new Array();
                Ext.each(this.layer.features, function(feature, j) {
                    features.push(this_.exportFeature(feature, projOrig, projTarget, this.layer.styleMap));
                });
            }
            var typeExport = null;
            if(this.nameTypeSelected == this.TYPE_GML_V3 || this.nameTypeSelected == this.TYPE_GML_V2){
                typeExport = this.TYPE_GML;
            }else{
                typeExport = this.TYPE_KML;
            }
            
            this.fileName = String.format(this.downloadFileText,this.layer.name, this.nameTypeSelected + "_" + projTarget.projCode, typeExport.toLowerCase());
            
            var mimeType= "data:text/xml;filename:"+ this.fileName +";base64,";
            
            this.data = 
                Base64.encode("<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
                                            + exporter.write(features));
            
            var downloadSuccessText = String.format(this.downloadSuccessText,this.nameTypeSelected, this.layer.name);
            this.getExportButton(this.fileName, this.data, "exportButton_"+this.layer.name, 
                    this.downloadSuccessTitleText, downloadSuccessText,
                    this.downloadCancelTitleText, this.downloadCancelText,
                    this.downloadErrorTitleText, this.downloadErrorText,
                    this.helpText, this.statusBar);
        }else{
            Ext.Msg.alert(this.downloadErrorTitleText, this.layerEmptyText);
        }
    },
    
    /**
     * Method: exportFeature
     * 
     * Transform and copy data to export a feature
     */
    exportFeature: function(origin, projOrig, projTarget, styleMap){
        var feature = origin.clone();
        this.parseGeometry(feature.geometry, projOrig, projTarget);
        if(!!feature.attributes){
            this.parseData(feature, origin.attributes);
        }
        
        if(!!feature.data){
            this.parseData(feature, origin.data);
        }
        
        feature.style = this.exportStyle(styleMap);
        
        return feature; 
    },
    
    /**
     * Method: exportStyle
     * 
     * Get default style symbolizer from a styleMap or default style otherwhise
     */
    exportStyle: function (styleMap){
        var style;
        if(!!styleMap 
                && !!styleMap.styles
                && !!styleMap.styles['default']){
            if(!!styleMap.styles['default'].rules
                    && styleMap.styles['default'].rules.length > 0
                    && !!styleMap.styles['default'].rules[0].symbolizer){
                //Only first rule without filter
                style = styleMap.styles['default'].rules[0].symbolizer; 
            }else{
                style = styleMap.styles['default'].defaultStyle;
            }
        }else{
            style = OpenLayers.Feature.Vector.style['default'];
        }
        return style;
    },
    
    MAPPED_DATA:{
        "nom": "name",
        "titol": "name",
        "nombre": "name",
        "type": "name",
        "camp 1:": "name"
    },
    
    defaultPropertyRow: "<tr><td>{0}</td><td>{1}</td></tr>",
    
    /**
     * Method: parseData
     * 
     * Parse data to show correctly in KML export
     */
    parseData: function(feature, data){
        var mapped = {};
        var description = "<![CDATA[<table>";
        if(!feature.attributes){
            feature.attributes = {};
        }
        if(!feature.attributes["name"]
            || !feature.attributes["description"]){
            if(!!feature.attributes["name"]){
                mapped["name"] = feature.attributes["name"]; 
            }
            if(!!data){
                for(var key in data){
                    var lowerKey = key.toLowerCase();
                    if(lowerKey in this.MAPPED_DATA
                            && !mapped[lowerKey]){
                        feature.attributes.name =  data[key];
                        mapped[lowerKey] = data[key];
                    }else{
                        description +=  String.format(this.defaultPropertyRow, key, data[key]);
                    }
                }
            }
            feature.attributes.description = description + "</table>"; 
        }
    },
    
    /**
     * Method: parseGeometry
     * 
     * Parse geometry with projections origin and target
     */
    parseGeometry: function(geometry, projOrig, projTarget){
        
        if(!!geometry){
            if(!!geometry.components){
            	var length = geometry.components.length;
                for(var i = 0; i< length; i++){
                    if(!!geometry.components[i]){
                        this.parseGeometry.apply(
                            this, [geometry.components[i], projOrig, projTarget]
                        );
                    }
                }
            }else{
            	if(!geometry.auxParsed){
                    geometry = OpenLayers.Projection.transform(geometry, projOrig, projTarget);
                    geometry.auxParsed = true;
                }
            }
        }
    },
    
    /**
     * Constant: TYPE_GML
     */
    TYPE_GML: "GML",
    
    /**
     * Constant: TYPE_GML_V2
     */
    TYPE_GML_V2: "GML Version 2",
    
    /**
     * Constant: TYPE_GML_V3
     */
    TYPE_GML_V3: "GML Version 3",
    
    /**
     * Constant: TYPE_KML
     */
    TYPE_KML: "KML",    

    CLASS_NAME: "OpenLayers.Control.ExportToGMLKML"
});
