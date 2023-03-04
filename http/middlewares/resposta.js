"use strict"

// Dependências
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"
import { HEADERS } from "../../schemas/especificação.js"
import { stringify } from "yaml"
import dotenv from "dotenv"
dotenv.config()

/**
 * Middleware para transformação da resposta no tipo requerido
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > }
 */
export async function Resposta( request, response ){
    let { accept = HEADERS.accept[0] } = request.headers

    if( response.body === undefined )
        response.body = {}

    // CORS
    response.setHeader( 'Access-Control-Allow-Origin', '*' )
            .setHeader( 'Access-Control-Allow-Methods', '*' )
            .setHeader( 'Access-Control-Max-Age', 600 )

    try {
        switch( accept ){
            // Parse YAML
            case HEADERS.accept[ 2 ]: 
                response.setHeader( "Content-Type", HEADERS.accept[2] )
                        .write( stringify(response.body) )
                break

            // Parse JSON
            default:
                response.setHeader( "Content-Type", HEADERS.accept[1] )
                        .write( JSON.stringify(response.body) )
        }

    } catch( erro ){
        response.statusCode = 500
        response.body = new Resultado( false, MENSAGENS.global.erro.interno(erro) )

        /**
         * Caso dê algum erro na transformação da Resposta, 
         * a mesma função é chamada novamente para transformar o erro
         */
        await Resposta( request, response ) 
    }
}