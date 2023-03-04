"use strict"

// Dependências
import { ESPECIFICAÇÃO, HEADERS } from "../../schemas/especificação.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { Resultado } from "../../schemas/resultado.js"
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"
import Formidable from "formidable"
import { parse } from "yaml"
import dotenv from "dotenv"
import fs from "node:fs"
dotenv.config()

/**
 * Regex para obter a parte que inicia 
 * os query parameters até o fim da string
 */
const QUERYS_REGEX = /\?.+$/,

    /**
     * Regex para obter variáveis na url. Exemplo: {id}
     */
    VARIÁVEIS_REGEX = /{[^{}]+}/g

/**
 * Capturar e Transformar os fields do form para o formato Javascript.
 * @param   { Request } request 
 * @param   { Response } response
 * @returns { Promisse< void > }
 */
async function body_form( request, response ){
    let FORM = new Formidable.IncomingForm({
        maxFileSize: 2 * 1024 * 1024,
        maxFields: 10,
        keepExtensions: true
    })

    // Aguardar o stream dos dodas
    await new Promise(( resolve, reject ) => {
        FORM.parse( request, async( erro, campos, arquivos ) => {
            if( erro ){
                reject()
                throw erro
            }
            
            // Inserir os Arquivos no request
            // No momento suporta apenas 1
            for( let campo of Object.keys(arquivos) ){
                let dados = fs.readFileSync( arquivos[campo].filepath ),
                arrayBuffer = dados.buffer.slice( dados.byteOffset, dados.byteOffset + dados.byteLength )
                
                request.body[ "nome" ] = arquivos[ campo ].originalFilename
                request.body[ "tipo" ] = arquivos[ campo ].mimetype
                request.body[ campo ]  = arrayBuffer
            }

            // Inserir os Campos no request
            Object.assign( request.body, campos )
            
            resolve()
        })
    })
}

/**
 * Capturar e Transformar o body para o formato String.
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< String > }
 */
async function body_raw( request, response ){
    let body = []
    
    // Receber o buffer stream do Body
    await new Promise(( resolve ) => {
        // Recebendo o stream dos dados
        request.on( "data", (chunk) => body.push(chunk) )
        // Stream finalizado
        request.on( "end", () => resolve() )
        // Stream finalizado
        request.on( "close", () => resolve() )
    })

    // Transformar o Buffer para String
    return Buffer.concat( body ).toString()
}

/**
 * Capturar e Transformar o body para o formato do Javascript.
 * Adicionado em Request.body
 * @param   { Request } request 
 * @param   { Response } response 
 * @throws  { Resultado }
 * @returns { Promisse< void > }
 */
async function body_parser( request, response ){
    let { 
        "content-length": length, 
        "content-type": content 
    } = request.parâmetros.headers
    
    // Guard Clause
    // Não há Body
    length = parseInt( length )
    if( Number.isNaN(length) || length <= 0 ) return
    
    try {
        // Busca o content-type suportado para o(s) content-type(s) informado(s)
        let index = HEADERS["content-type"].findIndex( item =>
            content.split( ";" )[ 0 ] === item
        )

        // Transformar para JavaScript
        switch( index ){
            // Parse JSON
            case 0:
                request.body = JSON.parse( 
                    await body_raw( request, response ) 
                )
                break

            // Parse YAML
            case 1:
                request.body = parse( 
                    await body_raw( request, response ) 
                )
                break
            
            case 2:
                await body_form( request, response )
                break
            
            // Não suportado
            default: break
        }

    } catch( erro ){
        response.statusCode = 400
        throw new Resultado( false, MENSAGENS.global.erro.conversão_body(erro) )
    }
}

/**
 * Caso o caminho da operação tenha variáveis, será criado 
 * e inserido no request.parâmetros.variáveis 
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > }
 */
async function variáveis( request, response ){
    let { operação, caminho } = request.parâmetros,
        caminhos  = caminho.split( "/" ),
        operações = operação.split( "/" )

    // Guard Clause
    // Não existem variáveis
    if( !VARIÁVEIS_REGEX.test(operação) ) return

    for( let index in operações ){
        let item = operações[ index ]
        if( item.startsWith("{") && item.endsWith("}") ){
            let nome = operações[ index ].slice( 1, -1 ),
                valor = caminhos[ index ]
            request.parâmetros.variáveis[ nome ] = valor
        }
    }
}

/**
 * Tenta obter uma operação para o caminho e método do request.
 * Insere o url da operação no Request.parâmetros.operação.
 * Caso não seja encontrado, será ""
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > } 
 */
async function operação( request, response ){
    let { caminho, método } = request.parâmetros,

        // caminhos documentados na especificação
        paths = Object.keys( ESPECIFICAÇÃO.paths ),

        // index do caminho na variável path, se não -1
        index = paths
            // converte os path parameters( "{id}" ) para um string regex que aceita qualquer coisa exceto "/"
            .map( path => `^${path.replace( VARIÁVEIS_REGEX, "[^/]+" )}$` )
            // testa se algum path, após ser convertido em regex, é compatível com o caminho informado
            .findIndex( path => new RegExp(path).test(caminho) ),

        operações = paths
            // converte os path parameters( "{id}" ) para um string regex que aceita qualquer coisa exceto "/"
            .map( path => `^${path.replace( VARIÁVEIS_REGEX, "[^/]+" )}$` )
            // retorna os paths, após ser convertido em regex, que são compatíveis com o caminho informado
            .filter( path => new RegExp(path).test(caminho) )
            // remove a parte do regex "^" e "$"
            .map( path => path.slice(1, -1) ),

        operação
    
    // Nenhuma caminho encontrada
    if( operações.length === 0 ) 
        operação = ""
    // Caminho exato encontrado
    else if( operações.includes(caminho) )
        operação = caminho
    // Caminho com variável encontrado 
    else operação = paths.find( path => new RegExp(operações[0]).test(path) )

    request.parâmetros.operação = ( operação != "" && método in ESPECIFICAÇÃO.paths[operação] )
        ? operação // Caminho e método compatível
        : "" // Caminho ou método não compatível
}

/**
 * Obter os query parameters no caminho 
 * do url e adicionar nos parâmetros
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > }
 */
async function querys( request, response ){
    let posição = decodeURI( request.url ).search( QUERYS_REGEX )

    // Guard Clause
    if( posição === -1 || request.url.length <= posição )
        return
    
    decodeURI( request.url ).substring( posição + 1 )
        .split( "&" )
        .filter( query => query !== "" )
        .forEach( query => {
            let [ nome, valor = "" ] = query.split( "=" )
            request.parâmetros.querys[ nome ] = valor
        })
}

/** 
 * Setando valores que serão utilizados ao longo do request.
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > }
 */ 
async function parâmetros( request, response ){
    // Atribuindo valores no Request
    let { body, parâmetros } = new Request()
    request.body = body
    request.parâmetros = parâmetros

    let { 
        accept = HEADERS.accept[ 0 ],
        "content-length": length = "0",
        "content-type": content = "",
        ...headers
    } = request.headers
   
    request.parâmetros.método = request.method.toLowerCase()
    
    request.parâmetros.caminho = ( request.url.startsWith(process.env.API_PATH) )
        ? decodeURI( request.url ).replace( process.env.API_PATH, "" ).replace( QUERYS_REGEX, "" )
        : ""

    request.parâmetros.headers = {
        accept, 
        "content-type": content, 
        "content-length": length, 
        ...headers
    }

    await querys( request, response )
    await operação( request, response )
    await variáveis( request, response )
}

/**
 * Middleware para setar os parâmetros no Request
 * e capturar/transformar o Body. 
 * @param   { Request } request 
 * @param   { Response } response
 * @returns { Promisse< void > }
 */
export async function Requisição( request, response ){
    await parâmetros( request, response )
    await body_parser( request, response )
}