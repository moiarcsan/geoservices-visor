SET search_path = persistence_geo, public;
-- Update wfs layers
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:ra' where value = 'http://10.136.202.75/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:ra';
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:rp' where value = 'http://10.136.202.75/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:rp';
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:rl' where value = 'http://10.136.202.75/ows/wfs?request=DescribeFeatureType=1.1.0=WFS=r:rl';
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs' where value = 'http://10.136.202.75/ows/wfs';

-- Update wms & wmst layers
update gis_layer set server_resource = 'http://sigescat.pise.interior.intranet/wmst/topo' where server_resource = 'http://10.136.202.75/wmst/topo';
update gis_layer set server_resource = 'http://sigescat.pise.interior.intranet/wmst/orto' where server_resource = 'http://10.136.202.75/wmst/orto';
update gis_layer set server_resource = 'http://sigescat.pise.interior.intranet/wmst/dades' where server_resource = 'http://10.136.202.75/wmst/dades';
update gis_layer set server_resource = 'http://sigescat.pise.interior.intranet/ows/wms?' where server_resource = 'http://10.136.202.75/ows/wms?';


-- Update (2)
update gis_layer_property set value = 'http://sigescat.pise.interior.intranet/ows/wfs' where value = 'http://10.136.202.75/ows/wfs';
