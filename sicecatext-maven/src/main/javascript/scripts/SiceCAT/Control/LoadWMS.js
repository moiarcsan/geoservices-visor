/* 
 * LoadWMS.js
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
 * Class: Openlayers.Control.LoadWMS 
 * 
 * The LoadWMS control is a button to load a WMS URL.
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
OpenLayers.Control.LoadWMS = OpenLayers.Class(OpenLayers.Control.LoadKML,{
	fileType : "WMS",
	CLASS_NAME : "OpenLayers.Control.LoadWMS",
	CLASS_NAME : "LoadWMS",
	displayClass : "ControlLoadWMS",
	formatType : null,
	/**
     * Property: obtenerCapasText
     * {String} Default text to be show
     */
	obtenerCapasText: "Load layers from server",
	/**
     * Property: seleccionaWMSText
     * {String} Default text to be show
     */
	seleccionaWMSText: "Select WMS to load",
	/**
     * Property: errorLoadWMSText
     * {String} Default text to be show
     */
	errorLoadWMSText: "Error loading URL; or layers incompatibility.",
	/**
     * Property: nombreText
     * {String} Default text to be show
     */
	nombreText: "Name: ",
	/*
	 * Function: LoadWMS_buscaLayers
	 * 
	 * Parameters:
	 * 
	 * wmsurl - URL where the WMS is located at
	 */
	LoadWMS_buscaLayers: function (wmsurl) {
		var store = new GeoExt.data.WMSCapabilitiesStore({
			url : "downloadWMS/" + LoadWMS_encode64(wmsurl.trim()),
			autoLoad : false
		});
		
		var errorLoadWMSText = this.errorLoadWMSText;

		var funcion_callback = function(r, options, success) {
			var layerdiv = document.getElementById('popup_WMS_layers');
			layerdiv.setAttribute("checked", '');
			layerdiv.innerHTML = "";

			var button = Ext.get("popup_WMS_button");
			button.dom.disabled = true;

			Ext.each(store.data.items,
			function(item, index) {
				// Miramos que sea compatible con nuestro tipo de
				// proyección y creamos el radiobutton
				if (item.data.srs[button.mapa.projection]) {
					var radioItem = document.createElement("input");
					radioItem.type = "checkbox";
					radioItem.name = "radGroup";
					radioItem.id = "idrad_" + index;
					radioItem.value = item.data.name;
					// Hacemos que se actualicen la lista de capas seleccionadas y estado del
					// botón cargar (disabled o no) cada vez que se modifica un check.
					radioItem
							.setAttribute(
									"onchange",
									"var selectedLayers = '';" +
									"Ext.each(document.getElementById('popup_WMS_layers').children, function(item, index) {" +
									"if(item.value != undefined && item.checked == true) {" +
									"selectedLayers += item.value + ',';" +
									"}" +
									"});" +
									"selectedLayers = selectedLayers.substring(0, selectedLayers.length - 1);" +
									"this.parentNode.setAttribute('checked', selectedLayers);" +
									"document.getElementById('popup_WMS_button').disabled = this.parentNode.getAttribute('checked') == undefined || this.parentNode.getAttribute('checked') == '';" +
									"");
					var radioLabel = document
							.createElement("label");
					radioLabel.innerHTML = item.data.title ? item.data.title
							: item.data.name;

					var layerdiv = document
							.getElementById('popup_WMS_layers');
					layerdiv.appendChild(radioItem);
					layerdiv.appendChild(radioLabel);
				}
			});
			
			if (store == null || store.data == null || layerdiv.children.length < 1) {
				// Limpiamos el listado y ponemos el mensaje
				Ext.each(layerdiv.children, function(item, index) {
					layerdiv.removeChild(item);
				});
				layerdiv.innerHTML = "<label>" + errorLoadWMSText + "</label>";
				Ext.get("layerOptions").setDisplayed(false);
			} else {
				Ext.get("layerOptions").setDisplayed(true);
			}
		};

		try {
			// Colocamos el icono de loading...
			document.getElementById('popup_WMS_layers').innerHTML = "<img src='lib/SiceCAT/images/loading.gif' />";

			store.load({
				callback : funcion_callback
			});
		} catch (err) {
			return err;
		}

		return '';
	},

	LoadWMS_annadeLayer: function() {
		var newLayer = new OpenLayers.Layer.WMS(
				Ext.get('popup_WMS_name').dom.value,
				Ext.get('popup_WMS_url').dom.value,
				{	layers: Ext.get('popup_WMS_layers').getAttribute('checked') },
				{
					opacity: Ext.get('lopacity').dom.value,
					isBaseLayer: Ext.get('baseLayer').dom.checked });
		if(Sicecat.isLogEnable) console.log(Ext.get('popup_WMS_layers').getAttribute('checked') + " - " + Ext.get('lopacity').dom.value + " - " + Ext.get('baseLayer').dom.checked);
		Ext.get('popup_WMS_button').mapa.addLayer(newLayer);
		
		// make layer visible in the tree
		tree.expand();
		Ext.each(tree.root.childNodes, function(item, index) {
			item.expand();
			var collapse = true;
			Ext.each(item.childNodes, function(it, ind) {
				if(it.layer.name == Ext.get('popup_WMS_name').dom.value) {
					collapse = false;
					return false; // break
				}
			});
			collapse ? item.collapse() : item.expand();
		});
	},
	/*
	 * Function: trigger
	 * 
	 * Function trigered when the button is clicked. It shows a
	 * wizard form to add a new WMS layer.
	 */
	trigger : function() {
		this.removePopUp();

		// NOMBRE
		var labelName = document.createElement("label");
		labelName.innerHTML = this.nombreText;
		var lname = document.createElement("input");
		lname.setAttribute("type", "text");
		lname.setAttribute("class", "popup_WMS_name");
		lname.setAttribute("id", "popup_WMS_name");

		// URL
		var labelURL = document.createElement("label");
		labelURL.innerHTML = "URL: ";
		var url = document.createElement("input");
		url.setAttribute("type", "text");
		url.setAttribute("class", "popup_WMS_url");
		url.setAttribute("id", "popup_WMS_url");
		
		// BOTÓN OBTENER CAPAS SERVIDOR
		var buttonCapas = document.createElement("input");
		buttonCapas.setAttribute("type", "button");
		buttonCapas.setAttribute("class", "popup_WMS_button_capas");
		buttonCapas.setAttribute("id", "popup_WMS_button_capas");
		buttonCapas.setAttribute("name", "Obtener capas del servidor");
		buttonCapas.setAttribute("value", this.obtenerCapasText);
		buttonCapas.setAttribute("onclick", "actions[\"loadWMS\"].control.LoadWMS_buscaLayers(document.getElementById('popup_WMS_url').value);");
		
		// LAYERS
		var layers = document.createElement("div");
		layers.setAttribute("id", "popup_WMS_layers");
		layers.setAttribute("checked", '');

		// OPCIONES DE CAPA
		var loptions = document.createElement("div");
		loptions.setAttribute("id", "layerOptions");
		loptions.setAttribute("style", "display: none;");
		var baseLayer = document.createElement("input");
		baseLayer.setAttribute("id", "baseLayer");
		baseLayer.name = "layerGroup";
		baseLayer.type = "radio";
		var labelBaseLayer = document.createElement("label");
		labelBaseLayer.innerHTML = "Base Layer";
		var overlays = document.createElement("input");
		overlays.setAttribute("id", "overlays");
		overlays.name = "layerGroup";
		overlays.type = "radio";
		var labelOverlays = document.createElement("label");
		labelOverlays.innerHTML = "Overlays";
		var labelOpacity = document.createElement("label");
		labelOpacity.setAttribute("id", "lopacity");
		labelOpacity.innerHTML = "Opacidad: 1";
		var lslider = document.createElement("div");
		lslider.setAttribute("id", "slider-id");
		loptions.appendChild(baseLayer);
		loptions.appendChild(labelBaseLayer);
		loptions.appendChild(overlays);
		loptions.appendChild(labelOverlays);
		loptions.appendChild(document.createElement("br"));
		loptions.appendChild(labelOpacity);
		loptions.appendChild(lslider);						
		
		// BOTÓN CARGA
		var button = document.createElement("input");
		button.setAttribute("type", "button");
		button.setAttribute("class", "popup_WMS_button");
		button.setAttribute("id", "popup_WMS_button");
		button.setAttribute("name", "Cargar");
		button.setAttribute("value", "Cargar");
		button.setAttribute("disabled", true);

		
		// FORMULARIO Y POPUP
		var divTag = document.createElement("div");
		divTag.setAttribute("id", "popup_in");

		divTag.appendChild(labelName);
		divTag.appendChild(lname);
		divTag.appendChild(document.createElement("br"));
		divTag.appendChild(labelURL);
		divTag.appendChild(url);
		divTag.appendChild(document.createElement("br"));
		divTag.appendChild(buttonCapas);
		divTag.appendChild(layers);
		divTag.appendChild(loptions);
		divTag.appendChild(button);

		var div = document.createElement("div");
		div.appendChild(divTag);

		var popup = new GeoExt.Popup({
			title : this.seleccionaWMSText,
			width : 250,
			maximizable : true,
			collapsible : true,
			map : this.map,
			html : div.innerHTML,
			anchored : false,
			bodyCssClass : "popup_" + this.fileType,
			closeable : true,
			autoHeight : true,
			autoWidth : true,
			autoScroll : true
		});
		popup.on("open", function() {
		});
		popup.doLayout();
		popup.show();
		Ext.get("popup_in").control = this;

		Ext.get("popup_WMS_button").mapa = this.map;
		Ext.get("popup_WMS_button").dom
				.setAttribute("onclick",
						"Ext.get('popup_in').control.removePopUp();");

		var slider = new Ext.slider.SingleSlider({
			id: "opacitySlider",
			renderTo: "slider-id",
			value: 20,
			increment: 1,
			minValue: 0,
			maxValue: 20,
			width: 100,
		    listeners: {
		        change: function(el, val) {
					Ext.get("lopacity").dom.innerHTML = "Opacidad: " + val / 20;
					Ext.get("lopacity").dom.value = val / 20;
		        }
		    }
		});
		
		Ext.get("baseLayer").dom.checked = true;
	},


	/**
	 * Method: loadLayer
	 */
	loadLayer : function(name, url) {
	}

});

/*
 * Function LoadWMS_encode64
 * 
 * Encode in 64 bytes the string parameter.
 * 
 * Parameters:
 * 
 * input - String input to encode
 * 
 * Returns:
 * 
 * String encoded in 64 bytes format.
 */
function LoadWMS_encode64(input) {
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	var output = '';
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	while (i < input.length) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output += (keyStr.charAt(enc1) + keyStr.charAt(enc2)
				+ keyStr.charAt(enc3) + keyStr.charAt(enc4));
	}

	return output;
}
