/*
 * RootContainer.js
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
 * Class: SiceCAT.Layer.Vector.RootContainer
 * 
 * Use instead of <OpenLayers.Layer.Vector.RootContainer> because of issues when using 
 * different handlers on this layer and its children. I use the code of <OpenLayers.Layer.Vector.RootContainer>
 * as the background for it.
 * 
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Layer.Vector>
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
 *  María Arias de Reyna Domínguez(marias@emergya.com)
 */
/**
 * @requires OpenLayers/Layer/Vector.js
 */

/**
 * Class: OpenLayers.Layer.Vector.RootContainer A special layer type to combine
 * multiple vector layers inside a single renderer root container. This class is
 * *supposed* to be instantiated from user space, it is a helper class for
 * controls that require event processing for multiple vector layers.
 * 
 * Inherits from: - <OpenLayers.Layer.Vector>
 */

if (!SiceCAT.Layer)
	SiceCAT.Layer = {};
if (!SiceCAT.Layer.Vector)
	SiceCAT.Layer.Vector = {};

SiceCAT.Layer.Vector.RootContainer = OpenLayers
		.Class(
				OpenLayers.Layer.Vector,
				{

					/**
					 * Property: displayInLayerSwitcher Set to false for this
					 * layer type
					 */
					displayInLayerSwitcher : false,

					/**
					 * APIProperty: layers Layers that are attached to this
					 * container. Required config option.
					 */
					layers : null,

					/**
					 * Constructor: OpenLayers.Layer.Vector.RootContainer Create
					 * a new root container for multiple vector layer. This
					 * constructor is not supposed to be used from user space,
					 * it is only to be used by controls that need feature
					 * selection across multiple vector layers.
					 * 
					 * Parameters: name - {String} A name for the layer options -
					 * {Object} Optional object with non-default properties to
					 * set on the layer.
					 * 
					 * Required options properties: layers - {Array(<OpenLayers.Layer.Vector>)}
					 * The layers managed by this container
					 * 
					 * Returns: {<OpenLayers.Layer.Vector.RootContainer>} A new
					 * vector layer root container
					 */
					initialize : function(name, options) {
						OpenLayers.Layer.Vector.prototype.initialize.apply(
								this, arguments);
					},

					/**
					 * Method: display
					 */
					display : function() {
					},

					/**
					 * Method: getFeatureFromEvent walk through the layers to
					 * find the feature returned by the event
					 * 
					 * Parameters: evt - {Object} event object with a feature
					 * property
					 * 
					 * Returns: {<OpenLayers.Feature.Vector>}
					 */
					getFeatureFromEvent : function(evt) {
						var layers = this.layers;
						var feature;
						for ( var i = 0; i < layers.length; i++) {
							feature = layers[i].getFeatureFromEvent(evt);
							if (feature) {
								return feature;
							}
						}
					},

					/**
					 * Method: setMap
					 * 
					 * Parameters: map - {<OpenLayers.Map>}
					 */
					setMap : function(map) {
						OpenLayers.Layer.Vector.prototype.setMap.apply(this,
								arguments);
						this.collectRoots();
						map.events.register("changelayer", this,
								this.handleChangeLayer);
					},

					/**
					 * Method: removeMap
					 * 
					 * Parameters: map - {<OpenLayers.Map>}
					 */
					removeMap : function(map) {
						map.events.unregister("changelayer", this,
								this.handleChangeLayer);
						this.resetRoots();
						OpenLayers.Layer.Vector.prototype.removeMap.apply(this,
								arguments);
					},

					/**
					 * Method: collectRoots Collects the root nodes of all
					 * layers this control is configured with and moveswien the
					 * nodes to this control's layer
					 */
					collectRoots : function() {
						if(Sicecat.isLogEnable) console.log("collectRoots()");

						var layer;
						// walk through all map layers, because we want to keep
						// the order
						for ( var i = 0; i < this.map.layers.length; ++i) {
							layer = this.map.layers[i];
							if (OpenLayers.Util.indexOf(this.layers, layer) != -1) {
								layer.renderer.moveRoot(this.renderer);
							}
						}
					},

					/**
					 * Method: resetRoots Resets the root nodes back into the
					 * layers they belong to.
					 */
					resetRoots : function() {
						if(Sicecat.isLogEnable) console.log("resetRoots()");
						var layer;
						for ( var i = 0; i < this.layers.length; ++i) {
							layer = this.layers[i];
							if (layer.renderer != null
									&& this.renderer
									&& layer.renderer.getRenderLayerId() == this.id) {
								this.renderer.moveRoot(layer.renderer);
							}
						}
					},

					/**
					 * Method: handleChangeLayer Event handler for the map's
					 * changelayer event. We need to rebuild this container's
					 * layer dom if order of one of its layers changes. This
					 * handler is added with the setMap method, and removed with
					 * the removeMap method.
					 * 
					 * Parameters: evt - {Object}
					 */
					handleChangeLayer : function(evt) {
						var layer = evt.layer;
						if (evt.property == "order"
								&& OpenLayers.Util.indexOf(this.layers, layer) != -1) {
							this.resetRoots();
							this.collectRoots();
						}
					},
					CLASS_NAME : "SiceCAT.Layer.Vector.RootContainer"
				});
