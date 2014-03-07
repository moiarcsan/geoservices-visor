//define if we are going to show an alert or not
var alertFallback = false;
if (typeof console === "undefined" || typeof console.log === "undefined") {
	console = {};
	if (alertFallback) {
		if(typeof(Sicecat) != "undefined" && Sicecat.isLogEnable) console.log = function(msg) {
			alert(msg);
		};
	} else {
		if(typeof(Sicecat) != "undefined" && Sicecat.isLogEnable) { 
		  console.log = function(msg) {
		  };
		} else {
		  console.log = function(msg) {
		  };
		}
	}
}

var jsfiles = new Array();

// Feature Handler
jsfiles.push("SiceCAT/Handler/Feature.js");
//PersistenceGeo
jsfiles.push("persistenceGeo/loaders/AbstractLoader.js");
jsfiles.push("persistenceGeo/loaders/WFSLoader.js");
jsfiles.push("persistenceGeo/loaders/WMSLoader.js");
jsfiles.push("persistenceGeo/loaders/WMSTLoader.js");
jsfiles.push("persistenceGeo/loaders/TEXTLoader.js");
jsfiles.push("persistenceGeo/loaders/KMLLoader.js");
jsfiles.push("persistenceGeo/loaders/GMLLoader.js");
jsfiles.push("persistenceGeo/Parser.js");
jsfiles.push("persistenceGeo/PersistenceGeoParser.js");
jsfiles.push("persistenceGeo/SiceCATGeoParser.js");
// OpenLayers Controls
jsfiles.push("SiceCAT/SiceCAT.js");
jsfiles.push("SiceCAT/Control.js");
jsfiles.push("SiceCAT/Layer.js");
jsfiles.push("SiceCAT/Feature.js");
jsfiles.push("SiceCAT/Control/MousePositionSiceCAT.js");
jsfiles.push("SiceCAT/Control/MapMenu.js");
jsfiles.push("SiceCAT/Control/ZoomToSelection.js");
jsfiles.push("SiceCAT/Control/ZoomToLayer.js");
jsfiles.push("SiceCAT/Control/ZoomToMunicipioComarca.js");
jsfiles.push("SiceCAT/Control/ZoomToInitialExtend.js");
jsfiles.push("SiceCAT/Control/LayerInformation.js");
jsfiles.push("SiceCAT/Control/WMSServiceReader.js");
jsfiles.push("SiceCAT/Control/WMSServiceStore.js");
jsfiles.push("SiceCAT/Control/WFSCapabilitiesVectorReader.js");
jsfiles.push("SiceCAT/Control/WFSCapabilitiesVectorStore.js");
jsfiles.push("SiceCAT/Control/WFSServiceReader.js");
jsfiles.push("SiceCAT/Control/WFSServiceStore.js");
jsfiles.push("SiceCAT/Control/LoadKML.js");
jsfiles.push("SiceCAT/Control/LoadGML.js");
jsfiles.push("SiceCAT/Control/LoadWMS.js");
jsfiles.push("SiceCAT/Control/LoadWFS.js");
jsfiles.push("SiceCAT/Control/LoadCamcat.js");
jsfiles.push("SiceCAT/Control/LoadAreaEmergencia.js");
jsfiles.push("SiceCAT/Control/LoadUserContext.js");
jsfiles.push("SiceCAT/Control/InitialConfiguration.js");
jsfiles.push("SiceCAT/Control/CreateFolder.js");
jsfiles.push("SiceCAT/Control/GeoCalculator.js");
jsfiles.push("SiceCAT/Control/GoTo.js");
jsfiles.push("SiceCAT/Layer/Vector/RootContainer.js");
jsfiles.push("SiceCAT/Layer/WMS_SIGESCAT.js");
jsfiles.push("SiceCAT/Control/ToolTipControl.js");
jsfiles.push("SiceCAT/Control/DefaultToolTipControl.js");
jsfiles.push("SiceCAT/Control/SelectFeatureControl.js");
jsfiles.push("SiceCAT/Control/SeleccionPuntoRadio.js");
jsfiles.push("SiceCAT/Control/EditFeatureAttributes.js");
jsfiles.push("SiceCAT/Control/SapoDragFeature.js");
jsfiles.push("SiceCAT/Control/SapoDragHandler.js");
jsfiles.push("SiceCAT/Control/ModifyFeatureControl.js");
jsfiles.push("SiceCAT/Control/Exporter.js");
jsfiles.push("SiceCAT/Control/ExportWFS.js");
jsfiles.push("SiceCAT/Control/ExportToGMLKML.js");
jsfiles.push("SiceCAT/Control/DeleteLayer.js");
jsfiles.push("SiceCAT/Control/GetFeatureInfo.js");
jsfiles.push("SiceCAT/Control/OverviewMap.js");
jsfiles.push("SiceCAT/Control/LocateBox.js");
jsfiles.push("SiceCAT/Control/Styler.js");
jsfiles.push("SiceCAT/Control/RefreshDisabler.js");
//OpenLayers 2.12
jsfiles.push("SiceCAT/Format/XML.js");
jsfiles.push("SiceCAT/Format/XML/KML.js");
jsfiles.push("SiceCAT/Format/XML/VersionedOGC.js");
jsfiles.push("SiceCAT/Format/WFSCapabilities/v1.js");
jsfiles.push("SiceCAT/Format/WFSCapabilities/v1_0_0.js");
jsfiles.push("SiceCAT/Format/WFSCapabilities/v1_1_0.js");
jsfiles.push("SiceCAT/Format/GML/v3.js");
//GeoExt overwrite
jsfiles.push("GeoExt/data/LayerStore.js");
//From GeoExt 1.2
jsfiles.push("GeoExt/data/AttributeReader.js");
jsfiles.push("GeoExt/data/AttributeStore.js");
jsfiles.push("GeoExt/data/CSWRecordsReader.js");
jsfiles.push("GeoExt/data/WFSCapabilitiesReader.js");
jsfiles.push("GeoExt/data/WFSCapabilitiesStore.js");
// WFS & Searchers widgets
jsfiles.push("SiceCAT/widgets/QueryPanel.js");
jsfiles.push("SiceCAT/widgets/QueryDialog.js");
jsfiles.push("SiceCAT/widgets/ColorField.js");
jsfiles.push("SiceCAT/widgets/ZoomToResultPanel.js");
jsfiles.push("SiceCAT/widgets/GeoSearch.js");
jsfiles.push("SiceCAT/widgets/PKSearchPanel.js");
jsfiles.push("SiceCAT/widgets/SigescatCercaSolrGeneralSearcherCombo.js");
jsfiles.push("SiceCAT/widgets/OpenlsSigescatSearchCombo.js");
jsfiles.push("SiceCAT/widgets/OpenlsSigescatReverseGeocodePanel.js");
jsfiles.push("SiceCAT/widgets/CopyFeaturesPanel.js");
jsfiles.push("SiceCAT/widgets/MultiSearchCombo.js");
jsfiles.push("SiceCAT/widgets/WFSDialog.js");
// Format SIGESCAT
//jsfiles.push("SiceCAT/Format/XML.js");
jsfiles.push("SiceCAT/Format/WFST/v1_1_0.js");
jsfiles.push("SiceCAT/Format/GML/v3_SIGESCAT.js");
jsfiles.push("SiceCAT/Format/XLS/v1_1_0_SIGESCAT.js");
jsfiles.push("SiceCAT/Format/XMLSOAP.js");
//PrintProvider
jsfiles.push("SiceCAT/data/PrintProvider.js");
jsfiles.push("SiceCAT/data/OpenLS_XLSReader.js");
jsfiles.push("SiceCAT/data/OpenLS_XLSReverseGeocodeReader.js");
// AddLayers panel
jsfiles.push("SiceCAT/widgets/AddLayers.js");
jsfiles.push("SiceCAT/widgets/CapabilitiesGrid.js");
// Tree config
jsfiles.push("SiceCAT/tree/OverlayLayerContainer.js");
jsfiles.push("SiceCAT/tree/EditableLayerContainer.js");
jsfiles.push("SiceCAT/tree/UserLayerContainer.js");
jsfiles.push("SiceCAT/tree/BaseLayerContainer.js");
jsfiles.push("SiceCAT/tree/LayerNode.js");
jsfiles.push("SiceCAT/tree/LayerTree.js");
jsfiles.push("SiceCAT/tree/LayerContextMenu.js");
jsfiles.push("SiceCAT/tree/FolderContextMenu.js");
// Tree pluggin
jsfiles.push("SiceCAT/plugins/TreeNodeRadioButton.js");
// Heron import
jsfiles.push("heron/data/OpenLS_XLSReader.js");
jsfiles.push("heron/widgets/OpenLSSearchCombo.js");
// Extjs.ux
jsfiles.push("ext/ux/StatusBar.js");
jsfiles.push("ext/ux/RowExpander.js");
jsfiles.push("ext/ux/FileUploadField.js");
jsfiles.push("SiceCAT/ext/Exporter-all.js");
// jsfiles.push("ext/ux/Ext.ux.ColorField.js");
// GeoExt.ux
jsfiles.push("GeoExt.ux/Measure.js");
jsfiles.push("GeoExt.ux/MeasureArea.js");
jsfiles.push("GeoExt.ux/MeasureLength.js");
jsfiles.push("GeoExt.ux/GeoNamesSearchCombo.js");
// GXP.ux
jsfiles.push("SiceCAT/widgets/PointSymbolizer.js");
// Proj4js
jsfiles.push("proj4js/proj4js-combined.js");
jsfiles.push("proj4js/defs/EPSG23030.js");
jsfiles.push("proj4js/defs/EPSG23029.js");
jsfiles.push("proj4js/defs/EPSG4258.js");
jsfiles.push("proj4js/defs/EPSG4326.js");
jsfiles.push("proj4js/defs/EPSG25831.js");
jsfiles.push("proj4js/defs/EPSG23031.js");
// Layouts & integration
jsfiles.push("SiceCAT/ext/transcat.js");
jsfiles.push("SiceCAT/ext/West.js");
jsfiles.push("SiceCAT/ext/MapLayout.js");
jsfiles.push("SiceCAT/ext/east_sicecatII.js");
jsfiles.push("SiceCAT/API/SIGIntegrator.js");
jsfiles.push("SiceCAT/Tools/AuxiliaryLayer.js");
// Downloadify
jsfiles.push("downloadify/js/downloadify.min.js");
jsfiles.push("downloadify/js/swfobject.js");

// Init script
jsfiles.push("SiceCAT/init_sicecatII.js");
jsfiles.push("SiceCAT/configuration.js");
// Global windows
jsfiles.push("SiceCAT/widgets/FeatureSelectedMonitor.js");

var agent = navigator.userAgent;
var docWrite = (agent.match("MSIE") || agent.match("Safari") || agent
		.match("Mozilla"));
if (docWrite) {
	var allScriptTags = new Array(jsfiles.length);
}
var host = "scripts/";
for ( var i = 0; i < jsfiles.length; i++) {
	if (docWrite) {
		allScriptTags[i] = "<script src='" + host + jsfiles[i] + "'></script>";
		//console.log("added " + host + jsfiles[i]);
	} else {
		var s = document.createElement("script");
		s.src = host + jsfiles[i];
		var h = document.getElementsByTagName("head").length ? document
				.getElementsByTagName("head")[0] : document.body;
		h.appendChild(s);
		//console.log("added " + s.src);
	}
}
if (docWrite) {
	document.write(allScriptTags.join(""));
}