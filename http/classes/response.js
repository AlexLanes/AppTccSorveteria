// Dependências
import { IncomingMessage, ServerResponse } from "node:http"

export class Response extends ServerResponse {
    constructor( IncomingMessage ){
        super( IncomingMessage )
        this.body = {}
    }
}