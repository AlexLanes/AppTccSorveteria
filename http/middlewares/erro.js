"use strict"

import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { Response } from "../classes/response.js"

/**
 * Error Handler padrão
 * @param   { Response } response 
 * @param   { (Resultado|Error) } erro 
 * @returns { Promisse< void > }
 */
export async function Erro( response, erro ){
	// Erro proveniente de algum catch.
	// statusCode já foi definido
	if( erro instanceof Resultado )
		response.body = erro
	
	// Erro imprevisto
	else {
		response.statusCode = 500
		response.body = new Resultado( false, MENSAGENS.global.erro.interno(erro) )
	}
}