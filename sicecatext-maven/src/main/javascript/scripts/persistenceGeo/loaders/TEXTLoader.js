/*
 * TEXTLoader.js Copyright (C) 2012 This file is part of PersistenceGeo project
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
 * Authors: Alejandro DÃ­az Torres (mailto:adiaz@emergya.com)
 * Moisés Arcos Santiago (marcos@emergya.com)
 */
/**
 * api: (define) module = PersistenceGeoParser
 */
Ext.namespace("PersistenceGeo.loaders");

/**
 * api: (define) module = PersistenceGeoParser.loaders class = TEXTLoader
 */
Ext.namespace("PersistenceGeo.loaders.TEXTLoader");

/**
 * Class: PersistenceGeoParser.TEXTLoader
 * 
 * Loader for TEXT Layers
 * 
 */
PersistenceGeo.loaders.TEXTLoader 
	= Ext.extend(PersistenceGeo.loaders.AbstractLoader,{
		
	/**
	 * i18n
	 */
    selectTypeText: "Select CAMCAT type to export",
    labelComboText: "Type",
    errorTitleText: 'Error', 
    errorLoadingText: "An error ocurred loading CAMCAT file",
    errorLoadingNotResultsText: "The file has not points in CAMCAT format, please check it.",
    errorLoadingSomeResultsText: "{0} points are not in CAMCAT format, please check it.",
    layerLoadedTitleText: "Upload File",
    layerLoadedText: "The CAMCAT file {0} has been loaded correctly.",
    

	load : function(layerData, layerTree) {
		
		var proj_orig = new OpenLayers.Projection(layerData.properties ? 
				layerData.properties.externalProjection: map.projection);
		
		var separator = layerData.properties ? layerData.properties.separator: "";
		
		// Get layer style
		var styleMap = this.preFunctionStyle(layerData);
		var layer = this.loadLayer(layerData.name, layerData.server_resource, proj_orig, separator, styleMap);

		// TODO: Wrap
		this.postFunctionsWrapper(layerData, layer, layerTree);

		return layer;
	},
	
	postFunctionsWrapper: function (layerData, layer, layerTree){
		PersistenceGeo.loaders.AbstractLoader.prototype.postFunctionsWrapper(layerData, layer, layerTree);
		this.postFunctionsSeparator(layerData, layer);
	},
	
	postFunctionsSeparator: function(layerData, layer){
		if(!!layerData.properties && !!layerData.properties.separator){
			layer.separator = layerData.properties.separator;
		}
	},
	
	/*
	 * Function: loadLayer
	 * 
	 * Loads the CAMCAT Layer
	 * 
	 * Parameters:
	 * 
	 * name - Name of the new layer url - URL where the file is
	 */
	loadLayer : function(name, url, proj_orig, separator, styleMap) {
		var this_ = this;
		var layer = new OpenLayers.Layer.Vector(name, {
			styleMap: styleMap
		});
		
		Ext.Ajax.request({
            url:  url,
			method: 'GET',
			success: function ( result, request ) {
				if(!!result 
						&& (!!result.responseText && result.responseText.indexOf("HTTP 404") < 0)){
					var rows = result.responseText.split(this_.endLine);
					if(!!rows && rows.length > 0){
						var errors = 0;
						var features = 0;
						for(var i = 0; i < rows.length; i++){
							var feature = this_.readFeature(rows[i], proj_orig, separator);
							if(!!feature){
								layer.addFeatures(feature);
								features++;
							}else if(rows[i] != ""){
								errors++;
							}
						}
						if(errors == 0){
							layer.events.on({
							    'added': function(){
							        actions["tooltipcontrol"].control.activate();
							    }
							});
							this_.msg(this_.layerLoadedTitleText, 
								String.format(this_.layerLoadedText, name));
						}else{
							if(features != 0){
								layer.events.on({
								    'added': function(){
								        actions["tooltipcontrol"].control.activate();
								    }
								});
								this_.msg(this_.errorTitleText, 
										String.format(this_.errorLoadingSomeResultsText, errors));
							}else{
								this_.msg(this_.errorTitleText, this_.errorLoadingNotResultsText);
							}
						}
					}else{
						this_.msg(this_.errorTitleText, this_.errorLoadingNotResultsText);
					}
				}else{
					this_.msg(this_.errorTitleText, this_.errorLoadingText);							
				}
			},
			failure: function ( result, request) {
				this_.msg(this_.errorTitleText, this_.errorLoadingText);
			} 
		});
		
		return layer;
	},

    strDelimiter: "  ",
    endLine: "\n",
    rows: new Array(),
    
    msg: function(title, msg){
    	//console.log("ERROR -->"+msg);
    },
    
    /*
     * Function: readFeatureRegExt
	 * 
	 * Reads a row of a CAMCAT file and return feature result. For example: 'componenteX,componenteY,prop1,....propN'
	 * 
	 * 
	 * Parameters:
	 * 
	 * row - Name of the new layer url - URL where the file is
     */
    readFeature: function(row, proj_orig, separator){
    	var feature = null;
    	var row_splited = null;
    	//El formato de la fila es el conocido CAMCAT: ejemplo: 'componenteX,componenteY,prop1,....propN'
    	// "X","Y","INE_NUM","INE","NOM","NOM_PROVINCIA","ID_COMARCA","NOM_COMARCA","ID_POBLACIO","NOM_POBLACIO"
    	if(!!row){
    		// Split by the separator
    		row_splited = row.toString().split(separator);
    		row_splited = this.clearParams(row_splited);
    		var data = {};
    		var floatX = parseFloat(row_splited[0]);
    		var floatY = parseFloat(row_splited[1]);
    		if(!isNaN(floatX) && !isNaN(floatY)){
    			data.x = floatX;
    			data.y = floatY;
    			
    			var proj_goal = new OpenLayers.Projection(map.projection);
        		//Reproyeccion
    			var point = new OpenLayers.Geometry.Point(data.x, data.y);
    			var geom = OpenLayers.Projection.transform(point, proj_orig, proj_goal);
    			feature = new OpenLayers.Feature.Vector(geom);
            	
        		if(!!feature && !!feature.data){
    	        	for(var i = 2; i < row_splited.length; i++){
    	        		feature.data["camp " + (i-1) + ":"] = row_splited[i];
    	        	}
        		}
    		}
    	}
		
    	return feature;
    },
    
    clearParams: function(row_splited){
    	var arraySplited = [];
    	for(var i=0; i<row_splited.length; i++){
    		if((row_splited[i].startsWith("\"") && row_splited[i].lastIndexOf("\"") == row_splited[i].length-1) 
    				|| (row_splited[i].startsWith("\'") && row_splited[i].lastIndexOf("\'") == row_splited[i].length-1)){
    			arraySplited.push(row_splited[i].substr(1, row_splited[i].length-2));
    		}else{
    			arraySplited.push(row_splited[i]);
    		}
    	}
    	return arraySplited;
    },
    
    search: function(reg, text, max){
    	var arrMatches = new Array();
        var matchedNum = null;
        var aux = text;
        var count = 0;
		while (matchedNum = reg.exec(aux)) {
			arrMatches.push(this.clear(matchedNum[0]));
			aux = aux.replace(reg,"");
			if(count++ >= max){
				break;
			}
        }
		return arrMatches;
    },
    
    clear: function (str){
    	var result = str;
    	while(result.indexOf(" ") >= 0){
    		result = result.replace(" ","");
    	}
    	return result; 
    }
});
