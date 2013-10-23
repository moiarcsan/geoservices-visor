/*
 * IncorrectWSParametersException.java 
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
package interior.cat.visor.exception;

public class IncorrectWSParametersException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -639744563693096207L;
	
	public static final String DEFAULT_MESSAGE_1 = "\n*******************************\nParametro ";
	public static final String DEFAULT_MESSAGE_2 = " incorrecto al llamar a ";
	public static final String DEFAULT_MESSAGE_3 = "\n*******************************\n";

	/**
	 * Constructor al que podemos adjuntar un mensaje personalizado
	 * 
	 * @param parameter incorrecto al llamar 
	 * @param method metodo del ws al que se llamaba
	 */
	public IncorrectWSParametersException(String parameter, String method) {
		super(DEFAULT_MESSAGE_1 + parameter + DEFAULT_MESSAGE_2 + method + DEFAULT_MESSAGE_3);
	}

	/**
	 * Constructor al que podemos adjuntar un mensaje personalizado
	 * 
	 * @param parameter incorrecto al llamar 
	 * @param method metodo del ws al que se llamaba
	 * @param cause traza de error
	 * 
	 */
	public IncorrectWSParametersException(String parameter, String method,Throwable cause) {
		super(DEFAULT_MESSAGE_1 + parameter + DEFAULT_MESSAGE_2 + method + DEFAULT_MESSAGE_3, cause);
	}

}
