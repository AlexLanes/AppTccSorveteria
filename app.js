"use strict"

// Inicialização de pacotes
import * as dotenv from "dotenv"
import Express from "express"
import compression from "compression"

// Variáveis
dotenv.config()

/**
 * Inicialização do express App
 */
export const express = Express()

// Configurando middleware de inicialização
express.use( Express.json() )
express.use( compression() )
import { router as autorização } from "./express/middleware/autorização.js"
express.use( autorização )
// import { router as operações } from "./express/middleware/operações.js"
// express.use( operações )

// Carregando routers do express dinamicamente
import fs from "fs-extra"
const routes = "./express/routes"
fs.readdirSync( routes ).forEach( async (arquivo) => {
	let { router } = await import( `${routes}/${arquivo}` )
	express.use( router )
})

express.listen( process.env.PORT, () => {
	console.log(`App executando na porta ${process.env.PORT}`)
})