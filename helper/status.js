"use strict"

/**
 * Retorna um http status code, baseado na mensagem do resultado.
 * Usar para códigos 400 ou 500 apenas
 * @param   { string } mensagem Mensagem do resultado
 * @returns { Promisse< number > } http status
 */
export async function status_mensagem( mensagem ){
    switch( true ){
        case mensagem.includes("schema"):
        case mensagem.includes("inválido"):
            return 400
        case mensagem.includes("encontrado"):
            return 404
        case mensagem.includes("existente"):
            return 409
        default: 
            return 500
    }
}