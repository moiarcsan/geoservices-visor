/*
 * UserLayerContainer.js
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
 * @requires SiceCAT/tree/OverlayLayerContainer.js
 */
Ext.namespace("SiceCAT.tree");

/** api: (define)
 *  module = SiceCAT.tree
 *  class = LayerTree
 */

/** api: (extends)
 * Ext/tree/TreePanel.js
 */

/** api: constructor
 * .. class:: LayerTree
 * 
 *     A layer tree panel for SiceCAT app
 */
SiceCAT.tree.LayerTree = Ext.extend(Ext.tree.TreePanel, {

	/**
	 * Property: sicecatInstance {SiceCAT} instance of sicecat
	 * viewer
	 */
	sicecatInstance : null,
	
	/** i18n **/
	gmlText : "GML",
	kmlText : "KML",
	wmsText : "WMS",
	areaEmergenciaText : "AreaEmergencia",
	baseLayersText : "Base layers",
	overlayLayersText : "Overlays",
	editableLayersText : "Editable layers",
	userLayersText : "User Layers",
	incidentsLayersText: "Incident layers",
	loadGMLTooltipText : "Load GML file",
	loadKMLTooltipText : "Load KML file",
	loadWMSTooltipText : "Load WMS layer",
	loadCamcatTooltipText : "Load CAMCAT file",
	loadEATooltipText : "Load Emergency Area file",
	userContextText: "User context",
	configurationText: "Configuration panel",
	createFolderText: "Folder",
	avalaibleText: "Availables",
	occupiedText: "Occupied",
	inEditionText: "In Edition",
    
    /** private: method[initComponent]
     */
    initComponent: function() {

		// create our own layer node UI class, using the
		// TreeNodeUIEventMixin
		var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI,
				new GeoExt.tree.TreeNodeUIEventMixin());
    	
		// get tree config
    	var treeConfig = this.getDefaultTreeConfig();
    	
    	// init panel
		this.getTreePanel(LayerNodeUI, treeConfig,
				false);
		
		SiceCAT.tree.LayerTree.superclass.initComponent.apply(this, arguments);
		
		// Set the title panel
    	this.title = this.initialConfig.title;
		
		new Ext.tree.TreeSorter(this, {
		    folderSort: true,
		    dir: "desc",
		    property: 'order', 
		    sortType: function(order, node) {
		        // sort by a custom, typed attribute:
		    	 return !!order ? 
		    			 parseInt(order, 10): 0;
		    }
		});
    },

	/**
	 * Method: getDefaultTreeConfig
	 * 
	 * Returns default tree config
	 */
	getDefaultTreeConfig : function() {
		if(!!Global_TMP.SELECTED_GROUP
				&&  (Global_TMP.SELECTED_GROUP == Sicecat.GROUP_IDS.CECAT
						||Global_TMP.SELECTED_GROUP == Sicecat.GROUP_IDS.SUPERADMIN)){
			return this.getAdminTreeConfig();
		}
		var baseLayersText = this.baseLayersText;
		var overlayLayersText = this.overlayLayersText;
		var editableLayersText = this.editableLayersText;
		var userLayersText = this.userLayersText;
		var notGroupLayers = [ "overlays", "editables" ];
		
		for (var i = 0 ; i < Sicecat.notGroupLayers.length; i++){
			notGroupLayers.push(Sicecat.notGroupLayers[i]);
		}

		// using OpenLayers.Format.JSON to create a nice
		// formatted string of the
		// configuration for editing it in the UI
		// var treeConfig = new OpenLayers.Format.JSON().write(
		var treeConfigObject = [ {
			nodeType : "gx_baselayercontainer",
			text : baseLayersText
		}, {
			nodeType : "gx_sicecat_editablelayercontainer",
			expanded : true,
			text : editableLayersText,
			// render the nodes inside this container with a
			// radio button,
			// and assign them the group "foo".
			loader : {
				baseAttrs : {
					radioGroup : "foo",
					uiProvider : "layernodeui"
				}
			}
		}, {
			nodeType : "gx_sicecat_userlayercontainer",
			expanded : true,
			text : this.incidentsLayersText,
			notGroupLayers : notGroupLayers,
			// render the nodes inside this container with a
			// radio button,
			// and assign them the group "foo".
			loader : {
				baseAttrs : {
					radioGroup : "foo",
					uiProvider : "layernodeui"
				}
			}
		} ];
		
		var treeConfig = (new SiceCATGeoParser()).parseLayerTreeConfig(treeConfigObject, Sicecat.auxGroupLayers, Sicecat.notGroupLayers);

		return treeConfig;
	},

	/**
	 * Method: getAdminTreeConfig
	 * 
	 * Returns default tree config for an admin1 or CECAT
	 */
	getAdminTreeConfig : function() {
		var baseLayersText = this.baseLayersText;
		var overlayLayersText = this.overlayLayersText;
		var editableLayersText = this.editableLayersText;
		var userLayersText = this.userLayersText;
		var notGroupLayers = [ "overlays", "editables", "occupied" ];
		
		for (var i = 0 ; i < Sicecat.notGroupLayers.length; i++){
			notGroupLayers.push(Sicecat.notGroupLayers[i]);
		}

		var treeConfigObject = null;
		
		if(Global_TMP.permisos.indexOf("admin1") > -1){
			treeConfigObject = [ {
				nodeType : "gx_baselayercontainer",
				text : baseLayersText
			}];
		}else{
			treeConfigObject = [ {
				nodeType : "gx_baselayercontainer",
				text : baseLayersText
			}, {
				leaf: false,
				expanded : true,
				text : editableLayersText, 
				children:[
					{
						nodeType : "gx_sicecat_editablelayercontainer",
						expanded : true,
						text : this.avalaibleText,
						groupLayers : 'available',
						loader : {
							baseAttrs : {
								radioGroup : "foo",
								uiProvider : "layernodeui",
								groupLayers : 'available'
							}
						}, 
					},
					{
						nodeType : "gx_sicecat_editablelayercontainer",
						expanded : true,
						text : this.occupiedText,
						groupLayers : 'occupied',
						loader : {
							baseAttrs : {
								radioGroup : "foo",
								uiProvider : "layernodeui",
								groupLayers : 'occupied'
							}
						}, 
					},
					{
						nodeType : "gx_sicecat_editablelayercontainer",
						expanded : true,
						text : this.inEditionText,
						groupLayers : 'in_edition',
						loader : {
							baseAttrs : {
								radioGroup : "foo",
								uiProvider : "layernodeui",
								groupLayers : 'in_edition'
							}
						}, 
					}
				]
			}];
		}
		
		var treeConfig = (new SiceCATGeoParser()).parseLayerTreeConfig(treeConfigObject, Sicecat.auxGroupLayers, Sicecat.notGroupLayers);
		
		return treeConfig;
	},

	/**
	 * Method: getTreePanel
	 * 
	 * Init tree panel with parameters
	 * 
	 * Parameters: LayerNodeUI - {<GeoExt.tree.LayerNodeUI>}
	 * for nodes Ui treeConfig - {<JSON>} With tree
	 * configuration showConfig - {<Boolean>} Indicates if show
	 * tree config in button bar of panel
	 */
	getTreePanel : function(LayerNodeUI, treeConfig, showConfig) {
		var west = this;

		// create the tree with the configuration from above
		this.title = this.layersText;
		this.width = 200;
		this.useArrows = true;
		this.autoScroll = true;
		this.animate = true;
		this.enableDD = true;
		this.containerScroll = true;
		this.border = false;
		this.rootVisible = false;
		this.lines = false;
		
		this.loader = new Ext.tree.TreeLoader({
						// applyLoader has to be set to false to
						// not interfer with loaders
						// of nodes further down the tree
						// hierarchy
						applyLoader : false,
						uiProviders : {
							"layernodeui" : LayerNodeUI
						}
					});
		this.root = {
						nodeType : "async",
						// the children property of an
						// Ext.tree.AsyncTreeNode is used to
						// provide an initial set of layer
						// nodes. We use the treeConfig
						// from above, that we created with
						// OpenLayers.Format.JSON.write.
						children : Ext.decode(treeConfig)
					};
		
		this.initPlugins();
		this.initListeners();
		this.initTopBar();
		this.initButtomBar(showConfig);
		

		return tree;
	},
	
	initListeners: function(){
		this.listeners = {
				"radiochange" : function(node) {
					alert(node.layer.name
							+ " is now the the active layer.");
				},
				"load" : function(node) {
					actions["tooltipcontrol"].control
							.activate();
				}
			};
	},
	
	initTopBar: function(){
		
		var userContextText = this.userContextText;
		var configurationText = this.configurationText;
		var createFolderText = this.createFolderText;

		// Control functions
		var loadCamcat = new OpenLayers.Control.LoadCamcat();
		var loadGML = new OpenLayers.Control.LoadGML();
		var loadKML = new OpenLayers.Control.LoadKML();
		var loadWFS = new OpenLayers.Control.LoadWFS();
		var loadUserContext = new OpenLayers.Control.LoadUserContext();
		var initialConfiguration = new OpenLayers.Control.InitialConfiguration();
		var createFolder = new OpenLayers.Control.CreateFolder();

		var addItems = [
			new GeoExt.Action(
					{
						itemID : "LoadCamcat",
						text : 'TEXT',
						control : loadCamcat,
						map : map,
						iconCls : "loadCamcat",
						// button
						// options
						allowDepress : false,
						tooltip : this.loadCamcatTooltipText
					}),
			new GeoExt.Action(
					{
						itemID : "LoadGML",
						text : "GML",
						control : loadGML,
						map : map,
						iconCls : "LoadGML",
						// button
						// options
						allowDepress : false,
						tooltip : this.loadGMLTooltipText
					}),
			new GeoExt.Action(
					{
						itemID : "LoadKML",
						text : 'KML',
						control : loadKML,
						map : map,
						iconCls : "LoadKML",
						// button
						// options
						allowDepress : false
					}),
			this.getAddLayersPanel()
	];

	if(!!Global_TMP.USER_GROUP){
		loadUserContext.selectedGroup = Global_TMP.USER_GROUP;
		addItems.push(
			new GeoExt.Action({
				itemID : "LoadUserContext",
				text : userContextText,
				control : loadUserContext,
				map : map,
				iconCls : "LoadUserContext",
				// button
				// options
				allowDepress : false
			}));
	}
	

	addItems.push(
	new GeoExt.Action({
		itemID : "createWFS",
		text : "WFS",
		control : loadWFS,
		map : map,
		iconCls : "LoadWFS",
		// button options
		allowDepress : false
	}));

	addItems.push(
	new GeoExt.Action({
		itemID : "createFolder",
		text : createFolderText,
		control : createFolder,
		map : map,
		iconCls : "CreateFolder",
		// button options
		allowDepress : false
	}));
	
	var items = [ new Ext.Button({
		iconCls : 'addButton',
		menu : new Ext.menu.Menu({items : addItems})
	})];
	
	// Add initial config panel only for level 1 admin
	if(Global_TMP.permisos.indexOf("admin1") >= 0){
		items.push(new GeoExt.Action(
				{
					itemID : "configurationPanel",
					tooltip : configurationText,
					control : initialConfiguration,
					map : map,
					iconCls : "InitialConf",
					allowDepress : false
				}));
	}
		
		this.tbar = new Ext.Toolbar(
				{
					items : items
				});
	},
	
	initButtomBar: function(showConfig){

		// dialog for editing the tree configuration
		var treeConfigWin = null;
		
		if (!!showConfig) {
			treeConfigWin = this
					.getTreeConfigWindow(treeConfig);
		}
		
		//buttom bar
		this.bbar = !!showConfig ? [ {
			text : "Show/Edit Tree Config",
			handler : function() {
				treeConfigWin.show();
				Ext.getCmp("treeconfig").setValue(
						treeConfig);
			}
		} ] : null;
	},
	
	draggingLayer: null,
	
	initPlugins: function(){
		
		var this_ = this;

		var sicecatInstance = this.sicecatInstance;
		
		this.plugins = [ new SiceCAT.plugins.TreeNodeRadioButton(
				{
					listeners : {
						"radiochange" : function(
								node) {
							// alert(node.text + "
							// is now the active
							// layer.");
							var layer = AuxiliaryLayer
									.getLayer(node.text);
							sicecatInstance
									.setActiveLayer(layer);
						},
						'checkchange': function(node, checked){
							this_.checkChange(node, checked);
			            },
						"onStartDrag": function(node){
							console.log("end drag");
							node.select();
							var layer = AuxiliaryLayer
									.getLayer(node.text);
							//console.log("layer --> "+layer);
						},
						"onEndDrag": function(node){
							console.log("end drag");
							node.select();
							var layer = AuxiliaryLayer
									.getLayer(node.text);
							//console.log("layer --> "+layer);
						},
						"beforeNodeDrop": function(dropEvent) {
							dropEvent.cancel = true;
							if(!!dropEvent.target.attributes["groupLayers"]
									&& !!dropEvent.dropNode.attributes["layer"]
									&& !!dropEvent.dropNode.attributes["layer"].layerID){
								// Layer move
								this_.layerMove(dropEvent);
							}else if(!!dropEvent.dropNode.attributes["groupLayers"]
								&& !!dropEvent.target.attributes["groupLayers"]){
								// Folder move
								this_.folderMove(dropEvent);
							}else{
								//only layers and folders with ids
								dropEvent.cancel = true;
							}
						},
						"onContextMenu" : function(
								node, e) {
							// alert("Positio to
							// show = "+ e.getXY());
							this_.contextMenu(node, e);
						}
					}
				}) ];
	},
	
	contextMenu: function (node, e){
		if(!!node.attributes["layer"]){
			// layer context menu
			node.select();
			var layer = node.attributes["layer"];
			if (!layer.layerContextMenu) {
				// init
				// layerContextMenu
				layer.layerContextMenu = new SiceCAT.tree.LayerContextMenu({
					sicecatInstance: this.sicecatInstance,
					map: map,
					layer: layer,
					node: node
				});
			}
			layer.layerContextMenu
					.show(node.ui
							.getAnchor());
		}else{
			//TODO: FolderContextMenu
			var folder = node.attributes;
			console.log(folder);
			console.log(this.userLayersText);
			if(!node.folderContextMenu){
				// init folder context menu
				folder.folderContextMenu = new SiceCAT.tree.FolderContextMenu({
					node: node,
					folder: folder, 
					locked: folder.text == this.userLayersText
				});
			}
			folder.folderContextMenu
				.show(node.ui
					.getAnchor());
		}
	},
	
	/**
	 * Method: checkChange
	 * 
	 * Guarda la visibilidad de la capa
	 * 
	 * @param node
	 * @param checked
	 */
	checkChange: function(node, checked){
		if(!!node.attributes.layer){
			if(this.isOwnerlayer(node.attributes.layer)){
				PersistenceGeoParser.saveLayerProperties(node.attributes.layer.layerID,{
					visibility: checked
				});
			} // TODO: else ¿save layer visibility by user?
		}
	},
	
	/**
	 * Method: layerMove
	 * 
	 * Mueve la capa al directorio si el usuario tiene permiso
	 * 
	 * @param dropEvent
	 */
	layerMove: function(dropEvent){
		var group = Sicecat.SELECTED_GROUP;
		var user = Sicecat.user.login;
		var layerId = dropEvent.dropNode.attributes["layer"].layerID;
		var folderId = dropEvent.target.attributes["groupLayers"]; 
		if(dropEvent.point != 'append')
			folderId = dropEvent.target.parentNode.attributes["groupLayers"];
		var order = this.getOrder(dropEvent);
		dropEvent.cancel = this.isInvalidMove(user, group, dropEvent, false);
		if(!dropEvent.cancel){
			PersistenceGeoParser.moveLayerTo(layerId, folderId, order,
					function(form, action){
	        			/*
	        			 * ON SUCCESS
	        			 */
						if(Sicecat.isLogEnable) console.log("Layer "+layerId + " moved to "+folderId +  " folder in order " + order);
	            		Sicecat.refreshLayers(function(){
	            			Sicecat.showHideMessageInformation(Sicecat.contextRefreshedText);
	            		});
	        		},
	        		function(){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			if(Sicecat.isLogEnable) console.log("Error moving "+layerId + " to "+folderId + " folder in order " + order);
	            		Sicecat.refreshLayers(function(){
	            			Sicecat.showHideMessageInformation(Sicecat.contextRefreshedText);
	            		});
	        		}
	        );
		}
	},
	
	/**
	 * Method: getOrder
	 * 
	 * Obtiene el orden de la capa a mover
	 * 
	 * @param dropEvent
	 * 
	 * @returns orden de la capa en funcion del orden de su carpeta y donde se ubique dentro de la misma
	 */
	getOrder: function(dropEvent){
		var folder = dropEvent.target;
		if(dropEvent.target instanceof SiceCAT.tree.LayerNode
			    || (!!dropEvent.point 
			    	&& dropEvent.point != 'append')){
			folder = dropEvent.target.parentNode;
		}
		var order = folder.childNodes.length;
		if(!!folder.parentNode){
			// maximo 100 por carpeta
			order += this.getOrder({target: folder.parentNode}) + 100; 
		}
		for(var i = 0; i< folder.childNodes.length; i++){
			order--;
			if(folder.childNodes[i].id
					==  dropEvent.target.id){
				if(dropEvent.point == 'below'){
					order--;
				}//else dropEvent.point == 'above'
				break;
			}
		}
		return order;
	},
	
	/**
	 * Method: folderMove
	 * 
	 * Mueve la carpeta al directorio si el usuario tiene permiso
	 * 
	 * @param dropEvent
	 */
	folderMove: function(dropEvent){
		var group = Sicecat.SELECTED_GROUP;
		var user = Sicecat.user.login;
		var folderId = dropEvent.dropNode.attributes["groupLayers"];
		var toFolderId = dropEvent.target.attributes["groupLayers"];
		if(dropEvent.point != 'append')
			toFolderId = dropEvent.target.parentNode.attributes["groupLayers"]; 
		var order = this.getOrder(dropEvent);
		dropEvent.cancel = this.isInvalidMove(user, group, dropEvent, true);
		if(!dropEvent.cancel){
			PersistenceGeoParser.moveFolderTo(folderId, toFolderId, order,
					function(form, action){
	        			/*
	        			 * ON SUCCESS
	        			 */
						if(Sicecat.isLogEnable) console.log("Folder "+folderId + " moved to "+toFolderId +  " folder in order " + order);
	            		Sicecat.refreshLayers(function(){
	            			Sicecat.showHideMessageInformation(Sicecat.contextRefreshedText);
	            		});
	        		},
	        		function(){
	        			/*
	        			 * ON FAILURE 
	        			 */
	        			if(Sicecat.isLogEnable) console.log("Error moving folder "+folderId + " to "+toFolderId + " folder in order " + order);
	            		Sicecat.refreshLayers(function(){
	            			Sicecat.showHideMessageInformation(Sicecat.contextRefreshedText);
	            		});
	        		}
	        );
		}
	},
	
	/**
	 * Method: isInvalidMove
	 * 
	 * Solo sera valido si el destino es tiene la propiedad isFolder igual a isFolder y el propietario coincide con user o group 
	 * 
	 * @param user
	 * @param group
	 * @param dropEvent
	 * @param isFolder 
	 * 
	 * @returns {Boolean}
	 */
	isInvalidMove: function (user, group, dropEvent, isFolder){
		var isInvalid = true;
		if(dropEvent.target.childNodes.length > 99){
			// maximo 99 hijos por carpeta
			return true;
		}
		if(!dropEvent.target.isExpanded()){
			dropEvent.target.expand();
			dropEvent.target.collapse();
		}
		if(!!group 
				&& !!dropEvent.target
				&& !!dropEvent.target.attributes
				&& (dropEvent.target.attributes["isFolder"] == isFolder 
						|| dropEvent.target.childNodes.length == 0)
				&& !!dropEvent.target.attributes["groupOwner"]
				&& dropEvent.target.attributes["groupOwner"] == group){
			isInvalid = false;
		}else if(!!user 
				&& !!dropEvent.target
				&& !!dropEvent.target.attributes
				&& (dropEvent.target.attributes["isFolder"] == isFolder 
						|| dropEvent.target.childNodes.length == 0)
				&& !!dropEvent.target.attributes["userOwner"]
				&& dropEvent.target.attributes["userOwner"] == user){
			isInvalid = false;
		}
		return isInvalid;
	},

	/**
	 * Method: getAddLayersPanel
	 * 
	 * Return an action to show add layers panel
	 */
	getAddLayersPanel : function() {
		// var map = this.map;
		Ext.QuickTips.init();

        var sources = {};
        
        // We have got to process the sources config.
        for(var sourceId in VisorConfig.WMS_SOURCES) {
            var sourceOrig = VisorConfig.WMS_SOURCES[sourceId];
            var source = sources[sourceId] = {};
            for(var key in sourceOrig) {
                if(key=="url") {
                    // We need to proxy these urls.
                    source["url"] = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, sourceOrig["url"]);
                    if(sourceOrig.securized) {
                        source["url"] = Sicecat.getUrlSecurized(source["url"]);
                    }
                } else {
                   source[key] = sourceOrig["key"];
                }
            }
            
            source["ptype"] = "gxp_wmssource";
        }
		var panel = new SiceCAT.widgets.AddLayers(
				{
					width : 365,
					height : 340,
					map : map,
					maxFeatures : 200,
					mapPanel : mapPanel,
					sources : sources					
				});

		action = new GeoExt.Action({
			itemID : "LoadWMS",
			text : "WMS",
			map : map,
			iconCls : "LoadWMS",
			// button options
			allowDepress : true,
			tooltip : this.loadWMSTooltipText,
			// check item options
			group : "export",
			listeners : {
				click : function(renderer) {
					panel.showCapabilitiesGrid();
				}
			}
		});

		return action;
	},

	/**
	 * Method: getTreeConfigWindow
	 * 
	 * Returns a window to show treeConfig
	 * 
	 * Parameters: treeConfig - {<JSON>} With tree
	 * configuration
	 */
	getTreeConfigWindow : function(treeConfig) {
		// dialog for editing the tree configuration
		var treeConfigWin = new Ext.Window(
				{
					layout : "fit",
					hideBorders : true,
					closeAction : "hide",
					width : 300,
					height : 400,
					title : "Tree Configuration",
					items : [ {
						xtype : "form",
						layout : "fit",
						items : [ {
							id : "treeconfig",
							xtype : "textarea"
						} ],
						buttons : [
								{
									text : "Save",
									handler : function() {
										var value = Ext.getCmp(
												"treeconfig")
												.getValue();
										try {
											var root = tree
													.getRootNode();
											root.attributes.children = Ext
													.decode(value);
											tree.getLoader()
													.load(root);
										} catch (e) {
											alert("Invalid JSON");
											return;
										}
										treeConfig = value;
										treeConfigWin.hide();
									}
								}, {
									text : "Cancel",
									handler : function() {
										treeConfigWin.hide();
									}
								} ]
					} ]
				});
		return (treeConfigWin);
	},

	/**
	 * Method: isOwnerlayer
	 * 
	 * Comprueba si el usuario tiene permisos sobre la capa
	 * 
	 * @param layer
	 * 
	 * @returns {Boolean}
	 */
	isOwnerlayer: function (layer){
		return Sicecat.isOwnerlayer(layer);
	}
});
