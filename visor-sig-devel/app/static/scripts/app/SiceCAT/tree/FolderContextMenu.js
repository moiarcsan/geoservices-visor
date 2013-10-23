/*
 * FolderContextMenu.js
 * 
 * Copyright (C) 2012, 
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
 * @requires PersistenceGeoParser.js
 */
Ext.namespace("SiceCAT.tree");

/** api: (define)
 *  module = SiceCAT.tree
 *  class = FolderContextMenu
 */

/** api: (extends)
 * Ext/menu/Menu.js
 */

/** api: constructor
 * .. class:: FolderContextMenu
 * 
 *     A tree folder context menu to be called from LayerTree
 */
SiceCAT.tree.FolderContextMenu = Ext.extend(Ext.menu.Menu, {

	/**
	 * Property: sicecatInstance {SiceCAT} instance of sicecat
	 * viewer
	 */
	sicecatInstance : null,
	
	/** i18n **/
	deleteText : "Delete folder",
	renameFolderWindowText : "Rename Folder",
	saveFolderNameText : "Save Name",
	nameText: "Name",
	withoutPermissionText: "Without permission",
	withoutPermissionDescText: "Folder {0} is admin folder. Contact with your administrator",
	
	folder: null,
	node: null,
    
    /** private: method[initComponent]
     */
    initComponent: function() {

		// init contextMenu
		this.items = this.getFolderContextMenuItems(this.folder);
		SiceCAT.tree.FolderContextMenu.superclass.initComponent.apply(this, arguments);
    },
	
	/**
	 * Method: isOwnerFolder
	 * 
	 * Comprueba si el usuario tiene permisos sobre el directorio
	 * 
	 * @param folder
	 * 
	 * @returns {Boolean}
	 */
	isOwnerFolder: function (folder){
		return (Sicecat.SELECTED_GROUP == folder.groupOwner);
	},

	/*
	 * Attributte: locked
	 * 
	 * Defines show folder options or note folder options
	 *
	 */
	locked: false,

	/**
	 * Method: getLayerContextMenu
	 * 
	 * Parameters layer - {OpenLayers.Layer} to get the
	 * contextMenu
	 * 
	 * Get layerContextMenu - {<Ext.menu.Menu>} to show in
	 * context menu of layers
	 */
	getFolderContextMenuItems : function(folder) {

		// init items only with layer options
		var items = [];
		
		// Delete Layer
		if (this.isOwnerFolder(folder) && !this.locked){
			items.push(this.getDeleteFolderContextMenu(folder));
			items.push(this.getRenameFolderContextMenu(folder));
		}else{
			items.push(this.getWithoutPermission(folder));
		}
		
		return items;
	},
	
	/**
	 * 
	 */
	getWithoutPermission: function(folder){
		var withoutPermissionText = this.withoutPermissionText;
		var withoutPermissionDescText = this.withoutPermissionDescText;
		return {
			text : this.withoutPermissionText,
			iconCls : 'DeleteLayer',
			handler : function() {
				Ext.MessageBox.alert(withoutPermissionText,
						String.format(withoutPermissionDescText, folder.text));
			}
		};
	},

	/**
	 * Method: getRenameFolder
	 * 
	 * Get a window to rename a folder
	 * 
	 * Parameter
	 * 
	 * folder - <Map> with folder properties to be renamed
	 */
	getRenameFolder : function(folder) {

		var window = folder.renameLayer;

		if (!window) {

			var newName = new Ext.form.TextField({
				value : folder.text,
				fieldLabel : this.nameText
			});

			var button = new Ext.Button(
					{
						text : this.saveFolderNameText,
						menuAlign : "b",
						cls : "formRenameLayer",
						handler : function() {
							var newValue = newName.getValue();

							PersistenceGeoParser.renameFolder(folder.groupLayers, newValue,
									function (action){
										/*
										 * ON SUCCESS
										 */
										//Sicecat.refreshLayers();
										folder.lext = newValue;
									} //,TODO: ON failure
							);
						},
						scope : this
					});

			var formPanel = new Ext.form.FormPanel({
				width : 280,
				items : [ newName ]
			});
			formPanel.addButton(button);

			window = new Ext.Window({
				title : this.renameFolderWindowText,
				width : 300,
				plain : true,
				closeAction : "hide",
				items : [ formPanel ]
			});
			folder.renameFolder = window;
		}else {
			window = folder.renameLayer;
		}

		return window;

	},

	/**
	 * Method: getRenameFolderContextMenu
	 * 
	 * Obtiene el menu contextual para cambiar el nombre de la carpeta
	 */
	getRenameFolderContextMenu : function(folder) {
		var this_ = this;
		
		return {
			text : this.renameFolderWindowText,
			iconCls : 'RenameLayer',
			handler : function() {
				this_.getRenameFolder(folder).show();
			}
		};
	},

	/**
	 * Method: getRenameFolderContextMenu
	 * 
	 * Obtiene el menu contextual para borrar la carpeta
	 */
	getDeleteFolderContextMenu : function(folder) {

		return {
			text : this.deleteText,
			iconCls : 'DeleteLayer',
			handler : function() {
				PersistenceGeoParser.deleteFolder(folder.groupLayers,
						function (action){
							/*
							 * ON SUCCESS
							 */
							Sicecat.refreshLayers();
							//or node.parent...
						}, function (action){
							/* 
							 * ON failure
							 */
							Sicecat.refreshLayers();
						}
				);
			}
		};
	}
});
