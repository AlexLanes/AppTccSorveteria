"use strict"

// Dependencias
import { ESPECIFICAÇÃO } from "../../schemas/especificação.js"
import dotenv from "dotenv"
dotenv.config()

/**
 * Rotas para obter a especificação da API
 */
export default {
    "/": {
		/**
		 * Obter especificação da API
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"get": async( request, response ) => {
			response.statusCode = 200
			response.body = ESPECIFICAÇÃO
		}
    }
}