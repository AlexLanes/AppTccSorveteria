"use strict"

// Dependências
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from '../../schemas/mensagens.js'
import dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
/**
 * Middleware para validação e parse do conteúdo no body e validação do tipo da resposta aceita.
 * a API trabalho com "application/json" e "application/yaml"
 * @typedef { Express.Router }
 */
export const router = Express.Router()

router.all( '*', async (request, response, next) => {
    const { apikey } = request.headers
    let resultado = new Resultado( false )
   
    // header apikey não encontrado
    if( !apikey ){
        resultado.mensagem = MENSAGENS.global.erro.autorização_não_informada
        return response.status( 401 ).send( resultado )

    // apikey inválida
    } else if( apikey != process.env.API_KEY ){
        resultado.mensagem = MENSAGENS.global.erro.não_autorizado
        return response.status( 401 ).send( resultado )
    }

    // remover do header
    delete request.headers.apikey

    next()
})