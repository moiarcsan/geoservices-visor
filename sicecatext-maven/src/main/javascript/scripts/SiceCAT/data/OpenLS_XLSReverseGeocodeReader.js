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

Ext.extend(SiceCAT.data.OpenLS_XLSReverseGeocodeReader, SiceCAT.data.OpenLS_XLSReader, {
	
	/**
	 * Property: searchCenterDistance {String} Default text to be show
	 */
	searchCenterDistance: "Search center distance",

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
		var addresses = format.getElementsByTagNameNS(root, "xls", 'ReverseGeocodedLocation');
		if(addresses.length == 0){
			addresses = root.getElementsByTagName("ReverseGeocodedLocation");
		}

		// Create record for each address
		var recordType = Ext.data.Record.create([
			{name: "lon", type: "number"},
			{name: "lat", type: "number"},
			{name: "text", type: "string"},
			{name: "number", type: "string"},
			{name: "place", type: "string"},
			{name: "typePlace", type: "string"},
			{name: "searchCentreDistance", type: "number"}
		]);
		var reader = this;

		Ext.each(addresses, function(address, index) {
			var pos = format.getElementsByTagNameNS(address, opts.namespaces.gml, 'pos');
			var xy = '';
			if (pos && pos[0]) {
				xy = format.getChildValue(pos[0]);
			}

			var xyArr = null;

			if(xy.indexOf(",") > -1){
				xyArr = xy.split(',');
			}else if(xy.indexOf(" ") > -1){
				xyArr = xy.split(' ');
			}

			var text = '';
			var place = '';
			var typePlace = '';
			var searchCentreDistance = '';
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
			/* Get street name */
			text = reader.addOptXlsText(format, address, 'Street', opts.namespaces.xls);
			/* Get street number */
			number = reader.addOptXlsPropertyText(format, address, 'Building', opts.namespaces.xls, 'number');
			/* Get municipality place */
			place = reader.addOptXlsText(format, address, 'Place', opts.namespaces.xls);
			/* Get center distance */
			searchCentreDistance = reader.addOptXlsPropertyText(format, address, 'SearchCentreDistance', "", 'value');
			/* Get type place */
			typePlace = reader.addOptXlsPropertyText(format, address, 'Place', opts.namespaces.xls, 'type');
			/* Make object with values to show */
			var values = {};
			values[reader.lon] = parseFloat(xyArr[0]);
			values[reader.lat] = parseFloat(xyArr[1]);
			values[reader.street] = text;
			values[reader.number] = number;
			values[reader.place] = place;
			values[reader.typePlace] = typePlace;
			values[reader.searchCenterDistance] = searchCentreDistance;
			var record = new recordType(values, index);
			records.push(record);
		});
		return records;
	}
});
