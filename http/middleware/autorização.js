"use strict"

// Dependências
import { caminho_especificação } from "../../schemas/especificação.js"
import { IncomingMessage, ServerResponse } from "node:http"
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import dotenv from "dotenv"
dotenv.config()

/**
 * Validação da APIKEY
 * @param   { IncomingMessage } request 
 * @param   { ServerResponse } response 
 * @returns { Promisse< void > }
 */
export async function Autorização( request, response ){
    const { apikey } = request.headers,
          { url: caminho } = request,
          { resultados: [especificação] } = await caminho_especificação()
    
    // operação da especificação não precisa de autorização
    if( caminho === especificação )
        return
    // header apikey não encontrado
    else if( apikey === undefined ){
        response.statusCode = 401
        throw new Resultado( false, MENSAGENS.global.erro.autorização_não_informada )
    }
    // apikey inválida
    else if( apikey != process.env.API_KEY ){
        response.statusCode = 401
        throw new Resultado( false, MENSAGENS.global.erro.não_autorizado )
    }
}