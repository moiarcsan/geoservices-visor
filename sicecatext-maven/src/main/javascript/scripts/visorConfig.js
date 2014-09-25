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
    WMS_SOURCES: {
        "geoserver": {
            url: "http://geoemerg-win2008.emergya.es/geoserver/wms?REQUEST=GetCapabilities",
            version: "1.1.1"
        },
        "mapproxy": {
            url: "http://geoemerg-win2008.emergya.es:8081/service?REQUEST=GetCapabilities"
        }
    }

};
