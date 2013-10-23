/**
 * Copyright (C) 2013
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

import interior.cat.visor.utils.EnvironmentUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.mapfish.print.MapPrinter;
import org.mapfish.print.servlet.MapPrinterServlet;

/**
 * Modificacion de MapPrinterServlet cambiar las urls por .do
 * 
 * @see <a
 *      href="https://github.com/alediator/mapfish-print/blob/master/src/main/java/org/mapfish/print/servlet/MapPrinterServlet.java">MapPrinterServlet.java</a>
 * 
 * @author <a href="mailto:adiaz@emergya.com">Alejandro Diaz Torres</a>
 * 
 */
public class MapPrinterServletMod extends MapPrinterServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	// urls sobreescritas
    protected static final String INFO_URL = "/info.json.do";
    protected static final String PRINT_URL = "/print.pdf.do";
    protected static final String CREATE_URL = "/create.json.do";
    
    // otras propiedades
	protected static final String CONTEXT_TEMPDIR = "javax.servlet.context.tempdir";
    protected static final String TEMP_FILE_PREFIX = "mapfish-print";
    protected static final String TEMP_FILE_SUFFIX = ".printout";

	// doGet override
    protected void doGet(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException {
        //do the routing in function of the actual URL
        final String additionalPath = httpServletRequest.getPathInfo();
        if (additionalPath.equals(PRINT_URL)) {
            createAndGetPDF(httpServletRequest, httpServletResponse);
        } else if (additionalPath.equals(INFO_URL)) {
            getInfo(httpServletRequest, httpServletResponse, getBaseUrl(httpServletRequest));
        } else if (additionalPath.startsWith("/") && additionalPath.endsWith(TEMP_FILE_SUFFIX)) {
            getFile(httpServletRequest, httpServletResponse, additionalPath.substring(1, additionalPath.length() - TEMP_FILE_SUFFIX.length()));
        } else {
            error(httpServletResponse, "Unknown method: " + additionalPath, 404);
        }
    }

    // doPost override
    protected void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException {
        final String additionalPath = httpServletRequest.getPathInfo();
        if (additionalPath.equals(CREATE_URL)) {
            createPDF(httpServletRequest, httpServletResponse, getBaseUrl(httpServletRequest));
        } else {
            error(httpServletResponse, "Unknown method: " + additionalPath, 404);
        }
    }
    
    /*
     * From BaseMapServlet
     * @see https://github.com/alediator/mapfish-print/blob/master/src/main/java/org/mapfish/print/servlet/BaseMapServlet.java
     * Overwrited with runtime parameters: #71474 
     */
    public static final Logger LOGGER = Logger.getLogger(MapPrinterServletMod.class);
    private MapPrinter printer = null;
    private Map<String, MapPrinter> printers = null;
    private long lastModified = 0L;
    private long defaultLastModified = 0L;
    private Map<String,Long> lastModifieds = null;
    /**
     * Builds a MapPrinter instance out of the file pointed by the servlet's
     * configuration. The location can be configured in two locations:
     * <ul>
     * <li>web-app/servlet/init-param[param-name=config] (top priority)
     * <li>web-app/context-param[param-name=config] (used only if the servlet has no config)
     * </ul>
     * <p/>
     * If the location is a relative path, it's taken from the servlet's root directory.
     */
    protected synchronized MapPrinter getMapPrinter(String app) throws ServletException {
    	/*
    	 * This function is the default function to load config.yaml from WEB-INF.
    	 * @see https://github.com/alediator/mapfish-print/blob/master/src/main/java/org/mapfish/print/servlet/BaseMapServlet.java
    	 * 
    	 * Overwritde with runtime parameters (platform, entorn): #71474
    	 */ 
        //String configPath = getInitParameter("config");
    	String platform = System.getProperty(EnvironmentUtils.PLATFORM_PARAMETER);
		String environment = System.getProperty(EnvironmentUtils.ENV_PARAMETER);
		String configPath = EnvironmentUtils.getConfigYamlPath(platform, environment);
        if (configPath == null) {
            //throw new ServletException("Missing configuration in web.xml 'web-app/servlet/init-param[param-name=config]' or 'web-app/context-param[param-name=config]'");
        	throw new ServletException("No se encuentra el config.yaml. Compruebe los parametros -Dentorn y -Dplatform");
        }
        //String debugPath = "";

        File configFile = null;
        if (app != null) {
        	if (lastModifieds == null) {
        		lastModifieds = new HashMap<String, Long>();
        		//debugPath += "new HashMap\n";
        	}
    		if (printers instanceof HashMap &&  printers.containsKey(app)) {
    			printer = printers.get(app);
    			//debugPath += "get printer from hashmap\n";
    		} else {
    			printer = null;
    			//debugPath += "printer = null 1\n";
    		}
       		// Load only one file with with runtime parameters (platform, entorn): #71474
    		// configFile = new File(app +".yaml");
       		configFile = new File(configPath);
        } else {
        	configFile = new File(configPath);
        	//debugPath += "configFile = new ..., 1\n";
        }
        if (!configFile.isAbsolute()) {
        	if (app != null) {
        		//debugPath += "config is absolute app = "+app+"\n";
        		configFile = new File(getServletContext().getRealPath(app +".yaml"));
        	} else {
        		configFile = new File(getServletContext().getRealPath(configPath));
        		//debugPath += "config is absolute app DEFAULT\n";
        	}
        }
        if (app != null) {
        	if (lastModifieds instanceof HashMap && lastModifieds.containsKey(app)) {
        		lastModified = lastModifieds.get(app);
        		//debugPath += "app = "+app+" lastModifieds has key and gotten: "+ lastModified +"\n";
        	} else {
        		lastModified = 0L;
        		//debugPath += "app = "+app+" lastModifieds has NOT key and gotten: "+ lastModified +" (0L)\n";
        	}
        } else {
        	lastModified = defaultLastModified; // this is a fix for when configuration files have changed
        	//debugPath += "app = NULL lastModifieds from defaultLastModified: "+ lastModified +"\n";
        }

        if (printer != null && configFile.lastModified() != lastModified) {
            //file modified, reload it
            LOGGER.info("Configuration file modified. Reloading...");
            try {
            	printer.stop();
            	
            	//debugPath += "printer stopped, setting NULL\n";
            } catch (NullPointerException npe) {
            	LOGGER.info("BaseMapServlet.java: printer was not stopped. This happens when a switch between applications happens.\n"+ npe);
            }
            
            printer = null;
            if (app != null) {
            	LOGGER.info("Printer for "+ app +" stopped");
            	printers.put(app, null);
            }
        }

        if (printer == null) {
            lastModified = configFile.lastModified();
            //debugPath += "printer == null, lastModified from configFile = "+lastModified+"\n";
            try {
                LOGGER.info("Loading configuration file: " + configFile.getAbsolutePath());
                printer = new MapPrinter(configFile);
                if (app != null) {
                	if (printers == null) {
                		printers = new HashMap<String, MapPrinter>();
                		//debugPath += "printers = new HashMap , printer == null, app = "+app+"\n";
                	}
                	printers.put(app, printer);
                	lastModifieds.put(app, lastModified);
                	//debugPath += "putting app = "+app+" HashMaps: printer and lastModified: "+lastModified+"\n";
                } else {
                	defaultLastModified = lastModified; // need this for default application
                	//debugPath += "defaultLastModified = "+defaultLastModified+" 123\n";
                }
            } catch (FileNotFoundException e) {
                throw new ServletException("Cannot read configuration file: " + configPath, e);
            }
        }
        
        return printer;
    }
    // EoF #71474 task 
	
}
