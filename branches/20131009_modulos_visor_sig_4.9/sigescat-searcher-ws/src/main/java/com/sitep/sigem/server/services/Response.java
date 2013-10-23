
package com.sitep.sigem.server.services;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for response complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="response">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="roadResponse" type="{http://services.server.sigem.sitep.com/}roadResponse" minOccurs="0"/>
 *         &lt;element name="solrResponse" type="{http://services.server.sigem.sitep.com/}solrResponse" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "response", propOrder = {
    "roadResponse",
    "solrResponse"
})
public class Response {

    protected RoadResponse roadResponse;
    protected SolrResponse solrResponse;

    /**
     * Gets the value of the roadResponse property.
     * 
     * @return
     *     possible object is
     *     {@link RoadResponse }
     *     
     */
    public RoadResponse getRoadResponse() {
        return roadResponse;
    }

    /**
     * Sets the value of the roadResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link RoadResponse }
     *     
     */
    public void setRoadResponse(RoadResponse value) {
        this.roadResponse = value;
    }

    /**
     * Gets the value of the solrResponse property.
     * 
     * @return
     *     possible object is
     *     {@link SolrResponse }
     *     
     */
    public SolrResponse getSolrResponse() {
        return solrResponse;
    }

    /**
     * Sets the value of the solrResponse property.
     * 
     * @param value
     *     allowed object is
     *     {@link SolrResponse }
     *     
     */
    public void setSolrResponse(SolrResponse value) {
        this.solrResponse = value;
    }

}
