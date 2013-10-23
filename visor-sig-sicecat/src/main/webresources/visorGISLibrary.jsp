<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 2007 Transitional//EN" >
<html>
<head>
<title></title>



	<%
		// Invisible para pre
		if("${index.mode}".equals("IS_NOT_DISPLAY")){
		//NADA
		}else { //IS_DISPLAY_NONE | IS_DEVEL
	%>
<!-- Css imports -->
<link rel="stylesheet" type="text/css"
	href="css/ext/resources/css/ext-all-sicecat.css" />
<link rel="stylesheet" type="text/css"
	href="css/GeoExt.ux/css/measure.css" />
<link rel="stylesheet" type="text/css" href="css/geoext-all-debug.css"></link>
<link rel="stylesheet" type="text/css" href="css/gxp/theme/all.css"></link>
<link rel="stylesheet" type="text/css" href="css/SiceCAT/css/all.css"></link>

<!-- Extjs -->
<script type="text/javascript" src="scripts/ext/ext-base-3.4.js"></script>
<script type="text/javascript" src="scripts/ext/ext-all-3.4.js"></script>
<!-- OpenLayers -->
<script type="text/javascript" src="scripts/OpenLayers/OpenLayers.js"></script>
<script type="text/javascript" src="scripts/GeoExt/lib/GeoExt.js"></script>
<script type="text/javascript" src="scripts/gxp/loader.js"></script>
<script type="text/javascript">
	//define if we are going to show an alert or not
	var alertFallback = false;
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		console = {};
		if (alertFallback) {
			console.log = function(msg) {
				alert(msg);
			};
		} else {
			console.log = function(msg) {
			};
		}
	}

	var windowGIS, integrator = null, readyToInteract = false;

	function init(usuario, permisos, idioma, tipo, idComarca, idMunicipio) {
		top.frames.sicecatlibrary.usuarioDef = usuario.value;
		top.frames.sicecatlibrary.permisosDef = permisos.value;
		top.frames.sicecatlibrary.idiomaDef = idioma.value;
		top.frames.sicecatlibrary.tipoDef = tipo.value;
		top.frames.sicecatlibrary.idComarcaDef = idComarca.value;
		top.frames.sicecatlibrary.idMunicipioDef = idMunicipio.value;
		
		windowGIS =window.open("sicecatII_map.jsp", "VisorGIS",
			"status=0,menubar=0,toolbar=0,fullscreen=1");
	}

	function setPointInViewer(X, Y, nombre, description, id) {
		var item = new defElement();
		item.setPosX(X.value);
		item.setPosY(Y.value);
		item.setName(nombre.value);
		item.setDescription(description.value);
		item.setId(id.value);
		if (windowGIS && !windowGIS.closed && readyToInteract) {
			windowGIS.integrator.msGisShowElement(item);
		} else
			alert("Debe abrir el visor GIS");
	}

	function setMunicipiComarcaInViewer(id, tipo, nombre, description, capa) {
		var item = new defElement();
		item.setName(nombre.value);
		item.setDescription(description.value);
		item.setCapa(capa.value);
		item.setType(tipo.value);
		item.setId(id.value);
		if (windowGIS && !windowGIS.closed && readyToInteract) {
			windowGIS.integrator.msGisShowElement(item);
		} else
			alert("Debe abrir el visor GIS");
	}

	function setGroupOfPointsInViewer(point1X, point1Y, point2X, point2Y,
			point3X, point3Y, projeccio, style) {
		var item1 = new defElement();
		item1.setName("Primer Punto");
		item1.setPosX(point1X.value);
		item1.setPosY(point1Y.value);
		item1.setDescription("Desc primer punto");
		item1.setType("INC");
		item1.setId(21);
		item1.setProjeccio(projeccio.value);
		item1.setStyle(style.value);

		var item2 = new defElement();
		item2.setName("Segundo Punto");
		item2.setPosX(point2X.value);
		item2.setPosY(point2Y.value);
		item2.setDescription("Desc primer punto");
		item2.setType("INC");
		item2.setId(22);
		item2.setProjeccio(projeccio.value);
		item2.setStyle(style.value);

		var item3 = new defElement();
		item3.setName("Tercer Punto");
		item3.setPosX(point3X.value);
		item3.setPosY(point3Y.value);
		item3.setDescription("Desc tercer punto");
		item3.setType("INC");
		item3.setId(23);
		item3.setProjeccio(projeccio.value);
		item3.setStyle(style.value);

		var _lstPoints = new Array(item1, item2, item3);
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisShowList(_lstPoints);
		else
			alert("Debe abrir el visor GIS");
	}

	function setPointFromAddress(address) {
		var item = new defElement();
		item.setDescription(address.value);

		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisResolveAddress(item);
		else
			alert("Debe abrir el visor GIS");
	}

	function focusPoints(idfocus) {
		if (!!idfocus.value) {
			var ids_string = idfocus.value;
			if (!!idfocus.value.split(',')) {
				var ids = ids_string.split(',');
				var items = new Array();
				for ( var i = 0; i < ids.length; i++) {
					var item = new defElement();
					item.setId(ids[i]);
					items[i] = item;
				}
				if (windowGIS && !windowGIS.closed && readyToInteract)
					windowGIS.integrator.msGisFocusList(items);
				else
					alert("Debe abrir el visor GIS");
			} else {
				var item = new defElement();
				item.setId(ids_string);
				if (windowGIS && !windowGIS.closed && readyToInteract)
					windowGIS.integrator.msGisFocusElement(item);
				else
					alert("Debe abrir el visor GIS");
			}
		}
	}

	function removePoint(idremove) {
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisRemoveElement(idremove);
		else
			alert("Debe abrir el visor GIS");
	}

	function removeGroupOfPoints(id1, id2, id3, id4) {
		var item1 = new defElement();
		item1.setId(id1.value);
		var item2 = new defElement();
		item2.setId(id2.value);
		var item3 = new defElement();
		item3.setId(id3.value);
		var item4 = new defElement();
		item4.setId(id4.value);
		var _lstPoints = new Array(item1, item2, item3, item4);

		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisRemoveList(_lstPoints);
		else
			alert("Debe abrir el visor GIS");
	}

	function getPointFromViewer(defElement) {
		_txt = "Recibiendo punto seleccionado en el Visor GIS con Id y Coordenadas \n"
				+ "Identificador : "
				+ defElement.getId()
				+ "\n"
				+ "Coordenada X : "
				+ defElement.getPosX()
				+ "\n"
				+ "Coordenada Y : " + defElement.getPosY() + "\n";
		alert(_txt);
	}

	function getElementFromViewer(defElement) {
		_txt = "Recibiendo el identificador de un punto seleccionado en el Visor GIS\n"
				+ "Identificador: " + defElement.getId();
		alert(_txt);
	}

	function getGroupOfElementsFromViewer(lstPoints) {
		_txt = "Recibiendo los identificadores de un conjunto de puntos seleccionados en el Visor GIS\n";
		for ( var i = 0; i < lstPoints.length; i++) {
			_txt += "Identificador :" + lstPoints[i].getId() + "\n";
		}
		alert(_txt);
	}

	function msGisCreateCapa(id, nombre, order) {
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisCreateCapa(id.value, nombre.value, order.value);
		else
			alert("Debe abrir el visor GIS");
	}

	function msGisRemoveCapa(id) {
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisRemoveCapa(id.value);
		else
			alert("Debe abrir el visor GIS");
	}
	
	function msGisDrawGML(id, URL, capa){
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisDrawGML(id.value, URL.value, capa.value);
		else
			alert("Debe abrir el visor GIS");
	}
	
	function msGisRenameAllLayers(capas){
		var list = new Array();
		var capasSplit = capas.split(",");
		for (var i=0; i< capasSplit.length; i++){
			list[i] = new Object();
			list[i].id = capasSplit[i].split(":")[0]; 
			list[i].name = capasSplit[i].split(":")[1];
		}
		
		if (windowGIS && !windowGIS.closed && readyToInteract)
			windowGIS.integrator.msGisRenameAllLayers(list);
		else
			alert("Debe abrir el visor GIS");
	}
	
	function msGisActiveSelectZone(){
		if (windowGIS && !windowGIS.closed && readyToInteract){
			windowGIS.integrator.msGisActiveSelectZone();
		}
	}

	function defElement() {
		var id, name, description, posX, posY, type, style, capa, projeccio;

		this.setId = function(Id) {
			id = Id;
		}
		this.getId = function() {
			return id;
		}
		this.setName = function(Name) {
			name = Name;
		}
		this.getName = function() {
			return name;
		}
		this.setPosX = function(PosX) {
			posX = PosX;
		}
		this.getPosX = function() {
			return posX;
		}
		this.setPosY = function(PosY) {
			posY = PosY;
		}
		this.getPosY = function() {
			return posY;
		}
		this.setDescription = function(Description) {
			description = Description;
		}
		this.getDescription = function() {
			return description;
		}
		this.setType = function(Type) {
			type = Type;
		}
		this.getType = function() {
			return type;
		}
		this.setStyle = function(Style) {
			style = Style;
		}
		this.getStyle = function() {
			return style;
		}
		this.setCapa = function(Capa) {
			capa = Capa;
		}
		this.getCapa = function() {
			return capa;
		}
		this.setProjeccio = function(Projeccio) {
			projeccio = Projeccio;
		}
		this.getProjeccio = function() {
			return projeccio;
		}

	}
</script>
</head>
<body>
</body>
</html>
	<%
		} 
	%>
