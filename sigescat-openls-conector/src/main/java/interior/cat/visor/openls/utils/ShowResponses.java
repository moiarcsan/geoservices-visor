/* 
 * ShowResponses.java
 * 
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
 * Authors:: Alejandro Díaz Torres (mailto:adiaz@emergya.com)
 */
package interior.cat.visor.conectors.openls.utils;

import net.opengis.xls.v_1_2_0.GeocodeResponseListType;
import net.opengis.xls.v_1_2_0.GeocodeResponseType;
import net.opengis.xls.v_1_2_0.GeocodedAddressType;

import org.apache.commons.logging.Log;


/**
 * Util class to show messages in Log
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 *
 */
public class ShowResponses {
	
	/**
	 * Show result hits for GeocodeResponseType
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param LOG
	 */
	public static void muestraInfo(GeocodeResponseType res, boolean showAttributes, String function, Log LOG){
		if(res.getGeocodeResponseList() != null){
			LOG.info(function + ": Hits --> " + res.getGeocodeResponseList().size());
			if(showAttributes){
				for(GeocodeResponseListType item: res.getGeocodeResponseList()){
					muestraInfo(item, showAttributes, function, LOG);
				}
			}
		}else{
			LOG.info("No hay resultados");
		}
	}
	
	/**
	 * Show result hits for GeocodeResponseListType
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param LOG
	 */
	public static void muestraInfo(GeocodeResponseListType res, boolean showAttributes, String function, Log LOG){
		if(res != null){
			LOG.info(function + ": Address --> " + res.getNumberOfGeocodedAddresses());
			if(showAttributes){
				for(GeocodedAddressType adress:res.getGeocodedAddress()){
					muestraInfo(adress, showAttributes, function, LOG);
				}
			}
		}else{
			LOG.info("No hay resultados");
		}
	}
	
	/**
	 * Show result hits for GeocodedAddressType
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param LOG
	 */
	public static void muestraInfo(GeocodedAddressType res,
			boolean showAttributes, String function, Log LOG) {
		if(res != null){
			LOG.info(function + ": Addres --> " + res.getAddress());
			if(showAttributes){
				LOG.info(function + ": Addressee --> " + res.getAddress().getAddressee());
				LOG.info(function + ": Coord --> " + res.getPoint().getCoord());
			}
		}else{
			LOG.info("No hay resultados");
		}
	}

}
