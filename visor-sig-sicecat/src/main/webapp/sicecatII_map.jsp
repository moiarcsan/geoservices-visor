<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!doctype html public "-//w3c//dtd html 4.0 transitional//en">


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Visor para SiceCAT II / GPCL</title>

<!-- Css imports -->
<link rel="stylesheet" type="text/css"
	href="css/ext/resources/css/ext-all-sicecat.css" />
<link rel="stylesheet" type="text/css"
	href="css/GeoExt.ux/css/measure.css" />
<link rel="stylesheet" type="text/css" href="css/geoext-all-debug.css"></link>
<link rel="stylesheet" type="text/css" href="css/gxp/theme/all.css"></link>
<link rel="stylesheet" type="text/css" href="css/SiceCAT/css/all.css"></link>

<!-- Chrome Frame -->
<!--[if IE]>
    <script type="text/javascript" 
     src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>
     
      <style>
     .chromeFrameInstallDefaultStyle {
       width: 100%; /* default is 800px */
       border: 5px solid blue;
     }
    </style>
    <script type="text/javascript" >
       function install() {
			window.location="installChromeFrame.jsp";
	}
	// The conditional ensures that this code will only execute in IE,
	// Therefore we can use the IE-specific attachEvent without worry
	CFInstall.check({
		preventPrompt: true,
		onmissing: install
	});
    </script>
 
     
<![endif]-->
<!-- Extjs -->

<script type="text/javascript" src="scripts/visorConfig.js"></script>

<script type="text/javascript" src="scripts/ext/ext-base-3.4.js"></script>
<script type="text/javascript" src="scripts/ext/ext-all-3.4.js"></script>

<!-- OpenLayers -->
<script type="text/javascript" src="scripts/OpenLayers/OpenLayers.js"></script>

<!-- GeoExt -->
<script type="text/javascript" src="scripts/GeoExt/lib/GeoExt.js"></script>

<!-- GXP -->
<script type="text/javascript" src="scripts/gxp/loader.js"></script>

<!-- PersistenceGeo -->
<!--script type="text/javascript" src="scripts/persistenceGeo.js"></script--> 

<!-- Sicecatext -->
<script type="text/javascript" src="scripts/SiceCAT/load.js"></script>

<!-- i18n -->
<script type="text/javascript" src="scripts/SiceCAT/locale/es.js"></script>
<script type="text/javascript" src="scripts/SiceCAT/locale/ca.js"></script>
<script type="text/javascript" src="scripts/SiceCAT/locale/en.js"></script>
<script type="text/javascript"
	src="scripts/ext/src/locale/ext-lang-ca.js"></script>
<script type="text/javascript"
	src="scripts/ext/src/locale/ext-lang-en.js"></script>
<script type="text/javascript"
	src="scripts/ext/src/locale/ext-lang-es.js"></script>

</head>
<body
	onunload="if(!!window.opener && !!window.opener.top && !!window.opener.top.frames && !!window.opener.top.frames.gisrefresh)window.opener.top.frames.gisrefresh.closeVisor();">
</body>
</html>
