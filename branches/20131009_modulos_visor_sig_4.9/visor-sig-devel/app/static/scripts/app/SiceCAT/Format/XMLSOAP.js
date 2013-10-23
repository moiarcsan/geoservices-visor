OpenLayers.Format.XMLSOAP = OpenLayers.Class(OpenLayers.Format.XML, {
	
	/**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
	namespaces:{
		SOAP: "http://schemas.xmlsoap.org/soap/envelope/",
		xs: "http://www.w3.org/2001/XMLSchema",
		xsi: "http://www.w3.org/2001/XMLSchema-instance",
		axis2: "http://sigem.sitep.com/mrk",
		n: "http://sigem.sitep.com/mrk",
		gml: "http://www.opengis.net/gml"
	},
	xy: true,
	
	/**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
	
	defaultPrefix: "n",
    
    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.
     */
    schemaLocation: "http://www.w3.org/2001/XMLSchema-instance",
    
    /**
     * Constructor: OpenLayers.Format.XMLSOAP
     * Instances of this class are not created directly.  Use the
     *     <OpenLayers.Format.XML> constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: write
     *
     * Parameters:
     * request - {Object} An object representing the XML request.
     *
     * Returns:
     * {DOMElement} The root of an XML document.
     */
    write: function(request) {
        var root = this.writers.soap.SOAP.apply(this, [request]);
        return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
    },
    
    writers:{
    	"soap":{
    		"SOAP": function(request){
    			var root = this.createElementNSPlus("SOAP:Envelope");
    			this.writeNode("soap:Body", request, root);
    			return root;
    		},
    		"Body": function(request){
    			var node = this.createElementNSPlus("SOAP:Body");
    			this.writeNode("soap:axis2", request, node);
    			return node;
    		},
    		"axis2": function(request){
    			var node = this.createElementNSPlus("axis2:findShortestPath");
    			this.writeNode("axis2:startPoint", request, node);
    			this.writeNode("axis2:targetPoint", request, node);
    			this.writeNode("axis2:toPrioritize", request.toPrioritize, node);
    			this.writeNode("axis2:useDefinedTurns", request.useDefinedTurns, node);
    			return node;
    		},
    		"Point": function(point){
    			var node = this.createElementNSPlus("Point",{
    				attributes:{
						"srsName": point.srsName
					}
    			});
    			this.writeNode("soap:coordinates", point.point, node);
    			return node;
    		},
    		"coordinates": function(point){
    			point = point.replace(" - ", ",");
    			return node = this.createElementNSPlus("coordinates", {
    				value: point
    			});
    		}
    	},
    	"axis2":{
    		"startPoint": function(request){
    			var node = this.createElementNSPlus("startPoint");
    			var startPoint = {
    					srsName: request.srsName,
    					point: request.startPoint
    			};
    			this.writeNode("soap:Point", startPoint, node);
    			return node;
    		},
    		"targetPoint": function(request){
    			var node = this.createElementNSPlus("targetPoint");
    			var targetPoint = {
    					srsName: request.srsName,
    					point: request.targetPoint
    			};
    			this.writeNode("soap:Point", targetPoint, node);
    			return node;
    		},
    		"toPrioritize": function(priority){
    			return node = this.createElementNSPlus("toPrioritize", {
    				value: priority
    			});
    		},
    		"useDefinedTurns": function(useDefinedTurns){
    			return node = this.createElementNSPlus("useDefinedTurns", {
    				value: useDefinedTurns
    			});
    		}
    	}
    },
    
    read: function(text){
    	var node = OpenLayers.Format.XML.prototype.read.apply(this, [text]);
    	var soap = {};
    	this.readers.SOAP.soapenv.apply(this, [node, soap]);
    	return soap;
    },
    
    readers:{
    	"SOAP":{
    		"Envelope": function(node, soap){
    			this.readChildNodes(node, soap);
    		},
    		"Body": function(node, soap){
    			this.readChildNodes(node, soap);
    		},
    		"soapenv": function(node, soap){
    			this.readChildNodes(node, soap);
    			return soap;
    		}
    	},
    	"n":{
    		"findShortestPathResponse": function(node, soap){
    			this.readChildNodes(node, soap);
    		},
    		"headers": function(node, soap){
    			soap.headers = [];
    			this.readChildNodes(node, soap);
    		},
    		"header": function(node, soap){
    			// Tomamos el name y el value de cada uno
    			var name = node.getElementsByTagName("name");
    			var value = node.getElementsByTagName("value");
    			var header = {
    				name: name[0].textContent,
    				value: value[0].textContent
    			};
    			soap.headers.push(header);
    		},
    		"startPoint": function(node, soap){
    			// Puede ser edge o node
    			var segment = node.getElementsByTagName("edge");
    			if(segment != undefined  && segment.length!=0){
    				soap.startPoint = {
    	    				id: this.getChildValue(segment[0].getElementsByTagName("id")[0]),
    	    				distFrom: this.getChildValue(segment[0].getElementsByTagName("distFrom")[0]),
    	    				distTo: this.getChildValue(segment[0].getElementsByTagName("distTo")[0]),
    	    				direction: this.getChildValue(segment[0].getElementsByTagName("direction")[0])
    	    			};
    			}else{
    				soap.startPoint = {
    						id: this.getChildValue(segment[0].getElementsByTagName("id")[0])
    	    			};
    			}
    		},
    		"targetPoint": function(node, soap){
    			// Puede ser edge o node
    			var segment = node.getElementsByTagName("edge");
    			if(segment != undefined && segment.length!=0){
    				soap.targetPoint = {
    						id: this.getChildValue(segment[0].getElementsByTagName("id")[0]),
    	    				distFrom: this.getChildValue(segment[0].getElementsByTagName("distFrom")[0]),
    	    				distTo: this.getChildValue(segment[0].getElementsByTagName("distTo")[0]),
    	    				direction: this.getChildValue(segment[0].getElementsByTagName("direction")[0])
    	    			};
    			}else{
    				soap.targetPoint = {
    						id: this.getChildValue(segment[0].getElementsByTagName("id")[0])
    	    			};
    			}
    		},
    		"path": function(node, soap){
    			// Ruta devuelta por el servicio
    			soap.path = [];
    			this.readChildNodes(node, soap);
    		},
    		"step": function(node, soap){
    			// Pasos a seguir de la ruta
    			var step = null;
    			step = {
	    				order: node.getAttribute("order"),
	    				name: this.getChildValue(node.getElementsByTagName("name")[0]),
	    				type: this.getChildValue(node.getElementsByTagName("type")[0]),
	    				//edgeID: this.getChildValue(node.getElementsByTagName("edge")[0].getElementsByTagName("id")[0]),
	    				time: this.getChildValue(node.getElementsByTagName("time")[0]),
	    				distance: this.getChildValue(node.getElementsByTagName("distance")[0])
	    		};
    			// Hay tres tipos de pasos:
    			var sp = node.getElementsByTagName("startNode");
    			var tp = node.getElementsByTagName("targetNode");
    			// Paso de inicio que no contiene startPoint
    			if(sp != undefined && sp.length == 0){
    				step.targetNodeID = this.getChildValue(node.getElementsByTagName("targetNode")[0].getElementsByTagName("id")[0]);
    			}else if(tp != undefined && tp.length == 0){
    				step.startNodeID = this.getChildValue(node.getElementsByTagName("startNode")[0].getElementsByTagName("id")[0]);
    			}else if(sp != undefined && tp != undefined && sp.length != 0 && tp.length != 0){
    				step.targetNodeID = this.getChildValue(node.getElementsByTagName("targetNode")[0].getElementsByTagName("id")[0]);
    				step.startNodeID = this.getChildValue(node.getElementsByTagName("startNode")[0].getElementsByTagName("id")[0]);
    			}
    			step.arrayEdge = [];
    			// Leemos los nodos para procesar los edges, ya que pueden venir mas de uno
    			this.readChildNodes(node, step);
    			soap.path.push(step);
    		},
    		"edge": function(node, step){
    			var nodeGeomXML = null;
    			var geom = {};
    			var edgeID = this.getChildValue(node.getElementsByTagName("id")[0]);
    			var edgeGeometry = this.getChildValue(node.getElementsByTagName("geometry")[0]);
    			if(edgeGeometry.namespaceURI == null){
    				nodeGeomXML = OpenLayers.Format.XML.prototype.read.apply(this, [edgeGeometry]);
    				this.readChildNodes(nodeGeomXML, geom);
    			}
    			var edgeGeom = geom.components;
    			var edge = {
    					id: edgeID,
    					geometry: edgeGeom
    			};
    			step.arrayEdge.push(edge);
    		},
    		"geometry": function(node, soap){
    			this.readChildNodes(node, soap);
    		},
    		"messages": function(node, soap){
    			// Mensajes de información adicional
    			soap.messages = [];
    			this.readChildNodes(node, soap);
    		},
    		"message": function(node, soap){
    			var message = {
    				type: this.getChildValue(node.getElementsByTagName("type")[0]),
    				text: this.getChildValue(node.getElementsByTagName("text")[0])
    			};
    			soap.messages.push(message);
    		}
    	},
        "gml": OpenLayers.Format.GML.v3.prototype.readers.gml
    },
	
	
	CLASS_NAME: "OpenLayers.Format.XMLSOAP" 
});