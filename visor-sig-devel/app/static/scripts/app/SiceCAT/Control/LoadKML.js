/*
 * LoadKML.js
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
 * Class: OpenLayers.Control.LoadKML
 * 
 * The LoadKML control is a button to load a KML file.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control>
 * 
 * See Also:
 * 
 * <LoadGML>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2011
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Authors:
 * 
 *  María Arias de Reyna Domínguez(marias@emergya.com)
 *  Moisés Arcos Santiago (marcos@emergya.com)
 */
OpenLayers.Control.LoadKML = OpenLayers.Class(OpenLayers.Control, {

	/*
	 * Property: fileType
	 * 
	 * Type format of the layer to Load (KML)
	 */
	fileType : "KML",
	/*
	 * Property: loadText
	 * 
	 * Text to show in load button
	 */
	loadText : "Load",
	/*
	 * Property: selectFileText
	 * 
	 * Text to show when for load a file
	 */
	selectFileText : "Select a {0} file to load",
	uploadingText : 'Uploading...',
	emptyText : 'Select a {0}',
	layerLoadedTitleText : 'Success',
	layerLoadedText : 'Layer {0} has been loaded',
	inProjectionText : "File projection",
	/*
	 * Property: nameLayer
	 * 
	 * Text to show the name of the layer
	 */
	nameLayer : "",
	/*
	 * Property: nameFolder
	 * 
	 * Text to show the name of the folder where save the layer
	 */
	nameFolder : "",
	
	folderID: null,
	/*
	 * Property: titleWindowLocationLayer
	 * 
	 * Text to show the title of the window
	 */
	titleWindowLocationLayer: "Introduce the layer name and the parent folder",
	/*
	 * Property: labelLayerName
	 * 
	 * Text to show the label of the input field 'name'
	 */
	labelLayerName : "Layer name",
	/*
	 * Property: labelLayerParentFolderName
	 * 
	 * Text to show the label of the combo box 'folder'
	 */
	labelLayerParentFolderName : "Select folder",
	selectNameText: "Introduce a name to the layer",
	selectComboBoxText : "Select the folder where save the layer",
	selectOrderText: "Introduce layer order",
	labelLayerOrderName: 'Order',
	baseLayerName: 'Base Layer',
    rootFolderName: null,
    rootFolderNameUserText:"User {0} folders",
    rootFolderNameGroupText:"Group {0} folders",
	userLayersText: "User's layers",

	// overrided by localized this.userLayersText
	DEFAULT_USER_LAYERS_FOLDER: "User's layers",
	/*
	 * Property: buttonFormLayer
	 * 
	 * Text to show the label of the window button
	 */
	buttonFormLayer : "Save",
	
	allGroupsUrl: "rest/persistenceGeo/getAllGroups",
	saveLayerBaseUrl: "rest/persistenceGeo/saveLayerByUser/",
	saveLayerGroupBaseUrl: "rest/persistenceGeo/saveLayerByGroup/",
	loadFoldersBaseUrl: "rest/persistenceGeo/loadFolders/",
	loadFoldersGroupBaseUrl: "rest/persistenceGeo/loadFoldersByGroup/",
	userOrGroupToSaveFolder: null,
	saveLayerUrl: null,
	typeToSaveFolder: null,
	nameFolderUser: "User Folder",
	
	/*
	 * Method: formatType
	 * 
	 * Type format of the layer to Load (KML)
	 */
	formatType : function() {
		if (Sicecat.isLogEnable)
			console.log("in --> " + this.map.projection);
		if (Sicecat.isLogEnable)
			console.log("external --> " + this.externalProjection);

		return new OpenLayers.Format.KML(
				{
					internalProjection : new OpenLayers.Projection(
							this.map.projection),
					externalProjection : new OpenLayers.Projection(
							this.externalProjection),
					extractStyles : true,
					extractAttributes : true,
					maxDepth : 2
				});
	},
	/*
	 * Property: CLASS_NAME
	 * 
	 * Class name, for CSS.
	 */
	CLASS_NAME : "LoadKML",
	/*
	 * Property: displayClass
	 * 
	 * Display class name, for CSS.
	 */
	displayClass : "ControlLoadKML",
	/*
	 * Property: type
	 * 
	 * Type of Control
	 */
	type : OpenLayers.Control.TYPE_BUTTON,
	
	idFile: null,
	
	window: null,
	
	/*
	 * Function: trigger
	 * 
	 * At the end of the wizard, it loads the file selected on the form.
	 * 
	 */
	trigger : function() {
		this.initParser();
		this.initFileCombo();
		this.window = this.createPopup();
		this.window.show();		
	},

	//Init pgeo parser
	initParser: function(){	
		this.parser = new SiceCATGeoParser({
			map:this.map
		});
	},
	
	/*
	 * Function: msg
	 * 
	 * Show an message window
	 * 
	 * See Also:
	 * 
	 * <Ext.Msg.show>
	 */
    msg: function(title, msg){
        Ext.Msg.show({
            title: title,
            msg: msg,
            minWidth: 200,
            modal: true,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        });
    },
    
    getPathFolder: function(combo, record){
    	var path = record.lastSelectionText;
    	if(path.indexOf("-") != -1){
    		path = path.replace("-", "");
    	}
    	var parentID = comboPF.getStore().getAt(record.getValue()).json.idParent;
    	var nameParent = null;
    	while(parentID != null){
    		nameParent = combo.getStore().getById(parentID);
    		if(nameParent.indexOf("-") != -1){
    			nameParent = nameParent.replace("-", "");
    		}
    		path = nameParent + " - " + path; 
    	}
    	return path;
    },
    
    getFoldersUrl: function(){
    	if(!!Sicecat.SELECTED_GROUP){
    		groupName = Sicecat.GROUP_NAMES[Sicecat.SELECTED_GROUP] ? 
    				Sicecat.GROUP_NAMES[Sicecat.SELECTED_GROUP] : Sicecat.SELECTED_GROUP;
    		this.rootFolderName = String.format(this.rootFolderNameGroupText, groupName);
        	// group from Sicecat
    		return this.loadFoldersGroupBaseUrl + Sicecat.SELECTED_GROUP;
    	}else{
    		this.rootFolderName = String.format(this.rootFolderNameUserText, Sicecat.user.login);
        	// user from Sicecat
    		return this.loadFoldersBaseUrl + Sicecat.user.login;
    	}
    },
    
    /**
     * Property: loadOnlyLayerFolders
     * 
     * Uses on getParentFolderJsonStore for filter folders.
     * 
     * It's can be:
     *   <ul>
     *   	<li><strong>true</strong>: Only loads folders with layers</li>
     *      <li><strong>false</strong>: Only loads folders without layers</li>
     *      <li><strong>null</strong>: Loads all folders</li>
     *   </ul>
     *   
     * Default is <code>true</code>
     */
    loadOnlyLayerFolders: true,

    /**
     * Method: getParentFolderJsonStore
     * 
     * @param idField
     * @param displayField
     * @returns {Ext.data.JsonStore}
     */
	getParentFolderJsonStore : function(idField, displayField) {

		this.initParser();

		var self = this;
		var fields = [ idField, {
		    name: displayField,
		    convert: function(v, record){
		        if(record.name == null || record.name === ""){
		        	return self.nameFolderUser;
		        }else{
		        	return v;
		        }
		    }
		} ];
		
		//Load store in two steps
		var params = {
            	filter: this.loadOnlyLayerFolders
        };
		var store = new Ext.data.JsonStore({
	        displayField:'name',
		    valueField:'id',
            root: 'data',
            totalProperty: 'results',
            fields: ['id','name']
        });
		this.parser.sendFormPostData(this.getFoldersUrl(), params, 'POST', 
				function(form, action) {
					/* ON SUCCESS */
					var json = Ext.util.JSON.decode(action.response.responseText);
					
					for(var i = 0; i < json.results ; i++){
						//console.log(json.data[i].name);
						if(!json.data[i].name 
							||json.data[i].name == ''){
							json.data[i].name = self.rootFolderName;
						}else if (!!json.data[i].name
							&& json.data[i].name.indexOf(self.DEFAULT_USER_LAYERS_FOLDER)> -1){
							json.data[i].name = json.data[i].name
								.replace(self.DEFAULT_USER_LAYERS_FOLDER, self.userLayersText);
						}
					}

    				store.loadData(json);
        		}, 
        		function(form, action) {
    				if (Sicecat.isLogEnabled) console.log("Fail loading  folders data");
        		});
        return store;
	},

	getParentFolderCombo : function() {
		var idField = 'id';
		var displayField = 'name';
		var this_ = this;
		var allowBlank = true;
		if(!!Sicecat.SELECTED_GROUP)
			allowBlank = false;
		var comboPF = new Ext.form.ComboBox({
			id: 'comboBoxFolder',
			xtype : 'combobox',
			mode : 'local',
			width : 190,
			emptyText: this.selectComboBoxText,
			allowBlank : allowBlank,
			forceSelection : !allowBlank,
			required: !allowBlank,
			fieldLabel : this.labelLayerParentFolderName,
			editable : false,
			lazyRender : false,
			triggerAction : 'all',
			selectOnFocus : true,
			store : this.getParentFolderJsonStore(idField, displayField),
			valueField : idField,
			displayField : displayField,
			listeners : {
				select : function(record, combo, value) {
					this_.nameFolder = record.lastSelectionText;
					this_.folderID = comboPF.getValue();
				},
				scope : this
			}
		});

		return comboPF;
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
					if(this_.form.form.isValid()){	
						// Save the layer
						this_.submitForm();
					}
				}
			} ]
		});
		this.form = formLocationLayer;

		var win = new Ext.Window({
			title : String.format(this.titleWindowLocationLayer),
			closeAction : 'close',
			width : 500,
			items : [ formLocationLayer ]
		});

		return win;
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
	
	getPersonalizedItems: function (){
		return new Array();
	},
	
	getLayerType: function(){
		var type = "KML";
		if(this.displayClass == "LoadKML"){
			type = "KML";
		}else if(this.displayClass == "LoadGML"){
			type = "GML";
		}
		return type;
	},

	/*
	 * Use to desc layer type
	 */
	getFormatTypeDesc: function(){
		return null;
	},

	submitForm : function() {

		this.initParser();

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
                	order: map.layers.length
    			}
    	};

    	if(!!this.getFormatTypeDesc()){
    		params.properties.typeDesc = this.getFormatTypeDesc();
    	}

		if(Sicecat.GROUP_IDS.SUPERADMIN == Sicecat.SELECTED_GROUP){
			params.properties.isBaseLayer = this_.form.get("inputIsBaseLayer").getValue();
		}
        
		if(!!Sicecat.SELECTED_GROUP){
			this_.parser.saveLayerByGroup(Sicecat.SELECTED_GROUP, params,
	        		function(form, action){
	        			/*
	        			 * ON SUCCESS
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = this_.parser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        		},
	        		function(form, action){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = this_.parser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        });
		}else{
			this_.parser.saveLayerByUser(Sicecat.user.login, params,
	        		function(form, action){
	        			/*
	        			 * ON SUCCESS
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = this_.parser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        		},
	        		function(form, action){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			var json = Ext.util.JSON.decode(action.response.responseText);
	        			var layer = this_.parser.LOADERS_CLASSES[json.type].load(json);
	        			Sicecat.addLayer(layer);
	        			this_.windowLocationLayer.close();
	        			this_.window.close();
	        });
		}
	},

	createPopup : function() {

		Ext.QuickTips.init();

		var fibasic = new Ext.ux.form.FileUploadField({
			width : 400
		});

		var fbutton = new Ext.ux.form.FileUploadField({
			buttonOnly : true,
			listeners : {
				'fileselected' : function(fb, v) {
					var el = Ext.fly('fi-button-msg');
					el.update('<b>Selected:</b> ' + v);
					if (!el.isVisible()) {
						el.slideIn('t', {
							duration : .2,
							easing : 'easeIn',
							callback : function() {
								el.highlight();
							}
						});
					} else {
						el.highlight();
					}
				}
			}
		});

		var map = this.map;
		var this_ = this;

		var fp = new Ext.FormPanel({
			fileUpload : true,
			width : 500,
			frame : true,
			url: 'rest/persistenceGeo/uploadFile',
			autoHeight : true,
			bodyStyle : 'padding: 10px 10px 0 10px;',
			labelWidth : 50,
			defaults : {
				anchor : '95%',
				allowBlank : false,
				msgTarget : 'side'
			},
			items : [ this.fileCombo,
					this.getProjectionCombo('3', 'origin_projection') ],
			buttons : [ {
				text : this.loadText,
				handler : function() {
					if (fp.getForm().isValid()) {
						//Send the first form
						fp.getForm().submit({
							url : "rest/persistenceGeo/uploadFile",
							waitMsg : this.uploadingText,
							success : function(form, action) {
								var json = Ext.decode(action.response.responseText);
								this_.idFile = json.data;
								// Show window to put the name and select its parent
								// folder
								this_.windowLocationLayer = this_.createWindowLocationLayer();
								this_.windowLocationLayer.fp = fp;
								this_.windowLocationLayer.show();
							},
							failure : function(form, action) {
								var json = Ext.decode(action.response.responseText);
							}
						});
					}
				}
			}]
		});

		this.fp = fp;

		this.windowSelecter = new Ext.Window({
			title : String.format(this.selectFileText, this.fileType),
			closeAction : 'hide',
			width : 500,
			items : [ fp, this.msg ]
		});
		// }

		return this.windowSelecter;
	},

	initFileCombo : function() {
		this.fileCombo = {
			xtype : 'fileuploadfield',
			emptyText : String.format(this.emptyText, this.fileType),
			fieldLabel : this.fileType,
			name : 'uploadfile',
			cls : 'upload-button',
			buttonText : '',
			buttonCfg : {
				iconCls : 'upload-icon'
			}
		};
	},

	getProjectionArrayStore : function(idField, displayField,
			defaultProjectionID) {

		var projections = [ [ 'EPSG:23031', 'EPSG:23031 (UTM 31N / ED50)' ],
				[ 'EPSG:25831', 'EPSG:25831 (UTM 31N / ETRS89)' ],
				[ 'EPSG:4326', 'EPSG:4326 (Lat/Lon WGS84)' ],
				[ 'EPSG:4258', 'EPSG:4258 (Lat/Lon ETRS89)' ] ];

		var fields = [ idField, displayField ];

		return new Ext.data.ArrayStore({
			id : defaultProjectionID,
			fields : fields,
			data : projections
		});
	},
	/*
	 * Function: getProjectionCombo
	 * 
	 * Returns a Combobox with all the available projections for the geographic
	 * calculator.
	 * 
	 * See Also:
	 * 
	 * <Ext.form.ComboBox>
	 */
	getProjectionCombo : function(defaultProjectionID, id) {
		var idField = 'projId';
		var displayField = 'displayText';
		var comboProj = new Ext.form.ComboBox({
			xtype : 'combobox',
			mode : 'local',
			width : 190,
			allowBlank : false,
			forceSelection : true,
			fieldLabel : this.inProjectionText,
			editable : false,
			lazyRender : false,
			triggerAction : 'all',
			selectOnFocus : true,
			store : this.getProjectionArrayStore(idField, displayField,
					defaultProjectionID),
			valueField : idField,
			displayField : displayField,
			listeners : {
				select : function(combo, record, index) {
					var idTypeSelected = comboProj.value;
					var nameTypeSelected = record.get(comboProj.displayField);
					this.importProyection(idTypeSelected, nameTypeSelected);
				},
				scope : this
			}
		});

		return comboProj;
	},

	/**
	 * Method: importProyection
	 * 
	 * Export a layer to GML or KML
	 */
	importProyection : function(idType, type) {
		if (Sicecat.isLogEnable)
			console.log("Importing from proyection " + type);
		this.externalProjection = idType;
	},

	/*
	 * Function: loadLayer
	 * 
	 * Loads the KML Layer
	 * 
	 * Parameters:
	 * 
	 * name - Name of the new layer url - URL where the file is
	 */
	loadLayer : function(name, url) {
		var layer = new OpenLayers.Layer.Vector(name, {
			strategies : [ new OpenLayers.Strategy.Fixed() ],
			protocol : new OpenLayers.Protocol.HTTP({
				url : url,
				format : this.formatType(),
				srsName : this.map.projection
			})
		});
		// NEW WIN
		var group = this.nameFolder;
		var subgroup = this.nameParentForlder;
		if (!!subgroup) {
			layer.groupLayers = group + "-" + subgroup;
		}
		layer.subgroupLayers = subgroup;
		if (!Sicecat.groupLayers.containsKey(group)) {
			Sicecat.groupLayers.add(group, new Ext.util.MixedCollection());
		}
		Sicecat.groupLayers.item(group).add(subgroup, subgroup);
		layer.events.on({
		    'added': function(){
		        actions["tooltipcontrol"].control.activate();
		    }
		});
		this.map.addLayer(layer);
	},
	draw : function() {
		OpenLayers.Control.prototype.draw.apply(this, arguments);
		return this.div;
	},
	/*
	 * Function: initialize
	 * 
	 * Overrides the initialize function to activate this control.
	 * 
	 * Parameter:
	 * 
	 * handler - {<OpenLayers.Handler>} options - {Object}
	 */
	initialize : function(handler, options) {
		OpenLayers.Control.prototype.initialize.apply(this, [ options ]);
		this.activate();
	}
});
