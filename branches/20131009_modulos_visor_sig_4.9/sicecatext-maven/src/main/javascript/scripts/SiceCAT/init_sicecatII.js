/*
 * init_sicecatII.js
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
 * Author: Maria Arias de Reyna Dominguez (marias@emergya.com)
 * Author: Moisés Arcos Santiago (marcos@emergya.com)
 * 
 */

/**
 * @requires transcat.js
 * @requires west_sicecatII.js
 * @requires map_sicecatII.js
 * @requires east_sicecatII.js
 */

// TODO: poner todas las funciones y parametros en SiceCAT.js
/*
 * Variables a inicializar con las funciones desde onReady
 */
var mapPanel, panelGML, header, footer, tree, leftSide, rightSide, searcher, exporter = [], localizator = [], routing = [], editor, App, stylingBar = [];
var map = null, vector, printCapabilities, toolbarNav = [], footBar = [], ctrl, action, actions = {};
var integrator;
var stupid = false;
var secondAPI = null;

Ext.onReady(function() {

	// if(Ext.isIE){
	// alert("Actualmente el visor sólo está preparado para su uso Chorme o
	// Firefox, por favor, disculpe las molestias");
	// }else{

	if (stupid)
		return true;

	Ext.QuickTips.init();
	Sicecat = new SiceCAT({
		listeners : {
			readyToCreateMap : load_first
		}
	});
	Sicecat.loadConfiguration();
	var secondaryAPI = null;
	if (window.opener && window.opener.top && window.opener
			&& window.opener.top && window.opener.top.frames
			&& window.opener.top.frames.sicecatlibrary) {
		secondaryAPI = window.opener.top.frames.sicecatlibrary;
	}
	if (secondaryAPI != null) {
		integrator = new SIGIntegrator({
			secondaryAPI : secondaryAPI,
			sicecatInstance : Sicecat,
			listeners : {
				readyToLogin : secondaryAPI.msAplVisorReadyToLogin,
				readyToInteract : secondaryAPI.msAplVisorReadyToInteract
			}
		});
		secondAPI = secondaryAPI;
	} else {
		alert("No se ha abierto desde SICECAT");
		// integrator = new SIGIntegrator();
	}

	// }
});

/**
 * Inicializa los paneles
 */
function init_all() {
	if (Sicecat.isLogEnable)
		console.log("Initialize Visor Sicecat");
	Sicecat.loadMapConfiguration(function() {
		map = Sicecat.map;
	}, true);
}

function load_first() {
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_first");
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_first user --> " + Global_TMP.user);
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_first permisos --> " + Global_TMP.permisos);
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_first municipio --> "
				+ Global_TMP.idMunicipio);

	var userGroup = 'CECAT';

	if (integrator.modo == integrator.TIPO_GPCL) {
		userGroup = 'GPCL';
	}

	PersistenceGeoParser.login(Global_TMP.user, userGroup,
			Global_TMP.idMunicipio, function(form, action) {
				console.log("test");
				Sicecat.loadStyling(load_second);
			}, function(form, action) {
				if (!!action && !!action.response && !!action.response.status
						&& action.response.status == "200"
						&& !!action.response.responseText) {
					Sicecat.loadStyling(load_second);
				} else {
					Ext.Msg.alert('Warning', 'Login error');
				}
			});
}

function load_second() {
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_second");
	map = Sicecat.map;
	Sicecat.loadSearchServices(function() {
		;
	});
	Sicecat.loadLayers(load_third);
}

function loadApiLayers() {
	var self = this;
	// Recuperamos las capas
	Ext.Ajax
			.request({
				url : 'rest/persistenceGeo/userContext/loadLayers/'
						+ Sicecat.idSession,
				method : 'POST',
				success : function(response) {
					if (Sicecat.isLogEnable) {
						console
								.info("Las features se han cargado correctamente: ");
						console.dir(response);
					}
					var jsonResponse = Ext.util.JSON
							.decode(response.responseText);
					var features = jsonResponse.data;
					for (feat in features) {
						var obj = features[feat];
						// Intentar aprovechar el metodo de la api
						self.createDefLayer(obj);
					}
				},
				failure : function(response) {
					if (Sicecat.isLogEnable) {
						console
								.error("[Error] Las features no se han cargado correctamente: ");
						console.dir(response);
					}
				}
			});
}

function loadApiFeatures() {
	var self = this;
	// Recuperamos las features
	Ext.Ajax
			.request({
				url : 'rest/persistenceGeo/userContext/loadFeatures/'
						+ Sicecat.idSession,
				method : 'POST',
				success : function(response) {
					if (Sicecat.isLogEnable) {
						console
								.info("Las features se han cargado correctamente: ");
						console.dir(response);
					}
					var jsonResponse = Ext.util.JSON
							.decode(response.responseText);
					var features = jsonResponse.data;
					for (feat in features) {
						var obj = features[feat];
						var feature = Ext.util.JSON.decode(obj.jsonFeature);
						// Intentar aprovechar el metodo de la api
						self.createDefElement(feature);
					}
				},
				failure : function(response) {
					if (Sicecat.isLogEnable) {
						console
								.error("[Error] Las features no se han cargado correctamente: ");
						console.dir(response);
					}
				}
			});
}

function refreshElements() {
	Sicecat.showHideMessageInformation(Sicecat.contextRefreshedText);
	this.loadApiFeatures();
	this.loadApiLayers();
}

function load_third() {
	if (Sicecat.isLogEnable)
		console.log("[Sicecat] load_third");
	var self = this;
	var refreshDisablerControl = new OpenLayers.Control.RefreshDisabler({
		onRefresh : function(evt) {
			if (evt.timeStamp - this.keyPressed > 10000) {
				this.keyPressed = evt.timeStamp;
				Sicecat.refreshLayers(self.refreshElements());
			}
		}
	});
	map.addControl(refreshDisablerControl);
	refreshDisablerControl.activate();

	if (Global_TMP.permisos.indexOf("admin") > -1) {
		load_fourth();
	}
	// Load user folder
	Sicecat.loadUserFolder(Global_TMP.user, load_fourth);

}
/*
 * method: cloneObject
 * 
 * Clone map properties
 */
function cloneObject(object) {
	var cloned = {};
	var i = 0;
	for ( var key in object) {
		if (!!object[key]
				&& !((typeof object[key] == "string")
						|| (typeof object[key] == "number") || (typeof object[key] == "function"))) {
			cloned[key] = this.cloneObject(object[key]);
			i++;
		} else {
			cloned[key] = object[key];
			i++;
		}
	}
	if (i > 1) {
		return cloned;
	} else {
		return object;
	}
}
/*
 * method: tranformToMapProjection
 * 
 * Transform the projection of a pointo into map projection
 */
function tranformToMapProjection(point, projeccio) {

	var proj_orig = new Proj4js.Proj(projeccio);
	var proj_goal = new Proj4js.Proj(this.map.projection);

	return Proj4js.transform(proj_orig, proj_goal, point);
}
/*
 * method: createDefElementsMethods
 * 
 * Creates the methods getters and setters to a defElement
 * 
 */
function createDefElementsMethods(element) {
	element.getCapa = function() {
		return element.capa;
	};
	element.getDescription = function() {
		return element.description;
	};
	element.getId = function() {
		return element.id;
	};
	element.getName = function() {
		return element.name;
	};
	element.getPosX = function() {
		return element.posx;
	};
	element.getPosY = function() {
		return element.posy;
	};
	element.getProjeccio = function() {
		return element.projeccio;
	};
	element.getStyle = function() {
		return element.style;
	};
	element.getType = function() {
		return element.type;
	};
	element.setCapa = function(Capa) {
		element.capa = Capa;
	};
	element.setDescription = function(Description) {
		element.desciption = Description;
	};
	element.setId = function(Id) {
		element.id = Id;
	};
	element.setName = function(Name) {
		element.name = Name;
	};
	element.setPosX = function(PosX) {
		element.posx = PosX;
	};
	element.setPosY = function(PosY) {
		element.posy = PosY;
	};
	element.setProjeccio = function(Projeccio) {
		element.projeccio = Pojeccio;
	};
	element.setStyle = function(Style) {
		element.style = Style;
	};
	element.setType = function(Type) {
		element.type = type;
	};

	return element;
}
/*
 * method: createDefElement
 * 
 * Re-create the integrator element added
 */
function createDefElement(element) {
	element = this.createDefElementsMethods(element);
	var layerName = element.getCapa();
	if (layerName != null) {
		// Creamos la capa
		var layerArray = map.getLayersByName(layerName);
		var layerAux = null;
		if (layerArray.length > 0) {
			// Hay una capa auxiliar creada
			layerAux = layerArray[0];
		} else {
			// No está la capa creada
			layerAux = new OpenLayers.Layer.Vector(layerName, {
				strategies : [ new OpenLayers.Strategy.Save() ],
				styleMap : Sicecat.createStyleMap()
			});
			Sicecat.addLayer(layerAux);
			layerAux.id = element.capa;
			layerAux.events.on({
				'added' : function() {
					actions["tooltipcontrol"].control.activate();
				}
			});
		}
	}
	integrator.msGisShowElement(element);
}

function createDefLayer(layer) {
	integrator.msGisCreateCapa(layer.id, layer.name, layer.order, false);
}

function load_fourth() {
	// do the Ext.Ajax.request
	Ext.Ajax.request({
		// the url to the remote source
		url : 'files.do/sicecatext-info.json.do',
		// define a handler for request success
		success : function(response, options) {
			json = Ext.util.JSON.decode(response.responseText);
			sicecatVersion = json.version;
			sicecatBuildNumber = json.buildNumber;
			load_fifth();
		},
		failure : function() {
			sicecatVersion = 'version desconocida';
			sicecatBuildNumber = null;
			load_fifth();
		}
	});
}

function load_fifth() {

	var mapLayout = new SiceCAT.MapLayout();
	mapLayout.sicecatInstance = Sicecat;
	mapLayout.map = map;
	mapLayout.init_map_sicecatII();
	mapPanel = mapLayout.mapPanel;
	toolbarNav = mapLayout.toolbarNav;
	footBar = mapLayout.footBar;
	mapLayout.footBar = null;
	map = mapLayout.map;
	vector = mapLayout.vector;

	var west = new SiceCAT.West();
	west.sicecatInstance = Sicecat;
	west.map = map;
	west.init_left_panel();
	leftSide = west.leftSide;
	tree = west.tree;
	searcher = west.searcher;
	localizator = west.localizator;
	routing = west.routing;
	stylingBar = west.stylingBar;
	init_rigth_panel();

	Sicecat.west = west;
	Sicecat.user.login = Global_TMP.user;
	Sicecat.user.permisos = Global_TMP.permisos;
	Sicecat.userInfo.nombreCompleto = Global_TMP.nombreCompleto;
	Sicecat.userInfo.nombreMunicipio = Global_TMP.nombreMunicipio;
	Sicecat.idMunicipio = Global_TMP.idMunicipio;
	Sicecat.idComarca = Global_TMP.idComarca;
	Sicecat.SELECTED_GROUP = Global_TMP.SELECTED_GROUP;
	Sicecat.USER_GROUP = Global_TMP.USER_GROUP;

	init_header();
	init_footer();

	try {
		init_viewport();
	} catch (e) {
	}

	// Establece el mapa
	integrator.map = map;

	init_map_menu();

	// Remove southern (footer) panel bar which was empty
	var elArray = Ext.DomQuery.select(".x-panel-bbar");
	for (elementCount = 0; elementCount < elArray.length; elementCount++) {
		var parentNode = elArray[elementCount].parentNode;
		parentNode.removeChild(elArray[elementCount]);
	}

	mapPanel.doLayout();

	// Redistribute buttons that cannot be handled by css

	Ext.DomQuery.select(".gx-zoomslider")[0].style.top = "80px";
	Ext.DomQuery.select(".gx-zoomslider")[0].style.left = "16px";

	var divPanZoom = Ext.DomQuery
			.select('div[id^="OpenLayers.Control.PanZoom_"]')[0];

	if (!!divPanZoom) {
		var id_panZoom = divPanZoom.id.substring(27);
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_zoomin").style.left = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_zoomin").style.top = "65px";

		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_zoomout").style.left = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_zoomout").style.top = "168px";

		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_zoomworld").style.visibility = "hidden";

		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_pandown").style.height = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panup").style.height = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panright").style.width = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panleft").style.width = "12px";

		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_pandown_innerImage").style.height = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panup_innerImage").style.height = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panright_innerImage").style.width = "12px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panleft_innerImage").style.width = "12px";

		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panup").style.top = "10px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panright").style.left = "22px";
		$("OpenLayers.Control.PanZoom_" + id_panZoom + "_panleft").style.left = "10px";
	}

	if (Sicecat.layerComarcaMunicipio) {
		Sicecat.map.addLayer(Sicecat.layerComarcaMunicipio);
		Sicecat.map.zoomToExtent(Sicecat.loadedBBox, true);
	} else if (Sicecat.map.maxExtent) {
		Sicecat.map.zoomToExtent(Sicecat.map.maxExtent, true);
	}

	AuxiliaryLayer.map = Sicecat.map;

	Sicecat.parser = new SiceCATGeoParser({
		map : this.map
	});

	// SIGIntegratos#readyToInteract callback
	secondAPI.msAplVisorReadyToInteract(integrator);
	Sicecat.showCompatibiltyWindow();
	// Nombre completo de usuario
	if(Sicecat.userInfo.nombreCompleto != null){
		$('user_id_sicecat').innerHTML = Sicecat.userInfo.nombreCompleto;
	}else if(Sicecat.userInfo.username != null){
		$('user_id_sicecat').innerHTML = Sicecat.userInfo.username;
	}
	// Nombre completo del municipio
	if(Sicecat.userInfo.nombreMunicipio != null){
		$('center_id_sicecat').innerHTML = "Ajuntament de " + Sicecat.userInfo.nombreMunicipio;
	}else if (!!Sicecat.idMunicipio) {
		$('center_id_sicecat').innerHTML = "Ajuntament de " + Sicecat.idMunicipio;
	} else {
		$('center_id_sicecat').innerHTML = 'SICECAT';
	}
	actions["tooltipcontrol"].enable();
	//collapse_header();
	this.refreshElements();
}

function init_map_menu() {
	var control = new OpenLayers.Control.MapMenu();
	map.addControl(control);
	actions["map_menu"] = control;
}

function collapse_header() {
	if (!!Ext.getCmp('sicecat_header') && Ext.getCmp('sicecat_header').collapse) {
		Ext.getCmp('sicecat_header').collapse();
	}
	var div = document.createElement('sicecat_header');
	div.setAttribute('class', 'sicecat_bottom_header_down');
	div.setAttribute('onclick', 'javascript:extend_header();');

	var divLogo = document.createElement('div');
	divLogo.className = "logo-div";
	document.getElementById('sicecat_header-xcollapsed').appendChild(divLogo);
	divLogo.innerText = " ";

	var divName = document.createElement('div');
	divName.className = "user-name";
	document.getElementById('sicecat_header-xcollapsed').appendChild(divName);
	if(!Sicecat.userInfo && !Sicecat.user){
		divName.innerText = 'Usuari desconegut';
	} else if (!!Sicecat.userInfo){
		if (Sicecat.userInfo.nombreCompleto != null) {
			divName.innerText = Sicecat.userInfo.nombreCompleto;
		} else if (Sicecat.userInfo.username != null) {
			divName.innerText = Sicecat.userInfo.username;
		}
	}else if(!!Sicecat.user && !!Sicecat.user.login){
		divName.innerText = Sicecat.user.login;
	}

	var divSep = document.createElement('div');
	divSep.className = "div-separator";
	divSep.innerText = "-";
	document.getElementById('sicecat_header-xcollapsed').appendChild(divSep);

	
	var divCentre = document.createElement('div');
	divCentre.className = "user-centre";
	document.getElementById('sicecat_header-xcollapsed').appendChild(divCentre);
	document.getElementById('sicecat_header-xcollapsed').appendChild(div);
	if (Sicecat.userInfo.nombreMunicipio != null) {
		divCentre.innerText = "Ajuntament de " + Sicecat.userInfo.nombreMunicipio;
	}else if (Sicecat.idMunicipio != null){
		divCentre.innerText = "Ajuntament de " + Sicecat.idMunicipio;
	}
}

function extend_header() {
	if (!!Ext.getCmp('sicecat_header')
			&& !!Ext.getCmp('sicecat_header').collapse) {
		Ext.getCmp('sicecat_header').expand();
	}
	var dom = Ext.getDom('sicecat_header-xcollapsed');
	var div_dom = Ext.query("div", Ext.getDom('sicecat_header-xcollapsed'));
	Ext.each(div_dom, function(el, index) {
		dom.removeChild(el);
	});
}

function init_header() {
	/* A\F1adimos la imagen de la cabecera de forma din\E1mica */
	if (Sicecat.modo != null && Sicecat.modo == "GPCL") {
		document.body.className += " gcpl";
	} else {
		document.body.className += " sicecat";
	}

	var login_box = '<div class="sicecat_login_box">'
			+ '<strong>Usuari:</strong> <div class="sicecat_login_box_usuari"><a href="#" id="user_id_sicecat">Tecnic</a></div> '
			+ '|'
			+ ' <strong>Centre:</strong> <div class="sicecat_login_box_centre"><a href="#" id="center_id_sicecat">Reus</a></div> '
			+ '</div>';
	var proteccio_civil = '<div class="sicecat_small">Protecci&oacute; civil</div>';
	var visor_sicecat = '<div class="sicecat_upper_header_big">Visor Sicecat</div>';
	var upper_header_icon = '<div class="sicecat_upper_header_icon">&nbsp</div>';
	var upper_header = '<div class="sicecat_upper_header">' + visor_sicecat
			+ proteccio_civil + login_box + upper_header_icon + '</div>';

	var sortir_label = '<div class="sicecat_bottom_header_exit" onclick="javascript:logout();">Sortir | </div>';
	var up_icon = '<div class="sicecat_bottom_header_up" onclick="javascript:collapse_header();">&nbsp;</div>';
	var bottom_header = '<div class="sicecat_bottom_header">' + sortir_label
			+ up_icon + '</div>';

	var html = '<div class="sicecat_header">' + upper_header + bottom_header
			+ '</div>';
	header = {
		id : "sicecat_header",
		autoHeight : true,
		border : false,
		html : html,
		region : 'north'
	};
	
	// Remove all temporal elements before close 
	window.onbeforeunload = function(event){
		// Enviamos una petici�n para eliminar los elementos temporales
		Ext.Ajax.request({
			url: 'rest/persistenceGeo/userContext/removeAll',
			success: function(response){
				// Cerramos la ventana
				window.close();
			}
		});
	};
}

function init_footer() {

	var version = sicecatVersion;

	if (!!sicecatBuildNumber) {
		version += " (r" + sicecatBuildNumber + ")";
	}

	if (!!Sicecat.jsonMapConfiguration["version"]) {
		version += " (DB " + Sicecat.jsonMapConfiguration["version"] + ")";
	}

	var html = '<div class="sicecatStatusBar" id="sicecatStatusBar"></div>'
			+ '<div class="sicecat_footer_left">&nbsp;&nbsp;&nbsp;&nbsp;Visor Sicecat '
			+ version
			+ '</div>'
			+ '<div class="copyright_footer">Copyright 2012 / TODOS LOS DERECHOS RESERVADOS &nbsp;&nbsp;&nbsp;&nbsp;</div>';
	footer = {
		id : "sicecat_footer",
		autoHeight : true,
		border : false,
		html : html,
		region : 'south'
	};
}

var viewport;

function init_viewport() {
	/*
	 * Panel principal, con map en el centro
	 */
	if (!!viewport) {
		viewport.removeAll();
		viewport = new Ext.Viewport({
			layout : "fit",
			hideBorders : true,
			items : {
				layout : "border",
				deferredRender : false,
				items : [ header, leftSide, mapPanel, footer ]
			}
		});
	} else {
		viewport = new Ext.Viewport({
			layout : "fit",
			hideBorders : true,
			items : {
				layout : "border",
				deferredRender : false,
				items : [ header, leftSide, mapPanel, footer ]
			}
		});
	}
}

function saveFail() {
	/*
	 * Ventana de alerta al fallar la actualización de una feature
	 */
	var alertTitleText = "Save";
	var alertMessageText = "Error: Changes don't saved";
	Ext.MessageBox.alert(alertTitleText, alertMessageText, this);
}

function logout() {
	integrator.msGisLogout();
}

/**
 * Function: onImageLoadError
 */
OpenLayers.Util.onImageLoadError = function() {
	this._attempts = (this._attempts) ? (this._attempts + 1) : 1;
	if (this._attempts <= OpenLayers.IMAGE_RELOAD_ATTEMPTS) {
		var urls = this.urls;
		if (urls && OpenLayers.Util.isArray(urls) && urls.length > 1) {
			var src = this.src.toString();
			var current_url, k;
			for (k = 0; current_url = urls[k]; k++) {
				if (src.indexOf(current_url) != -1) {
					break;
				}
			}
			var guess = Math.floor(urls.length * Math.random());
			var new_url = urls[guess];
			k = 0;
			while (new_url == current_url && k++ < 4) {
				guess = Math.floor(urls.length * Math.random());
				new_url = urls[guess];
			}
			this.src = src.replace(current_url, new_url);
		} else {
			this.src = this.src;
		}
	} else {
		// Cambiamos la imagen por un div para evitar el bucle infinito
		var div = document.createElement("div");
		div.style.className = "divSustImage";
		var text = document.createTextNode("Layer not found");
		div.appendChild(text);
		div.style.width = this.style.width;
		div.style.height = this.style.height;
		div.style.textAlign = "center";
		div.style.paddingTop = "200px";
		div.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
		if (this.parentElement) {
			this.parentElement.appendChild(div);
		}
		OpenLayers.Element.addClass(this, "olImageLoadError");
		console.log("error loading src " + this.src);
		// Comentamos this.src = ""; porque geoext lo usa para lanzarlo
		// recursivamente
		// y por tanto entraría en bucle infinito
		this.parentElement.removeChild(this);
	}
	this.style.display = "";
};
