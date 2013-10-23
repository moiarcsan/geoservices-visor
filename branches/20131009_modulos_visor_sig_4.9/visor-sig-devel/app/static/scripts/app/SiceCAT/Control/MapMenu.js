/*
 * Class: Openlayers.Control.MapMenu 
 * 
 *  The MapMenu control is a predefined contextual menu for the map.
 * 
 * Author: 
 * 
 * Mariano López Muñoz (mlopez@emergya.com)
 * María Arias de Reyna Domínguez (marias@emergya.com)
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control> 
 * 
 * See Also: 
 * 
 * 
 */
/* MapMenu.js
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

OpenLayers.Control.MapMenu = OpenLayers
		.Class(
				OpenLayers.Control,
				{

					/*
					 * Property: CLASS_NAME
					 * 
					 * Class name, for CSS.
					 */
					CLASS_NAME : "MapMenu",

					/*
					 * Property: displayClass
					 * 
					 * Display class name, for CSS.
					 */
					displayClass : "ControlMapMenu",

					/*
					 * Property: eventsConfigured
					 * 
					 * <Array> with text events and functions to be called
					 */
					eventsConfigured : null,

					/** i18n * */
					abrirFichaText : "Open tab",
					abrirFichaDeText : "Open tab of {0}",
					enviarPosicionText : "Send position",
					enviarPosicionPosText : "Send position {0}",
					enviarElementosText : "Send Elements",
					exportarElementosText : "Export to WFS-T Layers",
					enviarOrigenRuta: "Send source route",
					enviarDestinoRuta: "Send destination route",
					openDetailsText: "Open incident details",
					hideDetailsText: "Hide incident details",
					

					init_map_menu : function() {
						var abrirFichaText = this.abrirFichaText;
						var enviarPosicionText = this.enviarPosicionText;
						var eventsConfigured = new Array();
						eventsConfigured[0] = {
							"key" : abrirFichaText,
							"function" : "msAplElementSelected"
						};
						eventsConfigured[1] = {
							"key" : enviarPosicionText,
							"function" : "msAplPointSelected"
						};
						this.eventsConfigured = eventsConfigured;
					},

					/*
					 * Property: type
					 * 
					 * Type of Control
					 */
					// type: OpenLayers.Control.TYPE_TOOL,
					initialize : function(handler, options) {
						OpenLayers.Control.prototype.initialize.apply(this,
								[ options ]);
						this.init_map_menu();
						this.activate();
					},

					closeMenu : function(e) {
						var cmenu = Ext.getCmp("mapMenu");
						if (cmenu) {
							cmenu.destroy();
						}
					},

					rightclick : function(feature, evt) {
						if(map.getLayersByName("Mark Layer").length == 0){
							var markLayer =  new OpenLayers.Layer.Markers("Mark Layer", {
          					  'displayInLayerSwitcher': false
          				  });
							map.addLayer(markLayer);
						}
						var items = new Array();
						var isFeatureFromSicecat = this.isFeatureFromSicecat(feature);
						if (isFeatureFromSicecat) {
							items.push(this.getOpenTabItem(feature));
						}
						items.push(this.getSendPositionItem(evt));
						items.push(this.getSendRoute(evt, "source"));
						items.push(this.getSendRoute(evt, "target"));
						if (!!Sicecat.featuresSelected
								&& Sicecat.featuresSelected.length > 0) {
							//if (Sicecat.featuresSelected.length == 1 // Quitado
							if (Sicecat.featuresSelected.length > 0 // Quitar
									// length si se quiere permitir la seleccion
									// multiple de elementos no SICECAT. #57417
									|| this
											.isSicecatList(Sicecat.featuresSelected)) {
								items[items.length] = this.getSendElementsItem(
										evt, Sicecat.featuresSelected);
							}
							if (!!Sicecat.permisos
									&& !!Sicecat.permisos.editWFS) {
								items[items.length] = this
										.getExportElementsItem(evt,
												Sicecat.featuresSelected);
							}
						}
						if (isFeatureFromSicecat == integrator.ELEMENT_TYPE_INCIDENTE) {
							items.push(this.getOpenHideDetails(evt, feature));
						}
						this.showMenuItems(items, evt.xy[0], evt.xy[1], evt
								.getTarget());
						return true;
					},

					isSicecatList : function(list) {
						for ( var i = 0; i < list.length; i++) {
							var feature = list[i];
							if (!this.isFeatureFromSicecat(feature)) {
								return false;
							}
						}
						return true;
					},

					isFeatureFromSicecat : function(feature) {
						if(feature != null
								&& feature.data != null
								&& feature.data.type != null
								&& feature.data.pk_id > 0){
							return feature.data.type;
						}else{
							return false;
						}
					},

					rightclicknofeature : function(evt) {
						this.showMenuItems([ this.getSendPositionItem(evt) ],
								evt.xy[0], evt.xy[1], evt.getTarget());
						return true;
					},

					getOpenTabItem : function(feature) {
						var posX = feature.geometry.x;
						var posY = feature.geometry.y;
						var id = feature.data.pk_id;
						var tipo = feature.data.type;
						var direccion = null;
						var municipio = null;
						var comarca = null;
						var list = null;
						return new Ext.menu.Item({
							text : this.abrirFichaText,
							handler : function() {
								integrator.msAplElementSelected(posX, posY, id,
										tipo);
							}
						});
					},
					
					getSendRoute: function(evt, type){
						var this_ = this;
						var mapDiv = Ext.get(map.div);
						var evtX = evt.xy[0];
						var evtY = evt.xy[1];
						var x = evtX - mapDiv.getX();
						var y = evtY - mapDiv.getY();
						var pixel = new OpenLayers.Pixel(x, y);
						var bounds = integrator.pixelToBounds(pixel);
						var posX = bounds.getCenterLonLat().lon;
						var posY = bounds.getCenterLonLat().lat;
						var title = null;
						if(type == "source"){
							title = this.enviarOrigenRuta;
						}else if(type == "target"){
							title = this.enviarDestinoRuta;
						}
						return new Ext.menu.Item({
							text : title,
							handler : function() {
								var accordionWest = Ext.getCmp("accordionWest").layout;
								accordionWest.setActiveItem("routing");
								var size = new OpenLayers.Size(25, 28);
								var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
								if(map.getLayersByName("Geometry Path").length >0){
	            					  map.removeLayer(map.getLayersByName("Geometry Path")[0]);
	            				}
								var markLayer = map.getLayersByName("Mark Layer")[0];
								var marksToDelete = [];
								if(type == "source"){
									var icon = new OpenLayers.Icon(
											'http://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
											size, 
											offset);
									var mark = new OpenLayers.Marker(new OpenLayers.LonLat(posX, posY), icon);
									mark.routeID = "source_mark";
									if(markLayer.markers.length > 0){
										Ext.each(markLayer.markers, function(m){
											if(m.routeID == "source_mark"){
												marksToDelete.push(m);
											}
										});
										Ext.each(marksToDelete, function(mtd){
											markLayer.removeMarker(mtd);
										});
										marksToDelete = [];
										markLayer.addMarker(mark);
									}else{
										markLayer.addMarker(mark);
									}
									var fromField = Ext.getCmp("fromRoute");
									fromField.setValue(posX + " - " + posY);
								}else if (type == "target"){
									var icon = new OpenLayers.Icon(
											'http://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
											size, 
											offset);
									var mark = new OpenLayers.Marker(new OpenLayers.LonLat(posX, posY), icon);
									mark.routeID = "target_mark";
									if(markLayer.markers.length > 0){
										Ext.each(markLayer.markers, function(m){
											if(m.routeID == "target_mark"){
												marksToDelete.push(m);
											}
										});
										Ext.each(marksToDelete, function(mtd){
											markLayer.removeMarker(mtd);
										});
										marksToDelete = [];
										markLayer.addMarker(mark);
									}else{
										markLayer.addMarker(mark);
									}
									var toField = Ext.getCmp("toRoute");
									toField.setValue(posX + " - " + posY);
								}
							}
						});
					},

					getSendPositionItem : function(evt) {
						var mapDiv = Ext.get(map.div);
						var evtX = evt.xy[0];
						var evtY = evt.xy[1];
						var x = evtX - mapDiv.getX();
						var y = evtY - mapDiv.getY();
						this.stopUp = true;
						OpenLayers.Event.stop(evt, true);
						evt.preventDefault();
						var pixel = new OpenLayers.Pixel(x, y);
						var bounds = integrator.pixelToBounds(pixel);
						var posX = bounds.getCenterLonLat().lon;
						var posY = bounds.getCenterLonLat().lat;
						var items = new Array();
						return new Ext.menu.Item({
							text : this.enviarPosicionText,
							handler : function() {
								integrator.msAplPointSelected(posX, posY);
							}
						});
					},

					getSendElementsItem : function(evt, features) {
						this.stopUp = true;
						OpenLayers.Event.stop(evt, true);
						evt.preventDefault();
						return new Ext.menu.Item({
							text : this.enviarElementosText,
							handler : function() {
								integrator.msjAplListSelected(features);
							}
						});
					},

					getExportElementsItem : function(evt, features) {
						this.stopUp = true;
						OpenLayers.Event.stop(evt, true);
						evt.preventDefault();
						return new Ext.menu.Item(
								{
									text : this.exportarElementosText,
									handler : function() {
										SiceCAT.widgets.CopyFeaturesPanel.prototype.sicecatInstance = Sicecat;
										SiceCAT.widgets.CopyFeaturesPanel.prototype.initDestinyLayers();
										SiceCAT.widgets.CopyFeaturesPanel.prototype.exportToLayers();
									}
								});
					},

					showMenuItems : function(items, x, y, target) {
						this.closeMenu();

						var cmenu = new Ext.menu.Menu({
							id : "mapMenu",
							target : target,
							items : items
						});
						cmenu.showAt([ x, y ]);
					},

					showMenu : function(e) {
						e.preventDefault();

						var feature = integrator.getFeatureFromEvent(e);

						var control = null;
						Ext.each(map.controls, function(c) {
							if (c.CLASS_NAME == "MapMenu")
								control = c;
						});

						control.rightclick(feature, e);

					},

					getOpenHideDetails : function(evt, feature) {
						this.stopUp = true;
						OpenLayers.Event.stop(evt, true);
						evt.preventDefault();
						var layerDetails = (!!integrator.incidentsDetailsMap[feature.data.sicecat_feature.id]) ?
								integrator.incidentsDetailsMap[feature.data.sicecat_feature.id]["all"]: null;
						console.log(layerDetails);
						if(!!layerDetails){
							return new Ext.menu.Item({
								text : this.hideDetailsText,
								handler : function() {
									integrator.msIntRemoveElements(feature.data.sicecat_feature.id, "all");
								}
							});
						}else{
							return new Ext.menu.Item({
								text : this.openDetailsText,
								handler : function() {
									integrator.msIntGetElements(feature.data.sicecat_feature.id, "all");
								}
							});
						}
					},

					setMap : function(map) {
						OpenLayers.Control.prototype.setMap
								.apply(this, [ map ]);

						Ext.get(map.div).on("contextmenu", this.showMenu);
						Ext.get(map.div).on("click", this.closeMenu);
					}
				});
