/*
 * InitSiceCAT.js
 * Copyright (C) 2011, Cliente <cliente@email.com>
 * 
 * This file is part of Proyecto SiceCAT
 * 
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 * 
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 */

var map, layer, capas, defaultExtent, config;
//Proj4js
//var Proj4js = null;
var capasCargadas = new Object();
var ID_MAPA = "map";

//Controles
var controlReset,controlZoomIn,controlZoomOut,controlBack,controlForward, controlDragPan,
	controlSiceCATInfo,controlSiceCATTooltip,controlSiceCATEquivalencia,controlSiceCATDrawFeature,
	controlSiceCATLocator,controlSiceCATLimpiar,
	controlSiceCATEtiquetadorAutomatico, controlSiceCATResaltador,
	controlSiceCATWFS,controlSiceCATPrint,controlSiceCATEditPoint,controlSiceCATEditLine,
	controlSiceCATEditPolygon,controlSiceCATEditRectangulo,controlSiceCATEditCirculo,controlSiceCATFeatureEditor,
	controlSiceCATAnyadeTexto,controlSiceCATAnyadeLlamada,controlSiceCATMeasure,
	controlMousePosition, controlLayerSwitcher;

//Inicializacion de las capas del mapa
var intentosVolcado = 10;

function initMapSiceCAT(){
	
	calculaHeightDiv(window.innerHeight, 160, ID_MAPA);
	
	//defaultExtent = new OpenLayers.Bounds(3.5,40.2,-2,43.8);
	//defaultExtent = new OpenLayers.Bounds(-1.8,40,3.5,43.8);
	//defaultExtent = new OpenLayers.Bounds(1,-1,-1,1);
	//defaultExtent = new OpenLayers.Bounds(-80,-40,80,40);            
	var lon = 1;
        var lat = 41.5;
        var zoom = 7;
  
  layer = new OpenLayers.Layer.Vector("SICECAT Editable Layer", optionsLayers);

	
	var options = {
		div: ID_MAPA, 
	  	//maxExtent: defaultExtent,
		 controls: [
                        new OpenLayers.Control.Navigation(),
                        new OpenLayers.Control.PanZoomBar(),
                        new OpenLayers.Control.LayerSwitcher({'ascending':false}),
                        new OpenLayers.Control.Permalink(),
                        new OpenLayers.Control.ScaleLine(),
                        new OpenLayers.Control.Permalink('permalink'),
                        new OpenLayers.Control.MousePosition(),
                        new OpenLayers.Control.OverviewMap(),
                        new OpenLayers.Control.KeyboardDefaults(),
			new OpenLayers.Control.EditingToolbar(layer)
			//,new OpenLayers.Control.NavToolbar()
                    ],                   
		numZoomLevels: 10
  	};
  
  map = new OpenLayers.Map(options);
  
  var optionsLayers = {
      	displayInLayerSwitcher: false,
      	isBaseLayer: true,
          calculateInRange: function() { return true;}
      };

  var ol_wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                    "http://vmap0.tiles.osgeo.org/wms/vmap0",
                    {layers: 'basic'} );
  var jpl_wms = new OpenLayers.Layer.WMS( "NASA Global Mosaic",
    "http://t1.hypercube.telascience.org/cgi-bin/landsat7", 
    {layers: "landsat7"});

  var dm_wms = new OpenLayers.Layer.WMS( "DM Solutions Demo",
    "http://www2.dmsolutions.ca/cgi-bin/mswms_gmap",
    {layers: "bathymetry,land_fn,park,drain_fn,drainage," +
             "prov_bound,fedlimit,rail,road,popplace",
     transparent: "true", format: "image/png" });

  dm_wms.setVisibility(false);
  
  map.addLayers([ol_wms, jpl_wms, dm_wms, layer]);
  //map.addLayer(layer);
  //map.addLayer(ol_wms);
  //map.addLayer(jpl_wms);
  //map.addLayer(dm_wms);
  
  //map.addPanel(initControlsSiceCAT());

  map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);

  //if (!map.getCenter()) map.zoomToMaxExtent();

 map.div.oncontextmenu = function noContextMenu(e) {
             if (OpenLayers.Event.isRightClick(e)){
                 alert("Right button click"); // Add the right click menu here
              }
        return false; //cancel the right click of brower
       }; 

}

/**
 * Inicializa los controles del mapa
 * 
 * @return
 */
function initControlsSiceCAT(){

	//Controles basicos
	controlReset = new OpenLayers.Control.ZoomToMaxExtent({id:"reset", title:"Reset"});
	controlZoomIn = new OpenLayers.Control.ZoomIn({id:"zoomIn", title:"zoomIn"});
	controlZoomOut = new OpenLayers.Control.ZoomOut({id:"zoomOut", title:"zoomOut"});
//	var controlNavigationHistory = new OpenLayers.Control.NavigationHistory();
//    map.addControl(controlNavigationHistory);
	//controlBack = new SiceCAT.Control.Back({id:"back", controlNavigationHistory: controlNavigationHistory});
	//controlForward = new SiceCAT.Control.Forward({id:"forward", controlNavigationHistory: controlNavigationHistory});
	controlLayerSwitcher = new OpenLayers.Control.LayerSwitcher({id:"layerSwitcher"});
	controlDragPan = new OpenLayers.Control.DragPan({id:"dragPan", title:"dragPan"});
	//controlSiceCATInfo = new SiceCAT.Control.Info({id:"sicaInfo"});
	//controlSiceCATTooltip = new SiceCAT.Control.Tooltip({id:"sicaTooltip"});
	controlMousePosition = new OpenLayers.Control.MousePosition();
//	var controlLoading = new OpenLayers.Control.LoadingPanel();
//	map.addControl(controlLoading);
	
	//Utilidades graficas
	//controlSiceCATFeatureEditor = new SiceCAT.Control.FeatureEditor({id:"featureEditor"});
	//controlSiceCATEditPoint = new SiceCAT.Control.EditPoint({id:"editPoint", featureEditor:controlSiceCATFeatureEditor});
	//controlSiceCATAnyadeTexto = new SiceCAT.Control.AnyadeTexto({id:"anyadeTexto", featureEditor:controlSiceCATFeatureEditor});
	//controlSiceCATAnyadeLlamada = new SiceCAT.Control.AnyadeLlamada({id:"anyadeLlamada", featureEditor:controlSiceCATFeatureEditor});
	//controlSiceCATEditLine = new SiceCAT.Control.EditLine({id:"editLine", featureEditor:controlSiceCATFeatureEditor});
	//controlSiceCATEditCirculo = new SiceCAT.Control.EditCirculo({id:"editCirculo", featureEditor:controlSiceCATFeatureEditor});
	//controlSiceCATEditPolygon = new SiceCAT.Control.EditPolygon({id:"editPolygon"});
	//controlSiceCATEditRectangulo = new SiceCAT.Control.EditRectangulo({id:"editRectangulo", featureEditor:controlSiceCATFeatureEditor});
	
	//Utilidades para el volcado de geometrias en el mapa
	//controlSiceCATResaltador = new SiceCAT.Control.Resaltador({id:"resaltador"});
	//controlSiceCATLocator = new SiceCAT.Control.Locator({id:"locator"});
	//controlSiceCATLimpiar = new SiceCAT.Control.Limpiador({id:"limpiador"});
	  
	//Etiquetadores(Vector y WFS)
//	controlSiceCATEtiquetador = new SiceCAT.Control.Etiquetador({id:"etiquetador"});
//	controlSiceCATEtiquetadorAutomatico = new SiceCAT.Control.EtiquetadorAutomatico({id:"etiquetadorAutomatico"});
	//controlSiceCATWFS = new SiceCAT.Control.WFS({id:"etiquetadorWFS"});
	
	//Utilidades del mapa
//	controlSiceCATEquivalencia = new SiceCAT.Control.Equivalencia({id:"equivalencia"});
//	controlSiceCATMeasure = new SiceCAT.Control.Measure({id:"measure"});
//	controlSiceCATPrint = new SiceCAT.Control.Print({id:"printer"});
	
    var panel = new OpenLayers.Control.Panel({defaultControl: controlZoomIn});
    
    panel.addControls([

				  //Controles basicos
				  controlReset, 
				  controlZoomIn,
				  controlZoomOut,
	                 	  controlMousePosition,
				  controlLayerSwitcher,
				  controlDragPan]);
    
    return panel;
}

/**
 * Funcion que establece el height del div idMapa restando 
 * <code>restante</code> a <code>totalHeight</code> 
 * 
 * @param totalHeight
 * @param restante
 * @param idMapa
 * @return
 */
function calculaHeightDiv(totalHeight, restante, idDiv){
	if(!!totalHeight
			&& !!restante
			&& !!idDiv && totalHeight > restante){
		var heightObjetivo = totalHeight-restante;
		var divAux = document.getElementById(idDiv);
		if(!!divAux && !!divAux.style){
			divAux.style.height = heightObjetivo;
		}
	}
}
