"use strict"

// Dependencias
import { ESPECIFICAÇÃO } from "../../schemas/especificação.js"
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"

/**
 * Rotas para obter a especificação da API
 */
export default {
    "/": {
		/**
		 * Obter especificação da API
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< ESPECIFICAÇÃO > }
		 */
		"get": async( request, response ) => {
			response.statusCode = 200
			response.body = ESPECIFICAÇÃO
		}
    }
}