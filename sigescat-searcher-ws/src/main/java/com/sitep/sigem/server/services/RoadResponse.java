
package com.sitep.sigem.server.services;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for roadResponse complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="roadResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="lst" type="{http://services.server.sigem.sitep.com/}roadResponseItem" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "roadResponse", propOrder = {
    "lst"
})
public class RoadResponse {

    @XmlElement(nillable = true)
    protected List<RoadResponseItem> lst;

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
     * {@link RoadResponseItem }
     * 
     * 
     */
    public List<RoadResponseItem> getLst() {
        if (lst == null) {
            lst = new ArrayList<RoadResponseItem>();
        }
        return this.lst;
    }

}
