
package com.sitep.sigem.server.services;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;


/**
 * This class was generated by the JAX-WS RI.
 * JAX-WS RI 2.1.7-b01-
 * Generated source version: 2.1
 * 
 */
@WebService(name = "SearchService", targetNamespace = "http://services.server.sigem.sitep.com/")
@XmlSeeAlso({
    ObjectFactory.class
})
public interface SearchService {


    /**
     * 
     * @param query
     * @return
     *     returns com.sitep.sigem.server.services.SolrResponse
     */
    @WebMethod
    @WebResult(targetNamespace = "")
    @RequestWrapper(localName = "cercaSolrGeneral", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaSolrGeneral")
    @ResponseWrapper(localName = "cercaSolrGeneralResponse", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaSolrGeneralResponse")
    public SolrResponse cercaSolrGeneral(
        @WebParam(name = "query", targetNamespace = "")
        String query);

    /**
     * 
     * @param query
     * @param filaFinal
     * @param filaInicial
     * @param entitats
     * @return
     *     returns com.sitep.sigem.server.services.SolrResponse
     */
    @WebMethod
    @WebResult(targetNamespace = "")
    @RequestWrapper(localName = "cercaSolrParametritzada", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaSolrParametritzada")
    @ResponseWrapper(localName = "cercaSolrParametritzadaResponse", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaSolrParametritzadaResponse")
    public SolrResponse cercaSolrParametritzada(
        @WebParam(name = "query", targetNamespace = "")
        String query,
        @WebParam(name = "entitats", targetNamespace = "")
        String entitats,
        @WebParam(name = "filaInicial", targetNamespace = "")
        Integer filaInicial,
        @WebParam(name = "filaFinal", targetNamespace = "")
        Integer filaFinal);

    /**
     * 
     * @param query
     * @param filaFinal
     * @param filaInicial
     * @param entitats
     * @return
     *     returns com.sitep.sigem.server.services.Response
     */
    @WebMethod
    @WebResult(targetNamespace = "")
    @RequestWrapper(localName = "cerca", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.Cerca")
    @ResponseWrapper(localName = "cercaResponse", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaResponse")
    public Response cerca(
        @WebParam(name = "query", targetNamespace = "")
        String query,
        @WebParam(name = "entitats", targetNamespace = "")
        String entitats,
        @WebParam(name = "filaInicial", targetNamespace = "")
        Integer filaInicial,
        @WebParam(name = "filaFinal", targetNamespace = "")
        Integer filaFinal);

    /**
     * 
     * @param query
     * @param filaFinal
     * @param filaInicial
     * @return
     *     returns com.sitep.sigem.server.services.Response
     */
    @WebMethod
    @WebResult(targetNamespace = "")
    @RequestWrapper(localName = "cercaGeneral", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaGeneral")
    @ResponseWrapper(localName = "cercaGeneralResponse", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaGeneralResponse")
    public Response cercaGeneral(
        @WebParam(name = "query", targetNamespace = "")
        String query,
        @WebParam(name = "filaInicial", targetNamespace = "")
        Integer filaInicial,
        @WebParam(name = "filaFinal", targetNamespace = "")
        Integer filaFinal);

    /**
     * 
     * @param query
     * @return
     *     returns com.sitep.sigem.server.services.RoadResponse
     */
    @WebMethod
    @WebResult(targetNamespace = "")
    @RequestWrapper(localName = "cercaCarreteres", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaCarreteres")
    @ResponseWrapper(localName = "cercaCarreteresResponse", targetNamespace = "http://services.server.sigem.sitep.com/", className = "com.sitep.sigem.server.services.CercaCarreteresResponse")
    public RoadResponse cercaCarreteres(
        @WebParam(name = "query", targetNamespace = "")
        String query);

}