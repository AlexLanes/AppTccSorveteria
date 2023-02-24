"use strict"

// Dependências
import { Operações, Roteador } from "./http/middleware/operações.js"
import { Autorização } from "./http/middleware/autorização.js"
import { Requisição } from "./http/middleware/requisição.js"
import { Resposta } from "./http/middleware/resposta.js"
import { Erro } from "./http/middleware/erro.js"
import { createServer } from "node:http"
import dotenv from "dotenv"
dotenv.config()

const app = 
	// Criação do Servidor
	createServer()

	// Inicialização do Servidor
	.listen( process.env.PORT )

	// Ouvinte dos Requests
	.on( "request", async( request, response ) => {
		try {
			await Requisição( request, response )
			await Operações( request, response )
			await Autorização( request, response )
			await Roteador( request, response )

		} catch( erro ){
			await Erro( response, erro )
		
		} finally {
			await Resposta( request, response )
		}
		
		// Encerrar request
		response.end()
	})