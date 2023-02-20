// Inicializar router
import Express from "express"
export const router = Express.Router()

router.get( '/sorvetes', (request, response) => {
	response.send('Hello World!')
})