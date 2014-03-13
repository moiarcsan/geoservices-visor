/*
 * LayerContextMenu.js
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
 * Authors:: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 * 
 */

/**
 * @requires SiceCAT/tree/OverlayLayerContainer.js
 */
Ext.namespace("SiceCAT.tree");

/** api: (define)
 *  module = SiceCAT.tree
 *  class = LayerContextMenu
 */

/** api: (extends)
 * Ext/menu/Menu.js
 */

/** api: constructor
 * .. class:: LayerContextMenu
 * 
 *     A tree layer context menu to be called from LayerTree
 */
SiceCAT.tree.LayerContextMenu = Ext.extend(Ext.menu.Menu, {

	/**
	 * Property: sicecatInstance {SiceCAT} instance of sicecat
	 * viewer
	 */
	sicecatInstance : null,
	
	layer : null,
	
	/** i18n **/
	layerDeleteText : "Delete layer",
	layerInfoText : "View layer information",
	layerStyleText : "Edit layer style",
	layerStyleEditText : "Layer's '{0}' style edit",
	layerZoomText : "Zoom to layer",
	layerOpacityMenuText : "Layer opacity",
	layerOpacityText : "'{0}' layer opacity",
	layerOpacityNotAllowText : "This type of layer does not support opacity editing, edit the style",
	auxiliaryLayerNotStylingText : "This layer is designed only for integration with SICECAT / GPCL. Styling is not supported.",
	layerNotStylingText : "This layer type does not support styling, try edit opacity.",
	exportWFSTooltipText : "Export layer selected to CSV file",
	exportToGMLTooltipText : "Export layer selected to GML/KML file",
	startEditingMenuText : "Start Edition",
	stopEditingMenuText : "Stop Edition",
	layerText : "Layer",
	renameLayerWindowText : "Rename Layer",
	deleteLayerWindowText : "Remove Layer",
	saveLayerNameText : "Save Name",
	markLayerAsOccuped: "Mark as occuped",
	markLayerAsAvailable: "Mark as available",
	errorTitleText: 'Error',
	errorText: 'An error ocurred performing this operation.',
	notPoolWFSTitleText: 'Error',
	notPoolWFSText: 'You must\'n mark \'{0}\' layer as occupied. There aren\'t more available layers of geometry type \'{1}\'',
	
    noRasterDisabledText: " (vector layers only)",
    noVectorDisabledText: " (raster layers only)",
    notSupportedFormatDisabledText: " (not supported layer)",
    
    /** private: method[initComponent]
     */
    initComponent: function() {

		// init contextMenu
		this.items = this.getLayerContextMenu(this.layer);
		SiceCAT.tree.LayerContextMenu.superclass.initComponent.apply(this, arguments);
    },

	/**
	 * Method: getLayerContextMenu
	 * 
	 * Parameters layer - {OpenLayers.Layer} to get the
	 * contextMenu
	 * 
	 * Get layerContextMenu - {<Ext.menu.Menu>} to show in
	 * context menu of layers
	 */
	getLayerContextMenu : function(layer) {
		var layerDeleteText = this.layerDeleteText;
		var layerInfoText = this.layerInfoText;
		var layerStyleText = this.layerStyleText;
		var layerZoomText = this.layerZoomText;
		var layerStyleEditText = this.layerStyleEditText;
		var layerOpacityMenuText = this.layerOpacityMenuText;
		var layerExportMenuText = this.exportWFSTooltipText;
		var layerExportToGMLMenuText = this.exportToGMLTooltipText;
		var startEditingMenuText = this.startEditingMenuText;
		var stopEditingMenuText = this.stopEditingMenuText;

		var sicecatInstance = this.sicecatInstance;

		// Delete layer control
		var deleteLayerControl = new OpenLayers.Control.DeleteLayer({
			sicecatInstance: this.sicecatInstance,
			map: this.map,
			layer: layer,
			node: this.node
		});
		
		// Controls
		var zoomToLayerControl = new OpenLayers.Control.ZoomToLayer(
				{
					sicecatInstance : this.sicecatInstance,
					map : this.map,
					layer : layer
				});

		// Controls
		var stylerControl = new OpenLayers.Control.Styler({
			sicecatInstance : this.sicecatInstance,
			map : this.map,
			layer : layer
		});

		var layerInformationControl = new OpenLayers.Control.LayerInformation(
				{
					sicecatInstance : this.sicecatInstance,
					layer : layer
				});
		// actions["layerInformationControl"] =
		// layerInformationControl;
		var exporterWFS = new OpenLayers.Control.ExportWFS({
			map : this.sicecatInstance.map,
			layer : layer
		});
		var layerExporterControl = new SiceCAT.Control.ExportToGMLKML(
				{
					sicecatInstance : this.sicecatInstance,
					map : this.map
				});

		var west = this;

		var auxiliaryLayerNotStylingText = this.auxiliaryLayerNotStylingText;
		var layerNotStylingText = this.layerNotStylingText;

		if (layer instanceof OpenLayers.Layer.Vector
				&& !!layer.protocol && !layer.saveStrategy) {
			Ext.each(layer.strategies, function(s, i) {
				if (s instanceof OpenLayers.Strategy.Save)
					layer.saveStrategy = s;
			});
			var save = new OpenLayers.Control.Button(
					{
						title : startEditingMenuText,
						trigger : function() {
							if (edit.feature) {
								edit.selectControl
										.unselectAll();
							}

							// We are done with the editing
							disableEditing = true;

							// Deactivate the draw controls
							actions.draw_poly
									.setDisabled(disableEditing);
							actions.draw_line
									.setDisabled(disableEditing);
							actions.draw_point
									.setDisabled(disableEditing);

							// Deactivate the edit controls
							actions.delete_feature
									.setDisabled(disableEditing);
							actions.edit_feature
									.setDisabled(disableEditing);
							actions.edit_attributes
									.setDisabled(disableEditing);
							actions.drag_feature
									.setDisabled(disableEditing);

							// Disable the stop editing item
							this.menu.items.get(
									stopEditingMenuText)
									.disable();
							// Enable the start editing item
							this.menu.items.get(
									startEditingMenuText)
									.enable();

							// Commit Changes
							if (sicecatInstance.permisos.editWFS)
								layer.saveStrategy.save();

							Ext.each(SiceCAT.startEditArray,
									function(saveOption) {
										saveOption.enable();
									});

							Ext
									.each(
											layer.strategies,
											function(s, i) {
												if (s instanceof OpenLayers.Strategy.Refresh) {
													// s.activate();
													s.reset();
												}
											});

							sicecatInstance.editingLayer = false;

							actions.nav.control.activate();
						}
					});

			var edit = new OpenLayers.Control.Button(
					{
						title : stopEditingMenuText,
						trigger : function() {

							Ext
									.each(
											layer.strategies,
											function(s, i) {
												if (s instanceof OpenLayers.Strategy.Refresh) {
													// s.deactivate();
													s.stop();
												}
											});

							sicecatInstance
									.setActiveLayer(layer);
							sicecatInstance.editingLayer = true;
							this.menu.items.get(
									stopEditingMenuText)
									.enable();
							this.menu.items.get(
									startEditingMenuText)
									.disable();

							Ext.each(SiceCAT.startEditArray,
									function(saveOption) {
										saveOption.disable();
									});
						}
					});
		}

		// init items only with layer options
		var items = [];

		// Init context menus
		var layerDeleteContext =  this.createMenuAction(
				layerDeleteText, deleteLayerControl,
				"DeleteLayer");
		
		var layerInfoContext = this.createMenuAction(
				layerInfoText, layerInformationControl,
				"LayerInformation");

		var layerStylerContext = this.createMenuAction(
				layerStyleText, stylerControl, "StyleEdit");

		var layerZoomContext = this.createMenuAction(
				layerZoomText, zoomToLayerControl,
				"ZoomToLayer");
		var layerOpacityContext = this
				.getOpacitySliderContextMenu(
						layerOpacityMenuText, layer);
		exporterWFS.closed = false;
		var csvExporterContext = this.createMenuAction(
				layerExportMenuText, exporterWFS, "ExportWFS");
		var gmlExporterContext = this.createMenuAction(
				layerExportToGMLMenuText, layerExporterControl,
				"ExportToGML");
		// Delete Layer
		if ((Sicecat.GROUP_IDS.SUPERADMIN == layer.groupID 
				&& (Sicecat.user.permisos.indexOf("admin1") > -1))
			|| (Sicecat.GROUP_IDS.CECAT == layer.groupID 
					&& (Sicecat.user.permisos.indexOf("admin2") > -1))
			|| ((Sicecat.GROUP_IDS.GPCL == layer.groupID)
					&& (Sicecat.user.permisos.indexOf("admin2") > -1))
			|| (!layer.groupID 
					//&& layer.userID == Sicecat.user.login
					)
			){
				items.push(layerDeleteContext);
		}


		if(!!layer.layerID){
			if (layer instanceof OpenLayers.Layer.WMS
				&& !(layer instanceof SiceCAT.Layer.WMS_SIGESCAT)) {
				items.push(layerInfoContext);
				items.push(layerZoomContext);
                
                // Comprobacion para una capa WFS-T
			} else if (layer instanceof OpenLayers.Layer.Vector
					&& !!layer.protocol
					&& !!(layer.protocol.format)
					&& ((layer.protocol.format instanceof OpenLayers.Format.WFST.v1) // extensiones
					// de
					// v1
					|| (layer.protocol.format instanceof OpenLayers.Format.WFST.v1_0_0)) // o
			// v1_0_0
			) {
				items.push(layerInfoContext);
			}
		}
		
		
		if (layer instanceof OpenLayers.Layer.Vector) {
			if (!layer.layerFromSicecat) {
				items.push(layerStylerContext);
            }
			items.push(layerZoomContext);
        }
		if (layer instanceof OpenLayers.Layer.WMS) {
			items.push(layerOpacityContext);
		}
		if (layer instanceof OpenLayers.Layer.Vector
		// && layer.protocol //#50084 .Descomentar esta linea si
		// no se quieren exportar todas las vectoriales
		) {
			exporterWFS.setLayerToExport(layer);
			layerExporterControl.setLayerToExport(layer);
			
			if (!!layer.protocol
					&& !!(layer.protocol.format)) { // o
				// v1_0_0
				//items.push(csvExporterContext);
			} else {
                csvExporterContext.text+= this.notSupportedFormatDisabledText;
                csvExporterContext.disabled = true;
            }
		} else {
            gmlExporterContext.text+= this.noVectorDisabledText;
            gmlExporterContext.disabled = true;
            csvExporterContext.text+= this.noVectorDisabledText;
            csvExporterContext.disabled = true;
        }
        items.push(gmlExporterContext);
        items.push(csvExporterContext);
		
		if(!!layer.layerID){
			items.push(this.getRenameLayerContextMenu(
				this.renameLayerWindowText, layer));
		}

		if (!!layer.saveStrategy 
				&& !!layer.groupLayers){
			if(layer.groupLayers =='editables'){
				items.push(this.getMarkAsOcuppied(
						this.markLayerAsOccuped, 'MarkLayerAsOccupied', 
							layer));
			}else if(layer.groupLayers =='occupied'){
				items.push(this.getSaveLayerProperties(
						this.markLayerAsAvailable, 'MarkLayerAsAvailable', 
							layer, {
								inUse:false,
								occupied: false,
								available:true
							}, false, true));
			}
		}
		
		return items;
	},

	getOpacitySliderContextMenu : function(
			layerOpacityMenuText, layer) {
		var west = this;

		return {
			text : layerOpacityMenuText,
			cls : "Slider",
			handler : function() {
				var opacitySlider = west
						.getOpacitySlider(layer);

				opacitySlider.show();
			}
		};
	},

	getRenameLayerContextMenu : function(menuText, layer) {
		var west = this;

		return {
			text : menuText,
			cls : "RenameLayer",
			handler : function() {

				var window = west.getRenameLayer(layer);

				window.show();
			}
		};
	},

	/**
	 * Method: getRenameLayer
	 * 
	 * Get a window to rename a layer
	 * 
	 * Parameter
	 * 
	 * layer - <OpenLayers.Layer> to get the renamer
	 */
	getRenameLayer : function(layer) {

		var window = layer.renameLayer;
		var this_ = this;

		if (!window) {

			var newName = new Ext.form.TextField({
				value : layer.name,
				fieldLabel : this.layerText
			});

			var button = new Ext.Button(
					{
						text : this.saveLayerNameText,
						menuAlign : "b",
						cls : "formRenameLayer",
						handler : function() {
							var newValue = newName.getValue();
							layer.setName(newValue);
							if(this_.isOwnerlayer(layer)){
								PersistenceGeoParser.saveLayerName(layer.layerID, newValue,
										function(){
											if (!!integrator) {
												integrator
														.msAplSaveLayerName(new SiceCAT.Layer(
																layer.id,
																newValue));
											}
										}
								);
							} // TODO: else save layer visibility by user?
						},
						scope : this
					});

			var formPanel = new Ext.form.FormPanel({
				width : 280,
				items : [ newName ]
			});
			formPanel.addButton(button);

			window = new Ext.Window({
				title : this.renameLayerWindowText,
				width : 300,
				plain : true,
				closeAction : "hide",
				items : [ formPanel ]
			});
			layer.renameLayer = window;
		}

		return window;

	},

	getDeleteLayerContextMenu : function(menuText, layer) {
		var west = this;

		return {
			text : menuText,
			handler : function() {

				var window = west.getDeleteLayer(layer);

				window.show();
			}
		};
	},

	/**
	 * Method: createMenuAction
	 * 
	 * Obtain default contextMenu for call control.trigger()
	 * 
	 * Parameters menuText <String> - Text to show on context
	 * menu control <OpenLayers.Control> - Control to be called
	 * on click (trigger) iconCls <String> - Class for icon on
	 * context menu
	 */
	createMenuAction : function(menuText, control, iconCls) {
		return {
			text : menuText,
			itemId : menuText,
			iconCls : (!!iconCls ? iconCls : null),
			handler : function() {
				if (!!control)
					control.trigger();
			}
		};
	},

	/**
	 * Method: getLayerContextMenu
	 * 
	 * Get opacity slider of a layer
	 * 
	 * Parameter
	 * 
	 * layer - <OpenLayers.Layer> to get opacity slider
	 */
	getOpacitySlider : function(layer) {

		var opacitySlider = layer.opacitySlider;

		if (!opacitySlider) {
			if (layer instanceof OpenLayers.Layer.WMS) {
				opacitySlider = new Ext.Window(
						{
							title : String.format(
									this.layerOpacityText,
									layer.name),
							width : 300,
							height : 70,
							plain : true,
							closeAction : "hide",
							items : [ {
								xtype : "slider",
								name : "opacity",
								fieldLabel : this.opacityText,
								values : [ ((!!layer && !!layer.opacity) ? layer.opacity
										: OpenLayers.Renderer.defaultSymbolizer.strokeOpacity) * 100 ],
								isFormField : true,
								listeners : {
									changecomplete : function(
											slider, value) {
										var opacity = value / 100;
										if (!!layer
												&& layer instanceof OpenLayers.Layer.WMS) {
											layer
													.setOpacity(opacity);
											if(this_.isOwnerlayer(layer)){
												PersistenceGeoParser.saveLayerProperties(node.attributes.layer.layerID,{
													opacity: opacity
												});
											} // TODO: else save layer visibility by user?
										}
									}
								},
								plugins : [ new GeoExt.SliderTip(
										{
											getText : function(
													thumb) {
												return thumb.value
														+ "%";
											}
										}) ]
							} ]
						});
			} else {
				Ext.MessageBox.alert(String.format(
						this.layerOpacityText, layer.name),
						this.layerOpacityNotAllowText);
			}
			layer.opacitySlider = opacitySlider;
		}

		return opacitySlider;

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
	},
	
	/**
	 * Method: getSaveLayerProperties
	 * 
	 * Save layer properties in context menu handler 
	 * 
	 * @param node
	 * @param checked
	 */
	getSaveLayerProperties: function(menuText, cls, layer, properties, forzeOwner, condition){
		
		var this_ = this;

		return {
			text : menuText,
			cls : cls,
			handler : function() {

				if(!!layer && !!properties && !!condition){
					if(!forzeOwner || (!!forzeOwner && this_.isOwnerlayer(layer))){
						PersistenceGeoParser.saveLayerProperties(layer.layerID, properties);
						Sicecat.refreshLayers();
					} 
				}
			}
		};
	},

	/**
	 * Method: getSaveLayerProperties
	 * 
	 * Save layer properties in context menu handler 
	 * 
	 * @param node
	 * @param checked
	 */
	getMarkAsOcuppied: function(menuText, cls, layer){

		var this_ = this;

		return {
			text : menuText,
			cls : cls,
			handler : function() {

				if(!!layer){
					if(!!Sicecat.poolWFSAvalaibles
						&& !!layer.protocol && !!layer.protocol.geometry
						&& !!Sicecat.poolWFSAvalaibles[layer.protocol.geometry]
						&& !!Sicecat.poolWFSAvalaibles[layer.protocol.geometry].length > 0){
						var newLayer = Sicecat.poolWFSAvalaibles[layer.protocol.geometry].pop();
						PersistenceGeoParser.saveLayerProperties(newLayer.layerID, {
							occupied: false,
							available:false, 
							inUse: true
						});
						PersistenceGeoParser.saveLayerProperties(layer.layerID, {
							inUse:false,
							available:false, 
							occupied: true
						});
						Sicecat.refreshLayers();
					}else if(!!Sicecat.poolWFSAvalaibles
						&& !!layer.protocol && !!layer.protocol.geometry
						&& !!Sicecat.poolWFSAvalaibles[layer.protocol.geometry]
						&& !!Sicecat.poolWFSAvalaibles[layer.protocol.geometry].length == 0){
						Ext.MessageBox.alert(
							this_.notPoolWFSTitleText,
							String.format(this_.notPoolWFSText, layer.name,layer.protocol.geometry));
					}else{
						Ext.MessageBox.alert(
							this_.errorTitleText,
							this_.errorText);
					}
				}
			}
		};
	}
});