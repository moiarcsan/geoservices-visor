-- Update layers & layer_properties
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs' where value = 'http://10.136.202.75/ows/wfs';
update gis_layer set server_resource = 'http://sigescat.pise.interior.intranet/ows/wfs' where server_resource = 'http://10.136.202.75/ows/wfs';
