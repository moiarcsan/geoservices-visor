
package com.sitep.sigem.server.services;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for solrResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="solrResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="elapsedTime" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="facetLst" type="{http://services.server.sigem.sitep.com/}facetSearchResponse" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="lst" type="{http://services.server.sigem.sitep.com/}solrResponseItem" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="totalHits" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "solrResponse", propOrder = {
    "elapsedTime",
    "facetLst",
    "lst",
    "totalHits"
})
public class SolrResponse {

    protected Long elapsedTime;
    @XmlElement(nillable = true)
    protected List<FacetSearchResponse> facetLst;
    @XmlElement(nillable = true)
    protected List<SolrResponseItem> lst;
    protected Long totalHits;

    /**
     * Gets the value of the elapsedTime property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getElapsedTime() {
        return elapsedTime;
    }

    /**
     * Sets the value of the elapsedTime property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setElapsedTime(Long value) {
        this.elapsedTime = value;
    }

    /**
     * Gets the value of the facetLst property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the facetLst property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFacetLst().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link FacetSearchResponse }
     * 
     * 
     */
    public List<FacetSearchResponse> getFacetLst() {
        if (facetLst == null) {
            facetLst = new ArrayList<FacetSearchResponse>();
        }
        return this.facetLst;
    }

    /**
     * Gets the value of the lst property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the lst property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getLst().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SolrResponseItem }
     * 
     * 
     */
    public List<SolrResponseItem> getLst() {
        if (lst == null) {
            lst = new ArrayList<SolrResponseItem>();
        }
        return this.lst;
    }

    /**
     * Gets the value of the totalHits property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getTotalHits() {
        return totalHits;
    }

    /**
     * Sets the value of the totalHits property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setTotalHits(Long value) {
        this.totalHits = value;
    }

}
