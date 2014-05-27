/*
 * SIGIntegrator.js
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
 * @requires OpenLayers/Feature/Vector.js
 */

/**
 * Class: SIGIntegrator
 * 
 * The SIGIntegrator is designed for be called from SICECAT II and needs to be
 * initialized in SiceCAT SIG client.
 * 
 * Inherits from: - <OpenLayers.Class>
 */
SIGIntegrator = Ext
		.extend(
				Ext.util.Observable,
				{

					/**
					 * Property: errorFeatureNotFound
					 * 
					 * Message to show on error when looking for a feature.
					 */
					errorFeatureNotFound : "Feature not found -translation needed-",

					/**
					 * Property: availableLayers
					 * 
					 * Message to show on error when looking for a feature.
					 */
					availableLayers : "Available layers -translation needed-",
					/**
					 * Property: map {Openlayers.Map} Map to interact
					 */
					map : null,

					/**
					 * Property: secondaryAPI {Document.frame} with javascript
					 * functions of administrative application
					 */
					secondaryAPI : null,

					/**
					 * Property: sicecatInstance
					 * 
					 * Instancia del visor
					 */
					sicecatInstance : null,

					/*
					 * private
					 */
					styles : null,

					/*
					 * private
					 */
					search_services : null,

					/*
					 * private
					 */
					layers : null,

					/*
					 * private
					 */
					elementsSelected : new Array(),

					/**
					 * Property: debugMode {String} defines the log level
					 * (default info)
					 */
					logLevel : 'info',
					
					incidentsDetailsMap: {},
					
					incidentsDetailsIds: {},
					
					showLog: true,

					/**
					 * Method: constructor
					 * 
					 * Construct the SIGIntegrator object
					 * 
					 * Parameters: config 
					 */
					constructor : function(config) {
						if (config) {
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método constructor de SIGIntegrator, con el parámetro config igual a: ");
								console.dir(config);
							}
							this.addEvents({
								"readyToLogin" : true,
								"readyToInteract" : true
							});
							// Copy configured listeners into *this* object so
							// that the base class's
							// constructor will add them.
							this.listeners = config.listeners;
							this.sicecatInstance = config.sicecatInstance;
							// Call our superclass constructor to complete
							// construction process.
							SIGIntegrator.superclass.constructor.call(this, config);
							if (Ext.isIE) {
								this.getSecondaryAPI().msAplVisorReadyToLogin(this);
							} else {
								this.fireEvent("readyToLogin", this, this);
							}
						} else {
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el constructor de SIGIntegrator con config igual a: ");
								console.dir(config);
							}
							alert("No se puede abrir el visor de forma independiente, Ã¡brelo desde SICECAT");
						}
					},

					getSecondaryAPI : function() {
						if (this.secondaryAPI == null && window.opener
								&& window.opener.top && window.opener
								&& window.opener.top
								&& window.opener.top.frames
								&& window.opener.top.frames.sicecatlibrary) {
							this.secondaryAPI = window.opener.top.frames.sicecatlibrary;
							return this.secondaryAPI;
						} else if (this.secondaryAPI == null) {
							alert("No se puede abrir el visor de forma independiente");
							return null;
						} else {
							return this.secondaryAPI;
						}
					},

					/**
					 * Method: msGisShowElement
					 * 
					 * Mostrar un elemento
					 * 
					 * Parameters: element - {<defElement>} With (id, name,
					 * description, posX, posY) parameters and getters & setters
					 */
					msGisShowElement : function(element) {
						// Comprobamos que el parámetro no sea null
						if(element != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisShowElement de SIGIntegrator, con el parámetro element igual a: ");
								console.dir(element);
								var element_info = "element(id,name,capa,description,X,Y) = ("
									+ element.getId()
									+ ","
									+ element.getName()
									+ ","
									+ element.getCapa()
									+ ","
									+ element.getDescription()
									+ ","
									+ element.getPosX()
									+ ","
									+ element.getPosY() + ")";
							}
							// Guardamos el elemento que hemos recibido
							this.saveDefElement(element);
							if (!feature) {
								var feature = {};
								feature.position = new Array();
							}

							if (!element.getCapa()) {
								element.setCapa('Auxiliar');
							}

							if (!!element.getType() && (element.getType() == this.ELEMENT_TYPE_COMARCA || element.getType() == this.ELEMENT_TYPE_MUNICIPIO)) {
								if (element.getType() == this.ELEMENT_TYPE_COMARCA) {
									this.getZoomToResult("s:k", "OBJECTID", element
											.getId(), element.getCapa(), false,
											element);
								} else {
									this.getZoomToResult("s:i", "OBJECTID", element
											.getId(), element.getCapa(), false,
											element);
								}
							} else {
								var point = new Proj4js.Point(element.getPosX(),
										element.getPosY());
								if (!!element.getProjeccio()) {
									point = this.tranformToMapProjection(point,
											element.getProjeccio());
								}
								feature.position[0] = point.x;
								feature.position[1] = point.y;
								feature.name = element.getName();
								feature.id = element.getId();
								feature.description = element.getDescription();
								feature.type = element.getType();
								// Remove feature style
								feature.style = null;
								// Save feature style
								feature.estilo = element.getStyle();
								// Get default style
								var defaultStyle = Sicecat.styles[element.getStyle()];
								if(defaultStyle == null){
									defaultStyle = this.cloneObject(OpenLayers.Feature.Vector.style["default"]);
								}
								// Get select style
								var selectStyle = Sicecat.styles[element.getStyle()+"_s"];
								if(selectStyle == null){
									selectStyle = this.cloneObject(OpenLayers.Feature.Vector.style["select"]);
								}
								// Show a label with the id
								if(element.getType() == integrator.ELEMENT_TYPE_INCIDENTE){
									// Default style
									defaultStyle.label = '${pk_id}';
									defaultStyle.labelAlign = "rt";
									defaultStyle.labelXOffset = 20;
									defaultStyle.labelYOffset = 20;
									// Select style
									selectStyle.label = '${pk_id}';
									selectStyle.labelAlign = "rt";
									selectStyle.labelXOffset = 20;
									selectStyle.labelYOffset = 20;
								}
								var styleMap = new OpenLayers.StyleMap({
									'default': defaultStyle, 
									'select': selectStyle,
									'delete': OpenLayers.Feature.Vector.style["delete"],
									'temporary': OpenLayers.Feature.Vector.style["temporary"]
								});
								// Add style to the layer
								var layer_array = map.getLayersByName(element.getCapa());
								var aux_layer = null;
								if(layer_array.length > 0){
									aux_layer = layer_array[0];
								}
								if(aux_layer == null){
									aux_layer = new OpenLayers.Layer.Vector(element.getCapa(), {
										strategies : [ new OpenLayers.Strategy.Save() ],
										styleMap: styleMap
									});
									AuxiliaryLayer.map.addLayer(aux_layer);
								}else{
									aux_layer.styleMap = styleMap;
								}
								var pre_feature = AuxiliaryLayer.searchFeature(element.getCapa(), feature);
								if (!!pre_feature && !!pre_feature[0]) {
									if (this.isLogEnabled()){
										console.debug("Updating " + element_info);	
									}
									AuxiliaryLayer.updateFeature(element.getCapa(), feature);
								} else {
									if (this.isLogEnabled()){
										console.info("Adding " + element_info);
									}
									AuxiliaryLayer.addFeature(element.getCapa(), feature);
								}
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisShowElement de SIGIntegrator con element igual a: ");
								console.dir(element);
							}
						}
					},

					/*
					 * private: cloneObject
					 * 
					 * Clone map properties
					 */
					cloneObject: function (object){
						var cloned = {};
						var i = 0;
						for (var key in object){
							if(!!object[key] 
								&& !((typeof object[key] == "string")
										|| (typeof object[key] == "number")
										|| (typeof object[key] == "function")
									)){
								cloned[key] = this.cloneObject(object[key]);
								i++;
							}else{
								cloned[key] = object[key];
								i++;
							}
						}
						if(i>1){
							return cloned;
						}else{
							return object;
						}
					},

					/*
					 * private: tranformToMapProjection
					 */
					tranformToMapProjection : function(point, projeccio) {

						var proj_orig = new Proj4js.Proj(projeccio);
						var proj_goal = new Proj4js.Proj(this.map.projection);

						return Proj4js.transform(proj_orig, proj_goal, point);
					},

					/**
					 * Method: msGisShowList
					 * 
					 * Mostrar una lista elemento
					 * 
					 * Parameters: list - {<Array<IntegrationSiceCATElement>>}
					 */
					msGisShowList : function(list) {
						if(list != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisShowList de SIGIntegrator, con el parámetro list igual a: ");
								console.dir(list);
							}
							if (!!list) {
								for ( var i = 0; i < list.length; i++) {
									this.msGisShowElement(list[i]);
								}
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisShowList de SIGIntegrator con list igual a: ");
								console.dir(list);
							}
						}
					},

					/**
					 * Method: msGisFocusElement
					 * 
					 * Centra un elemento en pantalla
					 * 
					 * Parameters: id - {<Long>} Del elemento a centrar capa - {<String>}
					 * nombre de la capa en la que se encuentra. Si no se define
					 * se buscarÃ¡ en la capa 'Auxiliar'
					 */
					msGisFocusElement : function(id, capa) {
						// Controlamos los parámetros que recibimos
						if(id != null && capa != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisFocusElement de SIGIntegrator, con los parámetros id y capa igual a: ");
								console.dir(id);
								console.dir(capa);
							}
							if (!feature) {
								var feature = {};
							}
							feature.id = id;

							var capaDestino;
							if (!capa) {
								capaDestino = this.sicecatInstance.nombreCapaAuxiliarText;
							} else {
								capaDestino = capa;
							}

							var pre_feature = AuxiliaryLayer.searchFeature(
									capaDestino, feature);

							if (!!pre_feature && !!pre_feature[0]) {
								var feature2 = pre_feature[0];
								if(this.isLogEnabled()){
									console.debug("Zoom to " + feature2.geometry.bounds);
								}
								this.zoomToBoundsAtLevel(feature2.geometry.bounds);
							} else {
								if(this.isLogEnabled()){
									console.debug("Element " + id + " not found");
								}
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisFocusElement de SIGIntegrator con id y capa igual a: ");
								console.dir(id);
								console.dir(capa);
							}
						}
					},

					/**
					 * Method: msGisFocusList
					 * 
					 * Centra un conjunto de elementos en pantalla
					 * 
					 * Parameters: list - {<List<Long, String>>} con
					 * identificador del elemento a eliminar y el nombre de la
					 * capa en la que se encuentra
					 */
					msGisFocusList : function(list) {
						if (list != null) {
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisFocusList de SIGIntegrator, con el parámetro list igual a: ");
								console.dir(list);
							}
							for ( var i = 0; i < list.length; i++) {
								// this.msGisFocusElement(list[i]);
								var bounds = new OpenLayers.Bounds();
								var found = false;
								for ( var i = 0; i < list.length; i++) {
									var feature = {};
									feature.id = list[i].getId();

									var capaDestino;
									if (!list[i].getCapa()) {
										capaDestino = this.sicecatInstance.nombreCapaAuxiliarText;
									} else {
										capaDestino = list[i].getCapa();
									}

									var pre_feature = AuxiliaryLayer
											.searchFeature(capaDestino, feature);
									var feature2 = pre_feature[0];
									if (!!feature2 && !!feature2.geometry) {
										bounds.extend(feature2.geometry.bounds);
										found = true;
									}
								}
								if (this.isLogEnabled()){
										console.debug("Zoom to " + bounds);
								}
								if (found) {
									this.zoomToBoundsAtLevel(bounds);
								}
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisFocusList de SIGIntegrator con list igual a: ");
								console.dir(list);
							}
						}
					},
					
					/* Private method: zoomToBoundsAtLevel */
					zoomToBoundsAtLevel: function (bounds, level){
						this.map.zoomToExtent(bounds, true);
						var zoomLevel;
						if(!!level){
							zoomLevel = level;
						}else{
							if(this.map.zoom >= 2){
								zoomLevel = this.map.zoom - 2;
							}else{
								if(this.map.zoom == 1){
									zoomLevel = 0;
								}else{
									zoomLevel = this.map.zoom;
								}
								
							}
						}
						this.map.zoomTo(zoomLevel);
					},

					/**
					 * Method: msGisRemoveElement
					 * 
					 * Elimina un elemento de pantalla
					 * 
					 * Parameters: id - {<Long>} capa - {<String>} nombre de
					 * la capa en la que se encuentra. Si no se define se
					 * buscarÃ¡ en la capa 'Auxiliar'
					 */
					msGisRemoveElement : function(id, capa) {
						// TODO Comprobar si es necesario ver que la capa no sea nula 
						if(id != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisRemoveElement de SIGIntegrator, con los parámetros id y capa igual a: ");
								console.dir(id);
								console.dir(capa);
							}
							if (!feature) {
								var feature = {};
							}
							feature.id = id;

							var capaDestino;
							if (!capa) {
								capaDestino = this.sicecatInstance.nombreCapaAuxiliarText;
							} else {
								capaDestino = capa;
							}
							if (this.isLogEnabled()){
								console.debug("Removing element " + id + " from " + capaDestino);
							}
							AuxiliaryLayer.removeFeature(capaDestino, feature);
							this.removeDefElement(id);
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisRemoveElement de SIGIntegrator con id y capa igual a: ");
								console.dir(id);
								console.dir(capa);
							}
						}
					},

					/**
					 * Method: msGisRemoveList
					 * 
					 * Elimina una lista de elementos
					 * 
					 * Parameters: list - {<Array<Double,String>>}
					 */
					msGisRemoveList : function(list) {
						if (list != null) {
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisRemoveList de SIGIntegrator, con el parámetro list igual a: ");
								console.dir(list);
							}
							for ( var i = 0; i < list.length; i++) {
								this.msGisRemoveElement(list[i].getId(),
										list[i].getCapa());
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha intentado entrar en el método msGisRemoveList de SIGIntegrator con list igual a: ");
								console.dir(list);
							}
						}
					},

					/**
					 * Method: msGisCreateCapa
					 * 
					 * Crea un capa vectorial auxiliar en la que poder dibujar
					 * elementos
					 * 
					 * Parameters: 
					 * 		- id - {<String>} Id de la capa 
					 * 		- nombre - {<String>} 
					 * 		- order - {<Integer>} indica el orden de prioridad de la capa. A más orden, la capa se pinta más arriba 
					 * 		- hideInLayerSwitcher - {<String>} indica si la capa se debe ocultar
					 * Nombre de la capa
					 */
					msGisCreateCapa : function(id, nombre, order, hideInLayerSwitcher) {
						var layer = null;
						if(!hideInLayerSwitcher){
							var hideInLayerSwitcher = false;
						}
						if(id != null && nombre != null && hideInLayerSwitcher != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el metodo msGisCreateCapa de SIGIntegrator, con los par�metros id, nombre y hideInLayerSwitcher igual a: ");
								console.dir(id);
								console.dir(nombre);
								console.dir(order);
								console.dir(hideInLayerSwitcher);
							}
							var displayInLayerSwitcherValue  = !hideInLayerSwitcher;

							var layers = this.map.getLayersBy("id", id);
							if (!!layers && layers.length > 0) {
								// Si habia alguna con el mismo id, se debe eliminar
								this.msGisRemoveCapa(id);
							}
							if (this.isLogEnabled()){
								console.debug("Adding layer (id='" + id + "' , nombre='" + nombre + "')");
							}
							
							// layer order
							var layerIndex = !!order ? order: 100;
							
							layer = new OpenLayers.Layer.Vector(nombre, {
	        					'displayInLayerSwitcher': displayInLayerSwitcherValue,
								'strategies' : [ new OpenLayers.Strategy.Save() ],
								'layerIndex': layerIndex,
								'layerFromSicecat': true
								/*,
								'styleMap' : Sicecat.createStyleMap()
								*/
							});
							layer.id = id;
							this.map.addLayer(layer);							
							this.map.setLayerIndex(layer, layerIndex);
							// Guardamos la capa creada
							this.saveDefLayer(layer);
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha entrado en el metodo msGisCreateCapa de SIGIntegrator, con los par�metros id, nombre y hideInLayerSwitcher igual a: ");
								console.dir(id);
								console.dir(nombre);
								console.dir(hideInLayerSwitcher);
							}
						}
						return layer;
					},

					/**
					 * Method: msGisRemoveCapa
					 * 
					 * Elimina una capa con todos sus elementos.
					 * 
					 * Parameters: id - {<String>} Id de la capa a eliminar
					 */
					msGisRemoveCapa : function(id) {
						if(id != null){
							if (this.isLogEnabled()){
								console.info("Ha entrado en el método msGisRemoveCapa de SIGIntegrator, con el parámetro id igual a: ");
								console.dir(id);
							}
							this.removeDefLayer(id);
							var layers = this.map.getLayersBy("id", id);
							if (!!layers && layers.length > 0) {
								for ( var i = 0; i < layers.length; i++) {
									if (this.isLogEnabled()){
										console.debug("Removing layer by id (id='" + id + "')");
									}
									var layer = layers[i];
									this.map.removeLayer(layer);
								}
							}
						}else{
							if (this.isLogEnabled()){
								console.error("[Error] Ha entrado en el método msGisRemoveCapa de SIGIntegrator, con el parámetro id igual a: ");
								console.dir(id);
							}
						}
					},

					/**
					 * Method: msGisLogin
					 * 
					 * Inicializa el visor SIG con el perfil y el idioma que se
					 * indiquen.
					 * 
					 * Parameters: 
					 * 		- usuario - {<String>} usuario que abre la aplicacion
					 * 		- permisos - (<String>)
					 * 		- idioma - {<String>}
					 * 		- tipo - (<String>)
					 * 		- idComarca - (<String>)
					 * 		- idMunicipio - (<String>)
					 * 		- idSession - (<String>)
					 * 		- infoExtra - (<Object>)
					 */
					msGisLogin : function(usuario, permisos, idioma, tipo,
							idComarca, idMunicipio, idSession, urlSession, infoExtra) {
						
							// TODO comprobaciones de usuario con secondaryAPI
							if (this.isLogEnabled()) {
								console.info("El usuario " + usuario
										+ " esta abriendo el visor en modo " + tipo
										+ " con los parametros [" + "permisos = '"
										+ permisos + "'" + "idioma = '" + idioma
										+ "'" + "idComarca = '" + idComarca + "'"
										+ "idMunicipio = '" + idMunicipio + "'");
							}

							// PERMISOS
							_permisos = new Object();

							// TODO: aquÃ­ hay que inicializar
							// integrator.sicecatInstance.permisos.editWFS
							// salvo que venga ya hecho
							Ext.each(permisos.split(" "), function(p) {
								if ("editWFS" == p)
									_permisos.editWFS = true;
								else if ("readOnly" == p)
									_permisos.readOnly = true;
							});
							this.sicecatInstance.permisos = _permisos;

							// TIPO
							Global_TMP = new Object();
							Global_TMP.user = usuario;
							Global_TMP.permisos = permisos;
							// Nombre completo del usuarios
							if(infoExtra != null && infoExtra.nombreCompleto != null){
								Global_TMP.nombreCompleto = infoExtra.nombreCompleto;
							}
							// Nombre completo del municipio
							if(infoExtra != null && infoExtra.nombreMunicipio != null){
								Global_TMP.nombreMunicipio = infoExtra.nombreMunicipio;
							}
							if (!!tipo) {
								// GPCL
								if (this.TIPO_GPCL == tipo) {
									this.sicecatInstance.modo = tipo;
									this.sicecatInstance.idMunicipio = idMunicipio;
									this.sicecatInstance.idComarca = idComarca;
									Global_TMP.idMunicipio = idMunicipio;
									Global_TMP.idComarca = idComarca;

									this.sicecatInstance.layout = new Object();
									this.sicecatInstance.layout.idioma = idioma;
									GeoExt.Lang.set(idioma);
								} else {
									// SICECAT
									this.sicecatInstance.layout = new Object();
									this.sicecatInstance.layout.idioma = idioma;
									GeoExt.Lang.set(idioma);
								}
							}
							var self = this;
							// Mientras nos pasan los parametros
							if(infoExtra == null){
								infoExtra = {};
							}
							infoExtra.WMSSecured = {
								wmssecurized: {
									"http://sigescat.pise.interior.intranet/ows2/wms": {
										user: "usrpcivil1",
										pass: "t9OqR7gK"
									}
								}
							};
							Global_TMP.WMSSecured = infoExtra.WMSSecured;
							// Credenciales de wms securizado
//							if(infoExtra != null && infoExtra.WMSSecured != null){
//								// Lanzamos la peticion de securizacion
//								var url_proxy = Sicecat.getURLProxy(Sicecat.confType, Sicecat.typeCall.SECURIZADA, "configureAuth.do");
//								Ext.Ajax.request({
//									url: url_proxy,
//									jsonData: infoExtra.WMSSecured,
//									success: function(response){
//										Global_TMP.WMSSecured = infoExtra.WMSSecured;
//									}
//								});
//							}
							Ext.Ajax.request({
								url: 'rest/persistenceGeo/getUserInfoById/' + usuario,
								success: function(response){
									var res = response.responseText;
									var obj = JSON.parse(res);
									self.sicecatInstance.userInfo = obj.data;
								}
							});
							// TODO Temporalmente
							if(idSession == null){
								idSession = "88";
							}
							this.sicecatInstance.idSession = idSession;
							// Funcion de inicializacion de SiceCAT en
							// init_sicecatII.js.
							init_all();
					},
					
					LAYER_AUX_INCIDENTS: "LAYER_AUX_INCIDENTS",
					
					initAuxLayers: function(){
						var layer = new OpenLayers.Layer.Vector(this.LAYER_AUX_INCIDENTS, { 'displayInLayerSwitcher': false});
						layer.id = this.LAYER_AUX_INCIDENTS;
						this.map.addLayer(layer);
					},
					
					getAuxDefaultLayer: function(){
						return this.map.getLayersByName(this.LAYER_AUX_INCIDENTS)[0];
					},

					/**
					 * Method: msGisLogout
					 * 
					 * FinalizaciÃ³n del visor SIG.
					 * 
					 */
					msGisLogout : function() {
						if (this.isLogEnabled()){
							console.info("Ha entrado en el método msGisLogout de SIGIntegrator.");
						}
						// Enviamos una petición para eliminar los elementos temporales
						Ext.Ajax.request({
							url: 'rest/persistenceGeo/userContext/removeAll',
							success: function(response){
								// Cerramos la ventana
								window.close();
							}
						});
					},

					/**
					 * Method: msGisGetSelectedElements
					 * 
					 * Devuelve los elementos seleccionados
					 * 
					 */
					msGisGetSelectedElements : function() {
						if (this.isLogEnabled()){
							console.info("Ha entrado en el mÃ©todo msGisGetSelectedElements de SIGIntegrator.");
						}
						return this.elementsSelected;
					},

					/**
					 * Method: msGisAddSelectedElement
					 * 
					 * Selecciona un nuevo elemento
					 * 
					 */
					msGisAddSelectedElement : function(idSelected) {
						if(idSelected != null){
							if (this.isLogEnabled()) {
								console.info("Ha entrado en el mÃ©todo msGisAddSelectedElement de SIGIntegrator, con el parÃ¡metro idSelected igual a: ");
								console.dir(idSelected);
							}
							var enc = false;
							for ( var i = 0; i < this.elementsSelected.length; i++) {
								if (this.elementsSelected[i] == idSelected) {
									enc = true;
								}
							}
							if (!enc) {
								this.elementsSelected[this.elementsSelected.length] = idSelected;
							}
						}else{
							if (this.isLogEnabled()) {
								console.error("[Error] Ha entrado en el mÃ©todo msGisAddSelectedElement de SIGIntegrator, con el parÃ¡metro idSelected igual a: ");
								console.dir(idSelected);
							}
						}
					},

					/**
					 * Method: msGisDelUnselectedElement
					 * 
					 * Deseleciona un elementos
					 * 
					 */
					msGisDelUnselectedElement : function(idSelected) {
						if(idSelected != null){
							if (this.isLogEnabled()) {
								console.info("Ha entrado en el mÃ©todo msGisDelUnselectedElement de SIGIntegrator, con el parÃ¡metro idSelected igual a: ");
								console.dir(idSelected);
							}
							var enc = false;
							var result = new Array();
							for ( var i = 0; i < this.elementsSelected.length; i++) {
								if (this.elementsSelected[i] == idSelected) {
									enc = true;
								} else if (!enc) {
									result[i] = this.elementsSelected[i];
								} else if (enc && i > 0) {
									result[i - 1] = this.elementsSelected[i];
								}
							}
							this.elementsSelected = result;
						}else{
							if (this.isLogEnabled()) {
								console.error("[Error] Ha entrado en el mÃ©todo msGisDelUnselectedElement de SIGIntegrator, con el parÃ¡metro idSelected igual a: ");
								console.dir(idSelected);
							}
						}
					},

					/**
					 * Method: msGisRenameAllLayers
					 * 
					 * Renombra las capas pasadas como argumento
					 * 
					 * Parameters: layers - {<Array<SiceCAT.Layer>} Lista con
					 * las capas a renombrar
					 */
					msGisRenameAllLayers : function(layers) {
						if(layers != null){
							if (this.isLogEnabled()) {
								console.info("Ha entrado en el mÃ©todo msGisRenameAllLayers de SIGIntegrator, con el parÃ¡metro layers igual a: ");
								console.dir(layers);
							}
							for ( var i = 0; i < layers.length; i++) {
								this.msGisRenameLayer(layers[i].id,
										layers[i].name);
							}
						}else{
							if (this.isLogEnabled()) {
								console.error("[Error] Ha entrado en el mÃ©todo msGisRenameAllLayers de SIGIntegrator, con el parÃ¡metro layers igual a: ");
								console.dir(layers);
							}
						}
					},

					/**
					 * Method: msGisRenameLayer
					 * 
					 * Renombra la capa pasada como argumento
					 * 
					 * Parameters: id - {<String>} De la capa name - {<String>}
					 * Nuevo nombre de la capa
					 */
					msGisRenameLayer : function(id, name) {
						if(id != null && name != null){
							if (this.isLogEnabled()) {
								console.info("Ha entrado en el mÃ©todo msGisRenameLayer de SIGIntegrator, con los parÃ¡metros id y name igual a: ");
								console.dir(id);
								console.dir(name);
							}
							var layers = this.map.getLayersBy("id", id);
							if (this.isLogEnabled())
								console.debug("founds " + layers.length
										+ " layers with id " + id);
							if (!!layers && layers.length > 0) {
								for ( var i = 0; i < layers.length; i++) {
									var layer = layers[i];
									if (this.isLogEnabled())
										console.debug("previus name =" + layer.name
												+ ", new name = " + name);
									layer.setName(name);
								}
							}
						}else{
							if (this.isLogEnabled()) {
								console.error("[Error] Ha entrado en el mÃ©todo msGisRenameLayer de SIGIntegrator, con los parÃ¡metros id y name igual a: ");
								console.dir(id);
								console.dir(name);
							}
						}
					},

					/**
					 * Method: msGisDrawGML
					 * 
					 * Dibuja el GML obtenido de la URL pasada en la capa
					 * indicada.
					 * 
					 * Parameters: - id {<String>} Identificador del incidente -
					 * URL {<String>} DirecciÃÂ³n URL desde la que descargar el
					 * archivo GML. - capa {<String>} Identificador de la capa
					 * en la que mostrar el elemento.
					 */
//					msGisDrawGML : function(id, URL, capa) {
//						if (this.isLogEnabled())
//							console.log("Guardando la capa '" + capa
//									+ "' a partir de " + URL
//									+ " asociada al incidente " + id);
//						var layer = this.map
//								.addLayer(new OpenLayers.Layer.Vector(
//										capa,
//										{
//											strategies : [ new OpenLayers.Strategy.Fixed() ],
//											protocol : new OpenLayers.Protocol.HTTP(
//													{
//														url : URL,
//														format : "GML" // TODO
//													})
//										}));
//
//						// new OpenLayers.Layer.GML(capa, URL);
//						layer.id = capa;
//						layer.idIncidente = capa;
//						this.map.addLayer(layer);
//						this.msAplGMLSaved(id);
//					},

					/**
					 * Method: msAplElementSelected
					 * 
					 * Elemento y tipo pulsado por el usuario sobre el visor SIG
					 */
					msAplElementSelected : function(posX, posY, id, tipo,
							direccion, municipio, comarca, list) {
						if (this.isLogEnabled()) {
							console.info("Ha entrado en el mÃ©todo msAplElementSelected de SIGIntegrator, los siguientes parÃ¡metros: " 
									+ "posX: " + posX 
									+ " posY:" + posY 
									+ " id: " + id 
									+ " tipo: " + tipo
									+ " direccion: " + direccion
									+ " municipio: " + municipio
									+ " comarca: " + comarca
									+ " list: ");
							console.dir(list);
						}
						var pk_id = id;
						var tipo_feature = tipo;

						this.getSecondaryAPI().msAplElementSelected(pk_id,
								tipo_feature);
					},

					/**
					 * Method: msAplHideElements
					 * 
					 * Oculta el elemento indicado
					 */
					msAplHideElements : function(id, layer) {
						if (this.isLogEnabled()) {
							//console.info("Ha entrado en el metodo msAplHideElements de SIGIntegrator, los siguientes parÃ¡metros: " 
							//		+ "id: " + id + "," + " layer:" + layer ");
						}
						this.getSecondaryAPI().msAplHideElements(id, layer);
					},

					/*
					 * private: obtenerFeature
					 * 
					 * Obtiene la feature por asociada al evento en caso de que
					 * pertenezca a una capa vectorial no WFS
					 * 
					 * Parameters: - evt - {<Evt>} Evento del que obtener la
					 * feature
					 */
					getFeatureFromEvent : function(evt) {
						var feature;
						if (!!id && !!this.map && !!this.map.layers) {
							var enc = false;
							for ( var i = 0; i < this.map.layers.length; i++) {
								var layer = this.map.layers[i];
								// Solo las capas vectoriales no WFS con
								// features
								if (layer instanceof OpenLayers.Layer.Vector
										& !layer.protocol && !!layer.features) {
									var feature = layer
											.getFeatureFromEvent(evt);
									if (!!feature) {
										break;
									}
								}
							}
						}
						return feature;
					},

					/*
					 * private: obtenerFeature
					 * 
					 * Obtiene la feature por el id en caso de que pertenezca a
					 * una capa vectorial no WFS
					 * 
					 * Parameters: - id - {<String>} identificador OL de la
					 * figura
					 */
					obtenerFeature : function(id) {
						var feature;
						if (!!id && !!this.map && !!this.map.layers) {
							var enc = false;
							for ( var i = 0; i < this.map.layers.length; i++) {
								var layer = this.map.layers[i];
								// Solo las capas vectoriales no WFS con
								// features
								if (layer instanceof OpenLayers.Layer.Vector
										& !layer.protocol && !!layer.features) {
									for ( var j = 0; j < layer.features.length; j++) {
										feature = layer.features[j];
										if (feature.id == id) {
											enc = true;
											break;
										}
									}
									if (enc) {
										break;
									}
								}
							}
						}
						return feature;
					},

					/**
					 * Method: msGisResolveAddress
					 * 
					 * Resuelve una direcciÃÂ³n a partir de un texto y devuelve un
					 * listado de coincidencias
					 * 
					 * Parameters: direccion - {<String>}
					 */
					msGisResolveAddress : function(direccion) {
						if(direccion != null){
							if (this.isLogEnabled()) {
								console.info("Ha entrado en el mÃ©todo msGisResolveAddress de SIGIntegrator, con el parÃ¡metro direccion igual a: ");
								console.dir(direccion);
							}
							this.direccion_ = direccion;
							this.propertiesToLoad = 1;
							this.functionToCall = "msAplResolvedAddress";
							var panel = new Ext.Panel({
								autoHeight : true,
								border : false,
								items : [ {
									xtype : "gx_sicecat_sigescatcercaopenlscombo",
									map : this.map,
									title : this.streetsSearchText,
									zoom : this.geoNamesZoom,
									width : this.geoNamesWidth,
									maxRows : 1,
									listeners : {
										storeload : function(store) {
											if (!!store.records
													&& !!store.records[0]) {
												var record = store.records[0];
												this.posX_ = record.data.lon;
												this.posY_ = record.data.lat;
											}
											this.msAplLoadPost();
										},
										loadexception : function() {
											this.posX_ = null;
											this.posY_ = null;
											this.msAplLoadPost();
										},
										scope : this
									}
								} ]
							});
							if (this.isLogEnabled()) {
								console.debug(panel);
							}
							panel.items.items[0].doQuery(
									direccion.getDescription(), false, true);
						}else{
							if (this.isLogEnabled()) {
								console.error("[Error] Ha entrado en el mÃ©todo msGisResolveAddress de SIGIntegrator, con el parÃ¡metro direccion igual a: ");
								console.dir(direccion);
							}
						}
					},

					/*
					 * private properties to use in msAplLoadPost,
					 * msjAplListSelected and msAplRectangleSelected
					 */
					propertiesToLoad : 0,
					functionToCall : null,
					list_ : null,
					x1_ : null,
					y1_ : null,
					x2_ : null,
					y2_ : null,
					listMunicipios_ : null,
					direccion_ : null,

					/**
					 * Method: msAplPointSelected
					 * 
					 * PosiciÃÂ³n pulsada por el usuario sobre un punto del Visor
					 * SIG Lista <Identificador, Tipo>
					 */
					msAplPointSelected : function(posX, posY, direccion,
							municipio, comarca) {

						this.posX_ = posX;
						this.posY_ = posY;
						this.direccion_ = direccion;
						this.propertiesToLoad = 1;
						this.functionToCall = "msAplPointSelected";
						var bounds = (new OpenLayers.Geometry.Point(posX, posY))
								.getBounds();
						this.listMunicipios_ = new SiceCAT.Feature(null,
								bounds, true);
					},

					/**
					 * Method: msjAplListSelected
					 * 
					 * Listado de elementos con su tipo seleccionados desde el
					 * visor SIG
					 * 
					 * Parameters: list - {<Array<Integer, String>} Lista con
					 * el par (id, tipo)
					 */
					msjAplListSelected : function(list) {
						this.list_ = new Array();
						this.propertiesToLoad = list.length + 1;
						this.functionToCall = "msjAplListSelected";
						for ( var i = 0; i < list.length; i++) {
							this.list_[i] = new SiceCAT.Feature(list[i], null,
									true);
						}
						this.msAplLoadPost();
					},

					/**
					 * Method: msAplRectangleSelected
					 * 
					 * Coordenadas de la esquina superior izquierda y la esquina
					 * inferior derecha de un rectÃÂ¡ngulo dibujado sobre el mapa.
					 * 
					 * Parameters: - x1 <Integer> - y1 <Integer> - x2 <Integer> -
					 * y2 <Integer>
					 */
					msAplRectangleSelected : function(x1, y1, x2, y2) {
						this.x1_ = x1;
						this.y1_ = y1;
						this.x2_ = x2;
						this.y2_ = y2;
						this.propertiesToLoad = 1;
						this.functionToCall = "msAplRectangleSelected";
						var bounds = new OpenLayers.Bounds(x1, y1, x2, y2);
						this.listMunicipios_ = new SiceCAT.Feature(null,
								bounds, true);
						if(Sicecat.locate_box_control != null && Sicecat.locate_box_control.active){
							this.msGisDeactiveSelectZone();
						}
					},

					/*
					 * private: msjAplListSelectedPost
					 * 
					 * To call the API when all properties are loaded
					 */
					msAplLoadPost : function() {
						this.propertiesToLoad--;
						if (this.isLogEnabled())
							console.debug("this.propertiesToLoad --> "
									+ this.propertiesToLoad);
						if (this.propertiesToLoad == 0) {
							if (this.functionToCall == "msjAplListSelected") {
								this.getSecondaryAPI().msAplListSelected(
										this.list_);
								this.functionToCall = null;
							} else if (this.functionToCall == "msAplRectangleSelected") {
								this.getSecondaryAPI().msAplRectangleSelected(
										this.x1_, this.y1_, this.x2_, this.y2_,
										this.listMunicipios_);
								this.functionToCall = null;
							} else if (this.functionToCall == "msAplPointSelected") {
								this.getSecondaryAPI().msAplPointSelected(
										this.posX_, this.posY_,
										this.listMunicipios_.direccion,
										this.listMunicipios_.getIdMunicipio(),
										this.listMunicipios_.getIdComarca());
								this.functionToCall = null;
							} else if (this.functionToCall == "msAplResolvedAddress") {
								// this.getSecondaryAPI().msAplResolvedAddress(this.posX_,
								// this.posY_, this.direccion_);
								this.functionToCall = null;
							}
						}
					},

					/**
					 * Method: msAplSaveLayerName
					 * 
					 * Descriptor de la capa de tipo defLayer
					 * 
					 * Parameter: - defLayer <SiceCAT.Layer> Devuelve la lista
					 * de definiciones de capas que estÃÂ¡n almacenadas en la
					 * aplicaciÃÂ³n alfanumÃÂ©rica.
					 */
					msAplSaveLayerName : function(defLayer) {
						this.getSecondaryAPI().msAplSaveLayerName(defLayer);
					},

					/**
					 * Method: msAplGetAllLayers
					 * 
					 * Obtiene todas las SiceCAT.Layer registradas
					 */
					msAplGetAllLayers : function() {
						return this.getSecondaryAPI().msAplGetAllLayers();
					},

					/**
					 * Method: msAplGMLSaved
					 * 
					 * Identificador del incidente al que estÃÂ¡ asociado el GML
					 * 
					 */
					msAplGMLSaved : function(id) {
						return this.getSecondaryAPI().msAplGMLSaved(id);
					},
					
					/**
					 * Method: msAplGetElements
					 * 
					 * Devuelve todos los elementos relacionados con el incidente del tipo indicado.
					 */
					msAplGetElements : function(id, type) {
						
						return this.getSecondaryAPI().msAplGetElements(id, type);
					},
					
					/**
					 * Method: msIntGetElements
					 * 
					 * Obtiene e inicializa la capa de elementos asociados al incidente
					 */
					msIntGetElements : function(id, type) {
						if (this.isLogEnabled()){
							console.info("Ha entrado en el mÃ©todo msIntGetElements de SIGIntegrator, con los parÃ¡metros (id='" 
										+ id + "', type='" + type + "')");
						}
						// now don't return elements, only mark!!
						this.msAplGetElements(id, type);
						if(!this.incidentsDetailsMap[id]){
							this.incidentsDetailsMap[id]= {};
						}
						this.incidentsDetailsMap[id][type] = "show";
						
						/* old implementation (delegated to msAplGetElements):
						var elements = this.msAplGetElements(id, type);
						
						if(!!elements 
								&& elements.length > 0){

							for ( var i = 0; i < elements.length; i++) {
								var element = elements[i];
								element.setCapa(this.LAYER_AUX_INCIDENTS);
								if(!this.incidentsDetailsIds[element.getId()]){
									this.incidentsDetailsIds[element.getId()] = 0;
								}
								this.incidentsDetailsIds[element.getId()]++;
								this.msGisShowElement(element);
							}
							
							if(!this.incidentsDetailsMap[id]){
								this.incidentsDetailsMap[id]= {};
							}
							this.incidentsDetailsMap[id][type] = elements;
						}*/
					},
					
					/**
					 * Method: msIntRemoveElements
					 * 
					 * Oculta los detalles del incedente seleccionado
					 */
					msIntRemoveElements : function(id, type) {
						
						if (this.isLogEnabled()){
							console.info("Ha entrado en el mÃ©todo msIntHideElements de SIGIntegrator, con los parÃ¡metros (id='" 
										+ id + "', type='" + type + "')");
						}
						//now call to new API method and unmark
						this.msAplHideElements(id, type);
						this.incidentsDetailsMap[id][type] = null;
						
						/* old implementation (delegated to msAplHideElements):
						if(!!this.incidentsDetailsMap[id]
							&& this.incidentsDetailsMap[id][type]){
							
							var elements = this.incidentsDetailsMap[id][type];
							
							if(!!elements 
									&& elements.length > 0){
								for ( var i = 0; i < elements.length; i++) {
									this.incidentsDetailsIds[elements[i].getId()]--;
									if(this.incidentsDetailsIds[elements[i].getId()] == 0){
										this.msGisRemoveElement(elements[i].getId(), this.LAYER_AUX_INCIDENTS);
									}
								}
							}
							
							this.incidentsDetailsMap[id][type] = null;	
						}*/
					},
					
					/**
					 * Method: msGisActiveSelectZone
					 * 
					 * Activa el control de localizaciÃ³n de recursos por rectÃ¡ngulo
					 */
					msGisActiveSelectZone: function(){
						if (this.isLogEnabled()) {
							console.info("Ha entrado en el mÃ©todo msGisActiveSelectZone de SIGIntegrator");
						}
						Sicecat.locate_box_control.activate();
					},
					/**
					 * Method: msGisDeactiveSelectZone
					 * 
					 * Desactiva el control de localizaciÃ³n de recursos por rectÃ¡ngulo
					 */
					msGisDeactiveSelectZone: function(){
						if (this.isLogEnabled()) {
							console.info("Ha entrado en el mÃ©todo msGisDeactiveSelectZone de SIGIntegrator");
						}
						Sicecat.locate_box_control.deactivate();
					},

					/*
					 * Estos metodos son necesarios en la api secundaria
					 */
					// msAplVisorReadyToLogin
					// msAplVisorReadyToInteract
					/**
					 * APIProperty: clickTolerance {Integer} Tolerance for the
					 * filter query in pixels. This has the same effect as the
					 * tolerance parameter on WMS GetFeatureInfo requests. Will
					 * be ignored for box selections. Applies only if <click> or
					 * <hover> is true. Default is 5. Note that this not only
					 * affects requests on click, but also on hover.
					 */
					clickTolerance : 5,

					/**
					 * Method: pixelToBounds Takes a pixel as argument and
					 * creates bounds after adding the <clickTolerance>.
					 * 
					 * Parameters: pixel - {<OpenLayers.Pixel>}
					 */
					pixelToBounds : function(pixel) {
						var llPx = pixel.add(-this.clickTolerance / 2,
								this.clickTolerance / 2);
						var urPx = pixel.add(this.clickTolerance / 2,
								-this.clickTolerance / 2);
						var ll = this.map.getLonLatFromPixel(llPx);
						var ur = this.map.getLonLatFromPixel(urPx);
						if (this.isLogEnabled())
							console.debug("ll --> " + ll);
						if (this.isLogEnabled())
							console.debug("ur --> " + ur);
						return new OpenLayers.Bounds(ll.lon, ll.lat, ur.lon,
								ur.lat);
					},

					/**
					 * Method: init_toolbarLocalizacion
					 * 
					 * Load this.localizator
					 */
					getZoomToResult : function(queryTypeSiceCAT,
							propertyFilter, idFilter, layerName, doZoom,
							element, bounds) {

						var panel = new SiceCAT.ZoomToResultPanel(
								{
									closest : false,
									sicecatInstance : this.sicecatInstance,
									map : this.map,
									verbose: false,
									doZoom : doZoom,
									listeners : {
										zoomDone : function(panel, features) {
											if (this.isLogEnabled())
												console.debug("zoomDone --> "
														+ features);
											if (!!features && !!features[0]) {
												var feature = features[0];
												// DATA
												feature.data.pk_id = element
														.getId();
												feature.data.type = element
														.getType();
												feature.data.name = element
														.getName();
												// Feature style
												var style = Sicecat.styles['default'];
												if (!!element.getStyle()) {
													style = Sicecat.styles[element
															.getStyle()];
												}
												feature.style = style;
												// Save feature style
												feature.data.estilo = element
														.getStyle();
												feature.data.description = element
														.getDescription();
												feature.data.sicecat_feature = new SiceCAT.Feature(
														feature, null, true);
												// Obligamos a que su orden sea -1
												map.setLayerIndex(AuxiliaryLayer.getLayer(element.getCapa()), -1);
												AuxiliaryLayer.getLayer(
														element.getCapa())
														.addFeatures(feature);
											}
										},
										scope : this
									}
								});
						var name = "Result";
						if (!!layerName) {
							name = layerName;
						}
						panel.getZoomToResult(queryTypeSiceCAT, propertyFilter,
								idFilter, name, bounds);
					},
					
					isLogEnabled: function(){
						return this.showLog ? this.showLog : Sicecat.isLogEnable;
					},
					/**
					 * Method: saveDefElement
					 * 
					 * Save the elements that are received from the alphanumeric part.
					 * 
					 * parameters:
					 * 
					 * 		- element - (<defElement>) Elemento que viene del servidor.
					 **/
					saveDefElement: function(element){
						var self = this;
						var sendDefElement = this.createDefElement(element);
						Ext.Ajax.request({
							url: 'rest/persistenceGeo/userContext/saveFeature/' + Sicecat.idSession,
							method: 'POST',
							params: {
								feature: Ext.util.JSON.encode(sendDefElement),
								featureID: element.getId().toString()
							},
							success: function(response){
								if (self.isLogEnabled()){
									console.info("El defElement se ha guardado correctamente: ");
									console.dir(response);
								}
							},
							failure: function(response){
								if (self.isLogEnabled()){
									console.error("[Error] El defElement no se ha guardado correctamente: ");
									console.dir(response);
								}
							}
						});
					},
					
					createDefElement: function(element){
						var resDefElement = {};
						if(element != null){
							resDefElement.capa = element.getCapa();
							resDefElement.description = element.getDescription();
							resDefElement.id = element.getId();
							resDefElement.name = element.getName();
							resDefElement.posx = element.getPosX();
							resDefElement.posy = element.getPosY();
							resDefElement.projection = element.getProjeccio();
							resDefElement.style = element.getStyle();
							resDefElement.type = element.getType();
						}
						return resDefElement;
					},
					/**
					 * Method: saveDefLayer
					 * 
					 * Save the layers that are received from the alphanumeric part.
					 */
					saveDefLayer: function(layer){
						var self = this;
						if(layer.order == null){
							layer.order = "";
						}
						Ext.Ajax.request({
							url: 'rest/persistenceGeo/userContext/saveLayer/' + Sicecat.idSession,
							method: 'POST',
							params: {
								layer: "",
								layerID: layer.id.toString(),
								layerOrder: layer.order.toString(),
								layerName: layer.name
							},
							success: function(response){
								if (self.isLogEnabled()){
									console.info("El defLayer se ha guardado correctamente: ");
									console.dir(response);
								}
							},
							failure: function(response){
								if (self.isLogEnabled()){
									console.error("[Error] El defLayer no se ha guardado correctamente: ");
									console.dir(response);
								}
							}
						});
					},
					
					removeDefElement: function(idElement){
						var self = this;
						if(idElement != null){
							Ext.Ajax.request({
								url: 'rest/persistenceGeo/userContext/removeFeature/' + Sicecat.idSession,
								method: 'POST',
								params: {
									idFeature: idElement
								},
								success: function(response){
									if (self.isLogEnabled()){
										console.info("El defElement se ha eliminado correctamente: ");
										console.dir(response);
									}
								},
								failure: function(response){
									if (self.isLogEnabled()){
										console.error("[Error] El defElement no se ha eliminado correctamente: ");
										console.dir(response);
									}
								}
							});
						}
					},
					
					removeDefLayer: function(idLayer){
						var self = this;
						if(idLayer != null){
							Ext.Ajax.request({
								url: 'rest/persistenceGeo/userContext/removeLayer/' + Sicecat.idSession,
								method: 'POST',
								params: {
									idLayer: idLayer
								},
								success: function(response){
									if (self.isLogEnabled()){
										console.info("El defLayer se ha eliminado correctamente: ");
										console.dir(response);
									}
								},
								failure: function(response){
									if (self.isLogEnabled()){
										console.error("[Error] El defLayer no se ha eliminado correctamente: ");
										console.dir(response);
									}
								}
							});
						}
					},
					/**
					 * Function: checkSession
					 * 
					 * 		Check if session has been activated yet.
					 * 
					 * Parameters:
					 * 
					 * 		usuario - Usuario que abre la aplicacion
					 * 		permisos - Permisos que tiene el usuario
					 * 		idioma - Idioma con el que se loga el usuario
					 * 		tipo - Tipo de usuario
					 * 		idComarca - id de la comarca a la que pertenece
					 * 		idMunicipio - id del municipio al que pertenece
					 * 		idSession - id de la sesiÃ³n del usuario.
					 * 
					 * Returns:
					 * 
					 * 		The boolean that indicates if the session has been activated yet.
					 */
					checkSession: function(usuario, permisos, idioma, tipo,
							idComarca, idMunicipio, idSession, urlSession){
						// PeticiÃ³n al servicio rest de la parte alfanumÃ©rica
						Ext.Ajax.request({
							url: urlSession + '/openSession',
							method: 'POST',
							params: {
								Usuario: usuario,
								Permisos: permisos,
								Idioma: idioma,
								Tipo: tipo,
								Comarca: idComarca,
								Municipio: idMunicipio,
								Sesion: idSession
							},
							success: function(response){
								return true;
							},
							failure: function(response){
								return false;
							}
						});
						// TODO Eliminar cuando funcione openSession
						return true;
					},

					/**
					 * Property: TIPO_SICECAT
					 * 
					 * Indica que la aplicaciÃ³n se ha abierto en modo 'SICECAT'
					 * 
					 * See also: <SIGIntegrator.msGisLogin>
					 */
					TIPO_SICECAT : "SICECAT",

					/**
					 * Property: TIPO_GPCL
					 * 
					 * Indica que la aplicación se ha abierto en modo 'GPCL'
					 * 
					 * See also: <SIGIntegrator.msGisLogin>
					 */
					TIPO_GPCL : "GPCL",

					/**
					 * Properties: Element types
					 */
					ELEMENT_TYPE_COMARCA : "Comarca",
					ELEMENT_TYPE_MUNICIPIO : "Municipi",
					ELEMENT_TYPE_INCIDENTE : "INC",
					ELEMENT_TYPE_OBSERVACION : "Observación",
					ELEMENT_TYPE_MEDIO : "Medio/Recurso",
					ELEMENT_TYPE_SIRENA : "Sirena",
					ELEMENT_TYPE_ESTACION : "Estación meteorológica",

					/**
					 * Properties: Projections
					 */
					PROJ_4326 : "EPSG:4326",
					PROJ_23031 : "EPSG:23031",
					PROJ_25831 : "EPSG:25831",
					PROJ_4258 : "EPSG:4258",

					CLASS_NAME : "IntegradorVisorSIG"
				});
