import { Resultado } from "../../schemas/resultado.js"

// Inicializar o dotenv
import * as dotenv from "dotenv"
dotenv.config()

// Inicializar router
import Express from "express"
export const router = Express.Router()

router.all( '*', (request, response, next) => {
    const { authorization } = request.headers
    let resultado = new Resultado( false )
   
    // header authorization não encontrado
    if( !authorization ){
        resultado.mensagem = "Autorização não informada"
        response.status( 401 ).send( resultado )
        return
    // autorização não é uma apikey
    } else if( authorization.split( " " )[0].toLowerCase() != "apikey" ){
        resultado.mensagem = "Autorização restrita a apikey"
        response.status( 401 ).send( resultado )
        return
    // apikey inválida
    } else if( authorization.split( " " )[1] != process.env.apikey ){
        resultado.mensagem = "Falha na autorização"
        response.status( 401 ).send( resultado )
        return
    }

    next()
})