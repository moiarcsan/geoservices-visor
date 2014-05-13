/* Proxy.java
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
package interior.cat.visor.servlet;

import interior.cat.visor.openls.utils.HTTPRequestPoster;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.Vector;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HostConfiguration;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthPolicy;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.richfaces.json.JSONException;
import org.richfaces.json.JSONObject;


/**
 * When working with Web Feature Service (WFS) Requests a proxy needs to be used
 * to get around cross site scripting restrictions that are present in browsers.
 * 
 * The Openlayers.org site lists several CGI approaches for proxying. In this
 * approach we implement a proxy within a Wicket Ajax Behavior.
 * 
 * In order to make the behaviour work it needs to be added onto the
 * OpenLayersMap; and emitted when the map is created in javascript.
 * 
 * Then the OpenLayers.ProxyHost=behaviour.getProxyUrl() method can be used.
 * 
 * See openlayers-examples for an example (e.g. MapWithWMSGetFeatureInfo.class)
 * 
 * Using this behaviour binds the lifecycle of map access to an active session
 * which is useful in some cases but might be a problem in others.
 * 
 * The ProxyRequestTarget implementation could be used for example in a Servlet
 * Filter to proxy without caring about the current session and/or the users
 * authorization to view the map data.
 * 
 * @see <a
 *      href="http://grepcode.com/file/repo1.maven.org/maven2/org.wicketstuff/openlayers-proxy/1.4.12.1/org/wicketstuff/openlayers/proxy/WFSProxyBehavior.java">WFSProxyBehavior</a>
 * 
 * @author <a href="mailto:adiaz@emergya.com">Alejandro Diaz Torres</a>
 * 
 */
public class Proxy extends HttpServlet {
	private static final long serialVersionUID = 7418795331167207689L;
	private static Log log = LogFactory.getLog(Proxy.class);

	private static final Map<String, String> authorizedUrls;
	
	private String proxyUrl;
	private int proxyPort;
	private String proxyUser;
	private String proxyPassword;
	private boolean proxyOn = false; //Default proxy off
	private String [] noProxied = null; //Default null
	
	protected static final String AUTH_URL = "/configureAuth.do";

	/**
	 * Indica si se debe autorizar cualquier URL o solo los de la lista
	 * authorizedUrls.
	 */
	private static final Boolean MUST_CHECK_URL = Boolean.FALSE;

	static {
		authorizedUrls = new HashMap<String, String>();
		authorizedUrls.put("www.juntadeandalucia.es",
				"http://www.juntadeandalucia.es");
		authorizedUrls.put("demo.demoOpenGeo.org", "http://demo.opengeo.org");
		authorizedUrls
				.put("www.openplans.org", "http://www.openplans.org/topp");
		authorizedUrls.put("cartografia.amb.cat", "http://cartografia.amb.cat");
		authorizedUrls.put("www.idee.es", "http://www.idee.es");
		authorizedUrls.put("servergeo",
				"http://gofre.emergya.es:8080/geoserver");
		authorizedUrls.put("sima.gencat.cat", "http://sima.gencat.cat");
		authorizedUrls.put("galileo.icc.cat", "http://galileo.icc.cat");
		authorizedUrls.put("sigescat-pre.pise.interior.intranet",
				"http://10.136.200.76");
		authorizedUrls.put("sigescat.pise.interior.intranet",
				"http://sigescat.pise.interior.intranet");
	}
	
	/**
	 * Proxy init
	 */
	public void init() throws ServletException {
		log.info("Init SICECAT proxy (visor)");
	    String value = getServletConfig().getInitParameter("proxyOn");
	    
	    if (value.toUpperCase().equals("TRUE")){
	    	try{
	    		this.proxyOn = true;
	    		this.proxyUrl = getServletConfig().getInitParameter("proxyUrl");
	    		this.proxyUser = getServletConfig().getInitParameter("proxyUser");
	    		this.proxyPassword = getServletConfig().getInitParameter("proxyPassword");
	    		this.proxyPort = Integer.decode(getServletConfig().getInitParameter("proxyPort"));
	    		this.noProxied = getServletConfig().getInitParameter("noProxied").split(",");
	    		log.info("Correct proxied at PISE");
	    	}catch (Exception e){
	    		log.error("Error initializing", e);
	    		this.proxyOn = false;
	    	}
	    }
	    
	    //TODO: read authorizedUrls
	    	
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		process(req, resp, true);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, FileNotFoundException {
		process(request, response, false);
	}

	/**
	 * The doGet method of the servlet. <br>
	 * 
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request
	 *            the request send by the client to the server
	 * @param response
	 *            the response send by the server to the client
	 * @throws ServletException
	 *             if an error occurred
	 * @throws IOException
	 *             if an error occurred
	 */
	@SuppressWarnings("unchecked")
	public void process(HttpServletRequest request, HttpServletResponse response, boolean post)
			throws ServletException, IOException, FileNotFoundException {
		String additionalRequest = request.getPathInfo();
		if(additionalRequest != null && additionalRequest.equals(AUTH_URL)){
			executeConfigureAuth(request, response, post);
		}else{
			executeRequest(request, response, post);
		}
	}
	
	@SuppressWarnings("unchecked")
	private void executeRequest(HttpServletRequest request, HttpServletResponse response, boolean post) throws IOException{
		OutputStream os = response.getOutputStream();
		try {
			// Replaces from authorizedUrls
			String urlParameter = request.getParameter("url");
			if (request.getParameter("url2") != null) {
				urlParameter = request.getParameter("url2");
			}
			String requestURL = manageUrl(urlParameter, request, response);

			// Execute Openlayers proxy
			HttpClient client = getHttpClient(requestURL);

			if (request.getMethod().toLowerCase().equals("get")) {
				String getUrl = buildURL(request, requestURL);

				if (log.isTraceEnabled()) log.trace("Get = " + getUrl);
				
				GetMethod getMethod = new GetMethod(getUrl);
				String security = request.getParameter("SECURITY");
				if(Boolean.parseBoolean(security)){
					String authorizationString = getBasicAuth(requestURL, request);
			        if(authorizationString != null){
			        	Header header = new Header("Authorization", authorizationString);
				        getMethod.addRequestHeader(header);
			        }
				}
				
				int proxyResponseCode = client.executeMethod(getMethod);

				if (log.isTraceEnabled()) log.trace("redirected get, code = " + proxyResponseCode);

				// Pass response headers back to the client
				Header[] headerArrayResponse = getMethod.getResponseHeaders();
				for (Header header : headerArrayResponse) {
					response.setHeader(header.getName(), header.getValue());
				}

				// Send the content to the client
				InputStream inputStreamProxyResponse = getMethod
						.getResponseBodyAsStream();

                IOUtils.copy(inputStreamProxyResponse, os);

			} else if (request.getMethod().toLowerCase().equals("post")) {

				String endPoint = urlParameter;

				if (request.getParameter("url2") != null) {
					endPoint = request.getParameter("url2") + "?url="
							+ request.getParameter("url");
				}

				try {
					//Solo si es necesario en post
					if(this.proxyOn && !isSkipped(requestURL)){
						HTTPRequestPoster.postData(
                                request, new URL(endPoint),os, 
                                proxyUrl, proxyPort, proxyUser, proxyPassword);
					}else{
						HTTPRequestPoster.postData(
                                request, new URL(endPoint),os);
					}
				} catch (MalformedURLException e) {
					log.error(e);
					response.sendError(HttpServletResponse.SC_FORBIDDEN,
							"Proxy only to local requests.");
					throw new Exception("Trying to proxy from "
							+ request.getRemoteHost());
				} catch (Exception e) {
					log.error(e);
					if(e.getMessage() != null 
							&& e.getMessage().indexOf("CODE: ") > 0){
						response.sendError(Integer.decode(e.getMessage().split("CODE: ")[1]),
								e.getMessage());
					}
				}
				response.setContentType("text/xml");

			} else {
				// unsupported
				// fall through
				response.sendError(HttpServletResponse.SC_NOT_FOUND,
						"Page not found.");
				throw new Exception("Trying to proxy from "
						+ request.getRemoteHost());
			}
		} catch (Exception e) {
			log.error("getInputStream() failed", e);
			// fall through
			response.sendError(HttpServletResponse.SC_NOT_FOUND,
					"Page not found.");
		} finally {
			os.flush();
			os.close();
		}
	}
	
	private String getBasicAuth(String requestURL, HttpServletRequest request) throws JSONException, MalformedURLException{
		String user = null;
    	String pass = null;
    	String authorizationString = null;
		HttpSession session = request.getSession();
		JSONObject json = (JSONObject)session.getAttribute("wmssecurized");
		Iterator it = json.keys();
		while(it.hasNext()){
			String url = (String)it.next();
			URL json_url = new URL(url);
        	URL request_url = new URL(requestURL);
        	if(json_url.equals(request_url)){
        		JSONObject obj = (JSONObject)json.get(url);
        		user = (String)obj.get("user");
        		pass = (String)obj.get("pass");
        		authorizationString = "Basic " + Base64.encodeBase64String((user + ":" + pass).getBytes()).trim();
        	}
		}
        return authorizationString;
	}
	
	@SuppressWarnings("unchecked")
	private void executeConfigureAuth(HttpServletRequest request, HttpServletResponse response, boolean post) throws IOException{
		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
		HttpSession session = request.getSession();
        String json = "";
        if(br != null){
            json = br.readLine();
        }
        JSONObject jObj;
		try {
			jObj = new JSONObject(json);
			saveInSession(jObj, session);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void saveInSession(JSONObject json, HttpSession session){
		JSONObject obj = null;
		Iterator it = json.keys();
		while(it.hasNext()){
			String key = (String)it.next();
			try {
				session.putValue(key, json.get(key));
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * Get the http client for get
	 */
	private HttpClient getHttpClient(String requestURL) {
		HttpClient client = new HttpClient();
		
		//Only for PISE
		if(this.proxyOn && !isSkipped(requestURL)){
			Vector<String> authPrefs = new Vector<String>(1);
			authPrefs.add(AuthPolicy.NTLM); //Sistema dautenticacio del proxy
			client.getParams().setParameter(AuthPolicy.AUTH_SCHEME_PRIORITY, authPrefs);
			AuthScope authscope = new AuthScope(AuthScope.ANY);
			HostConfiguration hostConfiguration = new HostConfiguration();
			hostConfiguration.setProxy(proxyUrl, proxyPort);  //Host i port del proxy
			client.setHostConfiguration(hostConfiguration);
			client.getState().setProxyCredentials(authscope, new UsernamePasswordCredentials(proxyUser, proxyPassword));
		}
		
		return client;
	}

	/**
	 * Check if requestURL is starts with some noProxied String
	 * 
	 * @param requestURL
	 * 
	 * @return true if starts or false otherwise 
	 */
	private boolean isSkipped(String requestURL) {
		if(noProxied != null && noProxied.length>0){
			for(String urlAuth: noProxied){
				if(requestURL.startsWith(urlAuth)){
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * URL filtering urls not in authorizedUrls are avoid
	 * 
	 * @param url
	 * @param request
	 * 
	 * @return <code>String</code> target url with parameters
	 */
	private String manageUrl(String url, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		String header = request.getHeader("X-Forwarded-Host");
		if (header != null) {
			header = new StringTokenizer(header, ",").nextToken().trim();
		}
		if (header == null) {
			header = request.getHeader("Host");
		}

		String localUrl = (url.indexOf(":") > 0) ? (url.substring(0,
				url.indexOf(":"))
				+ "://" + header + "/") : url;

		if (log.isTraceEnabled()) {
			log.trace("Previus url : " + url);
			log.trace("Filtering from Base url: " + localUrl);
		}
		// ¿Is avoid?
		boolean found = false;
		String result = url;
		Iterator<String> itKies = authorizedUrls.keySet().iterator();
		if (MUST_CHECK_URL) {
			while (itKies.hasNext() && !found) {
				String key = itKies.next();
				log.trace("Starts with '" + localUrl + "/" + key + "'?");
				if (url.contains(key)) {
					String starts = url.substring(url.indexOf(key));

					if (starts.startsWith(key)) {
						result = starts.replace(key, authorizedUrls.get(key));
						log.trace("Url authorized");
						found = true;
					}
				}
			}
		}

		if (!found && MUST_CHECK_URL) {
			// FORBIDDEN!
			log.warn("Url not found in authorized urls: " + url);
			response.sendError(HttpServletResponse.SC_FORBIDDEN,
					"Proxy only to local requests.");
			throw new Exception("Trying to proxy from "
					+ request.getRemoteHost());
		}

		log.trace("Url managed: " + result);

		return result;
	}

    private String buildURL(HttpServletRequest request, String requestURL) 
            throws UnsupportedEncodingException {
        
        String decodedURL = URLDecoder.decode(requestURL, "UTF-8");
        StringBuilder getUrl = new StringBuilder(decodedURL.replaceAll(
                " ", "%20"));
        Set<String> parameters = request.getParameterMap().keySet();
        boolean first = true;

        for (String p : parameters) {
            if ((p.equals("url") && request.getParameter("url2") == null)
                    || p.equals("url2"))
                continue; // skip the url parameter

            if (p.startsWith("wicket:"))
                continue; // skip the wicket parameters

            String value = request.getParameter(p);

            // The url contain any parameter in get method
            if (parameters.size() > 1) {
                if (first) {
                    // first parameter needs to applied with question
                    // mark
                    // if this is not exist.
                    if (!decodedURL.contains("?")) {
                        getUrl.append("?");
                    } else if (decodedURL.indexOf("?") < (decodedURL
                            .length() - 1)) {
                        getUrl.append("&");
                    }
                    first = false;
                } else {
                    getUrl.append("&");
                }

                getUrl.append(p.equals("url2") ? "url" : p);
                getUrl.append("=");
            }

            getUrl.append(URLEncoder.encode(value, "UTF-8"));

        }
        
        return getUrl.toString();
    }
}
