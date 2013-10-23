package interior.cat.visor.servlet;

/*
 * Copyright (C) 2011
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
 */

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sun.xml.messaging.saaj.util.Base64;

public class DownloadWMS extends HttpServlet {
	private static final long serialVersionUID = 7418795331167207689L;
	private static Log log = LogFactory.getLog(DownloadWMS.class);

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, FileNotFoundException {

		OutputStream os = response.getOutputStream();
		try {
			response.setContentType("text/xml");

			StringBuffer requestURL = request.getRequestURL();
			String encodedURL = requestURL.substring(requestURL
					.lastIndexOf("/") + 1);
			log.debug("Searching for (encoded): " + encodedURL);

			String url = Base64.base64Decode(encodedURL);
			log.debug("Searching for (decoded): " + url);

			// Añade a la URL los parámetros por defecto, sólo si no tenía
			// ninguno
			if (url.indexOf("?") == -1 || url.indexOf("?") == url.length() - 1) {
				url = url.replace("?", "")
						+ "?REQUEST=GetCapabilities&SERVICE=WMS";
				log.debug("URL a consultar: " + url);
			}

			URL urlObj = new URL(url);

			InputStream is = (InputStream) urlObj.getContent();

			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = is.read(bytes)) != -1) {
				os.write(bytes, 0, read);
			}
			is.close();
		} catch (Throwable t) {
			log.error("Error en DownloadWMS servlet", t);
		} finally {
			os.flush();
			os.close();
		}
	}

}
