/*
 * CopyFeaturesPanel.js
 * Copyright (C) 2011, Cliente <cliente@email.com>
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
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 * 
 */

/** api: (define)
 *  module = SiceCAT.widget
 *  class = CopyFeaturesPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("SiceCAT.widgets");

/** api: constructor
 *  .. class:: CopyFeaturesPanel(config)
 *   
 *      Create a panel for copy-paste features to WFS-T layers
 */
SiceCAT.widgets.CopyFeaturesPanel = Ext.extend(Ext.Panel, {

    /** i18n */
    lineLayerComboText: "Line Layer",
    polygonLayerComboText: "Polygon Layer",
    pointLayerComboText: "Point Layer",
    windowtitle:"Copy to WFS-T layers",
    comboLayersText:"Target layers",
    loadingText: "Loading...",
    copyText: "Copy",
    emptyLineLayerText:"Select a layer to export line features",
    emptyPolygonLayerText:"Select a layer to export polygon features",
    emptyPointLayerText:"Select a layer to export point features",
    helpText: "Select target layers to copy {0} features selected",
    noFeatureSelectedText: "There was no feature selected",
    successPointsText: "<li>{0} points copied to '{1}' layer</li>",
    successLinesText: "<li>{0} lines copied to '{1}' layer</li>",
    successPolygonsText: "<li>{0} polygons copied to '{1}' layer</li>",
    successText: "<ul>{0}</ul>",
    alertTitleText: "Warning!",
    alertMessageText: "Data will be lost in the copy of the WFS-T elements. Only  TITOL and COMENTARI  attributes if they exist will be copied.",
    
    /**private: property[store]
     */
    destinyLayers:null,
    sicecatInstance: null,
    lineLayerSelected: null,
    lineLayerSelectedName: null,
    
    /**private: property[window]
     */
    windowToShow:null,
    
    /**private: property[window]
     */
    lineLayerCombo:null,
    
    /**private: property[window]
     */
    polygonLayerCombo:null,
    
    /**private: property[window]
     */
    pointLayerCombo:null,
    
    /**private: property[features] to copy
     */
    features: null,

    /** private: method[initComponent]
     */
    initComponent: function() {
    	
    	if(Sicecat.isLogEnable) console.log("Copy Features init");
    	
    	this.initDestinyLayers();
    	
        var panelContainer = this;
        
        this.buttonQuery = new Ext.Button({
                text: this.copyText,
                style: {
                	float: 'right'
                },
                handler: function() {
                	panelContainer.exportToLayers();
                }
            });

	    
        var numFeatures = 0;
        if(!!this.sicecatInstance
        		&& !!this.sicecatInstance.featuresSelected){
        	numFeatures = this.sicecatInstance.featuresSelected.length;
        }
        
	    this.statusBar = new Ext.ux.StatusBar({
            defaultText: String.format(this.helpText, numFeatures),
	        width: 480,
	        height: 50});
        
        this.items = [{
	            xtype: "fieldset",
	            title: this.comboLayersText,
	            checkboxToggle: false,
	            collapsed: false,
	            anchor: "95%",
	            height:"100px",
	            items:[this.lineLayerCombo,this.polygonLayerCombo,this.pointLayerCombo]
        	}, this.statusBar, this.buttonQuery];

        SiceCAT.widgets.CopyFeaturesPanel.superclass.initComponent.call(this);
    },
    
    initDestinyLayers: function(){
    	// Initialize the three layers wfs
		if(!!this.sicecatInstance.searchServices){
			for(var name in this.sicecatInstance.searchServices) {
				var wfs = map.getLayersByName(name)[0];
				if(wfs.geom == "POINT"){
					if(Sicecat.isLogEnable) console.log("Can export points to "+name);
					this.pointLayerSelected = wfs;
					this.pointLayerSelectedName = name;
				}else if(wfs.geom == "LINE"){
					if(Sicecat.isLogEnable) console.log("Can export lines to "+name);
					this.lineLayerSelected = wfs;
					this.lineLayerSelectedName = name;
				}else if(wfs.geom == "POLYGON"){
					if(Sicecat.isLogEnable) console.log("Can export polygons to "+name);
					this.polygonLayerSelected = wfs;
					this.polygonLayerSelectedName = name;
				}else{
					if(Sicecat.isLogEnable) console.log("Geom no recognized: "+name);
				}
			}
		}else{
			if(Sicecat.isLogEnable) console.log("Geoservices not inizialized");
		}
    },
    
    showWindow:function(){
    	if(!!!this.windowToShow){
	    	this.windowToShow = new Ext.Window({
				title: this.title, 
				closeAction: 'hide',
			    width:500,
			    height:250,
				items: [this]
			});
    	}
    	this.windowToShow.show();
    },
    
    pointLayerSelected: null,
    pointLayerSelectedName: null,
    polygonLayerSelected: null,
    polygonLayerSelectedName: null,
    lineLayerSelected: null,
    lineLayerSelectedName: null,
    
    exportToLayers: function(){
    	this.showMessageAlert();
    	if(Sicecat.isLogEnable) console.log("Exporting "+this.sicecatInstance.featuresSelected.length+ " features");
    	if(!!this.pointLayerSelected 
    			&& !!this.polygonLayerSelected
    			&& !!this.lineLayerSelected
    			&& !!this.sicecatInstance.featuresSelected
    			&& this.sicecatInstance.featuresSelected.length > 0){
    		this.lines = [], this.points = [], this.polygons = [];
    		for(var i = 0; i< this.sicecatInstance.featuresSelected.length; i++){
    			var feature = this.sicecatInstance.featuresSelected[i];
    			if(!!feature.geometry){
    				if(feature.geometry instanceof OpenLayers.Geometry.Point){
    					if(Sicecat.isLogEnable) console.log("Found a point");
    					this.points.push(this.cloneFeature(feature));
    				}else if(feature.geometry instanceof OpenLayers.Geometry.LineString){
    					this.lines.push(this.cloneFeature(feature));
    					if(Sicecat.isLogEnable) console.log("Found a line");
    				}else if(feature.geometry instanceof OpenLayers.Geometry.Polygon){
    					if(Sicecat.isLogEnable) console.log("Found a polygon");
    					this.polygons.push(this.cloneFeature(feature));
    				}else if(feature.geometry instanceof OpenLayers.Geometry.Collection){
    					var collection = this.manageCollection(feature);
    				}else{
    					if(Sicecat.isLogEnable) console.log("This geom is not supported " + feature.CLASS_NAME );
    				}
    			}
    		}
    		if(this.polygons.length<=0 
    				&& this.points.length<=0
    				&& this.lines.length<=0){
    			//this.statusBar.setText(this.noFeatureSelectedText);
    		}else{
    			var textToShow = "";
    			if(this.lines.length>0){
        			this.saveFeatures(this.lines, this.lineLayerSelected);
        			textToShow += String.format(this.successLinesText, this.lines.length, this.lineLayerSelectedName);
        		}
        		if(this.points.length>0){
        			this.saveFeatures(this.points, this.pointLayerSelected);
        			textToShow += String.format(this.successPointsText, this.points.length, this.pointLayerSelectedName);
        		}
        		if(this.polygons.length>0){
        			this.saveFeatures(this.polygons, this.polygonLayerSelected);
        			textToShow += String.format(this.successPolygonsText, this.polygons.length, this.polygonLayerSelectedName);
        		}
        		//this.statusBar.setText(String.format(this.successText, textToShow));
    		}
        		
    	}
    }, 
    
    cloneFeature: function(feature){
        var newFeature = new OpenLayers.Feature.Vector(feature.geometry.clone());
        newFeature.state = OpenLayers.State.INSERT;
    	newFeature.attributes = this.getDefaultData(feature);
        return newFeature;
    },
    
    getDefaultData: function(feature){
    	var attributes = {};
    	if(!!feature.data && !!feature.data.sicecat_feature){
    		attributes = feature.data.sicecat_feature.toDataMap();
        }else if(!!feature.data){
        	attributes = {
    			TITOL : feature.data.titol,
    			COMENTARI : feature.data.comentari,
    			DATA_MODIFICACIO : null
        	};
        }
    	return attributes;
    },
    
    newFeature: function(geometry, attributes){
        var newFeature = new OpenLayers.Feature.Vector(geometry.clone());
        newFeature.state = OpenLayers.State.INSERT;
        newFeature.attributes = attributes;
        return newFeature;
    },
    
    manageCollection: function(feature, parentAttributtes){
    	var isPointCol = false, isLineCol = false, isPolyCol = false;
    	var attributes;
    	if(!!parentAttributtes){
    		attributes = parentAttributtes
    	}else{
    		attributes = this.getDefaultData(feature);
    	}
    	var features = [];
    	for(var i = 0; i< feature.geometry.components.length; i++){
			var geometry = feature.geometry.components[i];
			if(!!geometry){
				if(geometry instanceof OpenLayers.Geometry.Point){
					isPointCol = true;
					var newFeature = this.newFeature(geometry, attributes);
					features.push(newFeature);
					this.points.push(newFeature);
				}else if(geometry instanceof OpenLayers.Geometry.LineString){
					isLineCol = true;
					var newFeature = this.newFeature(geometry, attributes);
					features.push(newFeature);
					this.lines.push(newFeature);
				}else if(geometry instanceof OpenLayers.Geometry.Polygon){
					isPolyCol = true;
					var newFeature = this.newFeature(geometry, attributes);
					features.push(newFeature);
					this.polygons.push(newFeature);
				}else if(geometry instanceof OpenLayers.Geometry.Collection){
					var collection = this.manageCollection(geometry, attributes);
				}else{
					if(Sicecat.isLogEnable) console.log("This geom is not supported " + geometry.CLASS_NAME );
					isPointCol = false; isLineCol = false; isPolyCol = false;
				}
			}
		}
    	if(isPointCol && !isLineCol && !isPolyCol){
			if(Sicecat.isLogEnable) console.log("Found a point collection");
			return {type: "isPointCol", features: features};
		}else if(!isPointCol && isLineCol && !isPolyCol){
			if(Sicecat.isLogEnable) console.log("Found a line collection");
			return {type: "isLineCol", features: features};
		}else if(!isPointCol && !isLineCol && isPolyCol){
			if(Sicecat.isLogEnable) console.log("Found a polygon collection");
			return {type: "isPolyCol", features: features};
		}else{
			return {type: "notDefined"};
		}
    },
    
    saveFeatures: function (features, layer){
    	if(Sicecat.isLogEnable) console.log("Adding "+features.length +" to "+layer.name);
    	var saved = false;
    	if(!!layer.strategies){
    		for(var i = 0; i < layer.strategies.length; i++){
    			if(layer.strategies[i] instanceof OpenLayers.Strategy.Save){
    				layer.strategies[i].activate();
    	        	layer.addFeatures(features);
    	        	layer.redraw();
    				layer.strategies[i].save();
    				saved = true;
    				layer.strategies[i].deactivate();
    				break;
    			}
    		}
    	}
    	if(!saved){
    		if(Sicecat.isLogEnable) console.log("features not saved!!");
    	}else{
    		if(Sicecat.isLogEnable) console.log("features saved!!");
    		//this.statusBar.setText(this.noFeatureSelectedText);
    		Ext.each(layer.strategies, function(s, i) {
				if (s instanceof OpenLayers.Strategy.Refresh){
					s.activate();
					s.reset();
				}
			});
    	}
    },
    
    showMessageAlert: function(){
    	Ext.Msg.alert(this.alertTitleText, this.alertMessageText);
    }
    
});

/** api: xtype = gxp_sicecat_querypanel */
Ext.reg('gxp_sicecat_copyfeaturespanel', SiceCAT.widgets.CopyFeaturesPanel); 