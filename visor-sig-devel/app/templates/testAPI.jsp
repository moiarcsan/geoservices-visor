<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 2007 Transitional//EN" >
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="chrome=1">
</head>
	<%
		// Invisible para pre
		if("IS_NOT_DISPLAY".equals("IS_DISPLAY_NONE")){
			out.print("<body><div style=\"display: none;\">");
			out.print("<iframe name=\"gislibrary\" src=\"visorGISLibrary.jsp\" id=\"gislibrary\" ></iframe>");
			out.print("<iframe name=\"sicecat\" src=\"sicecat.jsp\" id=\"sicecat\" ></iframe>");
			out.print("<iframe name=\"sicecatlibrary\" src=\"visorGIS.jsp\" id=\"sicecatlibrary\" ></iframe></div></body>");
		}else if("IS_NOT_DISPLAY".equals("IS_DEVEL")){
	%>
		<frameset frameborder="0" rows="0%,70%,*">
			<frame name="gislibrary" src="visorGISLibrary.jsp" id="gislibrary" />
			<frame name="sicecat" src="sicecat.jsp" id="sicecat" />
			<frame name="sicecatlibrary" src="visorGIS.jsp" id="sicecatlibrary" />
		</frameset>		
	<%
		} //IS_NOT_DISPLAY
	%>

</html>
