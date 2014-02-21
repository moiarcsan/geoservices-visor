/* EnvironmentUtils.java
 * 
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
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 */
package interior.cat.visor.utils;

import java.net.URL;

import org.apache.commons.lang.ArrayUtils;
import org.apache.log4j.PropertyConfigurator;

/**
 * Utilities class for separate by environment
 * 
 * @author <a href="mailto:adiaz@emergya.com">Alejandro Diaz Torres</a>
 *
 */
public class EnvironmentUtils {
	
	/**
	 * Environment parameter to obtain at system properties
	 */
	public static final String ENV_PARAMETER = "entorn";
	
	/**
	 * Platform parameter to obtain at system properties
	 */
	public static final String PLATFORM_PARAMETER = "platform";
	
	/**
	 * Empty string
	 */
	public static final String EMPTY = "";
	
	/**
	 * File prefix
	 */
	public static final String FILE = "file:";
	
	/**
	 * Default environment to develop (local)
	 */
	public static final String ENV_LOCAL = "local";
	
	/**
	 * INT environment
	 */
	public static final String ENV_INT = "int";
	
	/**
	 * PRE environment
	 */
	public static final String ENV_PRE = "pre";
	
	/**
	 * PRO environment
	 */
	public static final String ENV_PRO = "pro"; 
	
	/**
	 * PISE platform
	 */
	public static final String PISE = "pise";
	
	/**
	 * DINT platform
	 */
	public static final String DINT = "dint";
	
	/**
	 * DEVEL
	 */
	public static final String DEVEL = "devel";
	
	/**
	 * Array with known environments
	 */
	public static final String[] KNOWN_ENVIRONMENTS= {ENV_LOCAL, ENV_PRE, ENV_PRO, ENV_INT};

	/**
	 * Array with known platforms
	 */
	public static final String[] KNOWN_PLATFORMS= {PISE, DINT, DEVEL};
	
	private static final String LOG4J_ALL = "log4j.properties";
	private static final String WEBINF = "WEB-INF";
	private static final String CONF_DIR = "conf";
	private static final String CONF_YAML_FILE = "config.yaml";
	private static final String CLASSES_DIR = "classes";
	
	/**
	 * Configure log4j environment based 
	 * 
	 * @param environment
	 */
	public static void doLog4jConfiguration(String platform, String environment){
		String urlFile = getConfigPath(platform, environment) + "/" +  LOG4J_ALL;
		System.out.println("url fichero log4j: " + urlFile);
		PropertyConfigurator.configure(getConfigPath(platform, environment) + "/" +  LOG4J_ALL);
	}
	
	/**
	 * Configure configuration path platform and environment based 
	 * 
	 * @param platform
	 * @param environment
	 * 
	 * @return config path by platform ant environment
	 */
	public static String getConfigPath(String platform, String environment){
		
		String configPath =  getWebInfPath() + "/" +  CONF_DIR;
		String knownPlatform = platform != null 
				&& ArrayUtils.contains(KNOWN_PLATFORMS, platform) ? platform: DEVEL;
		String knownEnvironment = environment != null 
				&& ArrayUtils.contains(KNOWN_ENVIRONMENTS, environment) ? environment: DEVEL;
		
		return configPath +  "/" + knownPlatform + "/" +  knownEnvironment;
		
	}
	
	/**
	 * Configure config path platform and environment based
	 * 
	 * @param platform
	 * @param environment
	 * 
	 * @return config.yaml path by environment and platform 
	 */
	public static String getConfigYamlPath(String platform, String environment){
		
		return getConfigPath(platform, environment) + "/" +  CONF_YAML_FILE;
		
	}
	
	/**
	 * Obtain WEB-INF path
	 * 
	 * @return WEB-INF absolute path
	 */
	public static String getWebInfPath(){
		
		URL url = EnvironmentUtils.class.getResource("EnvironmentUtils.class");

		String className = url.getFile();
		
		String webInfPath = className.substring(0,className.indexOf(WEBINF) + WEBINF.length());
			
		if(webInfPath.startsWith(FILE)){
			webInfPath = webInfPath.replace(FILE, EMPTY);
		}

		//System.out.println("DIR --> " + webInfPath + "/" + CLASSES_DIR);

		return webInfPath + "/" + CLASSES_DIR;
	}

}
