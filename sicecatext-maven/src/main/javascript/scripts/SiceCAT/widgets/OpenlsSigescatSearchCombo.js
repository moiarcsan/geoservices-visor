/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt.ux
 *  class = GeoNamesSearchCombo
 *  base_link = `Ext.form.ComboBox <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */

Ext.namespace("SiceCAT.widgets");

SiceCAT.widgets.OpenlsSigescatSearchCombo = Ext.extend(Ext.form.ComboBox, {
	/** api: config[map]
	 *  ``OpenLayers.Map or Object``  A configured map or a configuration object
	 *  for the map constructor, required only if :attr:`zoom` is set to
	 *  value greater than or equal to 0.
	 */

	/** private: property[map]
	 *  ``OpenLayers.Map``  The map object.
	 */
	map: null,

	/** api: config[width]
	 *  See http://www.dev.sencha.com/deploy/dev/docs/source/BoxComponent.html#cfg-Ext.BoxComponent-width,
	 *  default value is 240.
	 */
	width: 240,

	/** api: config[listWidth]
	 *  See http://www.dev.sencha.com/deploy/dev/docs/source/Combo.html#cfg-Ext.form.ComboBox-listWidth,
	 *  default value is 350.
	 */
	listWidth: 400,
	
	/** api: config[tpl]
     *  ``Ext.XTemplate or String`` Template for presenting the result in the
     *  list (see http://www.dev.sencha.com/deploy/dev/docs/output/Ext.XTemplate.html),
     *  if not set a default value is provided.
     */
    tpl: '<tpl for="."><div class="x-combo-list-item"><h1>{text}<br></h1>{place}</div></tpl>',

	/** i18n **/
	loadingText: 'Searching...',
	emptyText: 'Search with OpenLS',
    errorTitleText: "Error",
    errorBodyText: "Error calling <strong>{0}</strong> service",

	/** api: config[zoom]
	 *  ``Number`` Zoom level for recentering the map after search, if set to
	 *  a negative number the map isn't recentered, defaults to 8.
	 */
	/** private: property[zoom]
	 *  ``Number``
	 */
	zoom: 8,

	/** api: config[minChars]
	 *  ``Number`` Minimum number of characters to be typed before
	 *  search occurs, defaults to 1.
	 */
	minChars: 1,

	/** api: config[queryDelay]
	 *  ``Number`` Delay before the search occurs, defaults to 200 ms.
	 */
	queryDelay: 200,

	/** api: config[maxRows]
	 *  `String` The maximum number of rows in the responses, defaults to 20,
	 *  maximum allowed value is 1000.
	 *  See: http://www.geonames.org/export/geonames-search.html
	 */
	maxRows: '10',


	/** config: property[url]
	 *  Url of the Geozet service default: http://geodata.nationaalgeoregister.nl/geocoder/Geocoder
	 *  e.g.  http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?zoekterm=Den,Helder,Schapendijkje&max=5
	 *  You must be IP-whitelisted and have a proxy defined to pass through to the domain like `open.mapquestapi.com`
	 */
	url: 'http://10.136.202.75/openls',

	/** private: property[hideTrigger]
	 *  Hide trigger of the combo.
	 */
	hideTrigger: true,

	/** private: property[displayField]
	 *  Display field name
	 */
	displayField: 'text',

	/** private: property[forceSelection]
	 *  Force selection.
	 */
	forceSelection: false,

	/** private: property[autoSelect]
	 *  true to select the first result gathered by the data store (defaults to false). A false value would require a manual selection
	 *  from the dropdown list to set the components value unless the value of (typeAheadDelay) were true..
	 */
	autoSelect: false,

	/** private: property[queryParam]
	 *  Query parameter.
	 */
	queryParam: '',
	
	multiStore: null,
    

	/** private: method[constructor]
	 *  Construct the component.
	 */
	initComponent: function() {
		Heron.widgets.OpenLSSearchCombo.superclass.initComponent.apply(this, arguments);

		
		var maxiumResponses = 1;
	    var locale="ES";
	    var query = "c. torns 27";
		var data = '<XLS xsi:schemaLocation="http://www.opengis.net/xls" version="1.2.0" xmlns="http://www.opengis.net/xls" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Request methodName="Geocode" requestID="123" '
						+ 'version="1.2.0" maximumResponses="'
						+ maxiumResponses
						+ '"><GeocodeRequest><Address countryCode="'
						+ locale
						+ '"><FreeFormAddress>'
						+ query
						+ '</FreeFormAddress></Address></GeocodeRequest></Request></XLS>';
		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url: this.url,
								method: 'POST',
								data: data
							}),
					fields : [
						{name: "lon", type: "number"},
						{name: "lat", type: "number"},
						"text"
					],
					
					listeners:{
		                loadexception: function(e){
		                	this.fireEvent("loadexception", this, e);
		                	Sicecat.showHideMessageInformation(String.format(this.errorBodyText, this.url), 6000);
		                },
		                scope: this
					},

					reader: new SiceCAT.data.OpenLS_XLSReader()
				});
		
		// a searchbox for names
		// see http://khaidoan.wikidot.com/extjs-combobox
		if (this.zoom > 0) {
			this.on("select", function(combo, record, index) {
				this.setValue(record.data.text); // put the selected name in the box
				var position = new OpenLayers.LonLat(record.data.lon, record.data.lat);

				// Reproject (if required)
				position.transform(
						new OpenLayers.Projection("EPSG:23031"),
						this.map.getProjectionObject()
				);

				// zoom in on the location
				this.map.setCenter(position, this.zoom);
				// close the drop down list
				this.collapse();
			}, this);
		}
	},
	
	getLang: function(){
		if(GeoExt.lang == "ca")
			return "CA";
		else if(GeoExt.lang == "en")
			return "EN";
		else
			return "ES";
	},

	
	/**
     * Execute a query to filter the dropdown list.  Fires the {@link #beforequery} event prior to performing the
     * query allowing the query action to be canceled if needed.
     * @param {String} query The SQL query to execute
     * @param {Boolean} forceAll <tt>true</tt> to force the query to execute even if there are currently fewer
     * characters in the field than the minimum specified by the <tt>{@link #minChars}</tt> config option.  It
     * also clears any filter previously saved in the current store (defaults to <tt>false</tt>)
     */
    doQuery : function(q, forceAll, onlyCallback){
    	
    	var maxiumResponses = this.maxRows;
	    var locale=this.getLang();
	    var query = this.queryParam + q;
		var data = '<XLS xsi:schemaLocation="http://www.opengis.net/xls" version="1.2.0" xmlns="http://www.opengis.net/xls" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><Request methodName="Geocode" requestID="123" '
						+ 'version="1.2.0" maximumResponses="'
						+ maxiumResponses
						+ '"><GeocodeRequest><Address countryCode="'
						+ locale
						+ '"><FreeFormAddress>'
						+ query
						+ '</FreeFormAddress></Address></GeocodeRequest></Request></XLS>';

		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url: this.url,
								method: 'POST',
								xmlData: data
							}),
					fields : [
						{
							name: "lon", 
							type: "number",
							mapping: 'lon',
		                    convert: function(v, record){
		        		        if(record.lon == null ){
		        		        	return "";
		        		        }
		        		    }
						},{
							name: "lat",
							type: "number",
							mapping: 'lat',
		                    convert: function(v, record){
		        		        if(record.lat == null ){
		        		        	return "";
		        		        }
		        		    }
						},{
							name: "text",
							mapping: "nom",
							convert: function(v, record){
		        		        if(record.text == null ){
		        		        	return "";
		        		        }
		        		    }
						}
					],
					
					listeners:{
		                loadexception: function(e){
		                	this.fireEvent("loadexception", this, e);
		                	Sicecat.showHideMessageInformation(String.format(this.errorBodyText, this.url), 6000);
		                },
		                scope: this
					},

					reader: new SiceCAT.data.OpenLS_XLSReader()
				});
        this.bindStore(this.store, true);
        
        Ext.form.ComboBox.prototype.doQuery.apply(this, arguments);
        
        if(!!onlyCallback){
        	this.setValue(q);
        	this.store.load();
        }
    },

    // private
    onLoad : function(){
        Ext.form.ComboBox.prototype.onLoad.apply(this);
        this.valueLoaded = this.getValue();
        this.fireEvent("storeload", this, this.store);
        var dataSource = {
        		records: this.store.data.items
        };
        for(var i=0; i<dataSource.records.length; i++){
        	dataSource.records[i].data.type = "openls";
        }
        // Load the initial record with the name of the service
        if(dataSource.records.length>0){
        	// Load the store records to put into the multistore
        	this.multiData.records = this.multiData.records.concat(dataSource.records);
            this.multiStore.loadRecords(this.multiData, {add: false}, null);
        }else{
        	// Load 0 founds
        }
    },

    // private
    collapse : function(){
        Ext.form.ComboBox.prototype.collapse.apply(this);
        if(!this.valueLoaded)
        	this.fireEvent("loadexception", this);
    }
});

/** api: xtype = gx_sicecat_sigescatcercasearchercombo */
Ext.reg('gx_sicecat_sigescatcercaopenlscombo', SiceCAT.widgets.OpenlsSigescatSearchCombo);
