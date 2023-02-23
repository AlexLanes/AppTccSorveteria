"use strict"

// Dependências
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { TIPOS } from "./requisição.js"
import compression from "compression"
import { stringify } from "yaml"
import dotenv from "dotenv"
dotenv.config()
 
// Inicializar router
import Express from "express"
/**
 * Middleware para fazer a compressão e transformação para o formato desejado.
 * a API trabalho com "application/json" e "application/yaml"
 * @typedef { Express.Router }
 */
export const router = Express.Router()

router
    // Middleware de compressão da Resposta
    .use( compression() )

    // Transformar o body para o formato requerido
    .all( "*", async ( request, response, next ) => {
        console.log( "RESPOSTA" )
        let { accept = TIPOS.accept[1] } = request.headers,
            send = response.send

        try {
            console.log( "TRY" )
            response.send = ( body ) => {
                console.log( "BODY" )
                // set function back to avoid "send-loop"
                response.send = send
    
                switch( accept ){
                    // Parse YAML
                    case TIPOS.accept[ 2 ]:
                        response.type( TIPOS.accept[2] ).send( stringify(body) )
                        break

                    // O parse JSON e Content-Type é feito automaticamente
                    default:
                        response.send( body )
                }
            }

        } catch( erro ){
            let resultado = new Resultado( false, MENSAGENS.global.erro.conversão_body(erro) )
            return response.status( 500 ).send( resultado )
        }

        next()
    })