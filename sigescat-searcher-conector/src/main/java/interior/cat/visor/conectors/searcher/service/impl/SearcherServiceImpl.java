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
package interior.cat.visor.conectors.searcher.service.impl;

import interior.cat.visor.conectors.searcher.service.SearcherService;
import interior.cat.visor.exception.IncorrectWSParametersException;
import interior.cat.visor.exception.WSException;

import javax.annotation.Resource;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import com.sitep.sigem.server.services.Response;
import com.sitep.sigem.server.services.RoadResponse;
import com.sitep.sigem.server.services.SolrResponse;

/**
 * Implementacion de conector de SearcherService
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 */
@Repository(value = "searcherServiceConector")
public class SearcherServiceImpl implements SearcherService {

	@Resource
	private com.sitep.sigem.server.services.SearchServiceImplService searchWS;

	/**
	 * Implementacion del metodo <code>exampleMethod</code> del ws
	 * 
	 * @param query
	 * 
	 * @return solrresponse
	 * 
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	@Cacheable("cercaSolrGeneral")
	public SolrResponse cercaSolrGeneral(String query) throws WSException,
			IncorrectWSParametersException {
		return searchWS.getSearchServiceImplPort().cercaSolrGeneral(query);
	}

	/**
	 * Implementacion del metodo <code>cercaCarreteres</code> del ws
	 * 
	 * @param query
	 * 
	 * @return roadresponse
	 * 
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	@Cacheable("cercaCarreteres")
	public RoadResponse cercaCarreteres(String query) throws WSException,
			IncorrectWSParametersException {
		return searchWS.getSearchServiceImplPort().cercaCarreteres(query);
	}

	/**
	 * Implementacion del metodo <code>cerca</code> del ws
	 * 
	 * @param query
	 * @param entitats
	 * @param filaInicial
	 * @param filaFinal
	 * 
	 * @return response
	 * 
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	@Cacheable("cerca")
	public Response cerca(String query, String entitats, Integer filaInicial,
			Integer filaFinal) throws WSException,
			IncorrectWSParametersException {
		return searchWS.getSearchServiceImplPort().cerca(query, entitats,
				filaInicial, filaFinal);
	}

	/**
	 * Implementacion del metodo <code>cercaSolrParametritzada</code> del ws
	 * 
	 * @param query
	 * @param entitats
	 * @param filaInicial
	 * @param filaFinal
	 * 
	 * @return response
	 * 
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	@Cacheable("cercaSolrParametritzada")
	public SolrResponse cercaSolrParametritzada(String query, String entitats,
			Integer filaInicial, Integer filaFinal) throws WSException,
			IncorrectWSParametersException {
		return searchWS.getSearchServiceImplPort().cercaSolrParametritzada(
				query, entitats, filaInicial, filaFinal);
	}

	/**
	 * Implementacion del metodo <code>cercaGeneral</code> del ws
	 * 
	 * @param query
	 * @param filaInicial
	 * @param filaFinal
	 * 
	 * @return response
	 * 
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	@Cacheable("cercaGeneral")
	public Response cercaGeneral(String query, Integer filaInicial,
			Integer filaFinal) throws WSException,
			IncorrectWSParametersException {
		return searchWS.getSearchServiceImplPort().cercaGeneral(query,
				filaInicial, filaFinal);
	}

}
