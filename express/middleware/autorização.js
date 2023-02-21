"use strict"

import { Resultado } from "../../schemas/resultado.js"

// Inicializar o dotenv
import * as dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
export const router = Express.Router()

router.all( '*', (request, response, next) => {
    const { apikey } = request.headers
    let resultado = new Resultado( false )
   
    // header apikey não encontrado
    if( !apikey ){
        resultado.mensagem = "Autorização não informada"
        response.status( 401 ).send( resultado )
        return

    // apikey inválida
    } else if( apikey != process.env.apikey ){
        resultado.mensagem = "Não autorizado"
        response.status( 401 ).send( resultado )
        return
    }

    next()
})