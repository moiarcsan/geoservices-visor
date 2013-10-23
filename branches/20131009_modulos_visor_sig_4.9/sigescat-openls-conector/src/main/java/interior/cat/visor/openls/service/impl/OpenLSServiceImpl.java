/* SearcherServiceImpl.java
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
package interior.cat.visor.conectors.openls.service.impl;

import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import javax.annotation.Resource;
import javax.xml.bind.JAXBElement;

import net.opengis.xls.v_1_2_0.GeocodeResponseType;
import net.opengis.xls.v_1_2_0.PositionType;
import net.opengis.xls.v_1_2_0.ResponseType;
import net.opengis.xls.v_1_2_0.ReverseGeocodePreferenceType;
import net.opengis.xls.v_1_2_0.ReverseGeocodeResponseType;
import net.opengis.xls.v_1_2_0.XLSType;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.oxm.Unmarshaller;
import org.springframework.stereotype.Repository;
import org.springframework.xml.transform.StringSource;

import com.googlecode.ehcache.annotations.Cacheable;

import interior.cat.visor.conectors.openls.service.OpenLSService;
import interior.cat.visor.conectors.openls.utils.HTTPRequestPoster;

/**
 * Implementacion de conector de SearcherService
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 */
@Repository(value="openlsServiceConector")
public class OpenLSServiceImpl implements OpenLSService {
	
	private static Log LOG = LogFactory
			.getLog(OpenLSServiceImpl.class);
	
	@Resource(name = "openLSEndpoint")
	private String openLSEndpoint;
	
	//@Resource(name="oxmMarshaller")
	//private Marshaller marshaler;
	
	@Resource(name="oxmMarshaller")
	private Unmarshaller unmarshaler;

	/**
	 * Obtiene los resultados de la busqueda parametrizada
	 * 
	 * @param query cadena de texto con la consulta
	 * @param maxiumResponses si es null por defecto devuelve un maximo de 10
	 * @param locale por defecto 'ES'
	 * 
	 * @return resultado de la busqueda
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Cacheable(cacheName = "geocode")
	public GeocodeResponseType geocode(String query, Long maxiumResponses, String locale) {
		
		GeocodeResponseType respObj = null;
		String response = null;
		
		//TODO: Manejar desde obj factory 
//		ObjectFactory fact = new ObjectFactory();
//		XLSType xls_req = fact.createXLSType();
//		
//		GeocodeRequestType request = ...
//		xls_req.append(locator)
		
		
		String xls = "<XLS xsi:schemaLocation=\"http://www.opengis.net/xls\" "
				+ "version=\"1.2.0\" xmlns=\"http://www.opengis.net/xls\" "
				+ "xmlns:gml=\"http://www.opengis.net/gml\" "
				+ "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
				+ "<Request methodName=\"Geocode\" requestID=\"123\" "
				+ "version=\"1.2.0\" maximumResponses=\""
				+ ((maxiumResponses != null) ? maxiumResponses.toString()
						: "10")
				+ "\">"
				+ "<GeocodeRequest><Address "
				+ "countryCode=\""
				+ ((locale != null) ? locale : "ES")
				+ "\"><FreeFormAddress>"
				+ query
				+ "</FreeFormAddress></Address></GeocodeRequest></Request></XLS>";

		Reader reader = new StringReader(xls);
		Writer writer = new StringWriter();

		try {
			HTTPRequestPoster.postData(reader, new URL(openLSEndpoint), writer);
		} catch (MalformedURLException e) {
			LOG.error(e);
		} catch (Exception e) {
			LOG.error(e);
		}

		try {
			response = writer.toString();
			JAXBElement<XLSType> obj = (JAXBElement<XLSType>) unmarshaler
					.unmarshal(new StringSource(response));
			respObj = (GeocodeResponseType) (((ResponseType) (((JAXBElement) ((List) obj
					.getValue().getBody()).get(0)).getValue()))
					.getResponseParameters().getValue());
			LOG.debug(respObj);
		} catch (Exception e) {
			LOG.error(e);
		}

		return respObj;
	}

	@Cacheable(cacheName = "reverseGeocode")
	public ReverseGeocodeResponseType reverseGeocode(PositionType position,
			List<ReverseGeocodePreferenceType> reverseGeocodePreference) {
		//return openlsWS.reverseGeocode(position, reverseGeocodePreference);
		return null;
	}

}
