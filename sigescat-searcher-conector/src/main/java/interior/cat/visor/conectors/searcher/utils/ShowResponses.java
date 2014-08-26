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
package interior.cat.visor.conectors.searcher.utils;

import org.apache.commons.logging.Log;

import com.sitep.sigem.server.services.Response;
import com.sitep.sigem.server.services.RoadResponse;
import com.sitep.sigem.server.services.RoadResponseItem;
import com.sitep.sigem.server.services.SolrResponse;
import com.sitep.sigem.server.services.SolrResponseItem;

/**
 * Util class to show messages in Log
 * 
 * @author <a href="mailto:adiaz@emergya.com">adiaz</a>
 * 
 */
public class ShowResponses {

	/**
	 * Show result hits for RoadResponse
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param log
	 */
	public static void muestraInfo(RoadResponse res, boolean showAttributes,
			String function, Log log) {
		if (log.isDebugEnabled()) {
			log.debug(function + ": Hits --> " + res.getLst().size());
			if (showAttributes) {
				for (RoadResponseItem item : res.getLst()) {
					log.debug(function + ":Item.id --> " + item.getId());
					log.debug(function + ":Item.nom --> " + item.getNom());
				}
			}
		}
	}

	/**
	 * Show result hits for SolrResponse
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param log
	 */
	public static void muestraInfo(SolrResponse res, boolean showAttributes,
			String function, Log log) {
		if (log.isDebugEnabled()) {
			log.debug(function + ":Hits --> " + res.getTotalHits());
			if (showAttributes) {
				for (SolrResponseItem item : res.getLst()) {
					log.debug(function + ":Item.id --> " + item.getId());
					log.debug(function + ":Item.nom --> " + item.getNom());
				}
			}
		}
	}

	/**
	 * Show result hits for Response
	 * 
	 * @param res
	 * @param showAttributes
	 * @param function
	 * @param log
	 */
	public static void muestraInfo(Response res, boolean showAttributes,
			String function, Log log) {
		if (log.isDebugEnabled()) {
			if (res.getRoadResponse() != null) {
				log.info(function + ":(Road) Hits --> "
						+ res.getRoadResponse().getLst().size());
				if (showAttributes) {
					for (RoadResponseItem item : res.getRoadResponse().getLst()) {
						log.info(function + ":(Road) Item.id --> "
								+ item.getId());
						log.info(function + ":(Road) Item.nom --> "
								+ item.getNom());
					}
				}
			}

			if (res.getSolrResponse() != null) {
				log.info(function + ":(Solr) Hits --> "
						+ res.getSolrResponse().getTotalHits());
				if (showAttributes) {
					for (SolrResponseItem item : res.getSolrResponse().getLst()) {
						log.info(function + ":(Solr) Item.id --> "
								+ item.getId());
						log.info(function + ":(Solr) Item.nom --> "
								+ item.getNom());
					}
				}
			}
		}
	}

}
