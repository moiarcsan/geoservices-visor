/*
 * OpenLayers.Control.LayerInformation.js
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
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.LayerInformation
 * 
 * Get layer information
 * 
 * It is designed to be used with a <OpenLayers.Control.Panel>
 * 
 * Inherits from: - <OpenLayers.Control>
 * 
 * See also: - <AuxilaryLayer>
 */
OpenLayers.Control.LayerInformation = OpenLayers
		.Class(
				OpenLayers.Control,
				{

					/**
					 * Property: type {String} The type of <OpenLayers.Control> --
					 * When added to a <Control.Panel>, 'type' is used by the
					 * panel to determine how to handle our events.
					 */
					type : OpenLayers.Control.TYPE_BUTTON,

					/**
					 * Property: sicecatInstance
					 * 
					 * {SiceCAT} instance of application
					 */
					sicecatInstance : null,

					/**
					 * api: config[closest] ``Boolean`` Find the zoom level that
					 * most closely fits the specified extent. Note that this
					 * may result in a zoom that does not exactly contain the
					 * entire extent. Default is true.
					 */
					closest : true,

					/** i18n */
					titleLayerText : "Title",
					nameLayerText : "Name",
					queryableLayerText : "Queryable",
					opaqueLayerText : "Opaque",
					nameSpace : "FeatureNS",
					bbox : "BBox",
					noSubsetsLayerText : "No subsets",
					cascadedLayerText : "Cascaded",
					prefixLayerText : "Prefix",
					descriptionLayerText : "Description",
					previewLayerText : "Preview of '{0}' layer",
					capabilitiesTitleText : "Informaci�n sobre capa WMS '{0}'",
					capabilitiesTitleTextLayerSelected : "Informaci�n sobre la capa seleccionada",
					capabilitiesListLayer : "Informaci�n sobre el resto de capas cargadas",
					capabilitiesListProperties: "Informaci�n sobre los atributos de la capa",
					type: "Tipo",
					alertMessageTitle: "Advertencia",
					alertMessageContent: "No se ha podido cargar la informaci�n de la capa",

					/** i18n */
					nameHeaderField : "Property",
					valueHeaderField : "Value",

					/**
					 * Property: layer
					 * 
					 * {OpenLayers.Layer} to get information
					 */
					layer : null,
					
					myMask: null,

					/*
					 * Method: trigger Do the zoom to selected features.
					 */
					trigger : function() {
						var layerURLTest = null;
						if(!this.layer.url){
							layerURLTest = this.prepareURL(this.layer.protocol.url);
						}else{
							layerURLTest = this.prepareURL(this.layer.url);
						}
						var this_layerInfo = this;
						Sicecat.testLayerInformation(layerURLTest, map, this.layer, function(){
							this_layerInfo.myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading ..."});
							if (!!this_layerInfo.layer) {
								this_layerInfo.myMask.enable(true);
								this_layerInfo.myMask.show();
								this_layerInfo.showLayerInformation(this_layerInfo.layer);
							}
						});
					},

					showLayerInformation : function(layer) {
						if (layer.informationWindow) {
							layer.informationWindow.show();
							this.myMask.hide();
						} else {
							if (layer instanceof OpenLayers.Layer.WMS) {
								layer.informationWindow = this
										.getCapabilitiesWMS(layer);
							} else if (layer instanceof OpenLayers.Layer.Vector){
								layer.informationWindow = this.getCapabilitiesVectorProtocolWFS(layer);
							}
						}
					},
					
					prepareURL: function(url){
						var urlSinProxy = null;
						var ret = null;
						if(url.indexOf(OpenLayers.ProxyHost)!=-1){
							urlSinProxy = url.replace(OpenLayers.ProxyHost, "");
						}else{
							urlSinProxy = url;
						}
						if(urlSinProxy != null){
							/* GetURLProxy */
							if(urlSinProxy.indexOf("?")!=-1){
								ret = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, urlSinProxy.replace("?", "&"));
							}else{
								if(urlSinProxy.charAt(urlSinProxy.length-1) != "&"){
									ret = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, urlSinProxy + "&");
								}else{
									ret = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, urlSinProxy);
								}
							}
						}
						return ret;
					},
					
					/**
					 * Method: getCapabilitiesWFS
					 * 
					 * Shows and return a grid panel with WFS getCapabilites
					 * request
					 * 
					 * Parameters layer - <OpenLayers.Layer.Vector> to obtain
					 * capabilities
					 */
					
					getCapabilitiesVectorProtocolWFS : function(layer){
						var informationPanel;
						var titleInformationPanel;
						var htmlInformationLayerSelected;
						var grid;
						var gridSelectedLayer;
						var titleWindow;
						var layerURL = this.prepareURL(layer.protocol.url);

						titleInformationPanel = String.format(
								this.capabilitiesTitleTextLayerSelected,
								layer.name);

						titleWindow = String.format(
								this.capabilitiesTitleText, layer.name);
						
						var urlVectorWFS = layerURL
						+ "request=DescribeFeatureType&typeName="
						+ layer.protocol.featurePrefix +":"
						+ layer.protocol.featureType;

						var store = new SiceCAT.Control.WFSCapabilitiesVectorStore({
							url : urlVectorWFS
						});
						// load the store with records derived from the doc at
						// the above url
						store.load();

						// create a grid to display records from the store
						grid = new Ext.grid.GridPanel({
							title : this.capabilitiesListProperties,
							store : store,
							columns : [{
								header : this.nameLayerText,
								dataIndex : "name",
								sortable : true,
								width: 400
							},{
								header : this.type,
								dataIndex : "type",
								sortable : true,
								width: 400
							}],
							height : 300,
							width : 800,
							listeners : {
								rowdblclick : this.mapPreview,
								scope : this
							}
						});

						var storeSelectedLayer = new SiceCAT.Control.WFSServiceStore(
								{
									url : layerURL
											+ "request=getCapabilities&layerName=" + escape(layer.name)
											+ "&layerUrl=" + escape(layerURL) 
											+ "&layerMaxExtent=" + escape(layer.maxExtent.toString())
								});

						storeSelectedLayer.load();

						gridSelectedLayer = new Ext.grid.GridPanel({
							title : this.capabilitiesTitleTextLayerSelected,
							store : storeSelectedLayer,
							columns : [ {
								header : this.nameHeaderField,
								dataIndex : "nameField",
								width: 400
							}, {
								header : this.valueHeaderField,
								dataIndex : "valueField",
								width: 400
							} ],
							height : 200,
							width : 790
						});
						var maskWFS =this.myMask;
						var capabilitiesWin = new Ext.Window({
							title : titleWindow,
							height : gridSelectedLayer.height + grid.height
									+ 20,
							width : grid.width + 10,
							shadow : false,
							plain : true,
							closeAction : "hide",
							listeners: {
								'afterrender': function(){
									maskWFS.hide();
								}
							},
							items : [gridSelectedLayer,grid ]
						});

						capabilitiesWin.show();
						return capabilitiesWin;
					},

					/**
					 * Method: getCapabilitiesWMS
					 * 
					 * Shows and return a grid panel with WMS getCapabilites
					 * request
					 * 
					 * Parameters layer - <OpenLayers.Layer.WMS> to obtain
					 * capabilities
					 */
					getCapabilitiesWMS : function(layer) {
						var informationPanel;
						var titleInformationPanel;
						var htmlInformationLayerSelected;
						var grid;
						var gridSelectedLayer;
						var titleWindow;
						var layerURL = this.prepareURL(layer.url);
						
						this.grid = null;
						this.gridSelectedLayer = null;
						
						titleInformationPanel = String.format(
								this.capabilitiesTitleTextLayerSelected,
								layer.name);

						// create a new WMS capabilities store
						this.titleWindow = String.format(
								this.capabilitiesTitleText, layer.name);
						
						var url1 = layerURL;
						
						if(url1.charAt(url1.length-1) != "?"){
							if(url1.charAt(url1.length-1) != "&"){
								url1 = url1 + "?request=getCapabilities";
							}else{
								url1 = url1 + "request=getCapabilities";
							}
						}else{
							url1 = url1 + "request=getCapabilities";
						}
						url1=url1+"&SERVICE=WMS";

						var store = new GeoExt.data.WMSCapabilitiesStore({
							url : url1,
							listeners: {
								load: this.loadLayerInformationGrid2,
								scope: this
							}
						});
						// load the store with records derived from the doc at
						// the above url
						store.load();
						
						var url = layerURL;
						
						if(url.charAt(url.length-1) != "?"){
							if(url.charAt(url.length-1) != "&"){
								url = url + "?request=getCapabilities&layerName=";
							}else{
								url = url + "request=getCapabilities&layerName=";
							}
						}else{
							url = url + "request=getCapabilities&layerName=";
						}
						url = url + escape(layer.name) + "&layerUrl="
						+ escape(layerURL) + "&layerMaxExtent="
						+ escape(layer.maxExtent.toString())+"&SERVICE=WMS";

						var storeSelectedLayer = new SiceCAT.Control.WMSServiceStore(
								{
									url : url,
									listeners: {
										load: this.loadLayerInformationGrid1,
										scope: this
									}
								});

						storeSelectedLayer.load();
					},
					
					loadLayerInformationGrid2: function(store, records, options){
						if(!!records && records.length != 0){
							// create a grid to display records from the store
							this.grid = new Ext.grid.GridPanel({
								title : this.capabilitiesListLayer,
								store : store,
								columns : [ {
									header : this.titleLayerText,
									dataIndex : "title",
									sortable : true
								}, {
									header : this.nameLayerText,
									dataIndex : "name",
									sortable : true
								}, {
									header : this.prefixLayerText,
									dataIndex : "prefix",
									sortable : true
								}, {
									header : this.queryableLayerText,
									dataIndex : "queryable",
									sortable : true,
									width : 70
								}, {
									header : this.opaqueLayerText,
									dataIndex : "opaque",
									sortable : true
								}, {
									header : this.noSubsetsLayerText,
									dataIndex : "noSubsets",
									sortable : true
								}, {
									header : this.cascadedLayerText,
									dataIndex : "cascaded",
									sortable : true
								}, {
									id : "description",
									header : this.descriptionLayerText,
									dataIndex : "abstract"
								} ],
								autoExpandColumn : "description",
								height : 300,
								width : 800,
								listeners : {
									rowdblclick : this.mapPreview,
									scope : this
								}
							});
							this.openCapabilitiesWin();
						}else{
							this.myMask.hide();
							Ext.Msg.alert(this.alertMessageTitle, this.alertMessageContent);
						}
						
					},
					
					loadLayerInformationGrid1: function(store, records, options){
						if(!!records && records.length != 0){
							this.gridSelectedLayer = new Ext.grid.GridPanel({
								title : this.capabilitiesTitleTextLayerSelected,
								store : store,
								columns : [ {
									header : this.nameHeaderField,
									dataIndex : "nameField",
									width: 400
								}, {
									header : this.valueHeaderField,
									dataIndex : "valueField",
									width: 400
								} ],
								height : 200,
								width : 790
							});
							this.openCapabilitiesWin();
						}else{
							this.myMask.hide();
							Ext.Msg.alert(this.alertMessageTitle, this.alertMessageContent);
						}
						
					},
					
					openCapabilitiesWin: function(){
						var maskWMS = this.myMask;
						if(!!this.gridSelectedLayer && !!this.grid){
							var capabilitiesWin = new Ext.Window({
								title : this.titleWindow,
								height : this.gridSelectedLayer.height + this.grid.height
										+ 20,
								width : this.grid.width + 10,
								shadow : false,
								plain : true,
								closeAction : "hide",
								listeners: {
									'afterrender': function(){
										maskWMS.hide();
									}
								},
								items : [ this.gridSelectedLayer, this.grid ]
							});
	
							capabilitiesWin.show();
							return capabilitiesWin;
						}else{
							return null;
						}
					},

					/**
					 * Method: mapPreview
					 * 
					 * Shows map preview of a layer
					 * 
					 * Parameters grid - <Ext.grid.GridPanel> grid with layers
					 * information index - <Integer> with layer index to load
					 */
					mapPreview : function(grid, index) {
						var record = grid.getStore().getAt(index);
						var layer = record.getLayer().clone();
						layer.url = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.ALFANUMERICA, layer.url);
						layer.url = Sicecat.getUrlSecurized(layer.url);

						var win = new Ext.Window({
							title : String.format(this.previewLayerText, record
									.get("title")),
							width : 512,
							height : 256,
							layout : "fit",
							items : [ {
								xtype : "gx_mappanel",
								layers : [ layer ],
								extent : record.get("llbbox")
							} ]
						});
						win.show();
					},

					CLASS_NAME : "OpenLayers.Control.ZoomToLayer"
				});
