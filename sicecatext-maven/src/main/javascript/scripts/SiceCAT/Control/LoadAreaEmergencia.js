/* 
 * LoadAreaEmergencia.js
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
 * Class: Openlayers.Control.LoadAreaEmergencia 
 * 
 * The LoadAreaEmergencia control is a button to load an emergency area.
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Control> 
 * 
 * See Also: 
 * 
 * <Openlayers.Control.LoadKML>
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
 * Mariano López Muñoz (mlopez@emergya.com)
 */

OpenLayers.Control.LoadAreaEmergencia =
		OpenLayers.Class(OpenLayers.Control.LoadKML, {
	fileType : null,
	CLASS_NAME : "LoadAreaEmergencia",
	displayClass : "ControlLoadAreaEmergencia",
//	formatType : null,
	
	onMenuContextual: {

	},

	trigger: function() {
		this.removePopUp();
		
		// TARGETLAYER
		var labelTarget = document.createElement("label");
		labelTarget.innerHTML = "Nombre: ";
		var targetName = document.createElement("input");
		targetName.setAttribute("type", "text");
		targetName.setAttribute("class", "popup_LoadAE_name");
		targetName.setAttribute("id", "popup_LoadAE_name");

		// INPUT FICHERO
		var input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("class", "popup_LoadAE_file");
		input.setAttribute("name", "file");
		input.setAttribute("id", "popup_LoadAE_file");

		// BOTÓN CARGA
		var button = document.createElement("input");
		button.setAttribute("type", "button");
		button.setAttribute("type", "submit");
		button.setAttribute("class", "popup_LoadAE_button");
		button.setAttribute("id", "popup_LoadAE_button");
		button.setAttribute("value", "Cargar");

		// FORMULARIO Y POPUP
		var divTag = document.createElement("form");
		divTag.setAttribute("method", "POST");
		divTag.setAttribute("enctype", "multipart/form-data");
		divTag.setAttribute("action", Sicecat.uploadServletURL);

		divTag.setAttribute("id", "popup_in");

		divTag.appendChild(labelTarget);
		divTag.appendChild(targetName);
		divTag.appendChild(document.createElement("br"));
		divTag.appendChild(input);
		divTag.appendChild(document.createElement("br"));
		divTag.appendChild(button);

		var div = document.createElement("div");
		div.appendChild(divTag);

		var popup = new GeoExt.Popup({
			title : "Selecciona el KML/GML a cargar",
			width : 250,
			maximizable : true,
			collapsible : true,
			map : this.map,
			html : div.innerHTML,
			anchored : false,
			bodyCssClass : "popup_LoadAE",
			closeable : true
		});
		popup.on("open", function() {
		});
		popup.doLayout();
		
		popup.show();
		document.getElementById("popup_in").control = this;

		// Ext.get("popup_LoadAE_button").mapa = this.map;
		
		onclick = function() {
			var tempForm = new Ext.form.BasicForm(Ext.get("popup_in"));
			tempForm.submit({
				fileUpload : true,
				method : 'POST',
				success : function(form, action) {
					if (action.result.error == null
							&& action.result.path != null)
						document.getElementById("popup_in").control.loadLayer(
								action.result.name, Sicecat.downloadServletURL
										+ action.result.path);
					else if (action.result.error != null)
						alert(action.result.error);
				},
				failure : function(form, action) {
					if (action.result.error == null
							&& action.result.path != null)
						document.getElementById("popup_in").control.loadLayer(
								action.result.name, Sicecat.downloadServletURL
										+ action.result.path);
					else if (action.result.error != null)
						alert(action.result.error);
				}
			});
		};

		document.getElementById("popup_LoadAE_button")
				.setAttribute("onclick", onclick);

	},
	
	
	/**
	 * Method: loadLayer
	 */
	loadLayer : function(name, url) {
//		if(Sicecat.isLogEnable) console.log("loadLayer: " + name + "-" + url);
		if( /\.[Gg][Mm][Ll]$/.test(name) ) {
//			if(Sicecat.isLogEnable) console.log("LoadAreaEmergencia: loadLayer GML");
			this.map.addLayer(new OpenLayers.Layer.GML(name, url));
		} else if ( /\.[Kk][Mm][Ll]$/.test(name) ) {
//			if(Sicecat.isLogEnable) console.log("LoadAreaEmergencia: loadLayer KML");
			this.map.addLayer(new OpenLayers.Layer.Vector(name, {
				strategies : [ new OpenLayers.Strategy.Fixed() ],
				protocol : new OpenLayers.Protocol.HTTP({
					url : url,
					format : new OpenLayers.Format.KML({
						extractStyles : true,
						extractAttributes : true,
						maxDepth : 2
					})
				})
			}));
		}
		this.removePopUp();
	}

});

