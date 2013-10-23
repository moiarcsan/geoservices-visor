/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/GML/Base.js
 */

/**
 * Class: OpenLayers.Format.GML.v3
 * Parses GML version 3.
 *
 * Inherits from:
 *  - <OpenLayers.Format.GML.Base>
 */
OpenLayers.Format.GML.v3_SIGESCAT = OpenLayers.Class(OpenLayers.Format.GML.v3, {

    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "gml": OpenLayers.Util.applyDefaults({
            "featureMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Curve": function(node, container) {
                var obj = {points: []};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                container.components.push(
                    new OpenLayers.Geometry.LineString(obj.points)
                );
            },
            "segments": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "LineStringSegment": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                if(obj.points) {
                    Array.prototype.push.apply(container.points, obj.points);
                }
            },
            "pos": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
				if(coords.length < 2){
					//4) <gml:pos>x, y</gml:pos> SIGESCAT!!
				   coords = str.split(this.regExes.trimComma);
				}
                var point;
                if(this.xy) {
                    point = new OpenLayers.Geometry.Point(
                        coords[0], coords[1], coords[2]
                    );
                } else {
                    point = new OpenLayers.Geometry.Point(
                        coords[1], coords[0], coords[2]
                    );
                }
                obj.points = [point];
            },
            "posList": function(node, obj) {
                var str = this.getChildValue(node).replace(
                    this.regExes.trimSpace, ""
                );
                var coords = str.split(this.regExes.splitSpace);
                var dim = parseInt(node.getAttribute("dimension")) || 2;
                var j, x, y, z;
                var numPoints = coords.length / dim;
                var points = new Array(numPoints);
                for(var i=0, len=coords.length; i<len; i += dim) {
                    x = coords[i];
                    y = coords[i+1];
                    z = (dim == 2) ? undefined : coords[i+2];
                    if (this.xy) {
                        points[i/dim] = new OpenLayers.Geometry.Point(x, y, z);
                    } else {
                        points[i/dim] = new OpenLayers.Geometry.Point(y, x, z);
                    }
                }
                obj.points = points;
            },
            "Surface": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "patches": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "PolygonPatch": function(node, obj) {
                this.readers.gml.Polygon.apply(this, [node, obj]);
            },
            "exterior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.outer = obj.components[0];
            },
            "interior": function(node, container) {
                var obj = {};
                this.readChildNodes(node, obj);
                container.inner.push(obj.components[0]);
            },
            "MultiCurve": function(node, container) {
                var obj = {components: []};
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiLineString(obj.components)
                    ];
                }
            },
            "curveMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "MultiSurface": function(node, container) {
                var obj = {components: []};
                this.readChildNodes(node, obj);
                if(obj.components.length > 0) {
                    container.components = [
                        new OpenLayers.Geometry.MultiPolygon(obj.components)
                    ];
                }
            },
            "surfaceMember": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "surfaceMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "pointMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "lineStringMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "polygonMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "geometryMembers": function(node, obj) {
                this.readChildNodes(node, obj);
            },
            "Envelope": function(node, container) {
                var obj = {points: new Array(2)};
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }
                var min = obj.points[0];
                var max = obj.points[1];
                container.components.push(
                    new OpenLayers.Bounds(min.x, min.y, max.x, max.y)
                );
            },
            "lowerCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[0] = obj.points[0];
            },
            "upperCorner": function(node, container) {
                var obj = {};
                this.readers.gml.pos.apply(this, [node, obj]);
                container.points[1] = obj.points[0];
            }
        }, OpenLayers.Format.GML.Base.prototype.readers["gml"]),            
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Format.GML.Base.prototype.readers["wfs"]
    },
    
    CLASS_NAME: "OpenLayers.Format.GML.v3_SIGESCAT" 

});
