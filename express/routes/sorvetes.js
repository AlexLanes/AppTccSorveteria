"use strict"

// Dependencias
import * as db from "../../firebase/database/sorvetes.js"
import { status_mensagem } from "../../helper/status.js"
import dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
/**
 * Rotas dos sorvetes
 * @typedef { Express.Router }
 */
export const router = Express.Router()

router
	.get( `${process.env.API_PATH}/sorvetes`, async (request, response, next) => {
		let resultado = await db.obter_sorvetes(),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})
	.get( `${process.env.API_PATH}/sorvetes/:id`, async (request, response, next) => {
		let resultado = await db.obter_sorvete_id( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})
	.get( `${process.env.API_PATH}/sorvetes/:id/:campo`, async (request, response, next) => {
		let { id, campo } = request.params,
			resultado = await db.obter_campo_sorvete( id, campo ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})
	.post( `${process.env.API_PATH}/sorvetes`, async (request, response, next) => {
		let resultado = await db.adicionar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 201 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})
	.put( `${process.env.API_PATH}/sorvetes`, async (request, response, next) => {
		let resultado = await db.atualizar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})
	.delete( `${process.env.API_PATH}/sorvetes/:id`, async (request, response, next) => {
		let resultado = await db.apagar_sorvete( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
		next()
	})