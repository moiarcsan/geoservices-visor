<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 2007 Transitional//EN" >
<html>
<head>
	<title></title>
	


	<%
		// Invisible para pre
		if("IS_DEVEL".equals("IS_NOT_DISPLAY")){
		//NADA
		}else { //IS_DISPLAY_NONE | IS_DEVEL
	%>
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

	var integrator = null, ready = false;
	var usuarioDef, permisosDef, idiomaDef, tipoDef, idComarcaDef, idMunicipioDef;

	function msGisShowElement(defElement) {
		_txt = "Definiendo el punto en el visor desde SICECAT.\n"
				+ "Nombre : [" + defElement.getName().toUpperCase() + "]\n"
				+ "Coordenada X: " + defElement.getPosX() + "\n"
				+ "Coordenada Y: " + defElement.getPosY();
		alert(_txt);
	}

	function msGisShowList(lstPoints) {
		_txt = "Definiendo un conjunto de puntos en el visor desde SICECAT.\n";
		for ( var i = 0; i < lstPoints.length; i++) {
			_txt += "Punto : " + lstPoints[i].getName() + "\n";
		}
		alert(_txt);
	}

	function msGisResolveAddress(defElement) {
		_txt = "Definiendo un punto en el visor a partir de una dirección desde SICECAT\n"
				+ "Dirección :" + defElement.getDescription();

		alert(_txt);
	}

	function msGisFocusElement(defElement) {
		_txt = "Centrando un punto con Identificador desde SICECAT \n"
				+ "Identificador: " + defElement.getId();
		alert(_txt);
	}

	function msGisRemoveElement(defElement) {
		_txt = "Eliminando un punto por Identificador desde SICECAT \n"
				+ "Identificador: " + defElement.getId();
		alert(_txt);
	}

	function msGisRemoveList(lstPoints) {
		_txt = "Eliminando un conjunto de puntos en el visor desde SICECAT.\n";
		for ( var i = 0; i < lstPoints.length; i++) {
			_txt += "Identificador : " + lstPoints[i].getId() + "\n";
		}
		alert(_txt);
	}

	function msAplPointSelected(posX, posY, direccion, idMunicipio, idComarca) {
		alert("X:" + posX + "\nY:" + posY + "\nDireccion:" + direccion
				+ "\nIdMunicipio:" + idMunicipio + "\nIdComarca:" + idComarca);
	}

	function msAplElementSelected(id, tipo) {
		alert("id:" + id + ", tipo:" + tipo);
	}

	function msAplListSelected() {
		alert("msAplListSelected");
	}

	function msAplVisorReadyToLogin(integratorGIS) {
		console.log("Visor readyToLogin");
		integratorGIS.msGisLogin(usuarioDef, permisosDef, idiomaDef, tipoDef,
				idComarcaDef, idMunicipioDef);
		integrator = integratorGIS;
		if (top && top.frames && top.frames.gislibrary) {
			top.frames.gislibrary.windowGIS.integrator = integratorGIS;
			top.frames.gislibrary.integrator = integratorGIS;
			top.frames.gislibrary.readyToInteract = true;
		}
	}

	function msAplVisorReadyToInteract() {
		console.log("Visor readyToInteract");
		var list = new Array();
		list.push({
			id : "Comarca/Municipio",
			name : "Com/mun"
		});
		integrator.msGisRenameAllLayers(list);
		readyToInteract = true;
	}

	function msAplSaveLayerName(defLayer) {
		alert("Se ha renombrado la capa con id = '" + defLayer.id + "' a '"
				+ defLayer.name + "'");
	}

	function msAplRemoveLayer(defLayer) {
		alert("Se ha eliminado la capa con id = '" + defLayer.id
				+ "' y nombre '" + defLayer.name + "'");
	}

	function msAplGMLSaved(id) {
		alert("Se ha cargado la capa asociada al incidente con id '" + id + "'");
	}

	function msAplRectangleSelected(x1, y1, x2, y2, rectangulo) {
		var idsMunicipiosEncontrados = "";
		var namesMunicipiosEncontrados = "";
		var idsComarcasEncontradas = "";
		var namesComarcasEncontradas = "";
		if (!!rectangulo && !!rectangulo.listMunicipios) {
			for ( var i = 0; i < rectangulo.listMunicipios.length; i++) {
				idsMunicipiosEncontrados += rectangulo.listMunicipios[i]
						.getIdMunicipio();
				namesMunicipiosEncontrados += rectangulo.listMunicipios[i]
						.getNameMunicipio();
				idsComarcasEncontradas += rectangulo.listMunicipios[i]
						.getIdComarca();
				namesComarcasEncontradas += rectangulo.listMunicipios[i]
						.getNameComarca();
				if (i < rectangulo.listMunicipios.length - 1) {
					idsComarcasEncontradas += ",";
					idsMunicipiosEncontrados += ",";
					namesMunicipiosEncontrados += ",";
					namesComarcasEncontradas += ",";
				}
			}
		}
		alert("Rectangulo seleccionado para busquedas (" + x1 + "," + y1 + ","
				+ x2 + "," + y2 + ")" + "\nIds de municipios --> "
				+ idsMunicipiosEncontrados + "\nNombres de municipios --> "
				+ namesMunicipiosEncontrados + "\nIds de comarcas --> "
				+ idsComarcasEncontradas + "\nNombres de comarcas --> "
				+ namesComarcasEncontradas);
	}

	function msjAplListSelected(list) {
		var msj = "Recibidos los siguientes elementos del Visor";
		if (!!list && list.length > 0) {
			for ( var i = 0; i < list.length; i++) {
				msj += list[i].toString() + "\n";
			}
		} else {
			msj = "No se han enviado elementos";
		}
		alert(msj);
	}
	
	function msAplGetElements(id, type){
		console.log("Abriendo detalles todos los detalles del incidente: "+id);
		
		var item1 = new defElement();
		item1.setName("Observacion 1");
		item1.setPosX(316100);
		item1.setPosY(4545100);
		item1.setDescription("Desc obs");
		item1.setType("Obs");
		item1.setId(201);
		item1.setCapa('Observaciones');
		item1.setProjeccio("EPSG:23031");
		item1.setStyle("");

		var elements = new Array(item1);
		
		if(!!elements 
				&& elements.length > 0){
			for ( var i = 0; i < elements.length; i++) {
				integrator.msGisShowElement(elements[i]);
			}
		}
	}
	
	function msAplHideElements(id, type){
		console.log("ocultando detalles todos los detalles del incidente: "+id);
		
		var item1 = new defElement();
		item1.setName("Observacion 1");
		item1.setPosX(316100);
		item1.setPosY(4545100);
		item1.setDescription("Desc obs");
		item1.setType("Obs");
		item1.setId(201);
		item1.setCapa('Observaciones');
		item1.setProjeccio("EPSG:23031");
		item1.setStyle("");

		var elements = new Array(item1);
		
		if(!!elements 
				&& elements.length > 0){
			for ( var i = 0; i < elements.length; i++) {
				integrator.msGisRemoveElement(elements[i].getId(), elements[i].getCapa());
			}
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
	<div style="display: block; border: 1px solid; text-align: center;">
		<p style="font-weight: bold; font-size: 14pt;">APLICACION - VISOR
			GIS</p>
	</div>
	<table border="0" width="80%">
		<tr>
			<td width="40px"></td>
			<td>
				<p style="border: 1px solid">Mensajes desde el visor GIS a
					SICECAT</p>
				<table width="100%">
					<tr>
						<td width="100px"></td>
						<td>
							<table border="0" style="border: 1px solid" cellpadding="0"
								cellspacing="0">
								<tr>
									<td colspan="2" align="center">
										<table border="0" width="100%">
											<tr>
												<td style="border-bottom: 1px solid;">Devolver un punto
													seleccionado en el visor GIS a partir de coordenadas X - Y</td>
											</tr>
										</table>
										<table border="0">
											<tr>
												<td align="right"><input type="button"
													value="Devolver punto selccionado a partir de coordenadas"
													onclick="msAplPointSelected()" /></td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
			<td width="40px"></td>
		</tr>
		<tr>
			<td width="40px"></td>
			<td>
				<table width="100%">
					<tr>
						<td width="100px"></td>
						<td>
							<table border="0" style="border: 1px solid" cellpadding="0"
								cellspacing="0">
								<tr>
									<td colspan="2" align="center">
										<table border="0" width="100%">
											<tr>
												<td style="border-bottom: 1px solid;">Devolver el
													identificador de un punto seleccionado en el visor GIS</td>
											</tr>
										</table>
										<table border="0">
											<tr>
												<td align="right"><input type="button"
													value="Devolver Identificador de punto selccionado"
													onclick="msAplElementSelected()" /></td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
			<td width="40px"></td>
		</tr>
		<tr>
			<td width="40px"></td>
			<td>
				<table width="100%">
					<tr>
						<td width="100px"></td>
						<td>
							<table border="0" style="border: 1px solid" cellpadding="0"
								cellspacing="0">
								<tr>
									<td colspan="2" align="center">
										<table border="0" width="100%">
											<tr>
												<td style="border-bottom: 1px solid;">Devolver los
													identificadores de un conjunto de puntos seleccionados en
													el visor GIS</td>
											</tr>
										</table>
										<table border="0">
											<tr>
												<td align="right"><input type="button"
													value="Devolver conjunto de identificadores seleccionados en el visor GIS"
													onclick="msAplListSelected()" /></td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
			<td width="40px"></td>
		</tr>
	</table>
</body>
</html>
	<%
		} 
	%>


