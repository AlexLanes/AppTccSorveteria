"use strict"

// Inicializar router
import Express from "express"
/**
 * Rotas dos sorvetes
 * @type { Express.Router }
 */
export const router = Express.Router()

/// Dependencias
import * as db from "../../firebase/database/sorvetes.js"
import { status_mensagem } from "../../helper/status.js"
import * as dotenv from "dotenv"
dotenv.config()

router
	.get( `${process.env.apiPath}/sorvetes`, async (request, response) => {
		let resultado = await db.obter_sorvetes(),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.get( `${process.env.apiPath}/sorvetes/:id`, async (request, response) => {
		let resultado = await db.obter_sorvete_id( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.get( `${process.env.apiPath}/sorvetes/:id/:campo`, async (request, response) => {
		let { id, campo } = request.params,
			resultado = await db.obter_campo_sorvete( id, campo ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.post( `${process.env.apiPath}/sorvetes`, async (request, response) => {
		let resultado = await db.adicionar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 201 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.put( `${process.env.apiPath}/sorvetes`, async (request, response) => {
		let resultado = await db.atualizar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.delete( `${process.env.apiPath}/sorvetes/:id`, async (request, response) => {
		let resultado = await db.apagar_sorvete( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})