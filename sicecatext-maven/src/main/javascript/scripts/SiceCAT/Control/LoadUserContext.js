/*
 * LoadUserContext.js
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
 * Class: OpenLayers.Control.LoadUserContext
 * 
 * The LoadUserContext control is a button to load a user Context
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
 *  Alejandro Díaz Torres (adiaz@emergya.com)
 */
OpenLayers.Control.LoadUserContext = OpenLayers.Class(OpenLayers.Control.LoadKML, {
	/*
	 * Property: loadText
	 * 
	 * Text to show in load button
	 */
	loadText : "Load",
	
	/* i18n */
	windowText : "Select a user to load",
	contextLoadedTitleText : 'Context loaded',
	contextLoadedText : "Context of '{0}' user loaded",
	userText : "User",
	confirmTitleText: "Confirm",
	confirmText: "All your folders and layers will be deleted to charge {0} context. Are you sure?",
	
	/*
	 * Property: CLASS_NAME
	 * 
	 * Class name, for CSS.
	 */
	CLASS_NAME : "LoadUserContext",
	/*
	 * Property: displayClass
	 * 
	 * Display class name, for CSS.
	 */
	displayClass : "LoadUserContext",
	/*
	 * Property: type
	 * 
	 * Type of Control
	 */
	type : OpenLayers.Control.TYPE_BUTTON,


	/** Default selected group is -1 **/
	selectedGroup: -1,
	
	/*
	 * Function: trigger
	 * 
	 * At the end of the wizard, it loads the file selected on the form.
	 * 
	 */
	trigger : function() {
		this.createPopup().show();
	},

	createPopup : function() {

		Ext.QuickTips.init();

		var usersUrl = PersistenceGeoParser.LOAD_USERS_BY_GROUP_BAE_URL() + this.selectedGroup;
		var confirmTitleText = this.confirmTitleText;
		var confirmText = this.confirmText;
		
		var this_ = this;
		
		var fp = new Ext.FormPanel({
			fileUpload : true,
			width : 500,
			frame : true,
			autoHeight : true,
			bodyStyle : 'padding: 10px 10px 0 10px;',
			labelWidth : 50,
			defaults : {
				anchor : '95%',
				allowBlank : false,
				msgTarget : 'side'
			},
			items : [
			{
		         fieldLabel:this_.userText
				,xtype:'combo'
		        ,displayField:'username'
		        ,valueField:'id'
		        ,store: new Ext.data.JsonStore({
		             url: usersUrl,
		             remoteSort: false,
		             autoLoad:true,
		             idProperty: 'username',
		             root: 'data',
		             totalProperty: 'results',
		             fields: ['id','username']
		         })
		        ,triggerAction:'all'
		        ,mode:'local'
		        ,listeners:{select:{fn:function(combo, value) {
		        	var userName = value.id;
		        	confirmText = String.format(confirmText, userName);
		        	Ext.MessageBox.confirm(
		        		confirmTitleText, 
		        		confirmText,
		                function(btn){
		                	if(btn == 'yes'){
			                	PersistenceGeoParser.cloneUserContext(userName, Sicecat.user.login, function(){
					    			Sicecat.refreshLayers(function(){
										Ext.Msg.alert(this_.contextLoadedTitleText, String.format(this_.contextLoadedText, userName));
									});
					    		});
								this_.windowSelecter.close();
		                	}
		                });
		            }}
		        }
			}
			         ],
			buttons : []
		});

		this.fp = fp;

		this.windowSelecter = new Ext.Window({
			title : this.windowText,
			closeAction : 'hide',
			width : 500,
			items : [fp]
		});

		return this.windowSelecter;
	}
});
