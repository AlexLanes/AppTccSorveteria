"use strict"

// Inicializar router
import Express from "express"
export const router = Express.Router()

// Dependências
import { Resultado } from "../../schemas/resultado.js"

/**
 * Variável que será carregado todas os caminhos das operações em "../Routes"
 * @type { Array< String > }
 */
// var Operações = [ ...rotas_sorvetes ]

router.all( '*', (request, response, next) => {
    if( !Operações.includes(request.path) )
        response.status( 404 ).send( new Resultado(false, "Operação não encontrada") )
    else next()
})