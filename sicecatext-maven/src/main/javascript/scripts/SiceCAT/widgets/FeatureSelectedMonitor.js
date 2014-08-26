/*
 * FeatureSelectedMonitor.js
 * Copyright (C) 2011
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
 */
/*
 * Class: SiceCAT.FeatureSelectedMonitor
 * 
 * Window with the selected features by layers.
 * 
 * 
 * Inherits from: 
 * 
 * <Ext.Window>
 * 
 * About: 
 * 
 * This file is part of Proyecto SiceCAT. Copyright (C) 2011
 * 
 * License:
 * 
 *  This file is licensed under the GPL.
 * 
 * Author:
 * 
 *  Moises Arcos Santiago (marcos@emergya.com)
 */
Ext.namespace("SiceCAT");
SiceCAT.FeatureSelectedMonitor = Ext.extend(Ext.Window, {
	title: '',
	features_selected_store: null,
	colModel: null,
	gridView: null,
	grid: null,
	control: null,
	
	/* i18n */
	titleFeatureWindow: 'Selected features by layers',
	textButtonDeselectAll: 'Unselect All',
	textButtonIntersect: 'Intersect',
	textNoFeatureSelected: 'There are not any feature selected.',
	titleIntersectWarning: 'Warning',
	textIntersectWarning: 'You must select some element',
	
	/** 
	 * private: method[constructor]
	 *  Construct the component.
	 */
	initComponent: function(){
		this.setTitle(this.titleFeatureWindow);
		this.createStore();
		this.createColModel();
		this.createGridView();
		this.createGrid();
		this.items = [this.grid];
		this.buttons = [{
			text: this.textButtonDeselectAll,
			handler: this.removeSelection,
			scope: this
		},{
			text: this.textButtonIntersect,
			handler: this.intersectElements,
			scope: this
		}];
		SiceCAT.FeatureSelectedMonitor.superclass.initComponent.apply(this, arguments);
	},
	/**
	 * Function: createStore
	 * 
	 * Create the internal grid store
	 * 
	 */
	createStore: function(){
		this.features_selected_store = new Ext.data.ArrayStore({
			fields: ['features', 'name', 'remove']
		});
	},
	/**
	 * Function: createColModel
	 * 
	 * Create the internal grid column model
	 * 
	 */
	createColModel: function(){
		this.colModel = new Ext.grid.ColumnModel([{
			dataIndex: 'features',
			menuDisabled: true,
			headersDisabled: true,
			width: 40
		},{
			dataIndex : 'name',
			menuDisabled: true,
			headersDisabled: true
		},{
			dataIndex : 'remove',
			menuDisabled: true,
			headersDisabled: true,
			width: 40,
			renderer: function(){
				return "<img src=\"images/SiceCAT/delete.png\"/>";
			}
		}]);
	},
	/**
	 * Function: createGridView
	 * 
	 * Create the internal grid view
	 * 
	 */
	createGridView: function(){
		this.gridView = new Ext.grid.GridView({
			forceFit : true,
			headersDisabled: true,
			deferEmptyText: false,
			emptyText: this.textNoFeatureSelected
		});
	},
	/**
	 * Function: createGrid
	 * 
	 * Create the internal grid 
	 * 
	 */
	createGrid: function(){
		var self = this;
		this.grid = new Ext.grid.GridPanel({
			disableSelection: true,
			hideHeaders: true,
		    store: this.features_selected_store,
		    colModel: this.colModel,
		    view : this.gridView,
		    listeners:{
		    	cellclick: function(rid,td,cellIndex,record,tr,rowIndex,e,eOpts){
		    		var featureToUnselectArray = null;
		    		// Si se ha pulsado sobre la img
		    		if(cellIndex == 2){
		    			featureToUnselectArray = classifiedFeatures[td].value.slice(0);
		    			for(var i=0; i<featureToUnselectArray.length; i++){
		    				self.control.unselect(featureToUnselectArray[i]);
		    			}
		    		}
		    	}
		    }
		});
	},
	/**
	 * Function: removeSelection
	 * 
	 * Remove all features selected
	 * 
	 */
	removeSelection: function(){
		this.control.removeSelection();
	},
	/**
	 * Function: intersectElements
	 * 
	 * Intersects the selected features with a WFS-T layer
	 * 
	 */
	intersectElements: function(){
		// Partimos de elementos seleccionados
		var control = this.control;
		var self = this;
		if(control.featuresSelected.length != 0){
			// Abrir ventana wfs
			if(Sicecat.wfsSearcherWindow != null){
				// Recogemos los fieldset de las dos primeras consultas
				Sicecat.wfsSearcherWindow.items.items[0].getComponent("fieldsetExtent").collapsed = true;
				Sicecat.wfsSearcherWindow.items.items[0].getComponent("fieldsetAtr").collapsed = true;
				Sicecat.wfsSearcherWindow.show();
			}
		}else{
			Ext.Msg.show({
	            title: self.titleIntersectWarning,
	            msg: self.textIntersectWarning,
	            buttons: Ext.Msg.OK,
	        });
		}
	},
	/**
	 * Function: setControl
	 * 
	 * Set the internal control of the window
	 * 
	 */
	setControl: function(control){
		this.control = control;
	},
	/**
	 * Function: close
	 * 
	 * Deactivates the control associated and hide the window
	 * 
	 */
	close: function(){
		// Event control to chrome vs firefox
		var evento = null;
		if(!Ext.isGecko){
			evento = event;
		}else{
			evento = evt;
		}
		// Deactivate the actual control and activate the tooltip control
		if(this.control && this.control.active){
			this.control.deactivate();
			actions["tooltipcontrol"].control.activate();
		}
	}
});
/** api: xtype = gx_sicecat_geosearch */
Ext.reg('gx_sicecat_featureselectedmonitor', SiceCAT.FeatureSelectedMonitor);