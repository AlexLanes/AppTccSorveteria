"use strict"

// Inicializar router
import Express from "express"
export const router = Express.Router()

import * as db from "../../firebase/database/sorvetes.js"
import { status_mensagem } from "../../helper/status.js"

router
	.get( "/sorvetes", async (request, response) => {
		let resultado = await db.obter_sorvetes(),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.get( "/sorvetes/:id", async (request, response) => {
		let resultado = await db.obter_sorvete_id( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.get( "/sorvetes/:id/:campo", async (request, response) => {
		let { id, campo } = request.params,
			resultado = await db.obter_campo_sorvete( id, campo ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.post( "/sorvetes", async (request, response) => {
		let resultado = await db.adicionar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 201 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.put( "/sorvetes", async (request, response) => {
		let resultado = await db.atualizar_sorvete( request.body ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})
	.delete( "/sorvetes/:id", async (request, response) => {
		let resultado = await db.apagar_sorvete( request.params.id ),
			codigo = ( resultado.sucesso ) 
				? 200 
				: await status_mensagem( resultado.mensagem )

		response.status( codigo ).send( resultado )
	})