/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. 
 * 
 * Edited by Joao Duarte
 * 
 * Edited and adapted by Moisés Arcos <marcos@emergya.com>
 * */


/**
 * @requires OpenLayers/Handler.js
 */

/**
 * Class: Sapo.Handler.Feature 
 * Handler to respond to mouse events related to drawn features.  Callbacks
 *     with the following keys will be notified of the following events
 *     associated with features: click, clickout, over, out, and dblclick.
 *
 * This handler stops event propagation for mousedown and mouseup if those
 *     browser events target features that can be selected.
 */
SiceCAT.Control.SapoDragHandler = OpenLayers.Class(OpenLayers.Handler, {

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
        'mouseup': {'in': null, 'out': null}
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
     * Property: clickoutTolerance
     * {Number} The number of pixels the mouse can move during a click that
     *     still constitutes a click out.  When dragging the map, clicks should
     *     not trigger the clickout property unless this tolerance is reached.
     *     Default is 4.
     */
    clickoutTolerance: 4,

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
    stopClick: true,

    /**
     * Property: stopDown
     * {Boolean} If stopDown is set to true, handled mousedowns do not
     *      propagate to other mousedown listeners. Otherwise, handled
     *      mousedowns do propagate. Unhandled mousedowns always propagate,
     *      whatever the value of stopDown. Defaults to true.
     */
    stopDown: true,

    /**
     * Property: stopUp
     * {Boolean} If stopUp is set to true, handled mouseups do not
     *      propagate to other mouseup listeners. Otherwise, handled mouseups
     *      do propagate. Unhandled mouseups always propagate, whatever the
     *      value of stopUp. Defaults to false.
     */
    stopUp: false,
    
    /**
     * Constructor: OpenLayers.Handler.Feature
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object with a 'over' property whos value is
     *     a function to be called when the mouse is over a feature. The 
     *     callback should expect to recieve a single argument, the feature.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, [control, callbacks, options]);
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
        return this.handle(evt) ? !this.stopDown : true;
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
        var type = evt.type;
        var handled = false;
        var previouslyIn = !!(this.feature); // previously in a feature
        var click = (type == "click" || type == "dblclick");
        this.feature = this.getFeatureFromEvent(evt);
        if(this.feature) {
            var inNew = (this.feature != this.lastFeature);
            if(this.geometryTypeMatches(this.feature)) {
                // in to a feature
                if(previouslyIn && inNew) {
                    // out of last feature and in to another
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                    this.triggerCallback(type, 'in', [this.feature]);
                } else if(!previouslyIn || click) {
                    // in feature for the first time
                    this.triggerCallback(type, 'in', [this.feature]);
                }
                this.lastFeature = this.feature;
                handled = true;
            } else {
                // not in to a feature
                if(previouslyIn && inNew || (click && this.lastFeature)) {
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
            if(previouslyIn || (click && this.lastFeature)) {
                this.triggerCallback(type, 'out', [this.lastFeature]);
            }
        }
        return handled;
    },
	
	/**
	 * Method: getFeatureFromEvent
	 * Checks if any of the features should respond to the event
	 */
	getFeatureFromEvent: function(evt){
		//Loop through all features from the control
		var features = this.control.features;
		if(!features){
			return null;
		}
		var feature;
		var point;
		var lonlat;
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature.geometry){
				// Distinguir entre el tipo de geometria
				if(feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point"){
					/* Tratamiento para un punto */
					if(this.intersectsPoint(evt.xy, feature)){
						return feature;
					}
				}
				else if(feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon"){
					/*Tratamiento para un polígono*/
					lonlat = feature.layer.getLonLatFromViewPortPx(evt.xy);
					point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
					if(feature.geometry.intersects(point)){
						return feature;
					}
				}else{
					/* Tratamiento para una línea*/
					lonlat = feature.layer.getLonLatFromViewPortPx(evt.xy);
					point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
					if(this.intersectsLine(point, feature)){
						return feature;
					}
				}
			}
		}
	},
	
	/**
	 * Method intersectsPoint
	 * Checks whether a point, intersects with a feature which is a point
	 */
	intersectsPoint: function(point, feature){
		//get the x,y pixels of the feature
			var xy = feature.layer.getViewPortPxFromLonLat(new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y));
			var radius = 10;
			//adjust the xy values, given the offset values;
			if(feature.style){
				xy.x += feature.style.graphicXOffset ? feature.style.graphicXOffset/2 : 0;
				xy.y += feature.style.graphicYOffset ? feature.style.graphicYOffset/2 : 0;
				//get the radius
				radius = feature.style.pointRadius ? feature.style.pointRadius : 0;
			}
			//check if we have a hit
			if (Math.abs(point.x - xy.x, 2) <= Math.abs(radius, 2) && Math.abs(point.y - xy.y, 2) <= Math.abs(radius, 2)) {
				return true;
			}
			
	},
	
	/**
	 * Method intersectsLine
	 * Checks whether a point, intersects with a feature which is a line
	 */
    intersectsLine: function(point, feature){
    	//get the x,y pixels of the feature
    	var radius = map.resolution*3;
    	var distanceToLine = point.distanceTo(feature.geometry);
    	if(distanceToLine <= radius){
    		return true;
    	}
    },
    /**
     * Method: triggerCallback
     * Call the callback keyed in the event map with the supplied arguments.
     *     For click out, the <clickoutTolerance> is checked first.
     *
     * Parameters:
     * type - {String}
     */
    triggerCallback: function(type, mode, args) {
        var key = this.EVENTMAP[type][mode];
        if(key) {
            if(type == 'click' && mode == 'out' && this.up && this.down) {
                // for clickout, only trigger callback if tolerance is met
                var dpx = Math.sqrt(
                    Math.pow(this.up.x - this.down.x, 2) +
                    Math.pow(this.up.y - this.down.y, 2)
                );
                if(dpx <= this.clickoutTolerance) {
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
        if (!evt.property || evt.property == "order") {
            this.moveLayerToTop();
        }
    },
    
    /**
     * Method: moveLayerToTop
     * Moves the layer for this handler to the top, so mouse events can reach
     * it.
     */
    moveLayerToTop: function() {
//        var index = Math.max(this.map.Z_INDEX_BASE['Feature'] - 1,
//            this.layer.getZIndex()) + 1;
//        this.layer.setZIndex(index);
        
    },
    
    /**
     * Method: moveLayerBack
     * Moves the layer back to the position determined by the map's layers
     * array.
     */
    moveLayerBack: function() {
//        var index = this.layer.getZIndex() - 1;
//        if (index >= this.map.Z_INDEX_BASE['Feature']) {
//            this.layer.setZIndex(index);
//        } else {
//            this.map.setLayerZIndex(this.layer,
//                this.map.getLayerIndex(this.layer));
//        }
    },

    CLASS_NAME: "SiceCAT.Control.SapoDragHandler"
});