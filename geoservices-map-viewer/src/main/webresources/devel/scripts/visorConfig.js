/* 
 * Copyright (C) 2014 Emergya
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 * 
 * Authors: lroman@emergya.com
 */

/**
 * This variable has configurations that can be overriden in different environments
 */
var VisorConfig = {
    "LAYER_TITLES": {
		"pap" : "Centros de administración pública",
		"pas" : "Centros de asistencia social",
		"pb" : "Centros de negocio",
		"pe" : "Centros educativos",
		"pl" : "Centros de ocio",
		"pm" : "Centros de transporte y movilidad",
		"psa" : "Centros de salud",
		"pse" : "Centros de seguridad",
		"t" : "Toponimia (nomenclator)",
		"ra" : "Anotaciones poligonales",
		"rl" : "Anotaciones lineales",
		"rp" : "Anotaciones puntuales",
		"a" : "AVAS (bases de aviones de vigilancia y ataque)",
		"ab" : "Áreas básicas policiales",
		"ae" : "Actividades extractivas",
		"ap" : "Inuncat: Puntos de actuación prioritaria",
		"aps" : "Puntos de actuación prioritaria",
		"b" : "Vigías",
		"c" : "Helipuertos",
		"c112" : "Centros del servicio 112",
		"ca" : "Red de caminos",
		"co" : "Altura de edificios",
		"d" : "Bocas de incendio",
		"db" : "Distritos",
		"e" : "Puntos de agua",
		"ef" : "Estaciones de ferrocarril",
		"ei" : "Establecimientos industriales (SIPAE)",
		"en" : "Espacios naturales con protección especial",
		"f" : "Parques de bomberos",
		"fo" : "Áreas forestales públicas",
		"g" : "Torres de comunicación",
		"h" : "Capitales de municipio",
		"i" : "Límites municipales",
		"k" : "Límites comarcales",
		"lf" : "Líneas de ferrocarril",
		"np" : "Núcleos de población",
		"nv" : "Nodos del grafo",
		"p" : "Límites provinciales",
		"pi" : "Zonas potencialmente inundables",
		"plo" : "Municipios con policía local",
		"pn" : "Riesgo de incendio forestal (peligro) ",
		"po" : "Última posición de efectivos RESCAT",
		"rpo" : "Mapa de las regiones policiales",
		"s1" : "Malla SOC 1km",
		"s5" : "Malla SOC de 5 km",
		"sc" : "Inuncat: Sirenas presas cobertura",
		"soc" : "Malla SOC 1 km",
		"sp" : "Situación de la sirena de les presas",
		"sv" : "Segmentos del grafo",
		"svm" : "Segmentos del grafo",
		"tf" : "Túneles de ferrocarril",
		"tt" : "Inuncat: Temps de tr\u00e0nsit",
		"vu" : "Mapa de vulnerabilidad de incéndios",
		"x" : "Ejes de carretera",
		"y" : "Puntos kilométricos",
		"z" : "Cortafuegos",
		"z1" : "Zonas inundables T50",
		"z3" : "Zonas inundables T500",
		"zt" : "Zonas inundables T100"
	},
    "WMS_SOURCES": {
        "geoserver": {
            url: "http://geoemerg-win2008.emergya.es/geoserver/wms?REQUEST=GetCapabilities",
            version: "1.1.1"
        },
        "mapproxy": {
            url: "http://geoemerg-win2008.emergya.es:8081/service?REQUEST=GetCapabilities"
        }
    },
    
    "WFS_GET_CAPABILITIES": "ows/wfs?request=GetCapabilities&version=1.1.0",
    
    "OPENLS_SRS": "EPSG:23030",
    
    "MOUSE_CONTROL_PROJECTIONS": {
        "WGS84":"EPSG:4326",
        "UTM ED50 30N":"EPSG:23030"
    },
    "COORDINATES_CALCULATOR_PROJECTIONS": [
        ['EPSG:23030', 'EPSG:23030 (UTM 30N / ED50)'],
        ['EPSG:4326', 'EPSG:4326 (Lat/Lon WGS84)']]

};
