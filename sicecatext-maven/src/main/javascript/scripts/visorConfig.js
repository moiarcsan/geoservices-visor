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
        "pap": "Centres de l'administraci\u00f3 p\u00fablica",
        "pas": "Centres d'assist\u00e8ncia social",
        "pb": "Centres de negoci",
        "pe": "Centres educatius",
        "pl": "Centres de lleure",
        "pm": "Centres de transport i mobilitat",
        "psa": "Centres de salut",
        "pse": "Centres de seguretat",
        "t": "Topon\u00edmia (nomencl\u00e0tor)",
        "ra": "Anotacions poligonals",
        "rl": "Anotacions lineals",
        "rp": "Anotacions puntuals",
        "a": "AVAS (Base dels avions de vigil\u00e0ncia i atac).",
        "ab": "\u00C0rees B\u00e0siques policials.",
        "ae": "Activitats extractives.",
        "ap": "Inuncat: Punts d'actuaci\u00f3 priorit\u00e0ria.",
        "aps": "Punts d'actuaci\u00f3 priorit\u00e0ria",
        "b": "Guaites.",
        "c": "Heliports.",
        "c112": "Centres del servei 112.",
        "ca": "Xarxa de camins",
        "cd": "Inuncat: Cons de dejecci\u00f3",
        "co": "Al\u00e7ada edificis",
        "d": "Hidrants",
        "db": "Districtes de Barcelona.",
        "e": "Punts d'aigua.",
        "ef": "Estacions de ferrocarril.",
        "ei": "Establiments industrials (SIPAE)",
        "en": "Espais Naturals de Protecci\u00f3 Especial.",
        "f": "Parcs de bombers",
        "fo": "\u00C0rees forestals p\u00fabliques",
        "g": "Xarxa RESCAT (Torres de comunicaci\u00f3)",
        "h": "Capitals de municipi",
        "i": "L\u00edmits municipals",
        "ir": "Zones inundables presa Rialb",
        "k": "L\u00edmits comarcals.",
        "lf": "L\u00ednies de ferrocarril.",
        "np": "Nuclis de poblaci\u00f3",
        "nv": "Nodes del graf",
        "p": "L\u00edmits provincials",
        "pi": "Inuncat_Zones potencialment inundables.",
        "plo": "Municipis amb Policia Local.",
        "pn": "Risc incendi forestal. Perill.",
        "po": "\u00daltima posici\u00f3 dels efectius RESCAT",
        "rpo": "Mapa de les Regions Policials.",
        "s1": "Malla SOC 1km",
        "s5": "Malla SOC de 5 km",
        "sc": "Inuncat: Sirenes preses cobertura.",
        "soc": "Malla SOC 1 km",
        "sp": "Situaci\u00f3 de la sirena de les preses.",
        "sv": "Segments del graf",
        "svm": "Segments del graf",
        "tf": "T\u00fanels de ferrocarril",
        "tt": "Inuncat: Temps de tr\u00e0nsit",
        "vu": "Infocat: Mapa de vulnerabilitat d'incendis",
        "x": "Eixos carretera (DGC)",
        "y": "Punts quilom\u00e8trics (DGC)",
        "z": "Tallafocs",
        "z1": "Inuncat. Zones inundables T50",
        "z3": "Zones inundables T500.",
        "zt": "Inuncat: Zones inundables T100"
    },
    "WMS_SOURCES": {
        "sigescat": {
            url: "http://sigescat.pise.interior.intranet/ows/wms",
            version: "1.1.1",
            securized: true
        },
        "taure.icc.cat": {
            url: "http://taure.icc.cat/cgi-bin/mapserv?",
            baseParams: {
                map: "/opt/idec/dades/pcivil/risc_municipal.map",
                LAYERS: "PAM_CAMCAT_obl",
                FORMAT: "image%2Fpng",
                SRS: "EPSG%3A23031",
                EXCEPTIONS: "application%2Fvnd.ogc.se_xml",
                TRANSPARENT: true,
                SERVICE: "WMS",
                REQUEST: "getCapabilities"
            },
            version: "1.1.1"
        },
        "galileo.icc.cat": {
            url: "http://galileo.icc.cat/arcgis/services/icc_limadmin_v_r/MapServer/WMSServer",
            version: "1.1.1"
        },
        "proteccion civil": {
            url: "http://sigescat.pise.interior.intranet/ows2/wms",
            securized: true,
            version: "1.1.0",
            baseParams: {
                SERVICE: "WMS",
                REQUEST: "getCapabilities",
                SECURITY: true
            }
        }

    },
    
    "WFS_GET_CAPABILITIES": "ows/wfs?request=GetCapabilities",
    "OPENLS_SRS": "EPSG:23031"

};
