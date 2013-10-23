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
 * Authors: María Arias de Reyna Domínguez (mailto:marias@emergya.com)
 */
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Download extends HttpServlet {

	private static final long serialVersionUID = 1082734618273461L;
	private static Log log = LogFactory.getLog(Download.class);

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
			response.setContentType("application/vnd.google-earth.kml+xml");

			StringBuffer requestURL = request.getRequestURL();
			String filePath = URLDecoder.decode(
					requestURL.substring(requestURL.lastIndexOf("/")), "UTF-8");
			;
			log.trace("Searching for: " + filePath);
			String fileName = System.getProperty("java.io.tmpdir")
					+ UploadFile.uploadedDirectory + filePath;
			log.trace("Opening: " + fileName);

			File file = new File(fileName);
			FileInputStream is = new FileInputStream(file);

			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = is.read(bytes)) != -1) {
				os.write(bytes, 0, read);
			}
			// file.delete();
		} catch (Throwable t) {
			log.error("Error in DownloadServlet", t);
		} finally {
			os.flush();
			os.close();
		}
	}
}