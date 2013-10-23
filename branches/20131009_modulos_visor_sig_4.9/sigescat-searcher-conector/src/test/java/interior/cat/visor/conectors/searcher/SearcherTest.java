/* 
 * SearcherTest.java
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
package interior.cat.visor.conectors.searcher;

import java.util.Properties;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import interior.cat.visor.exception.IncorrectWSParametersException;
import interior.cat.visor.exception.WSException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.sitep.sigem.server.services.Response;
import com.sitep.sigem.server.services.RoadResponse;
import com.sitep.sigem.server.services.SolrResponse;

import interior.cat.visor.conectors.searcher.service.SearcherService;
import interior.cat.visor.conectors.searcher.utils.ShowResponses;

/**
 * Tests junit para el conector del ws buscador
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:conectorSearcherContext.xml"})
public class SearcherTest{

	@Resource
	private Properties testProperties;

	@Resource(name="searcherServiceConector")
	private SearcherService SearcherService;

	private static final Log LOG = LogFactory.getLog(SearcherTest.class);

	// Propiedades a ser utilizada en los test procedentes de testProperties: testCercaSolrGeneral
	private static final String PR_1_QUERY = "SearcherTest.testCercaSolrGeneral.parameter0";
	
	// Propiedades a ser utilizada en los test procedentes de testProperties: testCerca
	public static final String PR_2_QUERY = "SearcherTest.testCerca.query";
	public static final String PR_2_ENTITATS = "SearcherTest.testCerca.entitats";
	public static final String PR_2_FILAINICIAL = "SearcherTest.testCerca.filaini";
	public static final String PR_2_FILAFINAL = "SearcherTest.testCerca.filafin";
	
	// Propiedades a ser utilizada en los test procedentes de testProperties: testCercaSolrParametritzada
	public static final String PR_3_QUERY = "SearcherTest.testCercaSolrParametritzada.query";
	public static final String PR_3_ENTITATS = "SearcherTest.testCercaSolrParametritzada.entitats";
	public static final String PR_3_FILAINICIAL = "SearcherTest.testCercaSolrParametritzada.filaini";
	public static final String PR_3_FILAFINAL = "SearcherTest.testCercaSolrParametritzada.filafin";
	
	// Propiedades a ser utilizada en los test procedentes de testProperties: testCercaCarreteres
	public static final String PR_4_QUERY = "SearcherTest.testCercaCarreteres.query";

	@Test
	public void testCercaSolrGeneral() {
		try {
			SolrResponse res = SearcherService.cercaSolrGeneral((testProperties
					.getProperty(PR_1_QUERY)));
			ShowResponses.muestraInfo(res, true, "cercaSolrGeneral", LOG);
		} catch (WSException e) {
			LOG.error("Error al llamar al WS \n", e);
			Assert.fail();
		} catch (IncorrectWSParametersException e) {
			LOG.error("Error en los parametros del WS \n", e);
			Assert.fail();
		} catch (Exception e) {
			LOG.error("Error  \n", e);
			Assert.fail();
		}
	}
	
	@Test
	public void testCerca() {
		try {
			String query = testProperties
					.getProperty(PR_2_QUERY);
			String entitats = testProperties
			.getProperty(PR_2_ENTITATS);
			Integer filaInicial = Integer.decode(testProperties
			.getProperty(PR_2_FILAINICIAL));
			Integer filaFinal = Integer.decode(testProperties
			.getProperty(PR_2_FILAFINAL));
			Response res = SearcherService.cerca(query, entitats, filaInicial, filaFinal);
			ShowResponses.muestraInfo(res, false, "cerca", LOG);
		} catch (WSException e) {
			LOG.error("Error al llamar al WS \n", e);
			Assert.fail();
		} catch (IncorrectWSParametersException e) {
			LOG.error("Error en los parametros del WS \n", e);
			Assert.fail();
		} catch (Exception e) {
			LOG.error("Error  \n", e);
			Assert.fail();
		}
	}
	
	@Test
	public void testCercaSolrParametritzada() {
		try {
			String query = testProperties
			.getProperty(PR_3_QUERY);
			String entitats = testProperties
			.getProperty(PR_3_ENTITATS);
			Integer filaInicial = Integer.decode(testProperties
			.getProperty(PR_3_FILAINICIAL));
			Integer filaFinal = Integer.decode(testProperties
			.getProperty(PR_3_FILAFINAL));
			SolrResponse res = SearcherService.cercaSolrParametritzada(query, entitats, filaInicial, filaFinal);
			ShowResponses.muestraInfo(res, false, "cercaSolrParametritzada", LOG);
		} catch (WSException e) {
			LOG.error("Error al llamar al WS \n", e);
			Assert.fail();
		} catch (IncorrectWSParametersException e) {
			LOG.error("Error en los parametros del WS \n", e);
			Assert.fail();
		} catch (Exception e) {
			LOG.error("Error  \n", e);
			Assert.fail();
		}
	}
	
	@Test
	public void testCercaCarreteres() {
		try {
			RoadResponse res = SearcherService.cercaCarreteres((testProperties
					.getProperty(PR_4_QUERY)));
			ShowResponses.muestraInfo(res, true, "cercaCarreteres", LOG);
		} catch (WSException e) {
			LOG.error("Error al llamar al WS \n", e);
			Assert.fail();
		} catch (IncorrectWSParametersException e) {
			LOG.error("Error en los parametros del WS \n", e);
			Assert.fail();
		} catch (Exception e) {
			LOG.error("Error  \n", e);
			Assert.fail();
		}
	}

}
