/*
 * Feature.js
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
 * Class: Feature 
 * 
 * Feature to be used from SICECAT
 * II integration whith SiceCAT SIG client.
 * 
 * Inherits from: - <OpenLayers.Class>
 */
SiceCAT.Feature = OpenLayers.Class({

	
	id: null, 
	name: null, 
	description: null, 
	posX: null, 
	posY: null, 
	type: null, 
	style: null, 
	capa: null, 
	projeccio: null,
	direccion: null,
	idComarca: null,
	nameComarca: null,
	idMunicipio: null,
	nameMunicipio: null,
	listMunicipios: null,
	
	setId:function(Id) {
		this.id = Id;
	},
	getId: function() {
		return this.id;
	},
	setName: function(Name) {
		this.name = Name;
	},
	getName: function() {
		return this.name;
	},
	setPosX: function(PosX) {
		this.posX = PosX;
	},
	getPosX: function() {
		return this.posX;
	},
	setPosY: function(PosY) {
		this.posY = PosY;
	},
	getPosY: function() {
		return this.posY;
	},
	setDescription: function(Description) {
		this.description = Description;
	},
	getDescription: function() {
		return this.description;
	},
	setType: function(Type) {
		this.type = Type;
	},
	getType: function() {
		return this.type;
	},
	setStyle: function(Style) {
		this.style = Style;
	},
	getStyle: function() {
		return this.style;
	},
	setCapa: function(Capa) {
		this.capa = Capa;
	},
	getCapa: function() {
		return this.capa;
	},
	setProjeccio: function(Projeccio) {
		this.projeccio = Projeccio;
	},
	getProjeccio: function() {
		return this.projeccio;
	},
	setIdComarca: function(IdComarca) {
		this.idComarca = IdComarca;
	},
	getIdComarca: function() {
		return this.idComarca;
	},
	setNameComarca: function(NameComarca) {
		this.nameComarca = NameComarca;
	},
	getNameComarca: function() {
		return this.nameComarca;
	},
	setIdMunicipio: function(IdMunicipio) {
		this.idMunicipio = IdMunicipio;
	},
	getIdMunicipio: function() {
		return this.idMunicipio;
	},
	setNameMunicipio: function(NameMunicipio) {
		this.nameMunicipio = NameMunicipio;
	},
	getNameMunicipio: function() {
		return this.nameMunicipio;
	},
	setDireccion: function(Direccion) {
		this.direccion = Direccion;
	},
	getDireccion: function() {
		return this.direccion;
	},
	
	copyAll: function (origin){
		this.id=origin.id; 
		this.name=origin.name; 
		this.description=origin.description; 
		this.posX=origin.posX; 
		this.posY=origin.posY; 
		this.type=origin.type; 
		this.style=origin.style; 
		this.capa=origin.capa; 
		this.projeccio=origin.projeccio;
		this.direccion=origin.direccion;
		this.idComarca=origin.idComarca;
		this.nameComarca=origin.nameComarca;
		this.idMunicipio=origin.idMunicipio;
		this.nameMunicipio=origin.nameMunicipio;
		this.listMunicipios=origin.listMunicipios;
		return true;
	},
	
	toDataMap: function (){
        /**
         * Data:
         * <xsd:element maxOccurs="1" minOccurs="0" name="OBJECTID" nillable="true" type="xsd:decimal"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="COMENTARI" nillable="true" type="xsd:string"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="DATA_MODIFICACIO" nillable="true" type="xsd:date"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="DATA_BAIXA" nillable="true" type="xsd:date"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="SHAPE" nillable="true" type="gml:GeometryPropertyType"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="SE_ANNO_CAD_DATA" nillable="true" type="xsd:hexBinary"/>
			<xsd:element maxOccurs="1" minOccurs="0" name="TITOL" nillable="true" type="xsd:string"/>
         */
		return {
			TITOL : this.name,
			COMENTARI : this.description,
			DATA_MODIFICACIO : null
		};
	},
	
	integratorCall: false,
	
	loadingElements:{
		direccion: false,
		municipio: false,
		comarca: false
	},

    /**
     * Constructor: SiceCAT.Feature
     *
     * Parameters:
     * feature - {feature} The feature to convert to defElement type
     */
    initialize: function(feature, bounds, integratorCall) {
    	if(!!integratorCall){
    		this.integratorCall = true;
    		if(Sicecat.isLogEnable) console.log("integrator.propertiesToLoad --> "+integrator.propertiesToLoad);
    	}
    	if(!!feature){
    		var initialized = false;
    		if(!!feature.data){
    			if(!!feature.data.sicecat_feature){
    				if(Sicecat.isLogEnable) console.log("Initialized!!");
    				initialized = this.copyAll(feature.data.sicecat_feature);
    			}else{
    				if(Sicecat.isLogEnable) console.log("Not initialized");
	    			this.id = feature.data.pk_id;
	            	this.name = feature.data.name;
	            	this.description = feature.data.description;
	            	this.type = feature.data.type; 
	            	this.style = feature.data.estilo;
    			}
    		}
            if(!initialized 
            	&& !!feature.geometry
				&& !!feature.geometry.getBounds()
				&& !!feature.geometry.getBounds().getCenterLonLat()){
            	this.posX = feature.geometry.getBounds().getCenterLonLat().lon;
				this.posY = feature.geometry.getBounds().getCenterLonLat().lat;
				this.initAll(feature.geometry.getBounds(), feature);
            }
            if(!initialized 
            		&& !!feature.layer 
            		&& !!feature.layer.map){
            	this.capa = feature.layer.id, 
        		this.projeccio = feature.layer.map.getProjection();
            }
		}else if(!!bounds){
			this.initAll(bounds);
		}
    	this.initialized = initialized;
    	this.callIntegratorLoadPost();
    },
	
	toString: function(){
		return "SiceCAT.Feature = (" + this.id + ","
					+ this.type + ","
					+ this.name + "," 
					+ this.description + ","
					+ this.posX + ","
					+ this.posY + ","
					+ this.style + ","
					+ this.capa + ","
					+ this.projeccio + ","
					+ this.direccion + ","
					+ this.idComarca + ","
					+ this.nameComarca + ","
					+ this.idMunicipio + ","
					+ this.nameMunicipio + ")";
	},
    
	/**
	 * Method: initAll
	 * 
	 * Inits all integration properties
	 * 
	 * Parameters:
     * bounds - {<OpenLayers.Bounds>} to get all
	 */
    initAll: function(bounds, feature){
    	if(!!feature){
    		if(!feature.data)
    			feature.data = {};
    		feature.data.sicecat_feature = this;
    	}
    	if((!!feature
    			&& !!feature.data
    			&& !!feature.data.type
    			&& !!feature.data.type == 'Incidente') 
    			|| (!feature 
        				|| !feature.data)){
    		for (var loadingElement in this.loadingElements){
				this.loadingElements[loadingElement]=true;
			}
			this.initComarcaMunicipio(bounds);
			this.initReverseGeocode(bounds);
    	}
    },
	
	callIntegratorLoadPost: function(){
    	if(this.integratorCall){
    		var loaded = true;
    		for (var loadingElement in this.loadingElements){
    			if(Sicecat.isLogEnable) console.log(loadingElement + " loading? " + this.loadingElements[loadingElement]);
    			if(this.loadingElements[loadingElement]){
    				loaded = false;
    				//break;
    			}
    		}
    		if(loaded || this.initialized){
    			//TODO: Register as callback
    			integrator.msAplLoadPost();
    		}
    	}
	},
    
	/**
	 * Method: initComarcaMunicipio
	 * 
	 * Inits this.idComarca, this.nameComarca, this.idMunicipio and this.nameMunicipio
	 * 
	 * Parameters:
     * bounds - {<OpenLayers.Bounds>} to get comarca and municipio
	 */
    initComarcaMunicipio: function(bounds){
    	//No es necesario el initComarca porque en el municipio viene
    	//this.initComarca(bounds);
		this.initMunicipio(bounds);
    },
    
	/**
	 * Method: initReverseGeocode
	 * 
	 * Inits this.direccion
	 * 
	 * Parameters:
     * bounds - {<OpenLayers.Bounds>} to get comarca and municipio
	 */
    initReverseGeocode: function(bounds){
    	var panel = new SiceCAT.widgets.OpenlsSigescatReverseGeocodePanel({
	    	closest: false,
	    	map: map,
	    	verbose: false,
	    	doZoom: false,
	    	listeners:{
	    		addressload:function(direccion){
	    			if(!!direccion){
	    				this.direccion = direccion;
	    			}
	    			this.loadingElements["direccion"]=false;
	    			this.callIntegratorLoadPost();
	    		}, 
	    		loadexception:function(e){
	    			if(Sicecat.isLogEnable) console.log("Error in openls");
	    			this.loadingElements["direccion"]=false;
	    			this.callIntegratorLoadPost();
	    		}, 
	    		scope: this
	    	}
	    });
	    panel.reverseGeocode(bounds.getCenterLonLat().lon, bounds.getCenterLonLat().lat, 1, ' ');
    },
    
    propertyComarca: "ID",

	/**
	 * Method: initComarca
	 * 
	 * Inits this.idComarca and this.nameComarca
	 * 
	 * Parameters:
     * bounds - {<OpenLayers.Bounds>} envolves this.point
	 */
    initComarca: function (bounds) {
		
	    var panel = new SiceCAT.ZoomToResultPanel({
	    	closest: false,
	    	sicecatInstance: Sicecat,
	    	map: map,
	    	verbose: false,
	    	doZoom: false,
	    	listeners:{
	    		zoomDone:function(panel, features){
	    			if(Sicecat.isLogEnable) console.log("zoomDone --> "+features);
	    			if(!!features && !!features[0]){
	    				var feature = features[0];
						if(Sicecat.isLogEnable) console.log("obtenida la comarca");
						this.setIdComarca(feature.data.ID);
						this.setNameComarca(feature.data.NOM);
	    			}
	    			this.loadingElements["comarca"]=false;
	    			this.callIntegratorLoadPost();
	    		}, 
	    		loadexception:function(e){
	    			if(Sicecat.isLogEnable) console.log("Error in WFS");
	    			this.loadingElements["comarca"]=false;
	    			this.loadingElements["municipio"]=false;
	    			this.callIntegratorLoadPost();
	    		},
	    		scope: this
	    	}
	    });
	    panel.getZoomToResult("s:k", null, null, "temp", bounds);
	},
	
    propertyMunicipio: "INE_NUM",

	/**
	 * Method: initMunicipio
	 * 
	 * Inits this.idMunicipio and this.nameMunicipio
	 * 
	 * Parameters:
     * bounds - {<OpenLayers.Bounds>} envolves this.point
	 */
    initMunicipio: function (bounds) {
		
	    var panel = new SiceCAT.ZoomToResultPanel({
	    	closest: false,
	    	sicecatInstance: Sicecat,
	    	map: map,
	    	verbose: false,
	    	doZoom: false,
	    	listeners:{
	    		zoomDone:function(panel, features){
	    			if(!!features && !!features[0]){
	    				var feature = features[0];
						this.resultToThis(feature, this);
						if(features.length > 1){
							this.listMunicipios = [];
							for(var i= 0; i< features.length; i++){
								var municipio = new SiceCAT.Feature();
								this.resultToThis(features[i], municipio);
								this.listMunicipios[i] = municipio;
							}
						}
	    			}
	    			this.loadingElements["comarca"]=false;
	    			this.loadingElements["municipio"]=false;
	    			this.callIntegratorLoadPost();
	    		}, 
	    		loadexception:function(e){
	    			if(Sicecat.isLogEnable) console.log("Error in WFS");
	    			this.loadingElements["comarca"]=false;
	    			this.loadingElements["municipio"]=false;
	    			this.callIntegratorLoadPost();
	    		},
	    		scope: this
	    	}
	    });
	    panel.getZoomToResult("s:i", null, null, "temp", bounds);
	},
	
	resultToThis: function(feature, this_){
		if(Sicecat.isLogEnable) console.log("obtenido el municipio "+feature.data.NOM_POBLACIO);
		this_.setIdComarca(feature.data.ID_COMARCA);
		this_.setNameComarca(feature.data.NOM_COMARCA);
		this_.setIdMunicipio(feature.data.INE_NUM);
		this_.setNameMunicipio(feature.data.NOM_POBLACIO);
		/*
		 * Propiedades del WFS:
		 * ID_COMARCA: "13"
			ID_POBLACIO: "380"
			INE: "080193"
			INE_NUM: "80193"
			NOM: "Barcelona"
			NOM_COMARCA: "Barcelonès"
			NOM_POBLACIO: "Barcelona"
			NOM_PROVINCIA: "Barcelona"
		 */
	}
			
});