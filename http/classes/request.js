// Dependências
import { IncomingMessage } from "node:http"

export class Request extends IncomingMessage {
    constructor(){
        super()
        this.body = {}
        this.parâmetros = {
            método: "",
            caminho: "",
            operação: "",
            headers: {},
            querys: {},
            variáveis: {}
        }
    }
}