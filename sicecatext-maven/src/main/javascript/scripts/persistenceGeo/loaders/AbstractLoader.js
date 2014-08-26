/*
 * AbstractLoader.js Copyright (C) 2012 This file is part of PersistenceGeo project
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

/** api: (define)
 *  module = PersistenceGeo
 */
Ext.namespace("PersistenceGeo.loaders");

/**
 * Class: PersistenceGeo.AbstractLoader
 * 
 * Abstract loader for Layers
 * 
 */
PersistenceGeo.loaders.AbstractLoader =  Ext.extend(Ext.Component,
	{

		/**
		 * OpenLayers map to load the layer
		 */
		map: null,

		/**
		 * Base url to replace default base url
		 */
		restBaseUrl: 'rest',

		/**
		 * Base url to be replaced with other restBaseUrl
		 */
		defaultRestBaseUrl: 'rest',
		
		/**
		 * Method to be called for generate OpenLayers layer
		 * 
		 * @return OpenLayers.Layer
		 */
		load: null,

		parseStringToArrayNumbers: function (string){
			var numbers = new Array();
			var stringArray = string.split(",");
			for(var i = 0; i < stringArray.length; i++){
				numbers.push(this.toNumber(stringArray[i]));
			}
			return numbers;
		},
		
		toBoolean: function(string){
			return (string === "true");
		},
		
		toNumber: function(string){
			return parseFloat(string);
		},
		
		getGroupSubGroupLayer: function (layerData){
			return {
				group: layerData.folderId,
				subGroup: layerData.folderId
			};
		},

	    copyAllPosibleProperties: function (fromMap, toMap){
	        for(var key in fromMap){
	            if (!!fromMap[key]
	                && ((typeof fromMap[key] == "string")
	                    || (typeof fromMap[key] == "number")
	                    || (typeof fromMap[key] == "boolean"))) {
	                toMap[key] = fromMap[key];
	            }
	        }
	    },
		
		postFunctionsWrapper: function (layerData, layer, layerTree){
			this.postFunctionsGroups(layerData, layer, layerTree);
			this.postFunctionsPermission(layerData, layer);
			this.postFunctionsStyle(layerData, layer);
			this.postFunctionsOrder(layerData, layer);
			this.postFunctionsVisibility(layerData, layer);
		},
		
		postFunctionsVisibility: function (layerData, layer){
			if(!!layerData.properties){
				var visibility = layerData.properties.visibility ? this.toBoolean(layerData.properties.visibility) : false;
				if(layer.visibility != visibility){
					layer.setVisibility(visibility);
				}
			}
		},
		
		postFunctionsOrder: function (layerData, layer){
			if(!!layerData.properties
					&& !!layerData.properties.order){
				layer.order = layerData.properties.order;
			}
		},
		
		postFunctionsGroups: function (layerData, layer, layerTree){
			var groupSub = PersistenceGeoParser.AbstractLoader.getGroupSubGroupLayer(layerData);
			layer.groupLayers = groupSub.group;
			layer.subgroupLayers = groupSub.subGroup;

			//Get folder names
			var group = PersistenceGeoParser.getFolderName(layer.groupLayers);
			var subgroup = PersistenceGeoParser.getFolderName(layer.subgroupLayers);
			
			//Save folder ids
			layer.groupLayersIndex = layer.groupLayers;
			layer.subGroupLayersIndex = layer.subgroupLayers;
			
			//Group
			if(! group){
				group = subgroup;
			}
			//Hide root folder
			var group_label = subgroup;
			if(!!group_label && group_label.indexOf("-") > 0){
				group_label = group_label.split("-")[1];
			}
			// Adds to layerTree
			if (!!group_label
					&& !!layerTree
					&& !layerTree.containsKey(group_label)) {
				//console.log("Creating '"+group_label+"'");
				layerTree.add(group_label,
						new Ext.util.MixedCollection());
			}
			
			//Subgroup
			var subgroup_label = subgroup;
			//Hide root folder
			if(!!subgroup_label && subgroup_label.indexOf("-") > 0){
				subgroup_label = subgroup_label.split("-")[subgroup_label.split("-").length-1];
			}
			// Adds to layerTree
			if(!!group_label
					&& group_label != subgroup_label 
					&& !layerTree.item(group_label).containsKey(subgroup_label)){
				//console.log("Creating '"+group_label + "-"+subgroup_label+"'");
				layerTree.item(group_label).add(subgroup_label,
					subgroup_label);
			}
			
			//To save at layer
			layer.groupLayers = subgroup;
			if(!!subgroup && subgroup.indexOf("-") > 0){
				layer.groupLayers = subgroup.substring(subgroup.indexOf("-")+1);
			}
			layer.subgroupLayers = group;
			if(!!group && group.indexOf("-") > 0){
				layer.subgroupLayers = subgroup_label;
			}
		},
		
		postFunctionsPermission: function(layerData, layer){
			// Save layer ids
			layer.layerID = layerData.id;
			layer.userID = layerData.userId;
			layer.groupID = layerData.authId;
			layer.folderID = layerData.folderId;
		},
		
		parseValueStyle: function (name, original){
			if(name.indexOf('Opacity') >  -1){
				return PersistenceGeoParser.AbstractLoader.toNumber(original);
			}else{
				return original;
			}
		},
		
		getStyleFromData: function(layerData, style){
			var ret = null;
			if(layerData.styles[style] && layerData.styles[style].true){
				ret = layerData.styles[style].true;
			}else{
				ret = layerData.styles[style];
			}
			return ret;
		},
		
		preFunctionStyle: function(layerData){
			// Get default style from data base
			var defaultStyle = null;
			if(layerData.styles){
				if(layerData.styles["default"]){
					defaultStyle = this.getStyleFromData(layerData, "default");
					defaultStyle["cursor"] = "pointer";
				}
			}
			// Others styles by default from OpenLayers
			return new OpenLayers.StyleMap({
				'default': defaultStyle, 
				'select': OpenLayers.Feature.Vector.style["select"],
				'delete': OpenLayers.Feature.Vector.style["delete"],
				'temporary': OpenLayers.Feature.Vector.style["temporary"]
			});
		},
		
		postFunctionsStyle: function(layerData, layer){
			var symbolizer = {};
			layer.events.register("loadend", 
					{
						layer: layer, 
						symbolizer: symbolizer
					}, 
					function() {
						//Forze style
						if(!this.layer.features || this.layer.features.length == 0){
							if(this.layer.styleMap 
									&& this.layer.styleMap.styles 
									&& this.layer.styleMap.styles.default 
									&& this.layer.styleMap.styles.default.defaultStyle
									&& this.layer.styleMap.styles.default.defaultStyle.cursor){
								if(this.layer.styleMap.styles.default.defaultStyle.cursor != "pointer"){
									this.layer.styleMap.styles.default.defaultStyle.cursor = "pointer";
								}
							}
						}else{
							for(var i = 0; i < this.layer.features.length; i++){
								var styleDefined = OpenLayers.Util.applyDefaults(this.symbolizer, OpenLayers.Feature.Vector.style["default"]);
								this.layer.features[i].style = null;
							}
							this.layer.redraw();
						}
					}
	            );
		}
});