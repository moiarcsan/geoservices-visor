
package com.sitep.sigem.server.services;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for facetSearchResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="facetSearchResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="entitat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="hits" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "facetSearchResponse", propOrder = {
    "entitat",
    "hits"
})
public class FacetSearchResponse {

    protected String entitat;
    protected int hits;

    /**
     * Gets the value of the entitat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEntitat() {
        return entitat;
    }

    /**
     * Sets the value of the entitat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEntitat(String value) {
        this.entitat = value;
    }

    /**
     * Gets the value of the hits property.
     * 
     */
    public int getHits() {
        return hits;
    }

    /**
     * Sets the value of the hits property.
     * 
     */
    public void setHits(int value) {
        this.hits = value;
    }

}
