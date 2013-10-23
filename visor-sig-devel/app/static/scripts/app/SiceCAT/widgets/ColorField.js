/*
 * ColorField.js
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
 * 
 */

/** api: (define)
 *  module = gxp.form
 *  class = ColorField
 *  base_link = `Ext.form.TextField <http://extjs.com/deploy/dev/docs/?class=Ext.form.TextField>`_
 */
Ext.namespace("SiceCAT.form");

/** api: constructor
 *  .. class:: ColorField(config)
 *   
 *      A text field that colors its own background based on the input value.
 *      The value may be any one of the 16 W3C supported CSS color names
 *      (http://www.w3.org/TR/css3-color/).  The value can also be an arbitrary
 *      RGB hex value prefixed by a '#' (e.g. '#FFCC66').
 */
SiceCAT.form.ColorField = Ext.extend(Ext.form.TriggerField,  {

    /** api: property[cssColors]
     *  ``Object``
     *  Properties are supported CSS color names.  Values are RGB hex strings
     *  (prefixed with '#').
     */
    cssColors: {
        aqua: "#00FFFF",
        black: "#000000",
        blue: "#0000FF",
        fuchsia: "#FF00FF",
        gray: "#808080",
        green: "#008000",
        lime: "#00FF00",
        maroon: "#800000",
        navy: "#000080",
        olive: "#808000",
        purple: "#800080",
        red: "#FF0000",
        silver: "#C0C0C0",
        teal: "#008080",
        white: "#FFFFFF",
        yellow: "#FFFF00"
    },
	
    /**
     * @cfg {Boolean} showHexValue
     * True to display the HTML Hexidecimal Color Value in the field
     * so it is manually editable.
     */
    showHexValue : true,
	
	/**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-color-trigger'
     * which displays a calendar icon).
     */
    triggerClass : 'x-form-color-trigger',
	
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10",
						 autocomplete: "off", maxlength:"7"},
	
	/**
	 * @cfg {String} lengthText
	 * A string to be displayed when the length of the input field is
	 * not 3 or 6, i.e. 'fff' or 'ffccff'.
	 */
	lengthText: "Color hex values must be either 3 or 6 characters.",
	
	//text to use if blank and allowBlank is false
	blankText: "Must have a hexidecimal value in the format ABCDEF.",
	
	/**
	 * @cfg {String} color
	 * A string hex value to be used as the default color.  Defaults
	 * to 'FFFFFF' (white).
	 */
	defaultColor: 'FFFFFF',
	
	maskRe: /[a-f0-9]/i,
	// These regexes limit input and validation to hex values
	regex: /[a-f0-9]/i,

	//private
	curColor: 'ffffff',

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
        if (this.value) {
            this.value = this.hexToColor(this.value);
        }
        SiceCAT.form.ColorField.superclass.initComponent.call(this);
        
        // Add the colorField listener to color the field.
        this.on({
            render: this.colorField,
            valid: this.colorField,
            scope: this
        });
        
    },
	
    // private
    validateValue : function(value){
		if(!this.showHexValue) {
			return true;
		}
		if(value.length<1) {
			this.el.setStyle({
				'background-color':'#' + this.defaultColor
			});
			if(!this.allowBlank) {
				this.markInvalid(String.format(this.blankText, value));
				return false
			}
			return true;
		}
		if(value.length!= 7) {
			this.markInvalid(String.format(this.lengthText, value));
			return false;
		}
		this.setColor(value);
        return true;
    },

    // private
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },
	
	// Manually apply the invalid line image since the background
	// was previously cleared so the color would show through.
	markInvalid : function( msg ) {
		SiceCAT.form.ColorField.superclass.markInvalid.call(this, msg);
		this.el.setStyle({
			'background-image': 'url(lib/ext/resources/images/default/grid/invalid_line.gif)'
		});
	},

    /** api: method[getValue]
     *  :returns: ``String`` The RGB hex string for the field's value (prefixed
     *      with '#').
     *  
     *  This method always returns the RGB hex string representation of the
     *  current value in the field (given a named color or a hex string),
     *  except for the case when the value has not been changed.
     */
    getValue: function() {
        var v = this.getHexValue();
        var o = this.initialConfig.value;
        if (v === this.hexToColor(o)) {
            v = o;
        }
        return v;
    },
    
    /** api: method[getHexValue]
     *  :returns: ``String`` The RGB hex string for the field's value (prefixed
     *      with '#').
     *  
     *  As a compliment to the field's ``getValue`` method, this method always
     *  returns the RGB hex string representation of the current value
     *  in the field (given a named color or a hex string).
     */
    getHexValue: function() {
        return this.colorToHex(
            gxp.form.ColorField.superclass.getValue.apply(this, arguments));
    },
    
    /** private: method[colorToHex]
     *  :returns: ``String`` A RGB hex color string or null if none found.
     *  
     *  Return the RGB hex representation of a color string.  If a CSS supported
     *  named color is supplied, the hex representation will be returned.
     *  If a non-CSS supported named color is supplied, null will be
     *  returned.  If a RGB hex string is supplied, the same will be returned.
     */
    colorToHex: function(color) {
        if (!color) {
            return color;
        }
        var hex;
        if (color.match(/^#[0-9a-f]{6}$/i)) {
            hex = color;
        } else {
            hex = this.cssColors[color.toLowerCase()] || null;
        }
        return hex;
    },
    
    /** private: method[hexToColor]
     */
    hexToColor: function(hex) {
        if (!hex) {
            return hex;
        }
        var color = hex;
        for (var c in this.cssColors) {
            if (this.cssColors[c] == color.toUpperCase()) {
                color = c;
                break;
            }
        }
        return color;
    },

    /**
     * Sets the value of the color field.  Format as hex value 'FFFFFF'
     * without the '#'.
     * @param {String} hex The color value
     */
    setValue : function(hex){
    	SiceCAT.form.ColorField.superclass.setValue.call(this, hex);
		this.setColor(hex);
    },
	
	/**
	 * Sets the current color and changes the background.
	 * Does *not* change the value of the field.
	 * @param {String} hex The color value.
	 */
	setColor : function(hex) {
		this.curColor = hex;
		
		this.el.setStyle( {
			'background-color': hex,
			'background-image': 'none'
		});
		if(!this.showHexValue) {
			this.el.setStyle({
				'text-indent': '-100px'
			});
			if(Ext.isIE) {
				this.el.setStyle({
					'margin-left': '100px'
				});
			}
		}
	},
    
    /** private: method[colorField]
     *  Set the background and font color for the field.
     */
    colorField: function() {
        var color = this.curColor || this.curColor;
        this.getEl().setStyle( {
			'background-color': color,
			'background-image': 'none'
		});
    },
	
	handleRender: function() {
		this.setDefaultColor();
	},
	
	setDefaultColor : function() {
		this.setValue(this.defaultColor);
	},

    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus();
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
	
	//private
	handleSelect : function(palette, selColor) {
		this.setValue("#" + selColor);
	},

    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the ColorPicker
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Ext.menu.ColorMenu();
			this.menu.palette.on('select', this.handleSelect, this );
        }
        this.menu.on(Ext.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.show(this.el, "tl-bl?");
    }
});

Ext.reg("gxp_colorfield", SiceCAT.form.ColorField);