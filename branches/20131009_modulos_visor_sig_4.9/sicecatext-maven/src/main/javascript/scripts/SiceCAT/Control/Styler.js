/*
 * OpenLayers.Control.Styler.js
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
 * Class: OpenLayers.Control.Styler
 * 
 * The Styler control is a button to modify later style
 *  
 * It is designed to be used with a 
 * <OpenLayers.Control.Panel>
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 *  
 * See also:
 *  - <AuxilaryLayer>
 */
OpenLayers.Control.Styler = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: type
     * {String} The type of <OpenLayers.Control> -- When added to a 
     *     <Control.Panel>, 'type' is used by the panel to determine how to 
     *     handle our events.
     */
    type: OpenLayers.Control.TYPE_BUTTON,
    
    /**
     * Property: sicecatInstance
     * 
     * {SiceCAT} instance of application
     */
    sicecatInstance: null,
    
    /** api: config[closest]
     *  ``Boolean`` Find the zoom level that most closely fits the specified
     *  extent. Note that this may result in a zoom that does not exactly
     *  contain the entire extent.  Default is true.
     */
    closest: true,
    
    /** i18n*/
	layerStyleEditText : "Layer's '{0}' style edit",
	lineSymbolizerText : "Line Symbolizer",
	polygonSymbolizerText : "Polygon Symbolizer",
	pointSymbolizerText : "Point Symbolizer",
	circleText : "Circle",
	squareText : "Square",
	triangleText : "Triangle",
	starText : "Star",
	xText : "X",
	externalText : "External",
	crossText : "Cross",
    
    /*
     * private: window to show
     */
    windowSelecter: null,
    
    /*
     * private: current symbolizer
     */
    currentSymbolizer: null,
    
    /*
     * Method: trigger
     * Do the zoom to selected features.
     */
    trigger: function() {
    	if(this.windowSelecter == null){
    		this.currentSymbolizer = this.obtainSymbolizer();
    		if(this.layer.styleMap && this.layer.styleMap.styles){
    			var style = this.layer.styleMap.styles["default"].defaultStyle;
    			if(style != null){
    				this.currentSymbolizer = style;
    				this.windowSelecter = this.getPointSymbolizerWindow();
    			}else{
        			//No se encuentra el estilo
        			this.currentSymbolizer = this.getDefaultSymbolyzer();
    				this.windowSelecter = this.getPointSymbolizerWindow();
    			}
    		}else{
    			//No se encuentra el estilo
    			this.currentSymbolizer = this.getDefaultSymbolyzer();
				this.windowSelecter = this.getPointSymbolizerWindow();
			}
    		this.windowSelecter.show();
    	}else{
    		this.windowSelecter.show();
    	}
    },
    
    obtainSymbolizer: function(){
		//Diferenciar por tipo
		var typeGeom = this.layer.geom;
		if(!!this.layer.styleMap.styles['default'].rules[0]
			&& !!this.layer.styleMap.styles['default'].rules[0].symbolizer){
			//Always only one rule without filter!!
			this.currentSymbolizer = this.layer.styleMap.styles['default'].rules[0].symbolizer;
			//Copy defaultStyle to symbolizer
			if(!!this.layer.styleMap.styles['default'].defaultStyle){
				for(var property in this.layer.styleMap.styles['default'].defaultStyle){
					if(!this.currentSymbolizer[property]){
						this.currentSymbolizer[property] = this.layer.styleMap.styles['default'].defaultStyle[property];
					}
				}
			}
		}else{ 
			var defaultStyle = null;
			if(this.layer.styleMap.styles['default'].rules.length != 1 ){
				defaultStyle = {};
				for(var property in this.layer.styleMap.styles['default'].defaultStyle){
					defaultStyle[property] = this.layer.styleMap.styles['default'].defaultStyle[property];
				}
			}
			if(typeGeom == "POLYGON"){
				this.currentSymbolizer = defaultStyle ? defaultStyle 
							: this.layer.styleMap.styles['default'].rules[0].symbolizer["Polygon"];
				this.windowSelecter = this.getPolygonSymbolizerWindow();
			}else if(typeGeom == "LINE"){
				this.currentSymbolizer = defaultStyle ? defaultStyle 
						: this.layer.styleMap.styles['default'].rules[0].symbolizer["Line"];
				this.windowSelecter = this.getLineSymbolizerWindow();
			}else if(typeGeom == "POINT"){
				this.currentSymbolizer = defaultStyle ? defaultStyle 
						: this.layer.styleMap.styles['default'].rules[0].symbolizer["Point"];
				this.windowSelecter = this.getPointSymbolizerWindow();
			} else if(!!this.layer.styleMap.styles['default'].rules[0]){
				this.currentSymbolizer = defaultStyle ? defaultStyle 
						: this.layer.styleMap.styles['default'].rules[0].symbolizer["Point"];
				this.windowSelecter = this.getPointSymbolizerWindow();
			}
		}
    	return this.currentSymbolizer;
    },
    
    getDefaultSymbolyzer: function (){
    	return {
	        fillColor: "#ee9900",
	        fillOpacity: 0.4, 
	        hoverFillColor: "white",
	        hoverFillOpacity: 0.8,
	        strokeColor: "#ee9900",
	        strokeOpacity: 1,
	        strokeWidth: 1,
	        strokeLinecap: "round",
	        strokeDashstyle: "solid",
	        hoverStrokeColor: "red",
	        hoverStrokeOpacity: 1,
	        hoverStrokeWidth: 0.2,
	        pointRadius: 6,
	        hoverPointRadius: 1,
	        hoverPointUnit: "%",
	        pointerEvents: "visiblePainted",
	        cursor: "inherit"
	    };
    },
    
    changeStyle: function(symbolizer) {
		if (!!this.layer) {
			if(symbolizer.cursor && symbolizer.cursor != "pointer"){
				symbolizer.cursor = "pointer";
			}
			if(symbolizer.strokeDashstyle == "4 4"){
				symbolizer.strokeDashstyle = "dash";
			}else if(symbolizer.strokeDashstyle == "2 4"){
				symbolizer.strokeDashstyle = "dot";
			}
			if(Sicecat.isLogEnable) console.log("Styling layer "+this.layer.name);
			styleMap = new OpenLayers.StyleMap({
	            "default": new OpenLayers.Style(null, {
	                rules: [new OpenLayers.Rule({symbolizer: symbolizer})]
	            })
	        });
			//Forze style
			for(var i = 0; i < this.layer.features.length; i++){
				var styleDefined = OpenLayers.Util
					.applyDefaults(
						symbolizer,
						OpenLayers.Feature.Vector.style["default"]);
				this.layer.features[i].style = styleDefined;
			}
			this.layer.styleMap = styleMap;
			this.layer.redraw();
		}
		
		this.submitValues();
	},
	
	submitValues: function (){
		if(!!this.layer.layerID){
			var this_layer = this.layer;
			PersistenceGeoParser.uploadStyle(this.layer.layerID,this.layer.styleMap, 
	        		function(form, action){
		    			/*
		    			 * ON SUCCESS
		    			 */
		    			var json = Ext.util.JSON.decode(action.response.responseText);
		    			var layer = PersistenceGeoParser.LOADERS_CLASSES[json.data.type].load(json.data);
//		    			Sicecat.removeLayer(this_layer);
//		    			Sicecat.addLayer(layer);
		    		},
		    		function(form, action){
		    			/*
		    			 * ON FAILURE 
		    			 */
		    			var json = Ext.util.JSON.decode(action.response.responseText);
		    			console.log("Error --> "+json);
		    });
		}
	},
    
    getDefaultSymbolizer: function(){
    	return {
				Point : {
					graphicName : "star",
					pointRadius : 8,
					fillColor : "yellow",
					strokeColor : "red",
					strokeWidth : 1
				},
				Line : {
					strokeColor : "#669900",
					strokeWidth : 3
				},
				Polygon : {
					fillColor : "white",
					fillOpacity : 0.25,
					strokeColor : "#666666",
					strokeWidth : 2,
					strokeDashstyle : "dot"
				}
			};
    },
    
    getPolygonSymbolizerWindow: function(){
    	return new Ext.Window(
				{
					title : String.format(this.layerStyleEditText, this.layer.name),
					width : 230,
					shadow : false,
					plain : true,
					closeAction : "hide",
					items : [ {
						xtype : "gxp_polygonsymbolizer",
						symbolizer : this.currentSymbolizer,
						bodyStyle : {
							padding : 10
						},
						border : false,
						labelWidth : 50,
						labelAlign : "right",
						defaults : {
							labelWidth : 50,
							labelAlign : "right"
						},
						listeners : {
							change : this.changeStyle,
							scope:this
						}
					} ]
				});
    },
    
    getLineSymbolizerWindow: function(){
    	return new Ext.Window(
				{
					title : String.format(this.layerStyleEditText, this.layer.name),
					width : 230,
					shadow : false,
					plain : true,
					closeAction : "hide",
					items : [ {
						xtype : "gxp_linesymbolizer",
						symbolizer : this.currentSymbolizer,
						bodyStyle : {
							padding : 10
						},
						border : false,
						labelWidth : 50,
						labelAlign : "right",
						defaults : {
							labelWidth : 50,
							labelAlign : "right"
						},
						listeners : {
							change : this.changeStyle,
							scope:this
						}
					} ]
				});
    },
    
    getPointSymbolizerWindow: function(){
    	return new Ext.Window(
				{
					title : String.format(this.layerStyleEditText, this.layer.name),
					width : 230,
					shadow : false,
					plain : true,
					closeAction : "hide",
					items : [ {
						xtype : "gxp_pointsymbolizer",
						symbolizer : this.currentSymbolizer,
						pointGraphics : [ {
							display : this.circleText,
							value : "circle",
							mark : true
						}, {
							display : this.squareText,
							value : "square",
							mark : true
						}, {
							display : this.triangleText,
							value : "triangle",
							mark : true
						}, {
							display : this.starText,
							value : "star",
							mark : true
						}, {
							display : this.crossText,
							value : "cross",
							mark : true
						}, {
							display : this.xText,
							value : "x",
							mark : true
						}, {
							display : this.externalText
						} ],
						bodyStyle : {
							padding : 10
						},
						border : false,
						labelWidth : 50,
						labelAlign : "right",
						defaults : {
							labelWidth : 50,
							labelAlign : "right"
						},
						listeners : {
							change : this.changeStyle,
							close: this.submitValues,
							hide: this.submitValues,
							scope:this
						}
					} ]
				});
    },
	
    CLASS_NAME: "OpenLayers.Control.Styler"
});
