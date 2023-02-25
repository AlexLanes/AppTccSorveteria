"use strict"

// Dependências
import { IncomingMessage, ServerResponse } from "node:http"
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { TIPOS } from "./requisição.js"
import { stringify } from "yaml"
import dotenv from "dotenv"
dotenv.config()

/**
 * Body Handler para transformação da resposta no tipo requerido
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
export async function Resposta( request, response ){
    let { accept = TIPOS.accept[0] } = request.headers

    // CORS
    response.setHeader('Access-Control-Allow-Origin', '*')
            .setHeader('Access-Control-Allow-Methods', '*')
            .setHeader('Access-Control-Max-Age', 600)

    if( response.body === undefined ){
        response.body = {}
        response.statusCode = 204
    }

    try {
        switch( accept ){
            // Parse YAML
            case TIPOS.accept[ 2 ]: 
                response.setHeader( "Content-Type", TIPOS.accept[2] )
                        .write( stringify(response.body) )
                break

            // Parse JSON
            default:
                response.setHeader( "Content-Type", TIPOS.accept[1] )
                        .write( JSON.stringify(response.body) )
        }

    } catch( erro ){
        response.statusCode = 500
        response.body = new Resultado( false, MENSAGENS.global.erro.interno(erro) )
        await Resposta( request, response )
    }
}