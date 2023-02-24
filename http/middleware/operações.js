"use strict"

// Dependências
import { ESPECIFICAÇÃO } from "../../schemas/especificação.js"
import { IncomingMessage, ServerResponse } from "node:http"
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import fs from "node:fs"

/**
 * Armazenará todas as rotas. 
 * {
 *  [url]: {
 *      [método]: async function()
 *  }
 * }
 */
const ROTAS = {},
      // Regex para obter variáveis na url. Exemplo: {id}
      REGEX = /{[^{}]+}/g

// Carregando todas as rotas dinamicamente e armazenando em `ROTAS`
fs.readdirSync( "./http/routes" ).forEach( async( arquivo) => {
	let { default: rota } = await import( `../routes/${arquivo}` )
    Object.assign( ROTAS, rota )
})

/**
 * Caso o caminho da operação tenha variáveis, será criado 
 * e inserido no request.parâmetros.url.variáveis 
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
async function obter_variáveis( request, response ){
    let { operação, url: { caminho } } = request.parâmetros
    
    // Não existem variáveis
    if( !REGEX.test(operação) ) return

    caminho = caminho.split( "/" )
    operação = operação.split( "/" )
    for( let index = 0; index < operação.length; index++ ){
        let item = operação[ index ]
        if( item.startsWith("{") && item.endsWith("}") ){
            let nome = operação[ index ].slice( 1, -1 ),
                valor = caminho[ index ]
            request.parâmetros.url.variáveis[ nome ] = valor
        }
    }
}

/**
 * Tenta obter uma operação para o caminho e método do request.
 * Insere o url da operação no Request.parâmetros.operação.
 * Caso não seja encontrado, será ""
 * @param   { String } caminho Path do request pós Base Url
 * @param   { String } método Método HTTP
 * @returns { Promisse< void > } 
 */
async function obter_operação( request, response ){
    let { caminho, método } = request.parâmetros.url,

        // caminhos documentados na especificação
        paths = Object.keys( ESPECIFICAÇÃO.paths ),

        // index do caminho na variável path, se não -1
        index = paths
            // converte os path parameters( "{id}" ) para um string regex que aceita qualquer coisa exceto "/"
            .map( path => `^${path.replace( REGEX, "[^/]+" )}$` )
            // testa se algum path, após ser convertido em regex, é compatível com o caminho informado
            .findIndex( path => new RegExp(path).test(caminho) )
    
    // Operação existente
    if( index !== -1 && método in ESPECIFICAÇÃO.paths[paths[index]] )
        request.parâmetros.operação = paths[ index ]
}

/**
 * Validação se o url e método informado possuem alguma operação na especificação.
 * Criação de variáveis url, caso haja
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
export async function Operações( request, response ){
    await obter_operação( request, response )
        
    // Operação não existente
    if( request.parâmetros.operação === "" ){
        response.statusCode = 404
        throw new Resultado( false, MENSAGENS.global.erro.operação_não_encontrada, 
            [{ 
                "rel": "especificação", 
                "href": `${ESPECIFICAÇÃO.servers[0].url}/`, 
                "type" : "GET" 
            }] 
        )
    }

    await obter_variáveis( request, response )
}

/**
 * Roteador para a operação correta
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
export async function Roteador( request, response ){
    let { operação, url: { método } } = request.parâmetros,
        rota = ROTAS[ operação ][ método ]
    await rota( request, response )
}