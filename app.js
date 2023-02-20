"use strict"

// Inicializar o dotenv
import * as dotenv from "dotenv"
dotenv.config()

// Inicializar o express
import Express from "express"
export const express = Express()

// Configurando middleware
import { router as autorização } from "./express/middleware/autorização.js"
express.use( autorização )
express.use( Express.json() )

// Carregando rotas do express dinamicamente
import fs from "fs-extra"
const routes = "./express/routes"
fs.readdirSync( routes ).forEach( async (arquivo) => {
	let { router } = await import( `${routes}/${arquivo}` )
	express.use( router )
})

express.listen(80, () => {
	console.log(`Example app listening on port 80`)
})