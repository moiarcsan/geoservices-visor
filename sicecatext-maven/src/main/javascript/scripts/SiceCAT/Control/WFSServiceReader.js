Ext.namespace("SiceCAT.Control");

/**
 * api: constructor .. class:: WFSServiceReader(meta, recordType)
 * 
 * :param meta: ``Object`` Reader configuration from which: ``layerOptions`` is
 * an optional object passed as default options to the ``OpenLayers.Layer.WFS``
 * constructor. ``layerParams`` is an optional set of parameters to pass into
 * the ``OpenLayers.Layer.WFS`` constructor. :param recordType: ``Array |
 * Ext.data.Record`` An array of field configuration objects or a record object.
 * Default is :class:`GeoExt.data.LayerRecord` with the following fields: name,
 * title, abstract, queryable, opaque, noSubsets, cascaded, fixedWidth,
 * fixedHeight, minScale, maxScale, prefix, formats, styles, srs, dimensions,
 * bbox, llbbox, attribution, keywords, identifiers, authorityURLs,
 * metadataURLs. The type of these fields is the same as for the matching fields
 * in the object returned from ``OpenLayers.Format.WFSCapabilities::read()``.
 * 
 * Data reader class to create an array of :class:`GeoExt.data.LayerRecord`
 * objects from a WFS GetCapabilities response.
 */
SiceCAT.Control.WFSServiceReader = function(meta, recordType) {
	meta = meta || {};
	if (!meta.format) {
		meta.format = new OpenLayers.Format.WFSCapabilities();
	}
	if (typeof recordType !== "function") {
		recordType = Ext.data.Record.create(recordType || meta.fields || [ {
			name : "nameField",
			type : "string"
		}, {
			name : "valueField",
			type : "string"
		} ]);
	}
	GeoExt.data.WFSCapabilitiesReader.superclass.constructor.call(this, meta,
			recordType);
};

Ext.extend(SiceCAT.Control.WFSServiceReader, GeoExt.data.WFSCapabilitiesReader,
		{

			/**
			 * api: config[attributionCls] ``String`` CSS class name for the
			 * attribution DOM elements. Element class names append "-link",
			 * "-image", and "-title" as appropriate. Default is
			 * "gx-attribution".
			 */
			attributionCls : "gx-attribution",

			/** i18n */
			nameLayerSelected : "Nombre de la capa seleccionada",
			urlLayerSelected : "Url de la capa seleccionada",
			maxExtentLayerSelected : "Max Extent de la capa seleccionada",
			nameServiceText : "Nombre del Responsable",
			organizationServiceText : "Organización del Responsable",
			positionServiceText : "Puesto del Responsable",
			typeServiceText : "Tipo de dirección",
			addressServiceText : "Dirección",
			cityServiceText : "Ciudad",
			provinceServiceText : "Provincia",
			postCodeServiceText : "Código Postal",
			countryServiceText : "País",
			phoneServiceText : "Teléfono",
			faxServiceText : "Fax",
			emailServiceText : "e-mail",
			
			changeValue: function(params){
				for(var i=0; i<params.length; i++){
					params[i] = "ows:" + params[i]; 
				}
				return params;
			},

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

				var params = [ "IndividualName", "ProviderName",
						"PositionName", "AddressType", "Address", "City",
						"AdministrativeArea", "PostalCode", "Country", "Voice",
						"Facsimile", "ContactElectronicMailAddress" ];

				var v = [];
				var url = data.URL;
				var navegador = navigator.appName
				if (navegador == "Microsoft Internet Explorer") {
					url = this.meta.url;
					params = this.changeValue(params);
				}
				var paramURL = url.split("&");
				var nameParam = [];
				var valueParam;
				for ( var i = 2; i < paramURL.length; i++) {
					nameParam[i] = unescape(paramURL[i].split("=")[1]);
				}
				// Activated layer information
				for(var i=0; i<nameParam.length+params.length; i++){
					if(i>=0 && i<=2){
						v[i] = nameParam[i+2];
					}else{
						valueParam = data.getElementsByTagName(params[i-nameParam.length+2]);
						if(valueParam.length==0){
							v[i] = "";
						}else{
							if (navegador == "Microsoft Internet Explorer"){
								v[i] = valueParam.item(0).text;
							}else{
								v[i] = valueParam[0].textContent;
							}
						}
					}
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
			}
		});