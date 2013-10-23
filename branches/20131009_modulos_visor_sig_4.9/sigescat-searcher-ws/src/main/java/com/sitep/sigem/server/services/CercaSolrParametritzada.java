
package com.sitep.sigem.server.services;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for cercaSolrParametritzada complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="cercaSolrParametritzada">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="query" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="entitats" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="filaInicial" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *         &lt;element name="filaFinal" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "cercaSolrParametritzada", propOrder = {
    "query",
    "entitats",
    "filaInicial",
    "filaFinal"
})
public class CercaSolrParametritzada {

    protected String query;
    protected String entitats;
    protected Integer filaInicial;
    protected Integer filaFinal;

    /**
     * Gets the value of the query property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQuery() {
        return query;
    }

    /**
     * Sets the value of the query property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQuery(String value) {
        this.query = value;
    }

    /**
     * Gets the value of the entitats property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEntitats() {
        return entitats;
    }

    /**
     * Sets the value of the entitats property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEntitats(String value) {
        this.entitats = value;
    }

    /**
     * Gets the value of the filaInicial property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getFilaInicial() {
        return filaInicial;
    }

    /**
     * Sets the value of the filaInicial property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setFilaInicial(Integer value) {
        this.filaInicial = value;
    }

    /**
     * Gets the value of the filaFinal property.
     * 
     * @return
     *     possible object is
     *     {@link Integer }
     *     
     */
    public Integer getFilaFinal() {
        return filaFinal;
    }

    /**
     * Sets the value of the filaFinal property.
     * 
     * @param value
     *     allowed object is
     *     {@link Integer }
     *     
     */
    public void setFilaFinal(Integer value) {
        this.filaFinal = value;
    }

}
