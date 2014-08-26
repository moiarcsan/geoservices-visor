/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Format/XLS/v1.js
 */

/**
 * Class: OpenLayers.Format.XLS.v1_1_0
 * Read / write XLS version 1.1.0.
 * 
 * Inherits from:
 *  - <OpenLayers.Format.XLS.v1>
 */
OpenLayers.Format.XLS.v1_1_0_SIGESCAT = OpenLayers.Class(
    OpenLayers.Format.XLS.v1_1_0, {
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "xls": {
            "XLS": function(node, xls) {
                xls.version = node.getAttribute("version");
                this.readChildNodes(node, xls);
            },
            "Response": function(node, xls) {
               this.readChildNodes(node, xls);
            },
            "GeocodeResponse": function(node, xls) {
               xls.responseLists = [];
               this.readChildNodes(node, xls);
            },
            "GeocodeResponseList": function(node, xls) {
                var responseList = {
                    features: [], 
                    numberOfGeocodedAddresses: 
                        parseInt(node.getAttribute("numberOfGeocodedAddresses"))
                };
                xls.responseLists.push(responseList);
                this.readChildNodes(node, responseList);
            },
            "GeocodedAddress": function(node, responseList) {
                var feature = new OpenLayers.Feature.Vector();
                responseList.features.push(feature);
                this.readChildNodes(node, feature);
                // post-process geometry
                feature.geometry = feature.components[0];
            },
            "GeocodeMatchCode": function(node, feature) {
                feature.attributes.matchCode = {
                    accuracy: parseFloat(node.getAttribute("accuracy")),
                    matchType: node.getAttribute("matchType")
                };
            },
            "Address": function(node, feature) {
                var address = {
                    countryCode: node.getAttribute("countryCode"),
                    addressee: node.getAttribute("addressee"),
                    street: [],
                    place: []
                };
                feature.attributes.address = address;
                this.readChildNodes(node, address);
            },
            "freeFormAddress": function(node, address) {
                address.freeFormAddress = this.getChildValue(node);
            },
            "StreetAddress": function(node, address) {
                this.readChildNodes(node, address);
            },
            "Building": function(node, address) {
                address.building = {
                    'number': node.getAttribute("number"),
                    subdivision: node.getAttribute("subdivision"),
                    buildingName: node.getAttribute("buildingName")
                };
            },
            "Street": function(node, address) {
                // only support the built-in primitive type for now
                address.street.push(this.getChildValue(node));
            },
            "Place": function(node, address) {
                // type is one of CountrySubdivision, 
                // CountrySecondarySubdivision, Municipality or
                // MunicipalitySubdivision
                address.place[node.getAttribute("type")] = 
                    this.getChildValue(node);
            },
            "PostalCode": function(node, address) {
                address.postalCode = this.getChildValue(node);
            }
        },
        "gml": OpenLayers.Format.GML.v3_SIGESCAT.prototype.readers.gml
    },

    CLASS_NAME: "OpenLayers.Format.XLS.v1_1_0_SIGESCAT"

});
