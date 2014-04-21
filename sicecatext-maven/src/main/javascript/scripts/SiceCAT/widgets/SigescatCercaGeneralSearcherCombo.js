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

SiceCAT.widgets.SigescatCercaGeneralSearcherCombo = Ext.extend(Ext.form.ComboBox, {
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
     *  default value is 350.
     */
    width: 350,

    /** api: config[listWidth]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/Combo.html#cfg-Ext.form.ComboBox-listWidth,
     *  default value is 350.
     */
    listWidth: 350,

    /**i18n */
    loadingText: 'Search in Geonames...',
    emptyText: 'Search location in Geonames',
    listEmptyText: "Geoname not found",
    resultText: "'{2}': {0}' in '{1}'",
    errorTitleText: "Error",
    errorBodyText: "Error calling SIGESCAT's <strong>cercaGeneral</strong> service",

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
     *  ``Number`` Delay before the search occurs, defaults to 50 ms.
     */
    queryDelay: 50,

    /** api: config[maxRows]
     *  `String` The maximum number of rows in the responses, defaults to 20,
     *  maximum allowed value is 1000.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[maxRows]
     *  ``String``
     */
    maxRows: '20',

    /** api: config[tpl]
     *  ``Ext.XTemplate or String`` Template for presenting the result in the
     *  list (see http://www.dev.sencha.com/deploy/dev/docs/output/Ext.XTemplate.html),
     *  if not set a default value is provided.
     */
    tpl: '<tpl for="."><div class="x-combo-list-item SigescatCercaSolrGeneralSearcherCombo_{entitat}"><h1>{nom}<br></h1><span class="SigescatCercaSolrGeneralSearcherCombo_{entitat}"/></div></tpl>',

    /** api: config[lang]
     *  ``String`` Place name and country name will be returned in the specified
     *  language. Default is English (en). See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[lang]
     *  ``String``
     */
    lang: 'en',

    /** api: config[countryString]
     *  ``String`` Country in which to make a GeoNames search, default is all countries.
     *  Providing several countries can be done like: countryString: country=FR&country=GP
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[countryString]
     *  ``String``
     */
    countryString: '',

    /** api: config[continentCode]
     *  ``String`` Restricts the search for toponym of the given continent,
     *  default is all continents.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[continentCode]
     *  ``String``
     */
    continentCode: '',
    
    /** api: config[adminCode1]
     *  ``String`` Code of administrative subdivision, default is all
     *  administrative subdivisions.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[adminCode1]
     *  ``String``
     */
    adminCode1: '',

    /** api: config[adminCode2]
     *  ``String`` Code of administrative subdivision, default is all administrative
     *  subdivisions.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[adminCode2]
     *  ``String``
     */
    adminCode2: '',

    /** api: config[adminCode3]
     *  ``String`` Code of administrative subdivision, default is all administrative
     *  subdivisions.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[adminCode3]
     *  ``String``
     */
    adminCode3: '',

    /** api: config[featureClassString]
     *  ``String`` Feature classes in which to make a GeoNames search, default is all
     *  feature classes.
     *  Providing several feature classes can be done with
     *  ``featureClassString: "featureClass=P&featureClass=A"``
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[featureClassString]
     *  ``String``
     */
    featureClassString: '',

    /** api: config[featureCodeString]
     *  ``String`` Feature code in which to make a GeoNames search, default is all
     *  feature codes.
     *  Providing several feature codes can be done with
     *  ``featureCodeString: "featureCode=PPLC&featureCode=PPLX"``
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[featureCodeString]
     *  ``String``
     */
    featureCodeString: '',

    /** api: config[tag]
     *  ``String`` Search for toponyms tagged with the specified tag, default
     *  is all tags.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[tag]
     *  ``String``
     */
    tag: '',

    /** api: config[charset]
     *  `String` Defines the encoding used for the document returned by
     *  the web service, defaults to 'UTF8'.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[charset]
     *  ``String``
     */
    charset: 'UTF8',

    /** private: property[hideTrigger]
     *  Hide trigger of the combo.
     */
    hideTrigger: true,

    /** private: property[displayField]
     *  Display field name
     */
    displayField: 'nom',

    /** private: property[forceSelection]
     *  Force selection.
     */
    forceSelection: true,

    /** private: property[queryParam]
     *  Query parameter.
     */
    queryParam: 'nom',

    /** private: property[url]
     *  Url of the GeoNames service: http://www.GeoNames.org/export/GeoNames-search.html
     */
    url: 'rest/cercaGeneral/',
    
    multiStore: null,

    /** private: constructor
     */
    initComponent: function() {
        GeoExt.ux.GeoNamesSearchCombo.superclass.initComponent.apply(this, arguments);

        var urlAppendString = '';
        
        this.reader = new Ext.data.JsonReader({
            idProperty: 'id',
            root: function(o){
            	var out = [];
            	return out.concat(o.roadResponse.lst, o.solrResponse.lst);
            },
            totalProperty: "totalHits",
            fields: [
                {
                    name: 'id',
                    mapping: 'id'
                },
                {
                    name: 'entitat',
                    mapping: 'entitat'
                },
                {
                    name: 'nom',
                    mapping: 'nom'
                },
                {
                    name: 'comarca',
                    mapping: 'comarca',
                    convert: function(v, record){
        		        if(record.comarca == null ){
        		        	return "";
        		        }
        		    }
                },
                {
                    name: 'descripcio',
                    mapping: 'descripcio',
                    convert: function(v, record){
        		        if(record.descripcio == null ){
        		        	return "";
        		        }
        		    }
                },
                {
                    name: 'municipi',
                    mapping: 'municipi',
                    convert: function(v, record){
        		        if(record.municipi == null ){
        		        	return "";
        		        }
        		    }
                },
                {
                    name: 'score',
                    mapping: 'score',
                    convert: function(v, record){
        		        if(record.score == null ){
        		        	return "";
        		        }
        		    }
                },
                {
                    name: 'tipus',
                    mapping: 'tipus',
                    convert: function(v, record){
        		        if(record.tipus == null ){
        		        	return "";
        		        }
        		    }
                }
            ]
        });
        
        this.store = new Ext.data.Store({
        	url: this.url,
            baseParams: null,
            reader: this.reader
        });

        if(this.zoom > 0) {
            this.on("select", function(combo, record, index) {
            	//if(Sicecat.isLogEnable) console.log("selected a feature");
            	this.loadWFSResult(record);
            }, this);
        }
    },
	
	/**
     * Execute a query to filter the dropdown list.  Fires the {@link #beforequery} event prior to performing the
     * query allowing the query action to be canceled if needed.
     * @param {String} query The SQL query to execute
     * @param {Boolean} forceAll <tt>true</tt> to force the query to execute even if there are currently fewer
     * characters in the field than the minimum specified by the <tt>{@link #minChars}</tt> config option.  It
     * also clears any filter previously saved in the current store (defaults to <tt>false</tt>)
     */
    doQuery : function(q, forceAll){
    	
    	var url = this.url + encodeURIComponent(q);

        this.store = new Ext.data.Store({
        	url: url,
            baseParams: {titlesToShow: this.titlesForLayer},
            reader: this.reader
        });
        this.bindStore(this.store, true);
        
        Ext.form.ComboBox.prototype.doQuery.apply(this, arguments);
    },
    
    onLoad: function(){
    	Ext.form.ComboBox.prototype.onLoad.apply(this);
    	// Create a data source to put into the multistore
        var dataSource = {
        		records: this.store.data.items
        };
        for(var i=0; i<dataSource.records.length; i++){
        	dataSource.records[i].data.type = "cercageneral";
        }
        // Load the store records to put into the multistore
        this.multiData.records = this.multiData.records.concat(dataSource.records);
        this.multiStore.loadRecords(this.multiData, {add: false}, null);
    },
    
    idsForFeatureType:{
    	"s:k": "ID",
    	"s:i": "INE_NUM"
    },
    
    entitatsForNamespace:{
    	"s":["a","ab","ae","ap","aps","b","c","c112","ca","cd","co",
    	     "d","db","e","ef","ei","en","f","fo","g","h","i","ir",
    	     "k","lf","np","nv","p","pi","plo","pn","po","rpo","s1",
    	     "s5","sc","soc","sp","sv","svm","tf","tt","vu","x","y",
    	     "z","z1","z3","zt"],
    	"p":["pap","pas","pb","pe","pl","pm","psa","pse","t"],
    	"r":["ra","rl","rp"]
    },
    
    titlesForLayer : {
		"pap" : "Centres de l'administraci\u00f3 p\u00fablica",
		"pas" : "Centres d'assist\u00e8ncia social",
		"pb" : "Centres de negoci",
		"pe" : "Centres educatius",
		"pl" : "Centres de lleure",
		"pm" : "Centres de transport i mobilitat",
		"psa" : "Centres de salut",
		"pse" : "Centres de seguretat",
		"t" : "Topon\u00edmia (nomencl\u00e0tor)",
		"ra" : "Anotacions poligonals",
		"rl" : "Anotacions lineals",
		"rp" : "Anotacions puntuals",
		"a" : "AVAS (Base dels avions de vigil\u00e0ncia i atac).",
		"ab" : "\u00C0rees B\u00e0siques policials.",
		"ae" : "Activitats extractives.",
		"ap" : "Inuncat: Punts d'actuaci\u00f3 priorit\u00e0ria.",
		"aps" : "Punts d'actuaci\u00f3 priorit\u00e0ria",
		"b" : "Guaites.",
		"c" : "Heliports.",
		"c112" : "Centres del servei 112.",
		"ca" : "Xarxa de camins",
		"cd" : "Inuncat: Cons de dejecci\u00f3",
		"co" : "Al\u00e7ada edificis",
		"d" : "Hidrants",
		"db" : "Districtes de Barcelona.",
		"e" : "Punts d'aigua.",
		"ef" : "Estacions de ferrocarril.",
		"ei" : "Establiments industrials (SIPAE)",
		"en" : "Espais Naturals de Protecci\u00f3 Especial.",
		"f" : "Parcs de bombers",
		"fo" : "\u00C0rees forestals p\u00fabliques",
		"g" : "Xarxa RESCAT (Torres de comunicaci\u00f3)",
		"h" : "Capitals de municipi",
		"i" : "L\u00edmits municipals",
		"ir" : "Zones inundables presa Rialb",
		"k" : "L\u00edmits comarcals.",
		"lf" : "L\u00ednies de ferrocarril.",
		"np" : "Nuclis de poblaci\u00f3",
		"nv" : "Nodes del graf",
		"p" : "L\u00edmits provincials",
		"pi" : "Inuncat_Zones potencialment inundables.",
		"plo" : "Municipis amb Policia Local.",
		"pn" : "Risc incendi forestal. Perill.",
		"po" : "\u00daltima posici\u00f3 dels efectius RESCAT",
		"rpo" : "Mapa de les Regions Policials.",
		"s1" : "Malla SOC 1km",
		"s5" : "Malla SOC de 5 km",
		"sc" : "Inuncat: Sirenes preses cobertura.",
		"soc" : "Malla SOC 1 km",
		"sp" : "Situaci\u00f3 de la sirena de les preses.",
		"sv" : "Segments del graf",
		"svm" : "Segments del graf",
		"tf" : "T\u00fanels de ferrocarril",
		"tt" : "Inuncat: Temps de tr\u00e0nsit",
		"vu" : "Infocat: Mapa de vulnerabilitat d'incendis",
		"x" : "Eixos carretera (DGC)",
		"y" : "Punts quilom\u00e8trics (DGC)",
		"z" : "Tallafocs",
		"z1" : "Inuncat. Zones inundables T50",
		"z3" : "Zones inundables T500.",
		"zt" : "Inuncat: Zones inundables T100"
	},
    
    getNamespace: function(entitat){
    	for(var index in this.entitatsForNamespace){
    		for(var i = 0; i <this.entitatsForNamespace[index].length; i++){
    			if(this.entitatsForNamespace[index][i] == entitat){
    				//if(Sicecat.isLogEnable) console.log("The namespace is "+index);
    				return index;
    			}else{
    				//if(Sicecat.isLogEnable) console.log(this.entitatsForNamespace[index][i]+"!="+entitat);
    			}
    		}
    	}
    	return null;
    },
    
    defaultIdProperty: "OBJECTID", 
    
    getFilterIdProperty: function(featureType){
    	if(Sicecat.isLogEnable) console.log("Searching id for "+featureType);
    	var idProperty = this.defaultIdProperty;
		
		if(!!this.idsForFeatureType[featureType]){
			idProperty = this.idsForFeatureType[featureType];
		}else{
			idProperty = this.defaultIdProperty;
		}
		
		if(featureType == "s:i"){
			idProperty = "INE_NUM";
		}
		
		return idProperty;
    },
	
	loadWFSResult: function (record){
		if(Sicecat.isLogEnable) console.log('searching entitat '+ record.get("entitat") + ' by id ' + record.get("id"));
		
		var namespace = this.getNamespace(record.get("entitat"));
		if(!!namespace){
			if(Sicecat.isLogEnable) console.log("The namespace is "+namespace);
			var featureType = namespace + ":" + record.get("entitat");
			
			this.entitat = record.get("entitat");
			this.idSelected = record.get("id");
			this.nomSelected = record.get("nom");

			var idProperty = this.getFilterIdProperty(featureType);
			
			this.getZoomToResult(featureType, idProperty, record.get("id"));
		}else{
			if(Sicecat.isLogEnable) console.log("Namespace not found");
		}
		
		
	},

	/**
	 * Method: init_toolbarLocalizacion
	 * 
	 * Load this.localizator
	 */
	getZoomToResult: function (queryTypeSiceCAT, propertyFilter, idFilter) {
		var layerName = String.format(this.resultText, this.idSelected, this.entitat, this.nomSelected);
		if(!!this.lastLayerName){
			AuxiliaryLayer.deleteLayer(this.lastLayerName);
		}
		this.lastLayerName = layerName; 
		this.sicecatInstance = Sicecat;
	    var panel = new SiceCAT.ZoomToResultPanel({
	    	closest: false,
	    	sicecatInstance: Sicecat,
	    	map: Sicecat.map
	    });
	    panel.getZoomToResult(queryTypeSiceCAT, propertyFilter, idFilter, layerName);
	}
});

/** api: xtype = gx_sicecat_sigescatcercageneralsearchercombo */
Ext.reg('gx_sicecat_sigescatcercageneralsearchercombo', SiceCAT.widgets.SigescatCercaGeneralSearcherCombo);
