"use strict"

// Dependências
import { Resultado } from "../../schemas/resultado.js"
import { especificação } from "../../schemas/especificação.js"
import { MENSAGENS } from "../../schemas/mensagens.js"

// Inicializar router
import Express from "express"
/**
 * Middleware de validação de caminho e método das operações existentes.
 * @typedef { Express.Router }
 */
export const router = Express.Router()

/**
 * @param   { String } caminho Path do request pós Base Url
 * @param   { String } método Método HTTP
 * @returns { Promisse< Boolean > } Retorna true caso a caminho e méotodo do request tenha uma operação válida
 */
async function operação_existente( caminho, método ){
    // caminhos registrados na especificação
    let paths = Object.keys( especificação.paths ),
    // index do caminho na variável path, se não -1
    index = paths
        .map( path => `^${path.replace( /{[\wÀ-ú]+}/gi, "[\\wÀ-ú]+" )}$` )
        .findIndex( path => new RegExp(path).test(caminho) )
    
    return index !== -1 && método in especificação.paths[ paths[index] ]
}

router.all( '*', async (request, response, next) => {
    let { path, method } = request,
        link = [{ 
            "rel": "especificação", 
            "href": `${especificação.servers[0].url}/`, 
            "type" : "GET" 
        }],
        resultado = new Resultado( false, MENSAGENS.global.erro.operação_não_encontrada, link )
    
    path = decodeURI( path.replace(process.env.API_PATH, "") )
    method = method.toLocaleLowerCase()

    // Operação não existente
    if( !await operação_existente(path, method) )
        response.status( 404 ).send( resultado )
    
    next()
})