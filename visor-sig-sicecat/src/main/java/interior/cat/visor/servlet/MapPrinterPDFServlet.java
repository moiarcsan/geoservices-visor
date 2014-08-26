/**
 * Copyright (C) 2012
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
package interior.cat.visor.servlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.mapfish.print.MapPrinter;
import org.mapfish.print.output.OutputFactory;
import org.mapfish.print.output.OutputFormat;
import org.mapfish.print.utils.PJsonObject;

import com.lowagie.text.DocumentException;

/**
 * Modificacion de MapPrinterServlet para leer la configuracion del fichero config.yaml correctamente
 * 
 * @see <a
 *      href="https://github.com/alediator/mapfish-print/blob/master/src/main/java/org/mapfish/print/servlet/MapPrinterServlet.java">MapPrinterServlet.java</a>
 * 
 * @author <a href="mailto:adiaz@emergya.com">Alejandro Diaz Torres</a>
 * 
 */
public class MapPrinterPDFServlet extends MapPrinterServletMod {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 7569430357187204968L;

	protected static final String TEMP_FILE_PREFIX = "map-image";
	private static final String TEMP_FILE_SUFFIX = ".printout";
	protected static final Logger LOGGER = Logger
			.getLogger(MapPrinterPDFServlet.class);
	

	/**
     * Create the PDF and returns to the client (in JSON) the URL to get the PDF.
     * 
     * Fixes #63565 reading configpath as app (adiaz)
     */
	protected TempFile doCreatePDFFile(String spec,
			HttpServletRequest httpServletRequest) throws IOException,
			DocumentException, ServletException {
		if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Generating PDF for spec=" + spec);
        }

		String app;
        PJsonObject specJson = MapPrinter.parseSpec(spec);
        if (specJson.has("app")) {
        	app = specJson.getString("app");
        } else {
        	// adiaz: Fixes #63565 reading configpath as app
        	String configPath = getInitParameter("config");
			if (configPath.endsWith(".yaml")){
				configPath = configPath.substring(0, configPath.length() - 5);
			}
			LOGGER.trace("config path: " + configPath);
        	app = configPath;
        }

        String referer = httpServletRequest.getHeader("Referer");

        final OutputFormat outputFormat = OutputFactory.create(getMapPrinter(app).getConfig(),specJson);
        //create a temporary file that will contain the PDF
        final File tempJavaFile = File.createTempFile(TEMP_FILE_PREFIX, TEMP_FILE_PREFIX + "."+outputFormat.fileSuffix()+TEMP_FILE_SUFFIX, getTempDir());
        TempFile tempFile = new TempFile(tempJavaFile, specJson, outputFormat);

        FileOutputStream out = null;
        try {
            out = new FileOutputStream(tempFile);

            outputFormat.print(getMapPrinter(app), specJson, out, referer);

            return tempFile;
        } catch (IOException e) {
            deleteFile(tempFile);
            throw e;
        } catch (DocumentException e) {
            deleteFile(tempFile);
            throw e;
        } catch (ServletException e) {
            deleteFile(tempFile);
            throw e;
        } finally {
            if (out != null)
                out.close();
        }
	}
	
}
