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
        "pap": "Centros de administraci&oacute;n p&uacute;blica",
        "pas": "Centros de asistencia social",
        "pb": "Centros de negocio",
        "pe": "Centros educativos",
        "pl": "Centros de ocio",
        "pm": "Centros de transporte y movilidad",
        "psa": "Centros de salud",
        "pse": "Centros de seguridad",
        "t": "Toponimia (nomenclator)",
        "ra": "Anotaciones poligonales",
        "rl": "Anotaciones lineales",
        "rp": "Anotaciones puntuales",
        "a": "AVAS (bases de aviones de vigilancia y ataque)",
        "ab": "&Aacute;reas b&aacute;sicas policiales",
        "ae": "Actividades extractivas",
        "ap": "Inuncat: Puntos de actuaci&oacute;n prioritaria",
        "aps": "Puntos de actuaci&oacute;n prioritaria",
        "b": "Vig&iacute;­as",
        "c": "Helipuertos",
        "c112": "Centros del servicio 112",
        "ca": "Red de caminos",
        "co": "Altura de edificios",
        "d": "Bocas de incendio",
        "db": "Distritos",
        "e": "Puntos de agua",
        "ef": "Estaciones de ferrocarril",
        "ei": "Establecimientos industriales (SIPAE)",
        "en": "Espacios naturales con protecci&oacute;n especial",
        "f": "Parques de bomberos",
        "fo": "&Aacute;reas forestales p&uacute;blicas",
        "g": "Torres de comunicaci&oacute;n",
        "h": "Capitales de municipio",
        "i": "L&iacute;­mites municipales",
        "k": "L&iacute;­mites comarcales",
        "lf": "L&iacute;­neas de ferrocarril",
        "np": "N&uacute;cleos de poblaci&oacute;n",
        "nv": "Nodos del grafo",
        "p": "L&iacute;­mites provinciales",
        "pi": "Zonas potencialmente inundables",
        "plo": "Municipios con polic&iacute;­a local",
        "pn": "Riesgo de incendio forestal (peligro) ",
        "po": "&iacute;šltima posici&oacute;n de efectivos RESCAT",
        "rpo": "Mapa de las regiones policiales",
        "s1": "Malla SOC 1km",
        "s5": "Malla SOC de 5 km",
        "sc": "Inuncat: Sirenas presas cobertura",
        "soc": "Malla SOC 1 km",
        "sp": "Situaci&oacute;n de la sirena de les presas",
        "sv": "Segmentos del grafo",
        "svm": "Segmentos del grafo",
        "tf": "T&uacute;neles de ferrocarril",
        "tt": "Inuncat: Temps de tr\u00e0nsit",
        "vu": "Mapa de vulnerabilidad de inc&eacute;ndios",
        "x": "Ejes de carretera",
        "y": "Puntos kilom&eacute;tricos",
        "z": "Cortafuegos",
        "z1": "Zonas inundables T50",
        "z3": "Zonas inundables T500",
        "zt": "Zonas inundables T100"
    },
    "WMS_SOURCES": {
        "geoserver": {
            url: "http://10.239.200.70/geoserver/wms?REQUEST=GetCapabilities",
            version: "1.1.1"
        }
    },
    "WFS_GET_CAPABILITIES": "ows/wfs?request=GetCapabilities&version=1.1.0",
    "OPENLS_SRS": "EPSG:23030",
    "MOUSE_CONTROL_PROJECTIONS": {
        "WGS84": "EPSG:4326",
        "UTM ED50 30N": "EPSG:23030"
    },
    "COORDINATES_CALCULATOR_PROJECTIONS": [
        ['EPSG:23030', 'EPSG:23030 (UTM 30N / ED50)'],
        ['EPSG:4326', 'EPSG:4326 (Lat/Lon WGS84)']]

};

