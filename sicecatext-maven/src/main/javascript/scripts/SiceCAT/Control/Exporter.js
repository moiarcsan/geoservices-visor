/*
 * SiceCAT.Control.Exporter.js
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
 * Authors: Alejandro Diaz Torres (mailto:adiaz@emergya.com)
 */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: SiceCAT.Control.Exporter
 * 
 * The Exporter control provides downloadify for file export
 * 
 * It is designed to be used with a <OpenLayers.Control.Panel>
 * 
 * Inherits from: - <OpenLayers.Control>
 * 
 * See also: - <a href="http://github.com/dcneiner/Downloadify">Downloadify</a>
 */
SiceCAT.Control.Exporter = OpenLayers
		.Class(
				OpenLayers.Control,
				{

					/**
					 * Property: type {String} The type of <OpenLayers.Control> --
					 * When added to a <Control.Panel>, 'type' is used by the
					 * panel to determine how to handle our events.
					 */
					type : OpenLayers.Control.TYPE_BUTTON,

					/**
					 * Property: layer
					 * 
					 * {OpenLayers.Layer.Vector} to be exported
					 */
					layer : null,

					/** i18n */
					downloadFileText : "{0}_{1}.{2}",
					downloadFileExtension: "xml",
					downloadImage : "images/downloadify/export_en.png",
					downloadErrorTitleText : "Download Error",
					layerEmptyText : "You can't export an empty layer",
					downloadErrorText : "You must put something in the File Contents or there will be nothing to save!",
					downloadCancelTitleText : "Down canceled",
					downloadCancelText : "You have cancelled the saving of this file.",
					downloadSuccessTitleText : "Done",
					downloadSuccessText : "The layer '{1}' file has been saved formatted as '{0}'",

					/**
					 * Method: getExportButton
					 * 
					 * Init the export button
					 * 
					 * See also: - <a
					 * href="http://github.com/dcneiner/Downloadify">Downloadify</a>
					 * 
					 */
					getExportButton : function(fileName, data, idButton,
							downloadSuccessTitleText, downloadSuccessText,
							downloadCancelTitleText, downloadCancelText,
							downloadErrorTitleText, downloadErrorText,
							helpText, statusBar) {
						while(fileName.indexOf(":")>-1){
							fileName = fileName.replace(":", "_");
						} 
						if (Sicecat.isLogEnable)
							console.log("Downloading '" + fileName + "'");

						var self = this;
                        var downloadSuccessText = downloadSuccessText;
						Downloadify.create(idButton,{
				    	    filename: function(){
				    	      return fileName;
				    	    },
				    	    data: function(){ 
				    	      return data;
				    	    },
				    	    onComplete: function(){
				    	    	self.onCompleteRequest(statusBar, helpText, downloadSuccessTitleText, downloadSuccessText);
				    	    },
				    	    onCancel: function(){ 
				    	    	Ext.Msg.alert(downloadCancelTitleText, downloadCancelText);
				    	    },
				    	    onError: function(){ 
				    	    	Ext.Msg.alert(downloadErrorTitleText, downloadErrorText); 
				    	    },
				    	    transparent: false,
				    	    swf: 'media/downloadify.swf',
				    	    downloadImage: this.downloadImage,
				    	    dataType:'base64',
				    	    width: 100,
				    	    height: 28,
				    	    append: false
				    	  });
					},

					/**
					 * Method: setLayerToExport
					 * 
					 * Setter for layer to be exported
					 * 
					 * Parameters layer - <OpenLayers.Layer.Vector> to be
					 * exported
					 */
					setLayerToExport : function(layer) {
						this.layer = layer;
					},

					/**
					 * Method: getembeddedDownloadify
					 * 
					 * Get default downloadify container with an id
					 * 
					 * Parameters idContainer - <String> id for the container
					 */
					getEmbeddedDownloadify : function(idContainer) {
						return new Ext.Container({
							autoEl : 'p',
							id : idContainer,
							cls : "downloadify"
						});
					},
					
					onCompleteRequest: function(statusBar, helpText, downloadSuccessTitleText, downloadSuccessText){
						statusBar.setText(helpText);
			    		Ext.Msg.alert(downloadSuccessTitleText, downloadSuccessText);
					},

					CLASS_NAME : "SiceCAT.Control.Exporter"
				});
