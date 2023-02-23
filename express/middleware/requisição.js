"use strict"

// Dependências
import { Resultado } from "../../schemas/resultado.js"
import { parse } from "yaml"
import dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
import { MENSAGENS } from "../../schemas/mensagens.js"
/**
 * Middleware para validação e parse do conteúdo no body e validação do tipo da resposta aceita.
 * a API trabalho com "application/json" e "application/yaml"
 * @typedef { Express.Router }
 */
export const router = Express.Router()

/** Accept e Content-Type aceitos */
export const TIPOS = {
    accept : [ "*/*", "application/json", "application/yaml" ],
    "content-type": [ "application/json", "application/yaml" ]
}

router
    // Validação dos headers
    .all( '*', async (request, response, next) => {
        let { accept = TIPOS.accept[0], "content-type": content } = request.headers
        
        // Validação se a API pode responder no formato requisitado
        if( !TIPOS.accept.includes(accept) ){
            let resultado = new Resultado( false, MENSAGENS.global.erro.accept(accept), TIPOS.accept )
            return response.status( 406 ).send( resultado )
            
        // Validação se a API aceita o formato recebido
        } else if( content !== undefined && !TIPOS["content-type"].includes(content) ){
            let resultado = new Resultado( false, MENSAGENS.global.erro["content-type"](content), TIPOS["content-type"] )
            return response.status( 406 ).send( resultado )
        }

        next()
    })
    
    // Body Parser que aceita tanto json como yaml
    .use( Express.text({ 
        type: TIPOS["content-type"]
    }))
    
    // Transformar o body para o formato do Javascript
    .all( '*', async  (request, response, next) => {
        let { "content-length": length = "0", "content-type": content } = request.headers
            
        // Não há Body => next()
        length = parseInt( length )
        if( length <= 0 ){
            return next()
        }

        try {
            switch( content ){
                // Parse JSON
                case TIPOS[ "content-type" ][ 0 ]:
                    request.body = JSON.parse( request.body )
                    break

                // Parse YAML
                case TIPOS[ "content-type" ][ 1 ]:
                    request.body = parse( request.body )
                    break
            }

        } catch( erro ){
            let resultado = new Resultado( false, MENSAGENS.global.erro.conversão_body(erro) )
            return response.status( 400 ).send( resultado )
        }
        next()
    })