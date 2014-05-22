/* 
 * LoadWFS.js
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
 * Class: Openlayers.Control.LoadWFS 
 * 
 * The LoadWFS control is a button to load a WFS URL.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control> 
 * 
 * See Also: 
 * 
 * <Openlayers.Control.LoadKML>
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
 * Moisés Arcos Santiago (marcos@emergya.com)
 */
OpenLayers.Control.LoadWFS = OpenLayers.Class(OpenLayers.Control.LoadKML,{
	/*
	 * Property: fileType
	 * 
	 * Type format of the layer to Load (WFS)
	 */
	fileType : "WFS",
	/*
	 * Property: CLASS_NAME
	 * 
	 * Class name, for CSS.
	 */
	CLASS_NAME : "LoadWFS",
	/*
	 * Property: displayClass
	 * 
	 * Display class name, for CSS.
	 */
	displayClass : "ControlLoadWFS",
	/*
	 * Property: win
	 * 
	 * Property to show a window.
	 */
	win: null,
	/*
	 * Method: formatType
	 * 
	 * Type format of the layer to Load (WFS)
	 */
	formatType : null,
	/**
	 * i18n
	 */
	titleWindowLocationLayer: "Load a WFS",
	labelLayerName: "Layer name",
	selectNameText: "Introduce the name of the layer",
	labelLayerURL: "URL path",
	selectURLText: "Introduce the path of the WFS URL service",
	labelLayerGeomType: "Geometry Type",
	selectGeomTypeText: "Introduce the type of the geometry in the layer",
	labelLayerGroupLayer: "Group Layers",
	selectGroupLayer: "Introduce the name of the gorup layers",
	labelLayerMaxFeatures: "Max Features",
	selectMaxFeature: "Introduce the number of the maxim features to show",
	labelLayerFeatureType: "Feature Type",
	selectFeatureType: "Introduce the type of the feature",
	labelLayerFeatureNS: "Feature NS",
	selectFeatureNS: "Introduce the feature name space",
	labelLayerFeaturePrefix: "Feature Prefix",
	selectFeaturePrefix: "Introduce the feature prefix",
	labelLayerGeomName: "Geometry Name",
	selectGeomName: "Introduce the geometry name",
	labelLayerSchema: "Schema",
	selectSchema: "Introduce the schema url",
	buttonSaveFormLayer: "Save",
	buttonCancelFormLayer: "Cancel",
	titleMsg: "Error to load WFS",
	messageLoadWFS: "Error to fill in the form",
	labelLayerEtitable: "Editable",
	labelGeometryType: "Geometry type",
	labelGeometryTypeEmpty: "Select a geometry type",
    layerLoadedTitleText: 'Done',
	layerLoadedText: 'WFS has been loaded',

	// Geometry type to edit
	geomType: null,
	
	/*
	 * Function: trigger
	 * 
	 * At the end of the wizard, it loads the file selected on the form.
	 * 
	 */
	trigger : function() {
		var this_ = this;
        w = new Viewer.view.dialog.WfsWizard({
        	listeners:{
        		featureTypeAdded: function (record){
        			this_.window = this_.createWindowLocationLayer();
        			this_.window.show();
        			if(!!record.data 
        					&& !!record.data.layer){
        				this_.layerData = record.data.layer;
        			}
        			this_.form.get("inputMaxFeatures").setValue(200);
        			this_.form.get("inputName").setValue(record.data.layer.name);
        		}
        	}
        });
        w.show();
	},
	
	getFormItems: function(){
		var this_ = this;
		var items = new Array();
		items.push({
			id : "inputName",
			fieldLabel : this.labelLayerName,
			name : 'layerName',
			allowBlank : false,
			emptyText: this.selectNameText
		});
		items.push(this.getParentFolderCombo());
		
		items.push({
			id: 'inputMaxFeatures',
			fieldLabel : this.labelLayerMaxFeatures,
			name : 'maxFeatures',
			allowBlank : false,
			emptyText: this.selectMaxFeature
		}); 
		if(Sicecat.GROUP_IDS.CECAT == Sicecat.SELECTED_GROUP
				|| Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
			items.push({
				xtype: 'checkbox',
				id: 'inputIsEditable',
				fieldLabel : this.labelLayerEtitable,
				name : 'maxFeatures',
				allowBlank : false,
				handler:function(e, checked){
					if(checked){
						this_.form.get("comboBoxFolder").setDisabled(true);
						this_.form.get("comboBoxGeom").setDisabled(false);
					}else{
						this_.form.get("comboBoxFolder").setDisabled(false);
						this_.form.get("comboBoxGeom").setDisabled(true);
					}
				}
			}); 

            var storeType = new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'id',
                    'name'
                ],
                data: [['POINT','POINT'],
                		['LINE', 'LINE'],
                		['POLYGON', 'POLYGON']]
            });
            //storeType.load();
            var comboType = new Ext.form.ComboBox({
                editable: false,
                typeAhead: true,
                triggerAction: 'all',
                lazyRender:true,
                mode: 'local',
                store: storeType,
                valueField: 'id',
                displayField: 'name',
                id: 'comboBoxGeom',
                fieldLabel: this.labelGeometryType,
                width: 245,
                disabled: 'true',
                emptyText: this.labelGeometryTypeEmpty,
                listeners: {
                    select: function(combo, record, index){
                        this.geomType = comboType.value;
                    },
                    scope: this}
            });
			items.push(comboType); 
		}
		
		var personalized = this.getPersonalizedItems();
		for(var i= 0; i < personalized.length; i++){
			items.push(personalized[i]);
		}
		
		return items;
	},
	
	/*
	 * Function: submitForm
	 * 
	 * Send the folder parameters to make persistence
	 * 
	 */
	submitForm: function(){
		var this_ = this;
		var type = "WFS";
		
		// Get the layer params to save them
        params = {
        		name: this.nameLayer,
    			server_resource: this.layerData.protocol.url,
    			type: type,
    			folderId: this.folderID,
    			properties:{ 
                	order: map.layers.length
    			}
    	};
        
        for(var key in this.layerData.protocol){
        	if (!!this.layerData.protocol[key]
        		&& (typeof this.layerData.protocol[key] != "undefined")
        		&& (typeof this.layerData.protocol[key] != "function")) {
        		params.properties[key] = this.layerData.protocol[key];
        	}
        }
        
        params.properties['maxFeatures'] = this_.form.get("inputMaxFeatures").getValue();

		if(Sicecat.GROUP_IDS.CECAT == Sicecat.SELECTED_GROUP
				|| Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
			params.properties['editable'] = this_.form.get("inputIsEditable").getValue();
			params.properties['available'] = true;
			params.properties['geometry'] = this_.geomType;
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
	        			this_.window.close();
	        });
		}
	}

});