/* SearcherService.java
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
package interior.cat.visor.conectors.searcher.service;

import interior.cat.visor.exception.IncorrectWSParametersException;
import interior.cat.visor.exception.WSException;

import com.sitep.sigem.server.services.Response;
import com.sitep.sigem.server.services.RoadResponse;
import com.sitep.sigem.server.services.SolrResponse;

/**
 * Interfaz de interaccion con el servicio
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 * 
 */
public interface SearcherService {

	/**
	 * Implementacion del metodo <code>cercaSolrGeneral</code> del ws
	 * 
	 * @param query
	 * @return
	 * @throws WSException
	 * @throws IncorrectWSParametersException
	 */
	public SolrResponse cercaSolrGeneral(String query) throws WSException,
			IncorrectWSParametersException;

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
	public RoadResponse cercaCarreteres(String query) throws WSException,
			IncorrectWSParametersException;

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
	public Response cerca(String query, String entitats, Integer filaInicial,
			Integer filaFinal) throws WSException,
			IncorrectWSParametersException;

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
	public SolrResponse cercaSolrParametritzada(String query, String entitats,
			Integer filaInicial, Integer filaFinal) throws WSException,
			IncorrectWSParametersException;

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
	public Response cercaGeneral(String query, Integer filaInicial,
			Integer filaFinal) throws WSException,
			IncorrectWSParametersException;

}
