/*
 * CreateFolder.js
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
 * Class: OpenLayers.Control.CreateFolder
 * 
 * The CreateFolder control is a button to show a window where you'll can create a folder.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control.LoadKML>
 * 
 * See Also:
 * 
 * <LoadKML>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2012
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Authors:
 * 
 *  Moisés Arcos Santiago (marcos@emergya.com)
 */
OpenLayers.Control.CreateFolder = OpenLayers.Class(OpenLayers.Control.LoadKML, {
	/*
	 * Property: CLASS_NAME
	 * 
	 * Class name, for CSS.
	 */
	CLASS_NAME : "CreateFolder",
	/*
	 * Property: displayClass
	 * 
	 * Display class name, for CSS.
	 */
	displayClass : "CreateFolder",
	/*
	 * Property: type
	 * 
	 * Type of Control
	 */
	type : OpenLayers.Control.TYPE_BUTTON,
	/* i18n */
	titleWindowLocationLayer: "Introduce the folder name and the parent folder",
	labelLayerName: "Folder Name",
	selectNameText: "Introduce the name of the folder",
	selectComboBoxText: "Select the folder where save the folder",
	
	window: null,
	
	/*
	 * Function: trigger
	 * 
	 * Open a window to fill in the folder properties.
	 * 
	 */
	trigger: function(){
		this.window = this.createWindowLocationLayer();
		this.window.show();
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
     * For this control is <code>false</code>
     * 
     * @see LoadKML.js
     */
    loadOnlyLayerFolders: false,
	
	getFormItems: function(){
		var items = new Array();
		items.push({
			id : "inputName",
			fieldLabel : this.labelLayerName,
			name : 'layerName',
			allowBlank : false,
			emptyText: this.selectNameText
		});
		items.push(this.getParentFolderCombo());
		
		var personalized = this.getPersonalizedItems();
		for(var i= 0; i < personalized.length; i++){
			items.push(personalized[i]);
		}
		
		return items;
	},
	
	callbackSave: function(form, action){
		var json = Ext.util.JSON.decode(action.response.responseText);
		Sicecat.refreshLayers(loadSicecatInfo);
		this.window.close();
	},
    
	/*
	 * Function: submitForm
	 * 
	 * Send the folder parameters to make persistence
	 * 
	 */
	submitForm: function(){
		var self = this;
    	if(!!Sicecat.SELECTED_GROUP){
    		PersistenceGeoParser.saveFolderByGroup(Sicecat.SELECTED_GROUP, self.nameLayer, true, false, false, self.folderID, self.callbackSave, self.callbackSave);
    	}else{
	        PersistenceGeoParser.saveFolderByUser(Sicecat.user.login, self.nameLayer, true, false, false, self.folderID, self.callbackSave, self.callbackSave);
    	}
	}
});