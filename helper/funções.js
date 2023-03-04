"use strict"

// Dependências
import { validate } from "jsonschema"

/**
 * Substitui acentuação de uma string pela sua versão sem acento
 * @param   { string } string String com ou sem acentuação
 * @returns { Promisse< string > } String sem acentuação
 */
export async function remover_acento( string ){
    return string.normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" )
}

/**
 * Checar se uma string é null, "" ou undefined
 * @param { String } string 
 * @returns { Promise< Boolean > }
 */
export async function isNullEmptyUndefined( string ){
    return string === undefined || string === null || string === ""
}

/**
 * Validar os ids do Firestore Database
 * @param   { string } id Id do documento
 * @returns { Promisse< boolean > } Retorna true se for válido
 */
export async function validador_id( id ){
    return typeof id === "string" && /^\w+$/.test( id )
}

/**
 * Validador de Json-Schema
 * @param   { Object } item Objeto/Classe a ser validado
 * @param   { Object } schema json-schema analisado
 * @returns { Primisse< boolean > } Retorna true caso seja compatível com o json-schema
 */
export async function schema_valido( item, schema ){
	return validate( item, schema ).valid
};