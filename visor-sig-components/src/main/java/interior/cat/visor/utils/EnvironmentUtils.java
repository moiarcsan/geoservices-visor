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
	
	private static final String LOG4J_LOCAL = "log4j.local.properties";
	private static final String LOG4J_INT = "log4j.int.properties";
	private static final String LOG4J_PRE = "log4j.pre.properties";
	private static final String LOG4J_PRO = "log4j.pro.properties";
	private static final String WEBINF = "WEB-INF";
	private static final String CONF_DIR = "conf";
	private static final String CONF_YAML_FILE = "config";
	private static final String CLASSES_DIR = "classes";
	
	/**
	 * Configure log4j environment based 
	 * 
	 * @param environment
	 */
	public static void doLog4jConfiguration(String environment){
		
		if(ENV_PRO.equals(environment)){
			PropertyConfigurator.configure(getWebInfPath() + "/" + CLASSES_DIR + "/" + LOG4J_PRO);
		}else if(ENV_PRE.equals(environment)){
			PropertyConfigurator.configure(getWebInfPath() + "/" + CLASSES_DIR + "/" + LOG4J_PRE);
		}else if(ENV_INT.equals(environment)){
			PropertyConfigurator.configure(getWebInfPath() + "/" + CLASSES_DIR + "/" + LOG4J_INT);
		}else{
			PropertyConfigurator.configure(getWebInfPath() + "/" + CLASSES_DIR + "/" + LOG4J_LOCAL);
		}
		
	}
	
	/**
	 * Configure config path environment based 
	 * 
	 * @param environment
	 * 
	 * @return config path by environment
	 */
	public static String getConfigPath(String environment){
		
		String configPath =  getWebInfPath() + "/" +  CONF_DIR;
		
		//By environment
		if(ENV_PRO.equals(environment)){
			configPath +=  "/" +  ENV_PRO;
		}else if(ENV_PRE.equals(environment)){
			configPath +=  "/" +  ENV_PRE;
		}else if(ENV_INT.equals(environment)){
			configPath +=  "/" +  ENV_INT;
		}else{
			configPath +=  "/" +  ENV_LOCAL;
		}
		
		return configPath;
		
	}
	
	/**
	 * Configure config path environment based 
	 * 
	 * @param environment
	 * 
	 * @return config.yaml path by environment 
	 */
	public static String getConfigYamlPath(String environment){
		
		return getConfigPath(environment) + "/" +  CONF_YAML_FILE;
		
	}
	
	/**
	 * Obtain WEB-INF path
	 * 
	 * @return WEB-INF absolute path
	 */
	public static String getWebInfPath(){
		
		URL url = EnvironmentUtils.class.getResource("EnvironmentUtils.class");

		String className = url.getFile();

		return className.substring(0,className.indexOf(WEBINF) + WEBINF.length());
	}

}
