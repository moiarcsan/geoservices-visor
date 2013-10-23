<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Css imports -->

<link rel="stylesheet" type="text/css" href="css/kickstart/kickstart.css"></link>
<link rel="stylesheet" type="text/css" href="css/kickstart/style.css"></link>
<script type="text/javascript" src="scripts/chromeframe/CFInstall.min.js"></script>
<script>
function getWindowHeight() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}

loadfuncion = function() {
  document.getElementById('container').style.height=getWindowHeight();
}

function installFromGoogle() {
	CFInstall.check({mode:'overlay', node:'prompt' });
}
 
</script>
<style>
     .chromeFrameInstallDefaultStyle {
       width: 650px; /* default is 800px */
       border: 5px solid blue;
       z-index: 2001;
     }
     table {
     	width: auto;
     }
</style>


<title>Chrome Frame</title>
</head>
<body onload="loadfuncion();">

<div id="container" style="overflow:auto;">
 <div id="prompt">
     <!-- if IE without GCF, prompt goes here -->
</div>
<!--
	<table border="0" cellpadding="0" cellspacing="0" width="100%"
		style="border: 1px solid;">
		<tr>
			<td><img src="images/tit_cecat.jpg"></td>
			<td align="right"><img src="images/tit_proteccio.jpg"></td>
			<td align="center"><img src="images/logo_proteccio.gif"></td>
		</tr>
	</table>
	<br />
	<br />
-->
	<div id="wrap" class="clearfix">
	  <div class="col_12">
	  <div class="col_12">
	    <div class="col_9">
		<img src="images/tit_cecat.jpg">
	    </div>
	    <div class="col_2">
		<img src="images/tit_proteccio.jpg">
	    </div>
	    <div class="col_1">
		<img src="images/logo_proteccio.gif">
	    </div>
	  </div>

	    <div class="col_12">
		<p>Se ha detectado que está intentando acceder al Visor SIG con el
		navegador Internet Explorer. Para la correcta visualización de la
		aplicación debe instalar el plugin que podrá descargarse en <a href="media/GoogleChromeframeStandaloneEnterprise.msi">este
		enlace</a>. Almacene el instalador en un lugar que pueda recordar y 
		siga las instrucciones indicadas abajo.</p>
		<p>En el caso de que usted no disponga de permisos de administraci&oacute;n del equipo, 
		puede instalar una versi&oacute;n de Chrome Frame  que no necesita que el usuario sea administrador 
		pulsando <a href="#" onclick="installFromGoogle();">aqu&iacute;</a>.</p>

		<ul>

		<li>Haga doble clic sobre el arhivo <i>GoogleChromeframeSandaloneEnterprise.msi</i> que ha descargado. 
			Si se le pregunta si desea ejecutar el archivo seleccione "Ejecutar".
		<img class="center" alt="Pulse Ejecutar para iniciar la instalación de Chrome Frame" src="images/InstallChromeFrame1.png"
		   width="414" height="310"></li>

		<li>Espere a que concluya el proceso de instalación.
		<img class="center" alt="Espere a que concluya el proceso de instalación" src="images/InstallChromeFrame2.png"
		   width="456" height="158">
		</li>
		<li>Pulse cerrar para finalizar la instalación.
		<img class="center" alt="Pulse cerrar para finalizar la instalación" src="images/InstallChromeFrame3.png"
		  width="456" height="158">
		</li>
		
		<li>Una vez finalizada la instalación, cierre todas las ventanas del navegador y vuelva a acceder a la aplicación.
		</li>
		
	    </div>
	  </div>
	</div>
</body>
</div>
</html>