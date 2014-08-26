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
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = -5396123030643319193L;
	private File tmpDir;
	private static final Log log = LogFactory.getLog(UploadFile.class);
	public static final String uploadedDirectory = "/uploaded/";

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		try {
			tmpDir = File.createTempFile("upload", "file").getParentFile();
		} catch (IOException e) {
			throw new ServletException(e.toString(), e);
		}
		if (!tmpDir.isDirectory()) {
			throw new ServletException(tmpDir + " is not a directory");
		}

	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		log.debug("Uploading file");
		PrintWriter out = response.getWriter();
		try {
			response.setContentType("text/html");

			DiskFileItemFactory fileItemFactory = new DiskFileItemFactory();
			/*
			 * Set the size threshold, above which content will be stored on
			 * disk.
			 */
			fileItemFactory.setSizeThreshold(100 * 1024 * 1024); // 100 MB
			/*
			 * Set the temporary directory to store the uploaded files of size
			 * above threshold.
			 */
			fileItemFactory.setRepository(tmpDir);

			ServletFileUpload uploadHandler = new ServletFileUpload(
					fileItemFactory);
			// out.print("{ ");
			// out.print("\"paths\": [");
			if (!ServletFileUpload.isMultipartContent(request))
				throw new Exception("No multipart");
			/*
			 * Parse the request
			 */
			@SuppressWarnings("unchecked")
			List<FileItem> items = uploadHandler.parseRequest(request);
			Iterator<FileItem> itr = items.iterator();
			while (itr.hasNext()) {
				FileItem item = itr.next();
				File source = new File(System.getProperty("java.io.tmpdir")
						+ uploadedDirectory);
				if (!source.exists())
					source.mkdir();
				log.trace(item.getName());
				String name = item.getName() != null
						&& !item.getName().equals("") ? item.getName()
						: "tempFile";
				if (!name.equals("tempFile")) {
					log.debug("Saving --> " + name);
					File file = File.createTempFile(name, ".tmp", source);
					item.write(file);
					out.print("{");
					out.print("\"path\": \"" + file.getName() + "\", ");
					out.print("\"name\": \"" + item.getName() + "\"");
					out.print("}");
					log.debug(file.getAbsolutePath());
				} else {
					log.debug("File empty, not saved");
				}
			}
		} catch (FileUploadException ex) {
			log.error("Error encountered while parsing the request", ex);
			out.println("{ \"error\": \"" + ex.toString() + "\"}");
		} catch (IllegalArgumentException ex) {
			log.error("Error encountered while parsing the request", ex);
			out.println("{ \"error_empty\": \"Empty File: " + ex.toString()
					+ "\"}");
		} catch (Throwable ex) {
			log.error("Error encountered while uploading file", ex);
			out.println("{ \"error\": \"" + ex.toString() + "\"}");
		} finally {
			try {
				// out.print("]}");
				log.debug("Closing out: error(" + out.checkError() + ")");
				out.close();
				log.debug("Closed out: error(" + out.checkError() + ")");
			} catch (Throwable t) {
				log.error("Error closing out", t);
			}
		}

	}

}