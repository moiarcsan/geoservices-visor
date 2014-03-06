package com.sitep.sigem.server.services;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Logger;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;
import javax.xml.ws.WebEndpoint;
import javax.xml.ws.WebServiceClient;
import javax.xml.ws.WebServiceFeature;

import org.springframework.stereotype.Repository;

/**
 * This class was generated by the JAX-WS RI. JAX-WS RI 2.1.7-b01- Generated
 * source version: 2.1
 * 
 */
@WebServiceClient(name = "SearchServiceImplService", targetNamespace = "http://services.server.sigem.sitep.com/", wsdlLocation = "http://sigescat.pise.interior.intranet/search?wsdl")
@Repository
public class SearchServiceImplService extends Service {

	private final static URL SEARCHSERVICEIMPLSERVICE_WSDL_LOCATION;
	private final static Logger logger = Logger
			.getLogger(com.sitep.sigem.server.services.SearchServiceImplService.class
					.getName());

	static {
		URL url = null;
		try {
			URL baseUrl;
			baseUrl = com.sitep.sigem.server.services.SearchServiceImplService.class
					.getResource(".");
			url = new URL(
					baseUrl,
					"http://sigescat.pise.interior.intranet/search?wsdl");
		} catch (MalformedURLException e) {
			logger.warning("Failed to create URL for the wsdl Location: 'http://sigescat.pise.interior.intranet/search?wsdl', retrying as a local file");
			logger.warning(e.getMessage());
		}
		SEARCHSERVICEIMPLSERVICE_WSDL_LOCATION = url;
	}

	public SearchServiceImplService(URL wsdlLocation, QName serviceName) {
		super(wsdlLocation, serviceName);
	}

	public SearchServiceImplService() {
		super(SEARCHSERVICEIMPLSERVICE_WSDL_LOCATION, new QName(
				"http://services.server.sigem.sitep.com/",
				"SearchServiceImplService"));
	}

	/**
	 * 
	 * @return returns SearchService
	 */
	@WebEndpoint(name = "SearchServiceImplPort")
	public SearchService getSearchServiceImplPort() {
		return super.getPort(new QName(
				"http://services.server.sigem.sitep.com/",
				"SearchServiceImplPort"), SearchService.class);
	}

	/**
	 * 
	 * @param features
	 *            A list of {@link javax.xml.ws.WebServiceFeature} to configure
	 *            on the proxy. Supported features not in the
	 *            <code>features</code> parameter will have their default
	 *            values.
	 * @return returns SearchService
	 */
	@WebEndpoint(name = "SearchServiceImplPort")
	public SearchService getSearchServiceImplPort(WebServiceFeature... features) {
		return super.getPort(new QName(
				"http://services.server.sigem.sitep.com/",
				"SearchServiceImplPort"), SearchService.class, features);
	}

}