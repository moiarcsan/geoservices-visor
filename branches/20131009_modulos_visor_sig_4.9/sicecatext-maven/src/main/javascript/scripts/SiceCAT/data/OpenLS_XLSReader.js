/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.namespace("SiceCAT.data");

/** api: (define)
 *  module = SiceCAT.data
 *  class = OpenLS_XLSReader
 *  base_link = `Ext.data.XmlReader <http://dev.sencha.com/deploy/ext-3.3.1/docs?class=Ext.data.XmlReader>`_
 */

SiceCAT.data.OpenLS_XLSReader = function(meta, recordType) {
	meta = meta || {};


	Ext.applyIf(meta, {
				idProperty: meta.idProperty || meta.idPath || meta.id,
				successProperty: meta.successProperty || meta.success
			});

	SiceCAT.data.OpenLS_XLSReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};

Ext.extend(SiceCAT.data.OpenLS_XLSReader, Ext.data.XmlReader, {

	addOptXlsText: function(format, node, tagname, sep) {
		var str = "";
		var elms = format.getElementsByTagNameNS(node, "http://www.opengis.net/xls", tagname);
		if (elms) {
			Ext.each(elms, function(elm, index) {
				str = format.getChildValue(elm);
			});
		}

		return str;
	},

	addOptXlsPropertyText: function(format, node, tagname, sep, property) {
		var str = "";
		var elms = format.getElementsByTagNameNS(node, "http://www.opengis.net/xls", tagname);
		if (elms) {
			Ext.each(elms, function(elm, index) {
				if(elm.attributes){
					str = elm.attributes.getNamedItem(property).value;
				}
			});
		}

		return str;
	},
	
	read : function(response){
        var doc = response.responseXML;
        var ret = null;
        if(!doc) {
        	var data = null;
        	if(!!response.responseText){
        		data = OpenLayers.Format.XML.prototype.read.apply(this, [response.responseText]);
        	}
        	if(!!data){
        		ret = this.readRecords(data);
        	}else{
        		throw {message: "XmlReader.read: XML Document not available"};       		
        	}
        }else{
        	ret = this.readRecords(doc);
        }
        return ret;
    },

	readRecords : function(doc) {

		this.xmlData = doc;

		var root = doc.documentElement || doc;

		var records = this.extractData(root);

		return {
			success : true,
			records : records,
			totalRecords : records.length
		};
	},

	extractData: function(root) {
		var opts = {
			/**
			 * Property: namespaces
			 * {Object} Mapping of namespace aliases to namespace URIs.
			 */
			namespaces: {
				gml: "http://www.opengis.net/gml",
				xls: "http://www.opengis.net/xls"
			}
		};

		var records = [];
		var format = new OpenLayers.Format.XML(opts);
		var addresses = format.getElementsByTagNameNS(root, "http://www.opengis.net/xls", 'GeocodedAddress');

		// Create record for each address
		var recordType = Ext.data.Record.create([
			{name: "lon", type: "number"},
			{name: "lat", type: "number"},
			"text"
		]);
		var reader = this;

		Ext.each(addresses, function(address, index) {
			var pos = format.getElementsByTagNameNS(address, "http://www.opengis.net/gml", 'pos');
			var xy = '';
			if (pos && pos[0]) {
				xy = format.getChildValue(pos[0]);
			}

			var xyArr = xy.split(',');

			var text = '';
			var place = '';
			var typePlace = '';
			
			/**
			 * SIGESCAT Result:
			 *		 <xls:GeocodedAddress>
	                    <gml:Point srsName="EPSG:23031">
	                        <gml:pos dimension="2">364354.300830706,4555340.75144698
	                        </gml:pos>
	                    </gml:Point>
	                    <GeocodeMatchCode accuracy="1.6969097" />
	                    <xls:Address countryCode="ES" language="CAT">
	                        <xls:StreetAddress>
	                            <xls:Building number="15" />
	                            <xls:Street>Carrer de Manuel Berges</xls:Street>
	                        </xls:StreetAddress>
	                        <xls:Place type="Municipality">Altafulla</xls:Place>
	                    </xls:Address>
	                </xls:GeocodedAddress>
			 *
			 */
			text = reader.addOptXlsText(format, address, 'Street', '');
			number = reader.addOptXlsPropertyText(format, address, 'Building', ',', 'number');
			place = reader.addOptXlsText(format, address, 'Place', ',');
			typePlace = reader.addOptXlsPropertyText(format, address, 'Place', ',', 'type');
			var values = {
				lon : parseFloat(xyArr[0]),
				lat : parseFloat(xyArr[1]),
				place: place,
				typePlace: typePlace,
				number: number,
				text : text
			};
			var record = new recordType(values, index);
			records.push(record);
		});
		return records;
	}
});

