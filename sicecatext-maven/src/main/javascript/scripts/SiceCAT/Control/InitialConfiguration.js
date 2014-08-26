/*
 * InitialConfiguration.js
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
 * Class: OpenLayers.Control.InitialConfiguration
 * 
 * The InitialConfiguration control is a button to show a window with the map initial configuration
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control>
 * 
 * See Also:
 * 
 * <Control>
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
OpenLayers.Control.InitialConfiguration = OpenLayers.Class(OpenLayers.Control,
		{
			/*
			 * Property: CLASS_NAME
			 * 
			 * Class name, for CSS.
			 */
			CLASS_NAME : "InitialConf",
			/*
			 * Property: displayClass
			 * 
			 * Display class name, for CSS.
			 */
			displayClass : "InitialConf",
			/*
			 * Property: type
			 * 
			 * Type of Control
			 */
			type : OpenLayers.Control.TYPE_BUTTON,
			/* i18n */
			windowText : "Initial Configuration",
			titleFieldSet : "Initial zoom",
			textButton: "Get zoom",
			textButtonSave: "Save",
			textButtonCancel: "Cancel",
			textCombobox: "Initial Projection",
			textResolutions: "Resolutions",
			titleMsg: "Initial Configuration Saved",
			textMsg: "The initial map configuration has been saved correctly.",
			titleMsgError: "Error",
			textMsgError: "Error to save the initial map configuration",
			/*
			 * Function: trigger
			 * 
			 * Open a window with the map initial configuration.
			 * 
			 */
			trigger : function() {
				if(!this.windowSelecter){
					var popup = this.createPopup();
					this.initializeForm();
					popup.show();
				}
				
			},
			
			initializeForm: function(){
				var json = Sicecat.jsonMapConfiguration;
				var bbox = json['bbox'];
				var bboxArray = bbox.split(",");
				
				Ext.getCmp("minx").setValue(parseFloat(bboxArray[0]));
				Ext.getCmp("miny").setValue(parseFloat(bboxArray[1]));
				Ext.getCmp("maxx").setValue(parseFloat(bboxArray[2]));
				Ext.getCmp("maxy").setValue(parseFloat(bboxArray[3]));
				
				Ext.getCmp("projection_config").setValue(Sicecat.jsonMapConfiguration['projection']);
				Ext.getCmp("resolutions").setValue(Sicecat.jsonMapConfiguration['resolutions']);
				
			},
			
			updateMapConfiguration: function(self){
				var minx = Ext.getCmp("minx").getValue();
				var miny = Ext.getCmp("miny").getValue();
				var maxx = Ext.getCmp("maxx").getValue();
				var maxy = Ext.getCmp("maxy").getValue();
				
				var bbox = "" + minx + "," + miny + "," + maxx + "," + maxy;
				
				var projection = Ext.getCmp("projection_config").getValue();
				var resolutions = Ext.getCmp("resolutions").getValue();
				
				properties = {
					bbox: bbox,
					iProj: projection,
					res: resolutions
				};
				PersistenceGeoParser.updateMapConfiguration(properties, 
				function(form, action){
					// ON SUCCESS
					Ext.Msg.alert(self.titleMsg, self.textMsg);
				}, 
				function(form, action){
					// ON FAILURE
					Ext.Msg.alert(self.titleMsgError, self.textMsgError);
				});
			},
			
			/*
			 * Function: createPopup
			 * 
			 * Open a window.
			 * 
			 */
			createPopup : function() {
				Ext.QuickTips.init();

				var self = this;

				var fp = new Ext.FormPanel({
					width : 490,
					frame : true,
					autoHeight : true,
					bodyStyle : 'padding: 10px 10px 0 10px;',
					items : [ {
						xtype : 'fieldset',
						title : this.titleFieldSet,
						autoHeight : true,
						layout: 'anchor',
						items : [{
							xtype : 'compositefield',
							items : [ 
							    new Ext.form.Label({
								xtype : 'label',
								text : 'MinX:',
								margins : '5 8 10 5'
							}), new Ext.form.NumberField({
								id: 'minx',
								xtype : 'numberfield',
								allowBlank : false
							}), new Ext.form.Label({
								xtype : 'label',
								text : 'MinY:',
								margins : '5 8 10 15'
							}), new Ext.form.NumberField({
								id: 'miny',
								xtype : 'numberfield',
								allowBlank : false
							})]
						},{
							xtype : 'compositefield',
							items : [ 
							    new Ext.form.Label({
								xtype : 'label',
								text : 'MaxX:',
								margins : '5 5 5 5'
							}), new Ext.form.NumberField({
								id: 'maxx',
								xtype : 'numberfield',
								allowBlank : false
							}), new Ext.form.Label({
								xtype : 'label',
								text : 'MaxY:',
								margins : '5 5 5 15'
							}), new Ext.form.NumberField({
								id: 'maxy',
								xtype : 'numberfield',
								allowBlank : false
							})]
						},{
							xtype: 'toolbar',
							items: [{
								xtype: 'button',
								text: this.textButton,
								handler: function(){
									self.getZoomFromMap(self.fp);
								}
							}]
						}]
					}, 
					this.getProjectionCombo('1', 'projection_config')
					,{
						xtype: 'textfield',
						id: 'resolutions',
						fieldLabel: this.textResolutions,
						width: 300
					},{
						xtype: 'toolbar',
						items: [{
							xtype: 'button',
							text: this.textButtonSave,
							handler: function(){
								self.updateMapConfiguration(self);
							}
						},{
							xtype: 'button',
							text: this.textButtonCancel,
							handler: function(){
								self.initializeForm();
							}
						}]
					}]
				});

				this.fp = fp;

				this.windowSelecter = new Ext.Window({
					title : this.windowText,
					closeAction : 'close',
					width : 500,
					items : [ fp ],
					listeners: {
						'close': function(){
							self.windowSelecter = null;
						}
					}
				});

				return this.windowSelecter;
			},
			
			getZoomFromMap: function(form){
				var mapExtent = map.getExtent();
				Ext.getCmp("maxx").setValue(mapExtent.right);
				Ext.getCmp("maxy").setValue(mapExtent.top);
				Ext.getCmp("minx").setValue(mapExtent.left);
				Ext.getCmp("miny").setValue(mapExtent.bottom);
			},
			
			getProjectionArrayStore : function(idField, displayField,
					defaultProjectionID) {

				var projections = [
						[ 'EPSG:23031', 'EPSG:23031 (UTM 31N / ED50)' ],
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
			
			getProjectionCombo : function(defaultProjectionID, id) {
				var idField = 'projId';
				var displayField = 'displayText';
				var combo = new Ext.form.ComboBox({
					id : id,
					ref: 'combo_proj',
					xtype : 'combobox',
					fieldLabel: this.textCombobox,
					mode : 'local',
					width : 220,
					allowBlank : false,
					forceSelection : true,
					editable : false,
					lazyRender : false,
					triggerAction : 'all',
					selectOnFocus : true,
					store : this.getProjectionArrayStore(idField,
							displayField, defaultProjectionID),
					valueField : idField,
					displayField : displayField
				});

				return combo;
			},
		});