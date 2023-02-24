"use strict"

// Dependencias
import { IncomingMessage, ServerResponse } from "node:http"
import * as db from "../../firebase/database/sorvetes.js"
import { status_mensagem } from "../../helper/status.js"
import { Resultado } from "../../schemas/resultado.js"

/**
 * Rotas para as operações do Sorvete
 */
export default {
	"/sorvetes": {
		/**
		 * Obter todos os sorvetes
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"get": async( request, response ) => {
			let resultado = await db.obter_sorvetes(),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Adicionar Sorvete
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"post": async( request, response ) => {
			let resultado = await db.adicionar_sorvete( request.body ),
				codigo = ( resultado.sucesso ) 
					? 201 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Atualizar Sorvete
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"put": async( request, response ) => {
			let resultado = await db.atualizar_sorvete( request.body ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )
	
			response.statusCode = codigo
			response.body = resultado
		}
	},
	"/sorvetes/{id}": {
		/**
		 * Obter sorvete pelo id
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"get": async( request, response ) => {
			let { id } = request.parâmetros.url.variáveis,
				resultado = await db.obter_sorvete_id( id ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Apagar sorvete pelo id
		 * @param   { IncomingMessage } request 
		 * @param   { ServerResponse } response 
		 * @returns { Promisse< Resultado > }
		 */
		"delete": async( request, response ) => {
			let { id } = request.parâmetros.url.variáveis,
				resultado = await db.apagar_sorvete( id ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		}
	},
	"/sorvetes/{id}/{campo}": {
		"get": async( request, response ) => {
			let { id, campo } = request.parâmetros.url.variáveis,
				resultado = await db.obter_campo_sorvete( id, campo ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		}
	}
}