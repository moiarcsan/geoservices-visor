/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: OpenLayers.Handler.Feature 
 * Handler to respond to mouse events related to a drawn feature.  Callbacks
 *     with the following keys will be notified of the following events
 *     associated with features: click, clickout, over, out, and dblclick.
 *
 * This handler stops event propagation for mousedown and mouseup if those
 *     browser events target features that can be selected.
 */
OpenLayers.Handler.Feature = OpenLayers.Class(OpenLayers.Handler, {

    /**
     * Property: EVENTMAP
     * {Object} A object mapping the browser events to objects with callback
     *     keys for in and out.
     */
    EVENTMAP: {
        'click': {'in': 'click', 'out': 'clickout'},
        'mousemove': {'in': 'over', 'out': 'out'},
        'dblclick': {'in': 'dblclick', 'out': null},
        'mousedown': {'in': null, 'out': null},
        'mouseup': {'in': null, 'out': null},
        'touchstart': {'in': 'click', 'out': 'clickout'}
    },

    /**
     * Property: feature
     * {<OpenLayers.Feature.Vector>} The last feature that was hovered.
     */
    feature: null,

    /**
     * Property: lastFeature
     * {<OpenLayers.Feature.Vector>} The last feature that was handled.
     */
    lastFeature: null,

    /**
     * Property: down
     * {<OpenLayers.Pixel>} The location of the last mousedown.
     */
    down: null,

    /**
     * Property: up
     * {<OpenLayers.Pixel>} The location of the last mouseup.
     */
    up: null,

    /**
     * Property: touch
     * {Boolean} When a touchstart event is fired, touch will be true and all
     *     mouse related listeners will do nothing.
     */
    touch: false,
    
    /**
     * Property: clickTolerance
     * {Number} The number of pixels the mouse can move between mousedown
     *     and mouseup for the event to still be considered a click.
     *     Dragging the map should not trigger the click and clickout callbacks
     *     unless the map is moved by less than this tolerance. Defaults to 4.
     */
    clickTolerance: 4,

    /**
     * Property: geometryTypes
     * To restrict dragging to a limited set of geometry types, send a list
     * of strings corresponding to the geometry class names.
     * 
     * @type Array(String)
     */
    geometryTypes: null,

    /**
     * Property: stopClick
     * {Boolean} If stopClick is set to true, handled clicks do not
     *      propagate to other click listeners. Otherwise, handled clicks
     *      do propagate. Unhandled clicks always propagate, whatever the
     *      value of stopClick. Defaults to true.
     */
    stopClick: false,

    /**
     * Property: stopDown
     * {Boolean} If stopDown is set to true, handled mousedowns do not
     *      propagate to other mousedown listeners. Otherwise, handled
     *      mousedowns do propagate. Unhandled mousedowns always propagate,
     *      whatever the value of stopDown. Defaults to false.
     */
    stopDown: false,

    /**
     * Property: stopUp
     * {Boolean} If stopUp is set to true, handled mouseups do not
     *      propagate to other mouseup listeners. Otherwise, handled mouseups
     *      do propagate. Unhandled mouseups always propagate, whatever the
     *      value of stopUp. Defaults to false.
     */
    stopUp: false,

    /**
     * Property: stopRightClick
     * {Boolean} If stopRightClick is set to true, handled mousedown with rightClick do not
     *      propagate to other mousedown listeners. Otherwise, handled mousedown
     *      do propagate. Unhandled mouseups always propagate, whatever the
     *      value of stopRightClick. Defaults to true.
     */
    stopRightClick: false,

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
    
    /**
     * Constructor: OpenLayers.Handler.Feature
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * layer - {<OpenLayers.Layer.Vector>}
     * callbacks - {Object} An object with a 'over' property whos value is
     *     a function to be called when the mouse is over a feature. The 
     *     callback should expect to recieve a single argument, the feature.
     * options - {Object} 
     */
    initialize: function(control, layer, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
        this.layer = layer;
    },

    /**
     * Method: touchstart
     * Handle touchstart events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchstart: function(evt) {
        if(!this.touch) {
            this.touch =  true;
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                dblclick: this.dblclick,
                scope: this
            });
        }
        return OpenLayers.Event.isMultiTouch(evt) ?
                true : this.mousedown(evt);
    },

    /**
     * Method: touchmove
     * Handle touchmove events. We just prevent the browser default behavior,
     *    for Android Webkit not to select text when moving the finger after
     *    selecting a feature.
     *
     * Parameters:
     * evt - {Event}
     */
    touchmove: function(evt) {
        OpenLayers.Event.stop(evt);
    },

    /**
     * Method: mousedown
     * Handle mouse down.  Stop propagation if a feature is targeted by this
     *     event (stops map dragging during feature selection).
     * 
     * Parameters:
     * evt - {Event} 
     */
    mousedown: function(evt) {
        this.down = evt.xy;
        if(OpenLayers.Event.isRightClick(evt)){
        	return this.handle(evt) ? !this.stopRightClick: true;
        }else{
        	return this.handle(evt) ? !this.stopDown : true;
        }
    },
    
    /**
     * Method: mouseup
     * Handle mouse up.  Stop propagation if a feature is targeted by this
     *     event.
     * 
     * Parameters:
     * evt - {Event} 
     */
    mouseup: function(evt) {
        this.up = evt.xy;
        return this.handle(evt) ? !this.stopUp : true;
    },

    /**
     * Method: click
     * Handle click.  Call the "click" callback if click on a feature,
     *     or the "clickout" callback if click outside any feature.
     * 
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean}
     */
    click: function(evt) {
        return this.handle(evt) ? !this.stopClick : true;
    },
        
    /**
     * Method: mousemove
     * Handle mouse moves.  Call the "over" callback if moving in to a feature,
     *     or the "out" callback if moving out of a feature.
     * 
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean}
     */
    mousemove: function(evt) {
        if (!this.callbacks['over'] && !this.callbacks['out']) {
            return true;
        }     
        this.handle(evt);
        return true;
    },
    
    /**
     * Method: dblclick
     * Handle dblclick.  Call the "dblclick" callback if dblclick on a feature.
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean}
     */
    dblclick: function(evt) {
        return !this.handle(evt);
    },

    /**
     * Method: geometryTypeMatches
     * Return true if the geometry type of the passed feature matches
     *     one of the geometry types in the geometryTypes array.
     *
     * Parameters:
     * feature - {<OpenLayers.Vector.Feature>}
     *
     * Returns:
     * {Boolean}
     */
    geometryTypeMatches: function(feature) {
        return this.geometryTypes == null ||
            OpenLayers.Util.indexOf(this.geometryTypes,
                                    feature.geometry.CLASS_NAME) > -1;
    },

    /**
     * Method: handle
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} The event occurred over a relevant feature.
     */
    handle: function(evt) {
        if(this.feature && !this.feature.layer) {
            // feature has been destroyed
            this.feature = null;
        }
        var type = evt.type;
        
        //console.log(type);
        
        var handled = false;
        var previouslyIn = !!(this.feature); // previously in a feature
        var click = (type == "click" || type == "dblclick" || type == "touchstart");
        this.feature = this.layer.getFeatureFromEvent(evt);
        if(this.feature && !this.feature.layer) {
            // feature has been destroyed
            this.feature = null;
        }
        if(this.lastFeature && !this.lastFeature.layer) {
            // last feature has been destroyed
            this.lastFeature = null;
        }
        if(OpenLayers.Event.isRightClick(evt)){
        	//console.log("rigth!!!");
    		//OpenLayers.Event.stop(evt, false);
        	if(this.feature){
        		this.rightclick(this.feature, evt);
        	}else{
        		this.rightclick(null, evt);
        	}
        }else if(this.feature) {
        	this.feature.parentEvt = evt;
            if(type === "touchstart") {
                // stop the event to prevent Android Webkit from
                // "flashing" the map div
                //OpenLayers.Event.stop(evt);
            }
            var inNew = (this.feature != this.lastFeature);
            if(this.geometryTypeMatches(this.feature)) {
                // in to a feature
                if(previouslyIn && inNew) {
                    // out of last feature and in to another
                    if(this.lastFeature) {
                        this.triggerCallback(type, 'out', [this.lastFeature]);
                    }
                    this.triggerCallback(type, 'in', [this.feature]);
                } else if(!previouslyIn || click) {
                    // in feature for the first time
                    this.triggerCallback(type, 'in', [this.feature]);
                }
                this.lastFeature = this.feature;
                handled = true;
            } else {
                // not in to a feature
                if(this.lastFeature && (previouslyIn && inNew || click)) {
                    // out of last feature for the first time
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                }
                // next time the mouse goes in a feature whose geometry type
                // doesn't match we don't want to call the 'out' callback
                // again, so let's set this.feature to null so that
                // previouslyIn will evaluate to false the next time
                // we enter handle. Yes, a bit hackish...
                this.feature = null;
            }
        } else {
            if(this.lastFeature && (previouslyIn || click)) {
                this.triggerCallback(type, 'out', [this.lastFeature]);
            }
        }
        return handled;
    },
    
    /**
     * Method: triggerCallback
     * Call the callback keyed in the event map with the supplied arguments.
     *     For click and clickout, the <clickTolerance> is checked first.
     *
     * Parameters:
     * type - {String}
     */
    triggerCallback: function(type, mode, args) {
        var key = this.EVENTMAP[type][mode];
        if(key) {
            if(type == 'click' && this.up && this.down) {
                // for click/clickout, only trigger callback if tolerance is met
                var dpx = Math.sqrt(
                    Math.pow(this.up.x - this.down.x, 2) +
                    Math.pow(this.up.y - this.down.y, 2)
                );
                if(dpx <= this.clickTolerance) {
                    this.callback(key, args);
                }
            } else {
                this.callback(key, args);
            }
        }
    },

    /**
     * Method: activate 
     * Turn on the handler.  Returns false if the handler was already active.
     *
     * Returns:
     * {Boolean}
     */
    activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.moveLayerToTop();
            this.map.events.on({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            activated = true;
        }
        return activated;
    },
    
    /**
     * Method: deactivate 
     * Turn off the handler.  Returns false if the handler was already active.
     *
     * Returns: 
     * {Boolean}
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.moveLayerBack();
            this.feature = null;
            this.lastFeature = null;
            this.down = null;
            this.up = null;
            this.touch = false;
            this.map.events.un({
                "removelayer": this.handleMapEvents,
                "changelayer": this.handleMapEvents,
                scope: this
            });
            deactivated = true;
        }
        return deactivated;
    },
    
    /**
     * Method handleMapEvents
     * 
     * Parameters:
     * evt - {Object}
     */
    handleMapEvents: function(evt) {
        if (evt.type == "removelayer" || evt.property == "order") {
            this.moveLayerToTop();
        }
    },
    
    /**
     * Method: moveLayerToTop
     * Moves the layer for this handler to the top, so mouse events can reach
     * it.
     */
    moveLayerToTop: function() {
        var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1,
            this.layer.getZIndex()) + 1;
        this.layer.setZIndex(index);
        
    },
    
    /**
     * Method: moveLayerBack
     * Moves the layer back to the position determined by the map's layers
     * array.
     */
    moveLayerBack: function() {
        var index = this.layer.getZIndex() - 1;
        if (index >= this.map.Z_INDEX_BASE['Feature']) {
            this.layer.setZIndex(index);
        } else {
            this.map.setLayerZIndex(this.layer,
                this.map.getLayerIndex(this.layer));
        }
    },

	closeMenu : function(e) {
		var cmenu = Ext.getCmp("mapMenu");
		if (cmenu) {
			cmenu.destroy();
		}
	},

	rightclick : function(feature, evt) {
		//console.log("rightclick!!");
		//evt.preventDefault();
		if(map.getLayersByName("Mark Layer").length == 0){
			var markLayer =  new OpenLayers.Layer.Markers("Mark Layer", {
				  'displayInLayerSwitcher': false
			  });
			map.addLayer(markLayer);
		}
		var items = new Array();
		var isFeatureFromSicecat = this.isFeatureFromSicecat(feature);
		//console.log(isFeatureFromSicecat);
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
		this.showMenuItems(items, evt.xy.x, evt.xy.y, evt
				.target);
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
		//this.stopUp = true;
		OpenLayers.Event.stop(evt, true);
		//evt.preventDefault();
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
		//this.stopUp = true;
		OpenLayers.Event.stop(evt, true);
		//evt.preventDefault();
		return new Ext.menu.Item({
			text : this.enviarElementosText,
			handler : function() {
				integrator.msjAplListSelected(features);
			}
		});
	},

	getExportElementsItem : function(evt, features) {
		//this.stopUp = true;
		OpenLayers.Event.stop(evt, true);
		//evt.preventDefault();
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

	getOpenHideDetails : function(evt, feature) {
		//this.stopUp = true;
		OpenLayers.Event.stop(evt, true);
		//evt.preventDefault();
		var layerDetails = (!!integrator.incidentsDetailsMap[feature.data.sicecat_feature.id]) ?
				integrator.incidentsDetailsMap[feature.data.sicecat_feature.id]["all"]: null;
		//console.log(layerDetails);
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
					var idIncident = !!feature.data 
						&& !!feature.data.sicecat_feature.id ? 
								feature.data.sicecat_feature.id : feature.attributes.pk_id;
					integrator.msIntGetElements(idIncident, "all");
				}
			});
		}
	},

    CLASS_NAME: "OpenLayers.Handler.Feature"
});
