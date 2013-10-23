/*
 * SiceCAT.Control.ModifyFeatureControl.js
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
 * Authors: Moisés Arcos Santiago (mailto:marcos@emergya.com)
 */

/**
 * @requires OpenLayers/Control/DragFeature.js
 * @requires OpenLayers/Control/SelectFeature.js
 * @requires OpenLayers/Handler/Keyboard.js
 * @requires OpenLayers/Control/ModifyFeature.js
 */

/**
 * Class: SiceCAT.Control.ModifyFeatureControl
 * Control to modify features.  When activated, a click renders the vertices
 *     of a feature - these vertices can then be dragged.  By default, the
 *     delete key will delete the vertex under the mouse.  New features are
 *     added by dragging "virtual vertices" between vertices.  Create a new
 *     control with the <OpenLayers.Control.ModifyFeature> constructor.
 *
 * Inherits From:
 *  - <OpenLayers.Control.ModifyFeature>
 */
SiceCAT.Control.ModifyFeatureControl = OpenLayers.Class(OpenLayers.Control.ModifyFeature, {

	 /**
     * Property: selectControl
     * {<OpenLayers.Control.SelectFeature>}
     */
    selectControl: null,
	
	/**
     * APIProperty: standalone
     * {Boolean} Set to true to create a control without SelectFeature
     *     capabilities. Default is false.  If standalone is true, to modify
     *     a feature, call the <selectFeature> method with the target feature.
     *     Note that you must call the <unselectFeature> method to finish
     *     feature modification in standalone mode (before starting to modify
     *     another feature).
     */
    standalone: false,
    
    /**
     * APIProperty: onModificationStart 
     * {Function} *Deprecated*.  Register for "beforefeaturemodified" instead.
     *     The "beforefeaturemodified" event is triggered on the layer before
     *     any modification begins.
     *
     * Optional function to be called when a feature is selected
     *     to be modified. The function should expect to be called with a
     *     feature.  This could be used for example to allow to lock the
     *     feature on server-side.
     */
    onModificationStart: function(feature) {
    	this.dragControl.removeFeature(feature);
    },
    
    /**
     * APIProperty: onModification
     * {Function} *Deprecated*.  Register for "featuremodified" instead.
     *     The "featuremodified" event is triggered on the layer with each
     *     feature modification.
     *
     * Optional function to be called when a feature has been
     *     modified.  The function should expect to be called with a feature.
     */
    onModification: function(feature) {
    	this.dragControl.removeFeature(feature);
    },
    
    /**
     * APIProperty: onModificationEnd
     * {Function} *Deprecated*.  Register for "afterfeaturemodified" instead.
     *     The "afterfeaturemodified" event is triggered on the layer after
     *     a feature has been modified.
     *
     * Optional function to be called when a feature is finished 
     *     being modified.  The function should expect to be called with a
     *     feature.
     */
    onModificationEnd: function(feature) {
    	if(feature.fid) {
			feature.state = OpenLayers.State.UPDATE;														
		} else {
			feature.state = OpenLayers.State.INSERT;
		}
		if (feature.attributes["OBJECTID"]) {
			feature.attributes["OBJECTID"] = undefined;
		}
    },
	
    /**
     * Constructor: OpenLayers.Control.ModifyFeature
     * Create a new modify feature control.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer.Vector>} Layer that contains features that
     *     will be modified.
     * options - {Object} Optional object whose properties will be set on the
     *     control.
     */
    initialize: function(layer, options) {
    	mfcontrol = this;
    	options = options || {};
    	if(Array.isArray(layer)){
    		this.layer = new OpenLayers.Layer.Vector("modifyLayer");
    		this.virtualStyle = OpenLayers.Util.extend({},
                    layer[0].style ||
                    layer[0].styleMap.createSymbolizer(null, options.vertexRenderIntent)
                );
    	}else{
    		this.layer = layer;
    		this.virtualStyle = OpenLayers.Util.extend({},
                    this.layer.style ||
                    this.layer.styleMap.createSymbolizer(null, options.vertexRenderIntent)
                );
    	}
        this.vertices = [];
        this.virtualVertices = [];
        this.virtualStyle.fillOpacity = 0.3;
        this.virtualStyle.strokeOpacity = 0.3;
        this.deleteCodes = [46, 68];
        this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        if(!(OpenLayers.Util.isArray(this.deleteCodes))) {
            this.deleteCodes = [this.deleteCodes];
        }
        // configure the select control
        var selectOptions = {
        		clickout : true,
				toggle : true,
				multiple : true,
				hover : false,
				highlightOnly : true,
				selectStyle : Sicecat.styles["select"],
				onBeforeSelect: this.beforeSelectFeature,
	            onSelect: this.selectFeature,
	            onUnselect: this.unselectFeature,
	            scope: this
        };
        if(this.standalone === false) {
        	if(Array.isArray(layer)){
        		this.selectControl = new OpenLayers.Control.SelectFeature(
                        layer, selectOptions
                    );
        	}else{
        		this.selectControl = new OpenLayers.Control.SelectFeature(
                        [layer], selectOptions
                    );
        	}
        }
        
        this.dragControl = new SiceCAT.Control.SapoDragFeature([], {
        	geometryTypes: ["OpenLayers.Geometry.Point"],
            snappingOptions: this.snappingOptions,
            'dragstart': {
				callback: function(feature, pixel){
					OpenLayers.Control.ModifyFeature.prototype.dragStart.apply(this, [feature, pixel]);
				},
				context: this
			},
			'drag': {
				callback: function(feature, pixel){
					OpenLayers.Control.ModifyFeature.prototype.dragVertex.apply(this, [feature, pixel]);
				},
				context: this
			},
			'dragend': {
				callback: function(feature, pixel){
					this.dragComplete.apply(this, [feature]);
				},
				context: this
			},
            featureCallbacks: {
                over: function(feature) {
                    /**
                     * In normal mode, the feature handler is set up to allow
                     * dragging of all points.  In standalone mode, we only
                     * want to allow dragging of sketch vertices and virtual
                     * vertices - or, in the case of a modifiable point, the
                     * point itself.
                     */
                    if(this.standalone !== true || feature._sketch ||
                       this.feature === feature) {
                        this.dragControl.overFeature.apply(
                            this.dragControl, [feature]);
                    }
                }
            }
        });

        // configure the keyboard handler
        var keyboardOptions = {
            keydown: this.handleKeypress
        };
        this.handlers = {
            keyboard: new OpenLayers.Handler.Keyboard(this, keyboardOptions)
        };
    },
    /**
     * APIMethod: activate
     * Activate the control.
     * 
     * Returns:
     * {Boolean} Successfully activated the control.
     */
    activate: function(){
    	return ((this.standalone || this.selectControl.activate()) &&
                this.handlers.keyboard.activate() &&
                OpenLayers.Control.prototype.activate.apply(this, arguments));
    },
    
    /**
     * APIMethod: deactivate
     * Deactivate the control.
     *
     * Returns: 
     * {Boolean} Successfully deactivated the control.
     */
    deactivate: function() {
    	return OpenLayers.Control.ModifyFeature.prototype.deactivate.apply(this, arguments);
    },
    
    selectFeature: function(feature){
    	OpenLayers.Control.ModifyFeature.prototype.selectFeature.apply(this, [feature]);
    },
    
    beforeSelectFeature: function(feature){
    	this.setLayer(feature.layer);
    	OpenLayers.Control.ModifyFeature.prototype.beforeSelectFeature.apply(this, [feature]);
    },
    
    unselectFeature: function(feature){
    	OpenLayers.Control.ModifyFeature.prototype.unselectFeature.apply(this, [feature]);
    },
    
    setLayer: function(layers){
    	this.layer = layers;
    	//this.selectControl.setLayer([layers]);
    	this.dragControl.setLayer(layers);
    },
    
    /**
     * Method: dragComplete
     * Called by the drag feature control when the feature dragging is complete.
     *
     * Parameters:
     * vertex - {<OpenLayers.Feature.Vector>} The vertex being dragged.
     */
    dragComplete: function(vertex) {
        this.resetVertices();
        this.dragControl.deactivate();
        this.dragControl.activate();
        this.setFeatureState();
        this.onModification(this.feature);
        this.layer.events.triggerEvent("featuremodified", 
                                       {feature: this.feature});
    },
    
    /**
     * Method: collectVertices
     * Collect the vertices from the modifiable feature's geometry and push
     *     them on to the control's vertices array.
     */
    collectVertices: function() {
        this.vertices = [];
        this.virtualVertices = [];        
        var control = this;
        function collectComponentVertices(geometry) {
            var i, vertex, component, len;
            if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                vertex = new OpenLayers.Feature.Vector(geometry);
                vertex._sketch = true;
                vertex.renderIntent = control.vertexRenderIntent;
                control.vertices.push(vertex);
            } else {
                var numVert = geometry.components.length;
                if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                    numVert -= 1;
                }
                for(i=0; i<numVert; ++i) {
                    component = geometry.components[i];
                    if(component.CLASS_NAME == "OpenLayers.Geometry.Point") {
                        vertex = new OpenLayers.Feature.Vector(component);
                        vertex._sketch = true;
                        vertex.renderIntent = control.vertexRenderIntent;
                        control.vertices.push(vertex);
                    } else {
                        collectComponentVertices(component);
                    }
                }
                
                // add virtual vertices in the middle of each edge
                if(geometry.CLASS_NAME != "OpenLayers.Geometry.MultiPoint") {
                    for(i=0, len=geometry.components.length; i<len-1; ++i) {
                        var prevVertex = geometry.components[i];
                        var nextVertex = geometry.components[i + 1];
                        if(prevVertex.CLASS_NAME == "OpenLayers.Geometry.Point" &&
                           nextVertex.CLASS_NAME == "OpenLayers.Geometry.Point") {
                            var x = (prevVertex.x + nextVertex.x) / 2;
                            var y = (prevVertex.y + nextVertex.y) / 2;
                            var point = new OpenLayers.Feature.Vector(
                                new OpenLayers.Geometry.Point(x, y),
                                null, control.virtualStyle
                            );
                            // set the virtual parent and intended index
                            point.geometry.parent = geometry;
                            point._index = i + 1;
                            point._sketch = true;
                            control.virtualVertices.push(point);
                        }
                    }
                }
            }
        }
        collectComponentVertices.call(this, this.feature.geometry);
        this.layer.addFeatures(this.virtualVertices, {silent: true});
        this.layer.addFeatures(this.vertices, {silent: true});
    },

    CLASS_NAME: "OpenLayers.Control.ModifyFeatureControl"
});