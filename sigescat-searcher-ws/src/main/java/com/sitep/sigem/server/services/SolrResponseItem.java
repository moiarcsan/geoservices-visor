
package com.sitep.sigem.server.services;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for solrResponseItem complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="solrResponseItem">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="comarca" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="descripcio" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="entitat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="id" type="{http://www.w3.org/2001/XMLSchema}long"/>
 *         &lt;element name="municipi" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="nom" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="score" type="{http://www.w3.org/2001/XMLSchema}double"/>
 *         &lt;element name="tipus" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "solrResponseItem", propOrder = {
    "comarca",
    "descripcio",
    "entitat",
    "id",
    "municipi",
    "nom",
    "score",
    "tipus"
})
public class SolrResponseItem {

    protected String comarca;
    protected String descripcio;
    protected String entitat;
    protected long id;
    protected String municipi;
    protected String nom;
    protected double score;
    protected String tipus;

    /**
     * Gets the value of the comarca property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getComarca() {
        return comarca;
    }

    /**
     * Sets the value of the comarca property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setComarca(String value) {
        this.comarca = value;
    }

    /**
     * Gets the value of the descripcio property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDescripcio() {
        return descripcio;
    }

    /**
     * Sets the value of the descripcio property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDescripcio(String value) {
        this.descripcio = value;
    }

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
     * Gets the value of the id property.
     * 
     */
    public long getId() {
        return id;
    }

    /**
     * Sets the value of the id property.
     * 
     */
    public void setId(long value) {
        this.id = value;
    }

    /**
     * Gets the value of the municipi property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMunicipi() {
        return municipi;
    }

    /**
     * Sets the value of the municipi property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMunicipi(String value) {
        this.municipi = value;
    }

    /**
     * Gets the value of the nom property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNom() {
        return nom;
    }

    /**
     * Sets the value of the nom property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNom(String value) {
        this.nom = value;
    }

    /**
     * Gets the value of the score property.
     * 
     */
    public double getScore() {
        return score;
    }

    /**
     * Sets the value of the score property.
     * 
     */
    public void setScore(double value) {
        this.score = value;
    }

    /**
     * Gets the value of the tipus property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTipus() {
        return tipus;
    }

    /**
     * Sets the value of the tipus property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTipus(String value) {
        this.tipus = value;
    }

}
