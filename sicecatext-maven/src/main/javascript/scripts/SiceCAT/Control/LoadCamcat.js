/*
 * LoadCamcat.js
 * Copyright (C) 2012
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
 * Class: OpenLayers.Control.LoadCamcat
 * 
 * The LoadCamcat control is a button to load a CAMCAT file.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control.LoadKML>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2012
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Author:
 * 
 *  Alejandro Diaz Torres(adiaz@emergya.com)
 *  
 *  Moisés Arcos Santiago(marcos@emergya.com)
 */
OpenLayers.Control.LoadCamcat = OpenLayers.Class(OpenLayers.Control.LoadKML, {
	/*
	 * Property: fileType
	 * 
	 * Type format of the layer to Load (Camcat)
	 */
	fileType : "TEXT",
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
	displayClass : "ControlLoadGML",
	/*
	 * Property: stringSeparator
	 * 
	 * String which represents the attribute separator parameter.
	 */
	stringSeparator : "",
	
	/**
	 * i18n
	 */
    selectTypeText: "Select TEXT type to export",
    labelComboText: "Type",
    errorTitleText: 'Error', 
    errorLoadingText: "An error ocurred loading CAMCAT file",
    errorLoadingNotResultsText: "The file has not points in CAMCAT format, please check it.",
    errorLoadingSomeResultsText: "{0} points are not in CAMCAT format, please check it.",
    labelStringSeparator: "Character separator",
    selectStringSeparatorText: "Character that split the attributes from the file",
    charNoValidated: "Character no validated",
    layerLoadedTitleText: 'Done',
    layerLoadedText: 'Layer has been loaded',
    
    
    getLayerType:function(){
    	return 'TEXT';
    },
    
    /*
	 * Function: createWindowLocationLayer
	 * 
	 * Creates a window with a form to put the name and the parent folder.
	 * 
	 */
	createWindowLocationLayer : function() {
		var this_ = this;

		var formLocationLayer = new Ext.FormPanel({
			width : 500,
			frame : true,
			autoHeight : true,
			bodyStyle : 'padding: 10px 10px 0 10px;',
			labelWidth : 100,
			defaultType : 'textfield',
			defaults : {
				anchor : '95%',
				allowBlank : false,
				msgTarget : 'side'
			},
			items : this.getFormItems(),
			buttons : [ {
				text : this.buttonFormLayer,
				handler : function() {
					// Get the input values
					this_.nameLayer = this_.form.get("inputName").getValue();
					this_.stringSeparator = this_.form.get("inputSeparator").getValue();
					if(this_.form.form.isValid()){	
						// Save the layer
						this_.submitForm();
					}
				}
			} ]
		});
		this.form = formLocationLayer;

		this.win = new Ext.Window({
			title : String.format(this.titleWindowLocationLayer),
			closeAction : 'close',
			width : 500,
			items : [ formLocationLayer ]
		});

		return this.win;
	},
	
	getFormItems: function(){
		var this_ = this;
		var items = new Array();
		// Input name
		items.push({
			id : "inputName",
			fieldLabel : this.labelLayerName,
			name : 'layerName',
			allowBlank : false,
			emptyText: this.selectNameText
		});
		items.push(this.getParentFolderCombo());
		// Input separator
		items.push({
			id : "inputSeparator",
			fieldLabel : this.labelStringSeparator,
			name : 'separator',
			allowBlank : false,
			emptyText: this.selectStringSeparatorText,
			validator: function(value){
				var msg = false;
				if(value.indexOf("\"") == -1 && value.indexOf("\'") == -1
						&& value.indexOf("\\") == -1 && value.indexOf("/") == -1
						&& value.indexOf(" ") == -1){
					msg = true;
				}else{
					msg = this_.charNoValidated;
				}
				return msg;
			}
		});
		
		//isBaseLayer
		if(Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
			items.push({
				xtype: 'checkbox',
				id : "inputIsBaseLayer",
				fieldLabel : this.baseLayerName,
				name : 'maseLayer',
				handler:function(e, checked){
					if(checked){
						this_.form.get("comboBoxFolder").setDisabled(true);
					}else{
						this_.form.get("comboBoxFolder").setDisabled(false);
					}
				}
			});
		}
		
		var personalized = this.getPersonalizedItems();
		for(var i= 0; i < personalized.length; i++){
			items.push(personalized[i]);
		}
		
		return items;
	},
	
	submitForm : function() {
		var this_ = this;
		var type = this.getLayerType();
		
		// Get the layer params to save them
        params = {
        		name: this_.nameLayer,
    			server_resource: "",
    			type: type,
    			folderId: this_.folderID,
    			idFile: this_.idFile,
    			properties:{
    				externalProjection: this_.externalProjection,
                	order: map.layers.length,
                	separator: this_.stringSeparator
    			}
    	};

		if(Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
			params.properties.isBaseLayer = this_.form.get("inputIsBaseLayer").getValue();
		}
        
		if(!!Sicecat.SELECTED_GROUP){
			PersistenceGeoParser.saveLayerByGroup(Sicecat.SELECTED_GROUP, params,
	        		function(form, action){
	        			/*
	        			 * ON SUCCESS
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
                        Ext.Msg.alert(this_.layerLoadedTitleText, this_.layerLoadedText);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        		},
	        		function(form, action){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
                        Ext.Msg.alert(this_.layerLoadedTitleText, this_.layerLoadedText);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
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
                        Ext.Msg.alert(this_.layerLoadedTitleText, this_.layerLoadedText);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        		},
	        		function(form, action){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
                        Ext.Msg.alert(this_.layerLoadedTitleText, this_.layerLoadedText);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        });
		}
	},
});
