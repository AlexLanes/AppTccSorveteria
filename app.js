"use strict"

// Dependências
import dotenv from "dotenv"
import Express from "express"
import { router as autorização } from "./express/middleware/autorização.js"
import { router as requisição } from "./express/middleware/requisição.js"
import { router as operações } from "./express/middleware/operações.js"
import { router as resposta } from "./express/middleware/resposta.js"
import { router as erro } from "./express/middleware/erro.js"

// Iniciar dotenv
dotenv.config()

/**
 * Inicialização do express App
 * @typedef { Express }
 */
export const express = Express()

// Configurando middleware anteriores às rotas
express.use( autorização )
express.use( requisição )
express.use( operações )

// Carregando routers do express dinamicamente
import fs from "fs-extra"
const routes = "./express/routes"
fs.readdirSync( routes ).forEach( async (arquivo) => {
	let { router } = await import( `${routes}/${arquivo}` )
	express.use( router )
})

// Configurando middleware posteriores às rotas
express.use( erro )
express.use( resposta )

express.listen( process.env.PORT, () => {
	console.log( `App executando na porta ${process.env.PORT}` )
})
