"use strict"

// Dependências
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"
import fs from "node:fs"

/**
 * Armazenará todas as rotas. 
 * {
 *  [caminho]: {
 *      [método]: async function()
 *  }
 * }
 */
const ROTAS = {}

// Carregando todas as rotas dinamicamente e armazenando em `ROTAS`
fs.readdirSync( "./http/routes" ).forEach( async(arquivo) => {
	let { default: rota } = await import( `../routes/${arquivo}` )
    Object.assign( ROTAS, rota )
})

/**
 * Middleare de roteamento para a operação correta.
 * O Middleware de validação garante que o request que
 * chegue até o Roteador existe
 * @param   { Request } request 
 * @param   { Response } response 
 * @returns { Promisse< void > }
 */
export async function Roteador( request, response ){
    let { operação, método } = request.parâmetros,
        rota = ROTAS[ operação ][ método ]

    await rota( request, response )
}