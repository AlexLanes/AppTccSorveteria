// Dependências
import dotenv from "dotenv"
dotenv.config()

// Schemas 
import * as Sorvete from "./sorvete.js"
import * as Resultado from "./resultado.js"
import { TIPOS } from "../express/middleware/requisição.js"
import { MENSAGENS } from "./mensagens.js"

/**
 * Padroes da especificação reutilizáveis
 * @typedef { Object }
 */
const PADRÕES = {
    /** Tags utilizadas na especificação */
    tags: [ "especificação", "sorvetes" ],

    /** Request Parameters */
    parameters: {
        "Content-Type": {
            "name": "Content-Type",
            "description": "Formatos aceitos no corpo da requisição",
            "in": "header",
            "required": true,
            "schema": {
                "type": "string",
                "enum": TIPOS["content-type"]
            }
        },
        "Accept": {
            "name": "Accept",
            "description": "Formatos possíveis de resposta",
            "in": "header",
            "required": true,
            "schema": {
                "type": "string",
                "enum": TIPOS.accept,
                "default": TIPOS.accept[ 1 ]
            }
        },
        id: {
            "name": "id",
            "description": "identificador item",
            "in": "path",
            "required": true,
            "schema":{
                "type": "string",
                "pattern": "^\\w+$"
            }
        },
        campo: {
            "name": "campo",
            "description": "Nome do campo desejado",
            "in": "path",
            "required": true,
            "schema":{
                "type": "string"
            }
        }
    },

    /**
     * @param   { String } description Descrição do Request 
     * @param   { String } schema Nome do schema que fica dentro de "#/components/schemas/"
     * @param   { any } example Exemplo do request
     * @returns { Object } Objeto no formato requestBody
     */
    request: ( description, schema, example ) => {
        return {
            "required": true,
            "description": description,
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": `#/components/schemas/${schema}`
                    },
                    "example": example
                }
            }
        }
    },

    /**
     * @param   { String } description Descrição do Response 
     * @param   { Resultado.Resultado } example Exemplo do response
     * @returns { Object } Objeto no formato response
     */
    response: ( description, example ) => {
        return {
            "description": description,
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/resultado"
                    },
                    "example": example
                }
            }
        }
    },

    /** Exemplos fixos */
    exemplos: {
        sorvete: {
            "url_imagem": "",
            "estoque": true,
            "nome": "chocolate"
        },
        sorvete_id: {
            "_id": "3kzmnXJAHZqgptsHFwjc",
            "url_imagem": "",
            "estoque": true,
            "nome": "chocolate"
        }
    }
}

/**
 * Especificação OpenAPI
 * @typedef { Object }
 */
export const especificação = {
    "openapi": "3.1.0",
    "info": {
        "version": "1.0.0",
        "title": "AppTccSorveteria",
        "description": "API que faz integração com o Firebase"
    },
    "servers": [{
        "url": `https://${process.env.API_HOST}${process.env.API_PATH}`,
        "description": "Base URL para a API"
    }],
    "paths": {
        "/": {
            "get": {
                "tags": [ PADRÕES.tags[0] ],
                "operationId": "obter-especificação",
                "summary": "Obter a especificação da API",
                "parameters": [
                    PADRÕES.parameters.Accept, PADRÕES.parameters["Content-Type"]
                ]
            }
        },
        "/sorvetes": {
            "get": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "obter-sorvetes",
                "summary": "Obter todos os sorvetes",
                "parameters": [
                    PADRÕES.parameters.Accept, PADRÕES.parameters["Content-Type"]
                ],
                "responses": {
                    "200": PADRÕES.response(
                        "Sucesso", 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_obtido(1), [PADRÕES.exemplos.sorvete_id] )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            },
            "post": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "criar-sorvete",
                "summary": "Criar sorvete",
                "parameters": [
                    PADRÕES.parameters.Accept, PADRÕES.parameters["Content-Type"]
                ],
                "requestBody": PADRÕES.request( 
                        "Sorvete que será adicionado. O _id é automático e não é considerado na criação", 
                        "sorvete",
                        PADRÕES.exemplos.sorvete
                ),
                "responses": {
                    "201": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_adicionado, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_adicionado, [ PADRÕES.exemplos.sorvete_id ] )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.schema_inválido, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "409": PADRÕES.response(
                        MENSAGENS.sorvete.erro.sorvete_duplicado, 
                        new Resultado.Resultado( false, MENSAGENS.sorvete.erro.sorvete_duplicado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            },
            "put": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "atualizar-sorvete",
                "summary": "Atualizar sorvete",
                "parameters": [
                    PADRÕES.parameters.Accept, PADRÕES.parameters["Content-Type"]
                ],
                "requestBody": PADRÕES.request( 
                    "Sorvete que será atualizado. O _id é necessário para a atualização", 
                    "sorvete",
                    PADRÕES.exemplos.sorvete_id
                ),
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_atualizado, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_atualizado, [ PADRÕES.exemplos.sorvete_id ] )
                    ),
                    "400": PADRÕES.response(
                        "Schema incorreto ou _id não informado", 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            }
        },
        "/sorvetes/{id}": {
            "get": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "obter-sorvete-id",
                "summary": "Obter sorvete pelo id",
                "parameters": [
                    PADRÕES.parameters.id,
                    PADRÕES.parameters.Accept, 
                    PADRÕES.parameters["Content-Type"]
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_obtido( 1 ), 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_obtido( 1 ), [ PADRÕES.exemplos.sorvete_id ] )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.id_invalido, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.id_invalido )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "404": PADRÕES.response(
                        MENSAGENS.sorvete.erro.não_encontrado, 
                        new Resultado.Resultado( false, MENSAGENS.sorvete.erro.não_encontrado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            },
            "delete": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "apagar-sorvete",
                "summary": "Apagar sorvete pelo id",
                "parameters": [
                    PADRÕES.parameters.id,
                    PADRÕES.parameters.Accept, 
                    PADRÕES.parameters["Content-Type"]
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_apagado, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_apagado )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.id_invalido, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.id_invalido )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "404": PADRÕES.response(
                        MENSAGENS.sorvete.erro.não_encontrado, 
                        new Resultado.Resultado( false, MENSAGENS.sorvete.erro.não_encontrado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            }
        },
        "/sorvetes/{id}/{campo}": {
            "get": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "obter-campo-sorvete-id",
                "summary": "Obter campo de sorvete pelo id",
                "parameters": [
                    PADRÕES.parameters.id,
                    PADRÕES.parameters.campo,
                    PADRÕES.parameters.Accept, 
                    PADRÕES.parameters["Content-Type"]
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.campo_obtido, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.campo_obtido, [ "Valor do campo" ] )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.campo_inválido, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.campo_inválido )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "404": PADRÕES.response(
                        MENSAGENS.sorvete.erro.não_encontrado, 
                        new Resultado.Resultado( false, MENSAGENS.sorvete.erro.não_encontrado )
                    ),
                    "500": PADRÕES.response(
                        MENSAGENS.global.erro.interno("{Detalhe erro}"), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                }
            }
        }
    },
    "components": {
        "schemas": {
            "resultado": Sorvete.SCHEMA,
            "sorvete": Resultado.SCHEMA
        },
        "securitySchemes": {
            "ApiKey": {
                "type": "apiKey",
                "in": "header",
                "name": "apikey"
            }
        }
    },
    "security": [{
        "ApiKey": []
    }]
}