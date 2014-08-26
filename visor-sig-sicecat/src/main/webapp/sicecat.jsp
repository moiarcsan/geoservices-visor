<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 2007 Transitional//EN" > 
<html>

	<head>
		<meta http-equiv="content-type" content="text/html;UTF-8">
		<title>SICECAT II</title>
	</head>

	<body>

	<%
		// Invisible para pre
		if("IS_NOT_DISPLAY".equals("IS_NOT_DISPLAY")){
		//NADA
		}else { //IS_DISPLAY_NONE | IS_DEVEL
	%>
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid;">
			<tr>
				<td><img src="images/tit_cecat.jpg"></td>
				<td align="right"><img src="images/tit_proteccio.jpg"></td>
				<td align="center"><img src="images/logo_proteccio.gif"></td>
			</tr>
		</table>
		<br/><br/>
		<table border="0" width="80%">
			<tr>
				<td width="40px"></td>
				<td>
					<table border="0" style="border: 1px solid" width="100%">
						<tr>
							<td>Mensajes SICECAT al visor GIS</td>
							<td align="center"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Definir un punto en el visor GIS</td></tr></table>
											<table border="0">
												<tr><td>Tipo ('SICECAT' | 'GPCL') :</td><td><input id="Tipo" type="text" value="GPCL"/></td></tr>
												<tr><td>Usuario :</td><td><input id="Usuario" type="text" value="Tecnic"/></td></tr>
												<tr><td>Permisos :</td><td><input id="Permisos" type="text" value="readOnly"/></td></tr>
												<tr><td>Idioma ('es' | 'en' | 'ca') :</td><td><input id="Idioma" type="text" value="es"/></td></tr>
												<tr><td>ID de Comarca :</td><td><input id="IdComarca" type="text" value=""/></td></tr>
												<tr><td>ID de Municipio (INE_NUM) :</td><td><input id="IdMunicipio" type="text" value="80193"/></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Abrir Visor GIS" onclick="top.frames.gislibrary.init(document.getElementById('Usuario'), document.getElementById('Permisos'), document.getElementById('Idioma'), document.getElementById('Tipo'),document.getElementById('IdComarca'),document.getElementById('IdMunicipio'))" style="cursor:hand;"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Definir un punto en el visor GIS</td></tr></table>
											<table border="0">
												<tr><td>Nombre :</td><td><input id="NameElement" type="text" value="Prueba1"/></td></tr>
												<tr><td>Descripcion :</td><td><input id="DescriptionElement" type="text" value="Descripcion Prueba1"/></td></tr>
												<tr><td>Tipo :</td><td><input id="TypeElement" type="text" value="Municipi"/></td></tr>
												<tr><td>Id :</td><td><input id="IdElement" type="text" value="80193"/></td></tr>
												<tr><td>Capa :</td><td><input id="CapaElement" type="text" value="Auxiliar"/></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Definir municipio/comarca en el Mapa" onclick="top.frames.gislibrary.setMunicipiComarcaInViewer(document.getElementById('IdElement'), document.getElementById('TypeElement'), document.getElementById('NameElement'), document.getElementById('DescriptionElement'), document.getElementById('CapaElement'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Definir un conjunto de puntos en el visor GIS</td></tr></table>
											<table border="0">
												<tr><td colspan="2">Primer punto</td></tr>
												<tr><td>Coordenada X :</td><td><input id="point1X" type="text" value="429675"/></td></tr>
												<tr><td>Coordenada Y :</td><td><input id="point1Y" type="text" value="4583400"/></td></tr>
											</table>
											<table border="0">
												<tr><td colspan="2">Segundo punto</td></tr>
												<tr><td>Coordenada X :</td><td><input id="point2X" type="text" value="325900"/></td></tr>
												<tr><td>Coordenada Y :</td><td><input id="point2Y" type="text" value="4722100"/></td></tr>
											</table>
											<table border="0">
												<tr><td colspan="2">Tercer punto</td></tr>
												<tr><td>Coordenada X :</td><td><input id="point3X" type="text" value="485900"/></td></tr>
												<tr><td>Coordenada Y :</td><td><input id="point3Y" type="text" value="4681800"/></td></tr>
											</table>
											<table border="0">
												<tr><td>Projection :</td><td><input id="projection" type="text" value="EPSG:23031"/></td></tr>
												<tr><td>Style :</td><td><input id="style" type="text" value="emergency"/></td></tr>
											</table>
											<table border="0" width="100%">
												<tr><td align="right"><input type="button" value="Definir conjunto de puntos en el Mapa" onclick="top.frames.gislibrary.setGroupOfPointsInViewer(document.getElementById('point1X'),document.getElementById('point1Y'),document.getElementById('point2X'),document.getElementById('point2Y'),document.getElementById('point3X'),document.getElementById('point3Y'), document.getElementById('projection'), document.getElementById('style'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Centrar un(os) elemento(s) en el visor GIS (separados por ',')</td></tr></table>
											<table border="0">
												<tr><td>Identificador(es) :</td><td><input id="idfocus" type="text" value="21,22,23"/></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Centrar elementos" onclick="top.frames.gislibrary.focusPoints(document.getElementById('idfocus'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Eliminar un elemento en el visor GIS</td></tr></table>
											<table border="0">
												<tr><td>Identificador :</td><td><input id="idremove" type="text" /></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Eliminar un elemento" onclick="top.frames.gislibrary.removePoint(document.getElementById('idremove').value)"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Eliminar un conjunto de elementos en el visor GIS</td></tr></table>
											<table border="0" width="100%">
												<tr><td>Identificador (1):</td><td><input id="id1" type="text" /></td></tr>
												<tr><td>Identificador (2):</td><td><input id="id2" type="text" /></td></tr>
												<tr><td>Identificador (3):</td><td><input id="id3" type="text" /></td></tr>
												<tr><td>Identificador (4):</td><td><input id="id4" type="text" /></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Eliminar conjunto de elementos" onclick="top.frames.gislibrary.removeGroupOfPoints(document.getElementById('id1'),document.getElementById('id2'),document.getElementById('id3'),document.getElementById('id4'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Crear una nueva capa en el visor GIS</td></tr></table>
											<table border="0" width="100%">
												<tr><td>Identificador (1):</td><td><input id="idCapa1" type="text" /></td></tr>
												<tr><td>Nombre de la capa:</td><td><input id="nameCapa1" type="text" /></td></tr>
												<tr><td>Orden:</td><td><input id="ordenCapa1" type="text" value="100"/></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Crear capa" onclick="top.frames.gislibrary.msGisCreateCapa(document.getElementById('idCapa1'),document.getElementById('nameCapa1'), document.getElementById('ordenCapa1'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Elimina una capa del visor GIS</td></tr></table>
											<table border="0" width="100%">
												<tr><td>Identificador Capa:</td><td><input id="idCapa2" type="text" /></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Eliminar capa" onclick="top.frames.gislibrary.msGisRemoveCapa(document.getElementById('idCapa2'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Renombrar todas las capas (id: nuevo nombre)</td></tr></table>
											<table border="0" width="100%">
												<tr><td>Capas a renombrar</td><td><input id="CapasToRename" type="text" value="101:Puntos,102:Lineas,103:Poligonos"/></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Renombrar capas" onclick="top.frames.gislibrary.msGisRenameAllLayers(document.getElementById('CapasToRename').value)"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Selección por zona</td></tr></table>
											<table border="0" width="100%">
												<tr><td colspan="2" align="right"><input type="button" value="Localizar recursos" onclick="top.frames.gislibrary.msGisActiveSelectZone()"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>
			<!--<tr>
				<td width="40px"></td>
				<td>
					<table width="100%">
						<tr>
							<td width="100px"></td>
							<td>
								<table border="0" style="border: 1px solid" cellpadding="0" cellspacing="0">
									<tr>
										<td colspan="2" align="center">
											<table border="0" width="100%"><tr><td style="border-bottom: 1px solid;">Adjunta un GML a un incidente</td></tr></table>
											<table border="0" width="100%">
												<tr><td>Identificador incidente:</td><td><input id="idIncidenteGML" type="text" /></td></tr>
												<tr><td>URL GML:</td><td><input id="URLGML" type="text" /></td></tr>
												<tr><td>Nombre Capa:</td><td><input id="nombreCapaGML" type="text" /></td></tr>
												<tr><td colspan="2" align="right"><input type="button" value="Crear capa" onclick="top.frames.gislibrary.msGisDrawGML(document.getElementById('idIncidenteGML'),document.getElementById('URLGML'),document.getElementById('nombreCapaGML'))"></input></td></tr>
											</table>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="40px"></td>
			</tr>-->
		</table>
	<%
		} 
	%>		
	</body>
</html>
