/**
 * Original code found on:
 * http://trac.osgeo.org/openlayers/browser/sandbox/madair/lib/OpenLayers/Control/EditFeatureAttributes.js
 * 
 * Changes made by marias to use this on geoext.
 * 
 * Edited by Moisés Arcos Santiago <marcos@emergya.com>
 */
OpenLayers.Control.EditFeatureAttributes = OpenLayers.Class(OpenLayers.Control.SelectFeature,{
	/**
	 *	Property: updateButtonText: {<Text>}
	 */
	updateButtonText : 'Save',
	
	/**
	 * Property: layer {<OpenLayers.Layer.Vector>}
	 */
	layer: null,
	
	/**
	 * Property: layer {<OpenLayers.Layer.Vector>}
	 */
	currentLayer: null,
	
	/**
	 * Property: popup {<Ext.Window>}
	 */
	popup : null,
	
	/**
	 * Property: currentFeature {<OpenLayers.Layer.Vector>}
	 */
	currentFeature : null,
	
	/**
	 * Property: schema {<Text>}
	 */
	schema : null,
	
	/**
	 * Constructor: OpenLayers.Control.EditFeatureAttributes
	 * Create a new feature editing form to give values to the
	 * features attributes The form is auto generated from a
	 * DescribeFeatureType response from a WFS.
	 * 
	 * Parameters: options - {Object} An optional object whose
	 * properties will be set on the control
	 */
	initialize : function(layer) {
		OpenLayers.Control.SelectFeature.prototype.initialize
				.apply(this, [layer, {
					clickout : false,
					toggle : true,
					multiple : false,
					hover : false,
					highlightOnly : false,
					selectStyle : Sicecat.styles["select"],
				}]);
	},
	/**
	 * Method: onSchemaRead
	 * Read the attributes of a feature from the xml schema of a http response.
	 */
	
	onSchemaRead: function(schema){
		this.schema = schema;
		// Select properties from features
		var properties = this.schema.features.featureTypes[0].properties;
		// Crate a FormPanel
		var formPanel = new Ext.form.FormPanel({
			frame : true,
			border : false,
			autoScroll : true,
			collapsible : true,
			layout : 'form'
		});

		var editFeatureAttributes = this;

		// Create the save button handler
		var handler = function() {
			editFeatureAttributes.updateFeature();
		};

		var items = [];
		var j = 0;
		var propType = null;
		// Initialize a text field set from properties
		for ( var i = 0; i < properties.length; i++) {
			// Check property value type and add restriction
			propType = properties[i].type;
			if (!(propType == "gml:GeometryPropertyType" || propType == "xsd:hexBinary")) {
				var input = new Ext.form.TextField({
					fieldLabel : properties[i].name,
					name : properties[i].name,
					style : {
						marginLeft : '25px',
						width : '50%',
						padding : '0px'
					}
				});
				if (propType == "xsd:decimal") {
					input.disable();
				} else if (propType == "xsd:date") {
					// Restricción de que sea tipo fecha
					input = new Ext.form.DateField({
						fieldLabel : properties[i].name,
						name : properties[i].name,
						format : 'Y-m-d',
						style : {
							marginLeft : '25px',
							width : '50%',
							padding : '0px'
						}
					});
				}
				items[j++] = input;
			}
		}
		formPanel.items = items;
		this.popup = new Ext.Window(
				{
					title : "Feature",
					layout : 'form',
					width : 300,
					heigth : 250,
					autoScroll : true,
					collapsible : true,
					closeAction : 'hide',
					onHide : function() {
						editFeatureAttributes
								.unselect(editFeatureAttributes.currentFeature);
					}
				});
		if (this.popup.hidden) {
			this.popup.items = formPanel;
			this.popup.addButton({
				text : this.updateButtonText,
				handler : handler,
				scope : this.popup
			});
			this.populate(this.currentFeature);
			this.popup.show();
		}
	},
	/**
	 * Method: populate
	 * Show a popup with a text in fields from schema xml.
	 */
	populate : function(feature) {
		var properties = this.schema.features.featureTypes[0].properties;
		for ( var i = 0; i < properties.length; ++i) {
			var attrName = properties[i].name;
			var attrValue = feature.attributes[attrName];
			var formPopup = this.popup.items;
			var formField = formPopup.items;
			for ( var j = 0; j < formField.length; j++) {
				if (formField[j].name == attrName) {
					formField[j].setValue(attrValue);
				}
			}
		}
	},
	/**
	 * Method: updateFeature
	 * Update the feature selected attributes.
	 */

	updateFeature : function() {
		// Select all attributes from inputs of fromPanel
		var formPanelUpdate = this.popup.items;
		var inputsForm = formPanelUpdate.items;
		var properties = this.schema.features.featureTypes[0].properties;
		// Check attributes values from properties[i].type
		for ( var i = 0; i < inputsForm.length; i++) {
			var attrName = properties[i].name;
			var attrType = properties[i].type;
			var inputValue = null;
			if (attrType == "xsd:string") {
				inputValue = inputsForm[i].el.getValue();
			} else {
				inputValue = inputsForm[i].value;
			}
			// En el feature actual modificamos el campo con
			// el valor del atributo
			this.currentFeature.attributes[attrName] = inputValue;
			if (this.currentFeature.attributes["OBJECTID"]) {
				this.currentFeature.attributes["OBJECTID"] = undefined;
			}
		}
		this.popup.hide();
		this.unselect(this.currentFeature);
		// Cambiar el estado de la feature a "actualizado" y
		// dibujarla en la capa
		if(this.currentFeature.fid) {
			this.currentFeature.state = OpenLayers.State.UPDATE;														
		} else {
			this.currentFeature.state = OpenLayers.State.INSERT;
		}
		this.currentLayer.events.triggerEvent("afterfeaturemodified",
				{
					feature : this.currentFeature
				});
		this.currentLayer.drawFeature(this.currentFeature);
	},
	
	/**
	 * Method: onSelect
	 * Send a request to obtain the information about the selected feature.
	 * 
	 * Parameters: feature - {<OpenLayers.Layer.Vector>} feature whose has been selected.
	 */
	onSelect: function(feature){
		this.currentFeature = feature;
		this.currentLayer = this.currentFeature.layer;
		this.currentLayer.featureSchema = new OpenLayers.Protocol.HTTP({
			url : this.currentLayer.protocol.url,
			params : {
				typename : this.currentLayer.protocol.featurePrefix
				+ ":"
				+ this.currentLayer.protocol.featureType,
				version : this.currentLayer.protocol.version,
				request : "DescribeFeatureType"
			},
			callback : this.onSchemaRead,
			scope : this,
			format : new OpenLayers.Format.WFSDescribeFeatureType()
		});
		this.currentLayer.featureSchema.read();
	},
	
	/**
     * Method: unhighlight
     * Redraw feature with the "default" style
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>} 
     */
    unhighlight: function(feature) {
        var layer = feature.layer;
        // three cases:
        // 1. there's no other highlighter, in that case _prev is undefined,
        //    and we just need to undef _last
        // 2. another control highlighted the feature after we did it, in
        //    that case _last references this other control, and we just
        //    need to undef _prev
        // 3. another control highlighted the feature before we did it, in
        //    that case _prev references this other control, and we need to
        //    set _last to _prev and undef _prev
        if(feature._prevHighlighter == undefined) {
            delete feature._lastHighlighter;
        } else if(feature._prevHighlighter == this.id) {
            delete feature._prevHighlighter;
        } else {
            feature._lastHighlighter = feature._prevHighlighter;
            delete feature._prevHighlighter;
        }
        if(feature.state != "Delete"){
        	layer.drawFeature(feature, feature.style || feature.layer.style ||
            "default");
        }
        this.events.triggerEvent("featureunhighlighted", {feature : feature});
    },
	
	CLASS_NAME : "OpenLayers.Control.EditFeatureAttributes"
});
