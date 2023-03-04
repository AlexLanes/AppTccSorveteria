"use strict"

// Dependências
import { Requisição } from "./http/middlewares/requisição.js"
import { Validador } from "./http/middlewares/validador.js"
import { Resposta } from "./http/middlewares/resposta.js"
import { Roteador } from "./http/middlewares/roteador.js"
import { Erro } from "./http/middlewares/erro.js"
import { createServer } from "node:http"
import dotenv from "dotenv"
dotenv.config()

/**
 * Criação do Servidor
 * 
 * Não foi possível usar as classes Request e Response
 * que são extends do IncomingMessage.
 * Problema com o Formidable não conseguir interpretar o multipart/form
 */ 
createServer()

// Inicialização do Servidor
.listen( process.env.PORT )

// Ouvinte dos Requests 
.on( "request", async( request, response ) => {
	try {
		await Requisição( request, response )
		await Validador( request, response )
		await Roteador( request, response )
		
	} catch( erro ){
		await Erro( response, erro )
		
	} finally {
		await Resposta( request, response )
	}
	
	// Encerrar request
	response.end()
})