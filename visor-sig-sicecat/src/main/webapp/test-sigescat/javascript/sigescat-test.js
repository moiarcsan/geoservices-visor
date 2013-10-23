var PROXY = "http://localhost:8080/Visor/proxy?url=";
var URL_GET_CAPABILITIES_WMS = "http://10.136.200.75/ows/wms?request=GetCapabilities";
var URL_WMST_TOPO = "http://10.136.202.75/wmst/topo?LAYERS=bt_350&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A23031&BBOX=302100,4547000,442100,4687000&WIDTH=400&HEIGHT=400";
var URL_WMST_ORTO = "http://10.136.202.75/wmst/orto?LAYERS=orto_350&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A23031&BBOX=302100,4547000,442100,4687000&WIDTH=400&HEIGHT=400";
var URL_WMST_DADES = "http://10.136.202.75/wmst/dades?LAYERS=Limit_350&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&FORMAT=image%2Fpng&SRS=EPSG%3A23031&BBOX=302100,4547000,442100,4687000&WIDTH=400&HEIGHT=400";
var URL_WFS_RRA = "http://10.136.202.75/ows/wfs?request=getCapabilities&layerName=r%3Ara&layerUrl=http%3A//10.136.202.75/ows/wfs%3F&layerMaxExtent=-180%2C-90%2C180%2C90";
var URL_SIGESCAR_SEARCH = "http://10.136.202.75/search";
var URL_SIGESCAT_OPENLS = "http://10.136.202.75/openls";

function LAYER_Request(URL, nameRequest, store){
	Ext.Ajax.request({
		url: PROXY + URL,
		success: function(response){
			/*
			 * ON SUCCESS
			 */
			var resp = null;
			
			if(response.responseText.indexOf("error") != -1){
				resp = 'FAIL';
			}else{
				resp = 'success';
			}
			
			var myRequest = [['Sigescat ' + nameRequest + ' Search Service', URL, resp]];
			myRequest[0][3] = response.responseText;
			store.loadData(myRequest, true);
		},
		failure: function(response){
			/*
			 * ON FAILURE
			 */
			var myRequest = [['Sigescat ' + nameRequest + ' Layer', URL, 'FAIL']];
			myRequest[0][3] = response.responseText;
			store.loadData(myRequest, true);
		}
	});
};
function sendXMLRequest(nameRequest, url, xmlText, store){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", PROXY + url, true);
	xmlHttp.onreadystatechange = function(){
		if (xmlHttp.readyState==4) {
			if(xmlHttp.responseText == "" || xmlHttp.responseText.indexOf("error") != -1){
				resp = 'FAIL';
			}else{
				resp = 'success';
			}
			var myRequest = [['Sigescat ' + nameRequest + ' Layer', url, resp]];
			myRequest[0][3] = xmlHttp.responseText;
			store.loadData(myRequest, true);
		}
	};
	xmlHttp.setRequestHeader("Content-Type", "application/soap+xml; charset=utf-8");
	xmlHttp.send(xmlText);
};

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	// create the data store
    var store = new Ext.data.ArrayStore({
        fields: [
           {name: 'request'},
           {name: 'url'},
           {name: 'result'},
           {name: 'info'}
        ]
    });
    
    // create the Grid
    var grid = new Ext.grid.GridPanel({
        store: store,
        stateful: true,
        stateId: 'stateGrid',
        columns: [{
        	header: 'Request',
            flex: 1,
            sortable: false,
            dataIndex: 'request',
            width: (screen.width - 20) / 3
        },{
        	header: 'URL Request',
            flex: 1,
            sortable: false,
            dataIndex: 'url',
            width: (screen.width - 20) / 3
        },{
        	header: 'Result',
            flex: 1,
            sortable: true,
            dataIndex: 'result',
            width: (screen.width - 20) / 3
        }],
        height: screen.height - 20,
        width: screen.width - 20,
        title: 'Sigescat Requests',
        renderTo: 'grid-sigescat',
        viewConfig: {
            stripeRows: true
        },
        listeners:{
        	rowclick: function(record, rowIndex, e){
        		var msg = record.store.getAt(rowIndex).json[3];
        		Ext.Msg.show({
        			   title:'Más Infomación',
        			   msg: msg,
        			   buttons: Ext.Msg.OK,
        			   minWidth: 600
        		});
        	}
        }
    });
	// WMS
	Ext.Ajax.request({
		url: PROXY + URL_GET_CAPABILITIES_WMS,
		success: function(response){
			/*
			 * ON SUCCESS
			 */
			var myRequest = [['Sigescat getCapabilities WMS service', 
			  URL_GET_CAPABILITIES_WMS, 
			  'success']];
			myRequest[0][3] = response.responseText;
			store.loadData(myRequest, true);
		},
		failure: function(response){
			/*
			 * ON FAILURE
			 */
			var myRequest = [['Sigescat getCapabilities WMS service', 
			    			  URL_GET_CAPABILITIES_WMS, 
			    			  'FAIL']];
			store.loadData(myRequest, true);
		}
	});
	// WMST TOPO
	LAYER_Request(URL_WMST_TOPO, "TOPO", store);
	// WMST ORTO
	LAYER_Request(URL_WMST_ORTO, "ORTO", store);
	// WMST DADES
	LAYER_Request(URL_WMST_DADES, "DADES", store);
	// WFS r:ra
	LAYER_Request(URL_WFS_RRA, "r:ra", store);
	
	// XML Text with the request content
	var xmlText = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
			"xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" " +
			"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">" +
			"<SOAP-ENV:Body>" +
			"<tns:cerca xmlns:tns=\"http://services.server.sigem.sitep.com/\">" +
			"<query>collserola</query>" +
			"<entitats></entitats>" +
			"<filaInicial>0</filaInicial>" +
			"<filaFinal>20</filaFinal>" +
			"</tns:cerca>" +
			"</SOAP-ENV:Body>" +
			"</SOAP-ENV:Envelope>";
	// Cerca Request
	sendXMLRequest("CERCA", URL_SIGESCAR_SEARCH, xmlText, store);
	
	var xmlTextCerca2 = "<SOAP-ENV:Envelope" +
			"xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
			"xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" " +
			"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">" +
			"<SOAP-ENV:Body>" +
			"<tns:cerca xmlns:tns=\"http://services.server.sigem.sitep.com/\">" +
			"<query>collserola</query>" +
			"<entitats>a,b,c,d,e,f</entitats>" +
			"<filaInicial>0</filaInicial>" +
			"<filaFinal>5</filaFinal>" +
			"</tns:cerca>" +
			"</SOAP-ENV:Body>" +
			"</SOAP-ENV:Envelope>";
	// Cerca 2 Request
	sendXMLRequest("CERCA 2", URL_SIGESCAR_SEARCH, xmlTextCerca2, store);
	
	var xmlCercaCarreteres = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
			"xmlns:ser=\"http://services.server.sigem.sitep.com/\">" +
			"<soapenv:Header/>" +
			"<soapenv:Body>" +
			"<ser:cercaCarreteres>" +
			"<!--Optional:-->" +
			"<query>AP-7</query>" +
			"</ser:cercaCarreteres>" +
			"</soapenv:Body>" +
			"</soapenv:Envelope>";
	
	// Cerca 2 Request
	sendXMLRequest("CERCA Carreteres", URL_SIGESCAR_SEARCH, xmlCercaCarreteres, store);
	
	var xmlOpenLS = "<XLS xsi:schemaLocation=\"http://www.opengis.net/xls ...\" " +
			"version=\"1.2.0\" xmlns=\"http://www.opengis.net/xls\" " +
			"xmlns:gml=\"http://www.opengis.net/gml\" " +
			"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
			"<Request methodName=\"Geocode\" requestID=\"123\" version=\"1.2.0\" maximumResponses=\"10\"> " +
			"<GeocodeRequest> " +
			"<Address countryCode=\"ES\"> " +
			"<FreeFormAddress>c. torns 27, Barcelona</FreeFormAddress>" +
			"</Address>" +
			"</GeocodeRequest>" +
			"</Request>" +
			"</XLS>";
	
	// OpenLS Geocode
	sendXMLRequest("OpenLS Geocode", URL_SIGESCAT_OPENLS, xmlOpenLS, store);
	
	var xmlOpenLSPoints = "<XLS xsi:schemaLocation=\"http://www.opengis.net/xls ...\" " +
			"version=\"1.2.0\" xmlns=\"http://www.opengis.net/xls\" xmlns:gml=\"http://www.opengis.net/gml\" " +
			"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> " +
			"<Request methodName=\"ReverseGeocode\" requestID=\"123\" version=\"1.2.0\" maximumResponses=\"10\">" +
			"<ReverseGeocodeRequest>" +
			"<Position>" +
			"<gml:Point srsName=\"EPSG:23031\">" +
			"<gml:pos>432912.750000000354583844</gml:pos>" +
			"</gml:Point>" +
			"</Position>" +
			"</ReverseGeocodeRequest>" +
			"</Request>" +
			"</XLS>";
	
	// OpenLS Reverse Geocode
	sendXMLRequest("OpenLS Reverse Geocode", URL_SIGESCAT_OPENLS, xmlOpenLSPoints, store);
});
