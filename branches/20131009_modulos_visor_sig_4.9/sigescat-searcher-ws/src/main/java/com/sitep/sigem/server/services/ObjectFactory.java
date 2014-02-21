
package com.sitep.sigem.server.services;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.sitep.sigem.server.services package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _CercaSolrParametritzada_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaSolrParametritzada");
    private final static QName _Cerca_QNAME = new QName("http://services.server.sigem.sitep.com/", "cerca");
    private final static QName _CercaGeneralResponse_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaGeneralResponse");
    private final static QName _CercaSolrGeneralResponse_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaSolrGeneralResponse");
    private final static QName _CercaCarreteresResponse_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaCarreteresResponse");
    private final static QName _CercaGeneral_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaGeneral");
    private final static QName _CercaCarreteres_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaCarreteres");
    private final static QName _CercaSolrParametritzadaResponse_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaSolrParametritzadaResponse");
    private final static QName _CercaResponse_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaResponse");
    private final static QName _CercaSolrGeneral_QNAME = new QName("http://services.server.sigem.sitep.com/", "cercaSolrGeneral");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.sitep.sigem.server.services
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link RoadResponseItem }
     * 
     */
    public RoadResponseItem createRoadResponseItem() {
        return new RoadResponseItem();
    }

    /**
     * Create an instance of {@link CercaCarreteresResponse }
     * 
     */
    public CercaCarreteresResponse createCercaCarreteresResponse() {
        return new CercaCarreteresResponse();
    }

    /**
     * Create an instance of {@link CercaSolrGeneralResponse }
     * 
     */
    public CercaSolrGeneralResponse createCercaSolrGeneralResponse() {
        return new CercaSolrGeneralResponse();
    }

    /**
     * Create an instance of {@link CercaGeneral }
     * 
     */
    public CercaGeneral createCercaGeneral() {
        return new CercaGeneral();
    }

    /**
     * Create an instance of {@link SolrResponseItem }
     * 
     */
    public SolrResponseItem createSolrResponseItem() {
        return new SolrResponseItem();
    }

    /**
     * Create an instance of {@link SolrResponse }
     * 
     */
    public SolrResponse createSolrResponse() {
        return new SolrResponse();
    }

    /**
     * Create an instance of {@link Cerca }
     * 
     */
    public Cerca createCerca() {
        return new Cerca();
    }

    /**
     * Create an instance of {@link CercaResponse }
     * 
     */
    public CercaResponse createCercaResponse() {
        return new CercaResponse();
    }

    /**
     * Create an instance of {@link Response }
     * 
     */
    public Response createResponse() {
        return new Response();
    }

    /**
     * Create an instance of {@link CercaSolrParametritzada }
     * 
     */
    public CercaSolrParametritzada createCercaSolrParametritzada() {
        return new CercaSolrParametritzada();
    }

    /**
     * Create an instance of {@link CercaCarreteres }
     * 
     */
    public CercaCarreteres createCercaCarreteres() {
        return new CercaCarreteres();
    }

    /**
     * Create an instance of {@link CercaGeneralResponse }
     * 
     */
    public CercaGeneralResponse createCercaGeneralResponse() {
        return new CercaGeneralResponse();
    }

    /**
     * Create an instance of {@link CercaSolrGeneral }
     * 
     */
    public CercaSolrGeneral createCercaSolrGeneral() {
        return new CercaSolrGeneral();
    }

    /**
     * Create an instance of {@link FacetSearchResponse }
     * 
     */
    public FacetSearchResponse createFacetSearchResponse() {
        return new FacetSearchResponse();
    }

    /**
     * Create an instance of {@link RoadResponse }
     * 
     */
    public RoadResponse createRoadResponse() {
        return new RoadResponse();
    }

    /**
     * Create an instance of {@link CercaSolrParametritzadaResponse }
     * 
     */
    public CercaSolrParametritzadaResponse createCercaSolrParametritzadaResponse() {
        return new CercaSolrParametritzadaResponse();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaSolrParametritzada }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaSolrParametritzada")
    public JAXBElement<CercaSolrParametritzada> createCercaSolrParametritzada(CercaSolrParametritzada value) {
        return new JAXBElement<CercaSolrParametritzada>(_CercaSolrParametritzada_QNAME, CercaSolrParametritzada.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link Cerca }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cerca")
    public JAXBElement<Cerca> createCerca(Cerca value) {
        return new JAXBElement<Cerca>(_Cerca_QNAME, Cerca.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaGeneralResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaGeneralResponse")
    public JAXBElement<CercaGeneralResponse> createCercaGeneralResponse(CercaGeneralResponse value) {
        return new JAXBElement<CercaGeneralResponse>(_CercaGeneralResponse_QNAME, CercaGeneralResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaSolrGeneralResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaSolrGeneralResponse")
    public JAXBElement<CercaSolrGeneralResponse> createCercaSolrGeneralResponse(CercaSolrGeneralResponse value) {
        return new JAXBElement<CercaSolrGeneralResponse>(_CercaSolrGeneralResponse_QNAME, CercaSolrGeneralResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaCarreteresResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaCarreteresResponse")
    public JAXBElement<CercaCarreteresResponse> createCercaCarreteresResponse(CercaCarreteresResponse value) {
        return new JAXBElement<CercaCarreteresResponse>(_CercaCarreteresResponse_QNAME, CercaCarreteresResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaGeneral }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaGeneral")
    public JAXBElement<CercaGeneral> createCercaGeneral(CercaGeneral value) {
        return new JAXBElement<CercaGeneral>(_CercaGeneral_QNAME, CercaGeneral.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaCarreteres }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaCarreteres")
    public JAXBElement<CercaCarreteres> createCercaCarreteres(CercaCarreteres value) {
        return new JAXBElement<CercaCarreteres>(_CercaCarreteres_QNAME, CercaCarreteres.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaSolrParametritzadaResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaSolrParametritzadaResponse")
    public JAXBElement<CercaSolrParametritzadaResponse> createCercaSolrParametritzadaResponse(CercaSolrParametritzadaResponse value) {
        return new JAXBElement<CercaSolrParametritzadaResponse>(_CercaSolrParametritzadaResponse_QNAME, CercaSolrParametritzadaResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaResponse")
    public JAXBElement<CercaResponse> createCercaResponse(CercaResponse value) {
        return new JAXBElement<CercaResponse>(_CercaResponse_QNAME, CercaResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CercaSolrGeneral }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://services.server.sigem.sitep.com/", name = "cercaSolrGeneral")
    public JAXBElement<CercaSolrGeneral> createCercaSolrGeneral(CercaSolrGeneral value) {
        return new JAXBElement<CercaSolrGeneral>(_CercaSolrGeneral_QNAME, CercaSolrGeneral.class, null, value);
    }

}
