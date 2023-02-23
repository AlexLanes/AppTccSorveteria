"use strict"

import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"

// Inicializar router
import Express from "express"
/**
 * Middleware de validação de caminho e método das operações existentes.
 * @typedef { Express.Router }
 */
export const router = Express.Router()

router
	.use( async ( erro, request, response, next ) => {
		let resultado = new Resultado(
			false, MENSAGENS.global.erro.interno( erro ) 
		)

		response.status( 500 ).send( resultado )
		return next()
	})