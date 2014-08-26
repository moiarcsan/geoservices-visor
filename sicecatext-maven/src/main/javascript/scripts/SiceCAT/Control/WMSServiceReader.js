Ext.namespace("SiceCAT.Control");

/**
 * api: constructor .. class:: WMSServiceReader(meta, recordType)
 * 
 * :param meta: ``Object`` Reader configuration from which: ``layerOptions`` is
 * an optional object passed as default options to the ``OpenLayers.Layer.WMS``
 * constructor. ``layerParams`` is an optional set of parameters to pass into
 * the ``OpenLayers.Layer.WMS`` constructor. :param recordType: ``Array |
 * Ext.data.Record`` An array of field configuration objects or a record object.
 * Default is :class:`GeoExt.data.LayerRecord` with the following fields: name,
 * title, abstract, queryable, opaque, noSubsets, cascaded, fixedWidth,
 * fixedHeight, minScale, maxScale, prefix, formats, styles, srs, dimensions,
 * bbox, llbbox, attribution, keywords, identifiers, authorityURLs,
 * metadataURLs. The type of these fields is the same as for the matching fields
 * in the object returned from ``OpenLayers.Format.WMSCapabilities::read()``.
 * 
 * Data reader class to create an array of :class:`GeoExt.data.LayerRecord`
 * objects from a WMS GetCapabilities response.
 */
SiceCAT.Control.WMSServiceReader = function(meta, recordType) {
	meta = meta || {};
	if (!meta.format) {
		meta.format = new OpenLayers.Format.WMSCapabilities();
	}
	if (typeof recordType !== "function") {
		recordType = Ext.data.Record.create(recordType || meta.fields || [ {
			name : "nameField",
			type : "string"
		}, {
			name : "valueField",
			type : "string"
		}]);
	}
	GeoExt.data.WMSCapabilitiesReader.superclass.constructor.call(this, meta,
			recordType);
};

Ext.extend(SiceCAT.Control.WMSServiceReader, GeoExt.data.WMSCapabilitiesReader,
		{

			/**
			 * api: config[attributionCls] ``String`` CSS class name for the
			 * attribution DOM elements. Element class names append "-link",
			 * "-image", and "-title" as appropriate. Default is
			 * "gx-attribution".
			 */
			attributionCls : "gx-attribution",
			
			/** i18n */
			nameLayerSelected: "Nombre de la capa seleccionada",
		    urlLayerSelected: "Url de la capa seleccionada",
		    maxExtentLayerSelected: "Max Extent de la capa seleccionada",
		    nameServiceText: "Nombre del Responsable",
		    organizationServiceText: "Organización del Responsable",
		    positionServiceText: "Puesto del Responsable",
		    typeServiceText: "Tipo de dirección",
		    addressServiceText: "Dirección",
		    cityServiceText: "Ciudad",
		    provinceServiceText: "Provincia",
		    postCodeServiceText: "Código Postal",
		    countryServiceText: "País",
		    phoneServiceText: "Teléfono",
		    faxServiceText:"Fax",
		    emailServiceText:"e-mail",

			/**
			 * private: method[read] :param request: ``Object`` The XHR object
			 * which contains the parsed XML document. :return: ``Object`` A
			 * data block which is used by an ``Ext.data.Store`` as a cache of
			 * ``Ext.data.Record`` objects.
			 */
			read : function(request) {
				var data = request.responseXML;
				if (!data || !data.documentElement) {
					data = request.responseText;
				}
				var v = [];
				var url = data.URL | this.meta.url;
				if(!!data.URL){
					url = data.URL;
				}else{
					url = this.meta.url;
				}
				var navegador = navigator.appName 
				if (navegador == "Microsoft Internet Explorer") {
					url = this.meta.url;
				}
				var paramURL = url.split("&");
				var nameParam = [];
				for ( var i = 2; i < paramURL.length; i++) {
					nameParam[i] = unescape(paramURL[i].split("=")[1]);
				}
				if(url.indexOf("user") != -1){
					// Activated layer information
					v[0] = nameParam[5];
					v[1] = nameParam[6];
					v[2] = nameParam[7];
				}else{
					// Activated layer information
					v[0] = nameParam[2];
					v[1] = nameParam[3];
					v[2] = nameParam[4];
				}

				return this.readRecords(data, v);
			},

			/**
			 * private: method[readRecords] :param data: ``DOMElement | String |
			 * Object`` A document element or XHR response string. As an
			 * alternative to fetching capabilities data from a remote source,
			 * an object representing the capabilities can be provided given
			 * that the structure mirrors that returned from the capabilities
			 * parser. :return: ``Object`` A data block which is used by an
			 * ``Ext.data.Store`` as a cache of ``Ext.data.Record`` objects.
			 * 
			 * Create a data block containing Ext.data.Records from an XML
			 * document.
			 */
			readRecords : function(data, v) {
				if (typeof data === "string" || data.nodeType) {
					data = this.meta.format.read(data);
				}

				var service = data.service;
				var contactInformation = "";
				var contactAddress = "";
				var personPrimary = "";
				if(!!service){
					contactInformation = service.contactInformation;
					contactAddress = contactInformation.contactAddress;
					personPrimary = contactInformation.personPrimary;
					// Name and Organization of contact person
					var person = personPrimary.person;
					v[3] = person;
					var organization = personPrimary.organization;
					v[4] = organization;
					var position = contactInformation.position;
					v[5] = position;

					// Information about contact address
					var addressType = contactAddress.type;
					v[6] = addressType;
					var address = contactAddress.address;
					v[7] = address;
					var city = contactAddress.city;
					v[8] = city;
					var province = contactAddress.stateOrProvince;
					v[9] = province;
					var postCode = contactAddress.postCode;
					v[10] = postCode;
					var country = contactAddress.country;
					v[11] = country;

					var phone = contactInformation.phone;
					v[12] = phone;
					var fax = contactInformation.fax;
					v[13] = fax;
					var email = contactInformation.email;
					v[14] = email;

					var field;
					var records = [];
					var fields = this.recordType.prototype.fields;
					var nameFieldList = [];
					nameFieldList[0] = this.nameLayerSelected;
					nameFieldList[1] = this.urlLayerSelected;
					nameFieldList[2] = this.maxExtentLayerSelected;
					nameFieldList[3] = this.nameServiceText;
					nameFieldList[4] = this.organizationServiceText;
					nameFieldList[5] = this.positionServiceText;
					nameFieldList[6] = this.typeServiceText;
					nameFieldList[7] = this.addressServiceText;
					nameFieldList[8] = this.cityServiceText;
					nameFieldList[9] = this.provinceServiceText;
					nameFieldList[10] = this.postCodeServiceText;
					nameFieldList[11] = this.countryServiceText;
					nameFieldList[12] = this.phoneServiceText;
					nameFieldList[13] = this.faxServiceText;
					nameFieldList[14] = this.emailServiceText;

					for ( var i = 0; i < nameFieldList.length; i++) {
						values = {};
						for ( var j = 0; j < fields.length; j++) {
							field = fields.items[j];
							if (j == 0) {
								values[field.name] = nameFieldList[i];
							} else {
								values[field.name] = v[i];
							}
						}
						records.push(new this.recordType(values, i));
					}

					return {
						totalRecords : records.length,
						success : true,
						records : records
					};
				}else{
					success : false
				}
			}
		});