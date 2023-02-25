"use strict"

// Dependências
import { IncomingMessage, ServerResponse } from "node:http"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { Resultado } from "../../schemas/resultado.js"
import { parse } from "yaml"
import dotenv from "dotenv"
dotenv.config()

/** Accept e Content-Type aceitos */
export const TIPOS = {
    accept : [ "*/*", "application/json", "application/x-yaml" ],
    "content-type": [ "application/json", "application/x-yaml" ]
}

/**
 * Capturar e Transformar o body para o formato do Javascript.
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
async function capturar_body( request, response ){
    let { 
        "content-length": length, 
        "content-type": content 
    } = request.parâmetros.headers
    
    // Não há Body
    length = parseInt( length )
    if( Number.isNaN( length ) || length <= 0 ) return
    
    try {
        // Receber stream e converter para String
        await new Promise( resolve => {
            request
                // Recebendo o stream dos dados
                .on( "data", chunk => { request.body += chunk } )
                // Stream finalizado, converter para string
                .on( "end", () => {
                    request.body = request.body.toString()
                    resolve()
                })
        })

        // Transformar o String para JavaScript
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
        response.statusCode = 400
        throw new Resultado( false, MENSAGENS.global.erro.conversãobody(erro) )
    }
}

/** 
 * Validação do Content-Type e Accept
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @throws  { Resultado }
 * @returns { Promisse< void > }
 */ 
async function validar_headers( request, response ){
    let { accept, "content-type": content } = request.parâmetros.headers
    
    // Validação se a API pode responder em algum dos formatos requisitados
    request.parâmetros.headers.accept = accept.split( "," )
        .find( item => TIPOS.accept.includes( item.split(";")[0] ))
    if( request.parâmetros.headers.accept === undefined ){
        response.statusCode = 406
        throw new Resultado( 
            false, 
            MENSAGENS.global.erro.accept( accept ), 
            TIPOS.accept 
        )
    } else request.parâmetros.headers.accept = request.parâmetros.headers.accept.split( ";" )[ 0 ]
            
    // Validação se a API aceita o formato recebido
    if( content !== undefined && !TIPOS["content-type"].includes(content) ){
        response.statusCode = 406
        throw new Resultado( 
            false, 
            MENSAGENS.global.erro["content-type"]( content ), 
            TIPOS["content-type"] 
        )
    }
}

/** 
 * Adições no IncomingMessage.Request que serão 
 * utilizados ao longo do request.
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */ 
async function parâmetros_request( request, response ){
    // Parâmetros utilizados no request
    request.body = ""
    request.parâmetros = {
        operação: "",
        headers: request.headers,
        url: {
            método: request.method.toLowerCase(),
            caminho: ( request.url.startsWith(process.env.API_PATH) )
                ? decodeURI( request.url )
                    .replace( process.env.API_PATH, "" )
                    .replace( /\?.+$/, "" )
                : "",
            querys: {},
            variáveis: {}
        }
    }

    // Query Parameters
    let posição = decodeURI( request.url ).search( /\?.+$/ )
    if( posição !== -1 && request.url.length > posição ){
        decodeURI( request.url ).substring( ++posição )
            .split( "&" )
            .filter( query => query !== "" )
            .forEach( query => {
                let [ nome, valor = "" ] = query.split( "=" )
                request.parâmetros.url.querys[ nome ] = valor
            })
    }

    // Headers validados que devem estar em request.parâmetros.headers
    if( request.parâmetros.headers.accept === undefined )
        request.parâmetros.headers.accept = TIPOS.accept[0]
    
    if( request.parâmetros.headers["content-length"] === undefined )
        request.parâmetros.headers["content-length"] = "0"
}

/**
 * Criação dos parâmetros no Request
 * Validação de Headers. 
 * Captura do Body. 
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
export async function Requisição( request, response ){
    await parâmetros_request( request, response )
    await validar_headers( request, response )
    await capturar_body( request, response )
}