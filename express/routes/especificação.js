"use strict"

// Dependencias
import { especificação } from "../../schemas/especificação.js"
import dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
/**
 * Rotas dos sorvetes
 * @typedef { Express.Router }
 */
export const router = Express.Router()

router.get( `${process.env.API_PATH}/`, async (request, response, next) => {
    response.status( 200 ).send( especificação )
    next()
})