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



SiceCAT.widgets.MultiSearchCombo = Ext.extend(Ext.form.ComboBox, {
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
    tpl: '<tpl for="."><div class="x-combo-list-item">'+
    '<h1>{text}{nom}<br></h1>'+
    '{place}<span class="SigescatCercaSolrGeneralSearcherCombo_{entitat}"/></div></tpl>',

	/** i18n **/
	loadingText: 'Searching...',
	emptyText: 'Search',
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
	url: '',

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
	
	comboOpenLS: null,
	
	comboCercaSolr: null,
	
	comboPKSearch: null,

	openlsUrl: "proxy.do?url=http://10.136.202.75/openls",
    
	keyEnterOnCombo: false,

	/** private: method[constructor]
	 *  Construct the component.
	 */
	initComponent: function() {
		this.multiData = {
			records: new Array()	
		};

		this.store = new Ext.data.Store({
					fields : [
						// Definir los fields conjuntos
						{
							name: 'type'
						},{
							name: 'lon'
						},{
							name: 'lat'
						},{
							name: 'entitat'
						},{
							name: 'nom',
						},{
							name: 'comarca'
						},{
							name: 'descripcio'
						},{
							name: 'municipi'
						},{
							name: 'score'
						},{
							name: 'tipus'
						},{
							name: 'valor'
						},{
							name: 'text'
						}
					],
					listeners:{
		                loadexception: function(e){
		                	this.fireEvent("loadexception", this, e);
		                	Sicecat.showHideMessageInformation(String.format(this.errorBodyText, this.url), 6000);
		                },
		                scope: this
					}
				});
		
		if (this.zoom > 0) {
			this.on("select", function(combo, record, index) {
				// Distinguimos entre los tres servicios
				// Si es OpenLS
				if(record.data.type == "openls"){
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
				}else if(record.data.type == "cercasolr"){
					this.setValue(record.data.nom);
					this.comboCercaSolr.loadWFSResult(record);
				}else if(record.data.type == "pksearch"){
					this.setValue(record.data.nom);
					this.comboPKSearch.getZoomToResult("s:y", "OBJECTID", record.get("id"));
				}
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
    	var waitMsg = new Ext.LoadMask(Ext.getBody(), {
			msg : "Loading ..."
		});
		waitMsg.enable(true);
    	if(this.keyEnterOnCombo){
    		waitMsg.show();
    		this.store.on("load", function(){
    			waitMsg.hide();
    		});
    		// Limpiamos el store antes de hacer otra consulta
        	if(this.store.data){
        		this.store.clearData();
        	}
        	this.multiData = {
        			records: new Array()	
        		};
        	
        	// OpenLS Service
        	var urlOpenLS = this.openlsUrl;
        	this.comboOpenLS = new SiceCAT.widgets.OpenlsSigescatSearchCombo();
        	this.comboOpenLS.url =  urlOpenLS;
        	this.comboOpenLS.multiStore = this.store;
        	this.comboOpenLS.multiData = this.multiData;
        	this.comboOpenLS.doQuery(q, forceAll, null);
        	// CercaSolr Service
        	this.comboCercaSolr = new SiceCAT.widgets.SigescatCercaSolrGeneralSearcherCombo();
        	this.comboCercaSolr.multiStore = this.store;
        	this.comboCercaSolr.multiData = this.multiData;
        	this.comboCercaSolr.doQuery(q, forceAll);
        	// PKSearch
        	this.comboPKSearch = new SiceCAT.PKSearchPanel();
        	this.comboPKSearch.queryParameter = q;
        	this.comboPKSearch.multiStore = this.store;
        	this.comboPKSearch.multiData = this.multiData;
        	this.comboPKSearch.query();
    	}
    },

    // private
    onLoad : function(){
        Ext.form.ComboBox.prototype.onLoad.apply(this);
        this.valueLoaded = this.getValue();
        this.fireEvent("storeload", this, this.store);
    },

    // private
    collapse : function(){
        Ext.form.ComboBox.prototype.collapse.apply(this);
        if(!this.valueLoaded)
        	this.fireEvent("loadexception", this);
    }
});

/** api: xtype = gx_sicecat_multisearchcombo */
Ext.reg('gx_sicecat_multisearchcombo', SiceCAT.widgets.MultiSearchCombo);
