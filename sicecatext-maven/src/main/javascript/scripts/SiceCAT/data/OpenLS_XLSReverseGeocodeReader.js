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

SiceCAT.data.OpenLS_XLSReverseGeocodeReader = function(meta, recordType) {
	meta = meta || {};


	Ext.applyIf(meta, {
				idProperty: meta.idProperty || meta.idPath || meta.id,
				successProperty: meta.successProperty || meta.success
			});

	SiceCAT.data.OpenLS_XLSReverseGeocodeReader.superclass.constructor.call(this, meta, recordType || meta.fields);
};

Ext.extend(SiceCAT.data.OpenLS_XLSReverseGeocodeReader, Ext.data.XmlReader, {

	addOptXlsText: function(format, text, node, tagname, sep) {
		var elms = format.getElementsByTagNameNS(node, "http://www.opengis.net/xls", tagname);
		if (elms) {
			Ext.each(elms, function(elm, index) {
				var str = format.getChildValue(elm);
				if (str) {
					text = text + sep + str;
				}
			});
		}

		return text;
	},

	addOptXlsPropertyText: function(format, text, node, tagname, sep, property) {
		var elms = format.getElementsByTagNameNS(node, "http://www.opengis.net/xls", tagname);
		if (elms) {
			Ext.each(elms, function(elm, index) {
				var str = format.getAttributeNodeNS(elm, "http://www.opengis.net/xls", property);
				if (str) {
					text = text + sep + str;
				}
			});
		}

		return text;
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
		var addresses = format.getElementsByTagNameNS(root, "", 'ReverseGeocodedLocation');

		// Create record for each address
		var recordType = Ext.data.Record.create([
			{name: "lon", type: "number"},
			{name: "lat", type: "number"},
			{name: "text", type: "string"},
			{name: "place", type: "string"},
			{name: "typePlace", type: "string"},
			{name: "searchCentreDistance", type: "number"}
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
			var searchCentreDistance = '';
			
			if(Sicecat.isLogEnable) console.log("Reading a reverseLocation");
			
			/**
			 * SIGESCAT Result:
					<ReverseGeocodedLocation>
						<gml:Point srsName="82340">
							<gml:pos dimension="2">432885.726989443,4583851.3716603</gml:pos>
						</gml:Point>
						<xls:Address countryCode="ES" language="CAT">
							<xls:StreetAddress>
								<xls:Building number="209" />
								<xls:Street>Carrer dels Almogàvers</xls:Street>
							</xls:StreetAddress>
							<xls:Place type="Municipality">Barcelona</xls:Place>
						</xls:Address>
						<SearchCentreDistance value="28.6714679795672" />
					</ReverseGeocodedLocation>
			 *
			 */
			text = reader.addOptXlsText(format, text, address, 'Street', '');
//			text = reader.addOptXlsText(format, text, address, 'StreetAddress', '');
			place = reader.addOptXlsText(format, text, address, 'Place', ',');
			searchCentreDistance = reader.addOptXlsText(format, text, address, 'SearchCentreDistance', ',');
			typePlace = reader.addOptXlsPropertyText(format, text, address, 'Place', ',', 'type');
			var values = {
				lon : parseFloat(xyArr[0]),
				lat : parseFloat(xyArr[1]),
				place: place,
				searchCentreDistance: searchCentreDistance,
				typePlace: typePlace,
				text : text
			};
			var record = new recordType(values, index);
			record.data['lon'] = values.lon; // updates record, but not the view
			record.data['lat'] = values.lat; // updates record, but not the view
			record.data['place'] = values.place; // updates record, but not the view
			record.data['searchCentreDistance'] = values.lonsearchCentreDistance; // updates record, but not the view
			record.data['typePlace'] = values.typePlace; // updates record, but not the view
			record.data['text'] = values.text; // updates record, but not the view
			record.commit(); // updates the view
			
			records.push(record);
		});
		return records;
	}
});
