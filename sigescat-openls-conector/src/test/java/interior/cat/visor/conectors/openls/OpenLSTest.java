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
package interior.cat.visor.conectors.openls;

import java.util.Properties;

import javax.annotation.Resource;

import net.opengis.xls.v_1_2_0.GeocodeResponseType;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import interior.cat.visor.conectors.openls.service.OpenLSService;
import interior.cat.visor.conectors.openls.utils.ShowResponses;

/**
 * Tests junit para el conector de openls
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:conectorOpenlsContext.xml"})
public class OpenLSTest{

	@Resource
	private Properties testProperties;

	@Resource(name="openlsServiceConector")
	private OpenLSService openlsServiceConector;

	private static final Log LOG = LogFactory.getLog(OpenLSTest.class);

	// Propiedades a ser utilizada en los test procedentes de testProperties: testGeocode
	private static final String PR_1_QUERY = "OpenLSTest.testGeocode.parameter0";

	@Test
	public void testGeocode() {
		try {
			GeocodeResponseType res = openlsServiceConector.geocode(
					testProperties.getProperty(PR_1_QUERY), null, null);
			ShowResponses.muestraInfo(res, true, "geocode", LOG);
		} catch (Exception e) {
			LOG.error("Error  \n", e);
			Assert.fail();
		}
	}

}
