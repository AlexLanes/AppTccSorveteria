"use strict"

// Dependencias
import * as strg from "../../firebase/storage/sorvetes.js"
import * as db from "../../firebase/database/sorvetes.js"
import { status_mensagem } from "../../helper/status.js"
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"

/**
 * Rotas para as operações do Sorvete
 */
export default {
	"/sorvetes": {
		/**
		 * Obter todos os sorvetes
		 * @param   { Request } request 
		 * @param   { Response } response
		 * @returns { Promisse< void > }
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
		 * @param   { Request } request 
		 * @param   { Response } response
		 * @returns { Promisse< void > }
		 */
		"post": async( request, response ) => {
			let resultado = await db.adicionar_sorvete( request.body ),
				codigo = ( resultado.sucesso ) 
					? 201 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		}
	},
	"/sorvetes/{id}": {
		/**
		 * Obter sorvete pelo id
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< void > }
		 */
		"get": async( request, response ) => {
			let { id } = request.parâmetros.variáveis,
				resultado = await db.obter_sorvete_id( id ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Atualizar Sorvete
		 * @param   { Request } request 
		 * @param   { Response } response
		 * @returns { Promisse< void > }
		 */
		"put": async( request, response ) => {
			let { id } = request.parâmetros.variáveis,
				resultado = await db.atualizar_sorvete( id, request.body ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )
	
			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Apagar sorvete pelo id
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< void > }
		 */
		"delete": async( request, response ) => {
			let { id } = request.parâmetros.variáveis,
				resultado = await db.apagar_sorvete( id ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		}
	},
	"/sorvetes/imagens": {
		/**
		 * Obter as urls das imagens dos sorvetes
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< void > }
		 */
		"get": async( request, response ) => {
			let resultado = await strg.obter_imagens_sorvetes(),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Upload de imagem de sorvete
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< void > }
		 */
		"post": async( request, response ) => {
			let resultado = await strg.upload_imagem_sorvete( request.body ),
				codigo = ( resultado.sucesso ) 
					? 201 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		},

		/**
		 * Apagar imagem de sorvete pelo nome
		 * @param   { Request } request 
		 * @param   { Response } response 
		 * @returns { Promisse< void > }
		 */
		"delete": async( request, response ) => {
			let { nome } = request.parâmetros.querys,
				resultado = await strg.apagar_imagem_sorvete( nome ),
				codigo = ( resultado.sucesso ) 
					? 200 
					: await status_mensagem( resultado.mensagem )

			response.statusCode = codigo
			response.body = resultado
		}
	}
}