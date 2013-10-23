Ext.namespace("SiceCAT.Control");

/** api: constructor
 *  .. class:: WMSServiceStore
 *  
 *      Small helper class to make creating stores for remote WMS layer data
 *      easier.  The store is pre-configured with a built-in
 *      ``Ext.data.HttpProxy`` and :class:`GeoExt.data.WMSServiceReader`.
 *      The proxy is configured to allow caching and issues requests via GET.
 *      If you require some other proxy/reader combination then you'll have to
 *      configure this with your own proxy or create a basic
 *      :class:`Ext.data.Store` and configure as needed.
 */

/** api: config[format]
 *  ``OpenLayers.Format``
 *  A parser for transforming the XHR response into an array of objects
 *  representing attributes.  Defaults to an ``OpenLayers.Format.WMSCapabilities``
 *  parser.
 */

/** api: config[fields]
 *  ``Array | Function``
 *  Either an Array of field definition objects as passed to
 *  ``Ext.data.Record.create``, or a record constructor created using
 *  ``Ext.data.Record.create``.  Defaults to ``["name", "type"]``. 
 */

SiceCAT.Control.WMSServiceStore = function(c) {
    c = c || {};
    GeoExt.data.WMSCapabilitiesStore.superclass.constructor.call(
        this,
        Ext.apply(c, {
            proxy: c.proxy || (!c.data ?
                new Ext.data.HttpProxy({url: c.url, disableCaching: false, method: "GET"}) :
                undefined
            ),
            reader: new SiceCAT.Control.WMSServiceReader(
                c, c.fields
            )
        })
    );
};
Ext.extend(SiceCAT.Control.WMSServiceStore, GeoExt.data.WMSCapabilitiesStore);