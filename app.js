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
import { router as autorização } from "./express/middleware/autorização.js"
express.use( Express.json() )
express.use( compression() )
express.use( autorização )

// Carregando rotas do express dinamicamente
import fs from "fs-extra"
const routes = "./express/routes"
fs.readdirSync( routes ).forEach( async (arquivo) => {
	let { router } = await import( `${routes}/${arquivo}` )
	express.use( router )
})

express.listen( 80, () => {
	console.log(`Example app listening on port 80`)
})