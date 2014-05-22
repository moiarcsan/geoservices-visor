/*
 * LoadGML.js
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
 */

/*
 * Class: OpenLayers.Control.LoadGML
 * 
 * The LoadGML control is a button to load a GML file.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control.KML>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2011
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Author:
 * 
 *  María Arias de Reyna Domínguez(marias@emergya.com)
 */
OpenLayers.Control.LoadGML = OpenLayers.Class(OpenLayers.Control.LoadKML, {
	/*
	 * Property: fileType
	 * 
	 * Type format of the layer to Load (GML)
	 */
	fileType : "GML",
	/*
	 * Property: CLASS_NAME
	 * 
	 * Class name, for CSS.
	 */
	CLASS_NAME : "LoadGML",
	/*
	 * Property: displayClass
	 * 
	 * Display class name, for CSS.
	 */
	displayClass: "ControlLoadGML",

	/**
	 * Constant: TYPE_GML_V2
	 */
	TYPE_GML_V2: "GML Version 2",

	/**
	 * Constant: TYPE_GML_V3
	 */
	TYPE_GML_V3: "GML Version 3",

	/**
	 * Property: gmlType
	 *
	 * The selected gmlType [TYPE_GML2,TYPE_GML3]
	 */
	gmlType: null,
	/**
	 * i18n
	 */
    selectTypeText: "Select GML type to export",
    labelComboText: "Type",
    
	createPopup: function(){
		var windowImporter = OpenLayers.Control.LoadKML.prototype.createPopup.apply(this, arguments);
		
		//TODO: Add cuando funcione GML.v3
		if(!this.comboType){
			var storeType = new Ext.data.ArrayStore({
		        id: 0,
		        fields: [
		            'myId',
		            'displayText'
		        ],
		        data: [[2, this.TYPE_GML_V2]
		        , [3, this.TYPE_GML_V3] //#55164: Comento GML V3 que no consigo que funciones(no encuentra las geometrias)
		        ]
		    });
			//storeType.load();
		    var comboType = new Ext.form.ComboBox({
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
			        	var idTypeSelected = comboType.value;
			        	var nameTypeSelected = record.get(comboType.displayField);
			        	this.importType(idTypeSelected, nameTypeSelected);
			        },
			        scope: this}
		    });
			
			this.fp.add(comboType);
			this.comboType = comboType;
		}
		
		return windowImporter;
	},

	/**
	 * Method: importType
	 * 
	 * Export a layer to GML or KML
	 */
	importType: function(idType, type) {
		if (Sicecat.isLogEnable) console.log("Importing layer in " + type);
		this.gmlType = type;
	},
	/**
     * Constant: TYPE_GML_V2
     */
	TYPE_GML_V2: "GML Version 2",
	
	/**
     * Constant: TYPE_GML_V3
     */
	TYPE_GML_V3: "GML Version 3",

	/*
	 * Use to desc layer type
	 */
	getFormatTypeDesc: function() {
		return this.gmlType;
	},

	/*
	 * Method: formatType
	 * 
	 * Type format of the layer to Load (KML)
	 */
	formatType : function(){
		var internalProjection = new OpenLayers.Projection(this.map.projection);
		var externalProjection = new OpenLayers.Projection(this.externalProjection);

		var formatType;
		if (this.gmlType === this.TYPE_GML_V3) {
			formatType = new OpenLayers.Format.GML.v3({
				internalProjection: internalProjection,
				externalProjection: externalProjection,
				featureType: "feature",
				featureNS: "http://example.com/feature",
				extractStyles: true,
				extractAttributes: true,
				maxDepth: 2
			});
		} else {
			formatType = new OpenLayers.Format.GML({
				internalProjection: internalProjection,
				externalProjection: externalProjection,
				extractStyles: true,
				extractAttributes: true,
				maxDepth: 2
			});
		}

		return formatType;
	}
});
