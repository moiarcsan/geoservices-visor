/* 
 * RestSearcherServiceController.java
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
package interior.cat.visor.web;

import javax.annotation.Resource;

import net.opengis.xls.v_1_2_0.GeocodeResponseType;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sitep.sigem.server.services.Response;
import com.sitep.sigem.server.services.RoadResponse;
import com.sitep.sigem.server.services.SolrResponse;

import interior.cat.visor.openls.service.OpenLSService;
import interior.cat.visor.conectors.searcher.service.SearcherService;
import interior.cat.visor.conectors.searcher.utils.ShowResponses;

/**
 * Rest API to interact with searcher service
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 */
@Controller
public class RestSearcherServiceController {

	/** Mark a String as null */
	private static final String NULL_VALUE = "NULL_VALUE";

	private static Log LOG = LogFactory
			.getLog(RestSearcherServiceController.class);

	@Resource(name = "openlsServiceConector")
	private OpenLSService openlsServiceConector;

	@Resource(name = "searcherServiceConector")
	private SearcherService searcherService;
	
	private static final int DEFAULT_START = 0;
	private static final int DEFAULT_END = 100;
	
	private static final String DEFAULT_ENTITATS = "pb,pe,pl,pm," +
			"psa,pse,t,ra,rl,rp,a,ab,ae,ap,aps,b,c,c112,pn,po,rpo,s1," +
			"s5,sc,soc,sp,sv,tf,tt,vu,x,ca,cd,co,d,db,e,ef,ei,en,f,fo,g," +
			"h,i,ir,k,lf,np,nv,p,pi,plo,tf,tt,vu,x,y,z,z1,z3,zt,svm,z," +
			"z1,z3,zt,y";

	/**
	 * Rest query for cercaSolrGeneral method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/cercaSolrGeneral/{query}")
	public @ResponseBody
	SolrResponse cercaSolrGeneral(@PathVariable("query") String query) {
		LOG.trace("Entro en cercaSolrGeneral");
		SolrResponse solrResponse = null;
		try {
			solrResponse = searcherService.cercaSolrGeneral(query);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			interior.cat.visor.conectors.searcher.utils.ShowResponses.muestraInfo(
					solrResponse, true, "cercaSolrGeneral", LOG);
		}

		return solrResponse;
	}

	/**
	 * Rest query for cercaSolrParametritzada method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/cercaSolrParametritzada/{query}/{entitats}/{filaInicial}/{filaFinal}")
	public @ResponseBody
	SolrResponse cercaSolrParametritzada(@PathVariable("query") String query,
			@PathVariable("entitats") String entitats,
			@PathVariable("filaInicial") Integer filaInicial,
			@PathVariable("filaFinal") Integer filaFinal) {
		LOG.trace("Entro en cercaSolrParametritzada");
		SolrResponse solrResponse = null;
		try {
			solrResponse = searcherService.cercaSolrParametritzada(
					query.equals(NULL_VALUE) ? "" : query,
					entitats.equals(NULL_VALUE) ? "" : entitats, filaInicial,
					filaFinal);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			interior.cat.visor.conectors.searcher.utils.ShowResponses.muestraInfo(
					solrResponse, true, "cercaSolrParametritzada", LOG);
		}

		return solrResponse;
	}

	/**
	 * Rest query for cercaSolrGeneral method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/cercaCarreteres/{query}")
	public @ResponseBody
	RoadResponse cercaCarreteres(@PathVariable("query") String query) {
		LOG.trace("Entro en cercaCarreteres");
		RoadResponse roadResponse = null;
		try {
			roadResponse = searcherService.cercaCarreteres(query);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			interior.cat.visor.conectors.searcher.utils.ShowResponses.muestraInfo(
					roadResponse, true, "cercaCarreteres", LOG);
		}

		return roadResponse;
	}

	/**
	 * Rest query for cercaSolrParametritzada method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/cerca/{query}")
	public @ResponseBody
	Response cerca(@PathVariable("query") String query) {
		LOG.trace("Entro en cerca (query)");
		Response response = null;
		try {
			response = searcherService.cerca(query.equals(NULL_VALUE) ? ""
					: query, "", DEFAULT_START, DEFAULT_END);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			ShowResponses.muestraInfo(response, true, "cerca", LOG);
		}

		return response;
	}

	/**
	 * Rest query for cercaSolrParametritzada method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/cerca/{query}/{entitats}/{filaInicial}/{filaFinal}")
	public @ResponseBody
	Response cercaP(@PathVariable("query") String query,
			@PathVariable("entitats") String entitats,
			@PathVariable("filaInicial") String filaInicial,
			@PathVariable("filaFinal") String filaFinal) {
		LOG.trace("Entro en cerca (parametrizada)");
		Response response = null;
		try {
			int start = getIntValue(filaInicial, DEFAULT_START);
			int end = getIntValue(filaFinal, DEFAULT_END);
			
			response = searcherService.cerca(query.equals(NULL_VALUE) ? ""
					: query, entitats.equals(NULL_VALUE) ? "" : entitats,
					start, end);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			ShowResponses.muestraInfo(response, true, "cerca", LOG);
		}

		return response;
	}

	/**
	 * Rest query for cercaSolrParametritzada method
	 * 
	 * @param query
	 * 
	 * @return SolrResponse
	 */
	@RequestMapping(value = "/geocode/{query}")
	public @ResponseBody
	GeocodeResponseType geocode(@PathVariable("query") String query) {
		LOG.trace("Entro en geocode");
		GeocodeResponseType response = null;

		try {
			response = openlsServiceConector.geocode(query, null, null);
		} catch (Exception e) {
			LOG.error(e);
		}

		return response;
	}
	
	/**
	 * Rest query for cercaGeneral method
	 * 
	 * @param query
	 * 
	 * @return Response
	 */
	@RequestMapping(value = "/cercaGeneral/{query}")
	public @ResponseBody
	Response cercaGeneral(@PathVariable("query") String query) {
		LOG.trace("Entro en cercaGeneral");
		Response response = null;
		try {
			response = searcherService.cercaGeneral(query.equals(NULL_VALUE) ? "" : query, DEFAULT_START, DEFAULT_END);
		} catch (Exception e) {
			LOG.error(e);
		}

		if (LOG.isTraceEnabled()) {
			interior.cat.visor.conectors.searcher.utils.ShowResponses.muestraInfo(
					response, true, "cercaGeneral", LOG);
		}
		
		return response;
	}
	
	private int getIntValue(String st, int defaultValue){
		try{
			if(StringUtils.isNumeric(st)){
				return Integer.decode(st);
			}
		}catch (Exception e){
			//Nothing
		}
		return defaultValue;
	}

}
