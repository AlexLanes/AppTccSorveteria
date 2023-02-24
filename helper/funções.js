"use strict"

/**
 * Substitui acentuação de uma string pela sua versão sem acento
 * @param   { string } string String com ou sem acentuação
 * @returns { Promisse< string > } String sem acentuação
 */
export async function remover_acento( string ){
    return string.normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" )
}

/**
 * Validar os ids do Firestore Database
 * @param   { string } id Id do documento
 * @returns { Promisse< string > } Retorna true se for válido
 */
export async function validador_id( id ){
    return typeof id === "string" && /^\w+$/.test( id )
}