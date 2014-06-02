/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Keyboard.js
 */

/**
 * Class: OpenLayers.Control.RefreshDisabler
 * The RefreshDisabler control disables the F5 refresh
 * 
 * This control has no visible appearance.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.RefreshDisabler = OpenLayers.Class(OpenLayers.Control, {

    /**
     * APIProperty: disableRefresh
     * {Boolean} Disable the F5 refresh propagation
     */
    disableRefresh: true,
    
    /**
     * APIProperty: keyPressed
     * {Integer} Number with the time at the moment of pressed the button. 
     */
    keyPressed: 0,
    
    /**
     * Method: onRefresh
     * This method can be overrided to make some functions to refresh map context
     *
     * Parameters:
     * evt - {Event}
     */
    onRefresh: function (evt){
    	
    },

    /**
     * Constructor: OpenLayers.Control.KeyboardDefaults
     */
        
    /**
     * Method: draw
     * Create handler.
     */
    draw: function() {
        var observeElement = this.observeElement || document;
        this.handler = new OpenLayers.Handler.Keyboard( this,
                {"keydown": this.defaultKeyPress},
                {observeElement: observeElement}
        );
    },
    
    /**
     * Method: defaultKeyPress
     * When handling the key event, we only use evt.keyCode. This holds 
     * some drawbacks, though we get around them below. When interpretting
     * the keycodes below (including the comments associated with them),
     * consult the URL below. For instance, the Safari browser returns
     * "IE keycodes", and so is supported by any keycode labeled "IE".
     * 
     * Very informative URL:
     *    http://unixpapa.com/js/key.html
     *
     * Parameters:
     * evt - {Event} 
     */
    defaultKeyPress: function (evt) {
        var size, handled = true;
        switch(evt.keyCode) {
            case OpenLayers.Event.KEY_F5:
            	// Remove the feature selected monitor and the selected features
//            	Sicecat.featureSelectedMonitor.destroy();
//            	Sicecat.tmpSelectedFeatures = [];
//            	Sicecat.featureSelectedMonitor = new SiceCAT.FeatureSelectedMonitor({
//					title: 'Selected features by layers',
//					closeAction : 'hide',
//					width : 200,
//					height : 300,
//					id : 'features_selected',
//					layout : 'fit'
//				});
//            	// Remove the wfs searcher window
//            	Sicecat.wfsSearcherWindow.close();
//            	//disable propagation if this.disableRefresh is activate
//            	this.onRefresh(evt);
//                if(this.disableRefresh){
//                	OpenLayers.Event.stop(evt);
//                }
//                break;
            	OpenLayers.Event.stop(evt);
            default:
                handled = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.RefreshDisabler"
});

/* 
 * (FROM OpenLayers.Event)
 * Constant: KEY_F5
 * {int}
 */
OpenLayers.Event.KEY_F5 = 116;