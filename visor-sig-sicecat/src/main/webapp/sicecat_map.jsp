<!doctype html public "-//w3c//dtd html 4.0 transitional//en">


<html>
<head>
<title>Example JSP</title>

<!-- Init file -->
<script type="text/javascript" src="lib/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="lib/ext/ext-all.js"></script>
<script type="text/javascript" src="lib/OpenLayers/OpenLayers.js"></script>
<script type="text/javascript" src="lib/GeoExt/lib/GeoExt.js"></script>
<script type="text/javascript" src="lib/GeoExt.ux/Measure.js"></script>
<script type="text/javascript" src="lib/GeoExt.ux/MeasureArea.js"></script>
<script type="text/javascript" src="lib/GeoExt.ux/MeasureLength.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Tools/AuxiliaryLayer.js"></script>
<script type="text/javascript" src="lib/init.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/LoadKML.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/LoadGML.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/LoadWMS.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/AreaPoligono.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/AreaCirculo.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/ToolTipControl.js"></script>
<script type="text/javascript" src="lib/SiceCAT/Control/MapMenu.js"></script>

<style type="text/css">
/* work around an Ext bug that makes the rendering
               of menu items not as one would expect */
.ext-ie .x-menu-item-icon {
	left: -24px;
}

.ext-strict .x-menu-item-icon {
	left: 3px;
}

.ext-ie6 .x-menu-item-icon {
	left: -24px;
}

.ext-ie7 .x-menu-item-icon {
	left: -24px;
}
</style>

<script>
	var layername = "auxiliar";
	var feature = {};
	feature.position = new Array();
	feature.position[0] = 4.21;
	feature.position[1] = 40.24;
	feature.width = 30;
	feature.height = 30;
	feature.id = 0;
	feature.icon = "http://icons.iconarchive.com/icons/turbomilk/animals/256/skunk-icon.png";
</script>
</head>
<body>
	<f:view>
		<a4j:form>
			<f:verbatim>
				<div id="mappanel"></div>
			</f:verbatim>
		</a4j:form>
		<button type="button" onclick="layername + 'i';AuxiliaryLayer.deleteLayer(layername);">Borrar
			capa</button>
		<button type="button" onclick="AuxiliaryLayer.emptyLayer(layername);">Borrar
			features</button>
		<button type="button"
			onclick="delete feature.style;feature.id++;AuxiliaryLayer.addFeature(layername, feature);">Añadir
			Elemento capa</button>
		<button type="button"
			onclick="delete feature.style;delete feature.icon; feature.fillColor = '#FF0000';feature.position[1] += 0.2;feature.position[0] += 0.2;AuxiliaryLayer.updateFeature(layername, feature);">Actualizar
			última</button>
		<button type="button"
			onclick="AuxiliaryLayer.removeFeature(layername, feature);">Eliminar
			última</button>
		<select id="areaPoligonoSelector">
			<option label="..." value="">...</option>
		</select>
	</f:view>
</body>
</html>