SET search_path = persistence_geo, public;
---------------------------------------
----- HTML encoding at gis_folder -----
---------------------------------------
update GIS_FOLDER set name = 'MAPA PROTECCI&#211; CIVIL' where id = 24;
update GIS_FOLDER set name = 'Planificaci&#243; Municipal' where id = 2;
--update GIS_FOLDER set name = 'Obligacions' where id ='3';
update GIS_FOLDER set name = 'Vig&#232;ncia' where id ='4';
--update GIS_FOLDER set name = 'Riscos en el Transport' where id ='5';
--update GIS_FOLDER set name = 'Risc Transport Ferrocarril' where id ='6';
update GIS_FOLDER set name = 'Risc Aeron&#224;utic' where id ='7';
update GIS_FOLDER set name = 'Riscos Tecnol&#242;gics'where id ='8';
update GIS_FOLDER set name = 'Risc Qu&#237;mic en Establiments Industrials' where id ='9';
--update GIS_FOLDER set name = 'Risc Transport Mercaderies Perilloses' where id ='10';
--update GIS_FOLDER set name = 'Risc Conductes' where id ='11';
--update GIS_FOLDER set name = 'Risc Nuclear' where id ='12';
update GIS_FOLDER set name = 'Risc Radiol&#242;gic' where id ='13';
update GIS_FOLDER set name = 'Risc Contaminaci&#243; Marina' where id ='14';
--update GIS_FOLDER set name = 'Riscos Naturals' where id ='15';
--update GIS_FOLDER set name = 'Risc Inundacions' where id ='16';
--update GIS_FOLDER set name = 'Risc Incendis Forestals' where id ='17';
--update GIS_FOLDER set name = 'Risc Nevades' where id ='18';
update GIS_FOLDER set name = 'Risc S&#237;smic' where id ='19';
--update GIS_FOLDER set name = where id ='20' 'Risc Allaus';

update GIS_MAP_CONF set (PDFSERVER,DOWNLOADSERVLETURL,OPENLAYERSPROXYHOST,UPLOADSERVLETURL,VERSION) = ('PDF.do','download.do/','proxy.do?url=','uploadServlet.do','4.6-SNAPSHOT(r3718)');


---------------------------------------
----- HTML encoding at gis_layer -----
---------------------------------------

update GIS_LAYER set NAME_LAYER = 'T&#250;nels ferrocarril' where id = 34;
update GIS_LAYER set NAME_LAYER = 'L&#237;nies ferrocarril' where id = 35;
update GIS_LAYER set NAME_LAYER = 'Instal·lacions aerona&#250;tiques' where id = 36 ;
update GIS_LAYER set NAME_LAYER = 'Zones d''emerg&#232;ncia aerona&#250;tica' where id = 37;
update GIS_LAYER set NAME_LAYER = 'Per&#237;metre de les instal·lacions' where id = 39;
update GIS_LAYER set NAME_LAYER = 'Zona intervenci&#243; i alerta m&#224;ximes' where id = 40;
update GIS_LAYER set NAME_LAYER = 'Zones d''evacuaci&#243;' where id = 43;
update GIS_LAYER set NAME_LAYER = 'Zones d''indefensi&#243; en l''autoprotecci&#243;' where id = 45;
update GIS_LAYER set NAME_LAYER = 'Zones d''intensitat l&#237;mit' where id = 46;
update GIS_LAYER set NAME_LAYER = 'Zones emerg&#232;ncia nuclear' where id = 56;
update GIS_LAYER set NAME_LAYER = 'Municipis instal·lacions radioactives' where id = 57;
update GIS_LAYER set NAME_LAYER = 'Municipis instal·lacions vigil&#224;ncia radioactiva' where id = 58;
update GIS_LAYER set NAME_LAYER = 'Municipis instal·lacions vigil&#224;ncia radioactiva' where id = 59;
update GIS_LAYER set NAME_LAYER = 'Municipis en zona de perill radiol&#242;gic' where id = 60;
update GIS_LAYER set NAME_LAYER = 'Municipis vigil&#224;ncia ambiental' where id = 61;
update GIS_LAYER set NAME_LAYER = 'Instal·lacions nuclears no generadores d''energia' where id = 62;
update GIS_LAYER set NAME_LAYER = 'Instal·lacions de vigil&#224;ncia radiol&#242;gica' where id = 64;
update GIS_LAYER set NAME_LAYER = 'Instal·lacions radioactives' where id = 65;
update GIS_LAYER set NAME_LAYER = 'Punts Actuaci&#243; Priorit&#224;ria' where id = 68;
update GIS_LAYER set NAME_LAYER = 'Cons de dejecci&#243;' where id = 72;
update GIS_LAYER set NAME_LAYER = 'Instal·lacions gas' where id = 80;
update GIS_LAYER set NAME_LAYER = 'Subestacions el&#232;ctriques' where id = 81;
update GIS_LAYER set NAME_LAYER = 'Observacions d''allaus' where id = 85;
update GIS_LAYER set NAME_LAYER = 'Enquesta d''allaus' where id = 86;

