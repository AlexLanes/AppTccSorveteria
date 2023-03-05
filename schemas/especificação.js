// Dependências
import * as Resultado from "./resultado.js"
import { MENSAGENS } from "./mensagens.js"
import * as Sorvete from "./sorvete.js"
import dotenv from "dotenv"
dotenv.config()

/** 
 * Accept e Content-Type aceitos pela API
 */
export const HEADERS = {
    accept : [ "*/*", "application/json", "application/x-yaml" ],
    "content-type": [ "application/json", "application/x-yaml", "multipart/form-data" ]
}

/**
 * Padroes da especificação reutilizáveis
 */
const PADRÕES = {
    /** Tags utilizadas na especificação */
    tags: [ "especificação", "sorvete", "anexo" ],

    /** Request Parameters */
    parameters: {
        /**
         * Parâmetro Content-Type. Enum parametrizado
         * @param { Array< String > } _enum
         */
        "Content-Type": async( _enum ) => {
            return {
                "name": "Content-Type",
                "description": "Formatos aceitos no corpo da requisição",
                "in": "header",
                "required": true,
                "schema": {
                    "type": "string",
                    "enum": ( Array.isArray(_enum) ) ? _enum : HEADERS["content-type"]
                }
            }
        },
        
        Accept: {
            "name": "Accept",
            "description": "Formatos possíveis de resposta",
            "in": "header",
            "required": false,
            "schema": {
                "type": "string",
                "enum": HEADERS.accept,
                "default": HEADERS.accept[ 1 ]
            }
        },

        /**
         * Parameter Query
         * @param { String } nome nome do query parameter
         * @param { String } descrição descrição do query parameter
         * @param { Boolean } required flag obrigatório
         * @param { Object } schema schema do query parameter
         * @returns
         */
        query: async( nome, descrição, required, schema ) => {
            return {
                "name": nome,
                "description": descrição,
                "in": "query",
                "required": required,
                "schema": schema
            }
        }
    },

    /**
     * @param { String } description Descrição do Request
     * @param { String } schema Nome do schema que fica dentro de "#/components/schemas/"
     * @param { Object } example Exemplo do request
     * @param { String } conteúdo Tipo do conteúdo do request. Default "*//*"
     */
    request: ( description, schema, example, conteúdo = HEADERS.accept[0] ) => {
        return {
            "required": true,
            "description": description,
            "content": {
                [conteúdo]: {
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
     * @returns Objeto no formato response
     */
    response: ( description, example ) => {
        return {
            "description": description,
            "content": {
                "*/*": {
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
            "url_imagem": "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=c7624c25-df93-4118-8ea5-f0a81808dabb",
            "estoque": true,
            "nome": "chocolate"
        },
        sorvete_id: {
            "_id": "3kzmnXJAHZqgptsHFwjc",
            "url_imagem": "",
            "estoque": true,
            "nome": "chocolate"
        },
        sorvete_imagem: {
            "nome": "chocolate.jpeg",
            "url": "https://firebasestorage.googleapis.com/v0/b/apptccsorveteria.appspot.com/o/sorvetes%2Fchocolate.jpeg?alt=media&token=7a785639-d222-4856-a63a-8f21b9838ffa"
        },
        anexo: {
            "nome": "chocolate.jpeg",
            "tipo": "image/jpeg",
            "anexo": "{Anexo}"
        }
    }
}

/**
 * Encontrar a tag "especificação" e retornar o caminho da operação
 * @returns { Promise< String > }
 */
export async function caminho_especificação(){
    let caminho = Object.keys( ESPECIFICAÇÃO.paths )
        .find( caminho => Object
            .values( ESPECIFICAÇÃO.paths[caminho] )
            .some( método => método.tags.includes(PADRÕES.tags[0]) )
        )
    
    return ( caminho != undefined ) 
        ? caminho 
        : "/"
}

/**
 * Especificação OpenAPI da API
 */
export const ESPECIFICAÇÃO = {
    "openapi": "3.0.0",
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
                "summary": "Obter a especificação da API. Não é necessário informar a apikey",
                "parameters": [
                    PADRÕES.parameters.Accept
                ],
                "responses": {
                  "200": {
                    "description": "Sucesso"
                  }
                }
            }
        },
        "/sorvetes": {
            "get": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "obter-sorvetes",
                "summary": "Obter sorvetes",
                "parameters": [
                    PADRÕES.parameters.Accept,
                    await PADRÕES.parameters.query( "_id", "ID do sorvete para obter apenas o desejado", false, {
                        type: "string"
                    })
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        "Sucesso, dado(s) retornado(s)", 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_obtido( 1 ), [ PADRÕES.exemplos.sorvete_id ] )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.schema_inválido( "{Item que falhou validação}" ), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
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
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            },
            "post": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "criar-sorvete",
                "summary": "Criar sorvete",
                "parameters": [
                    PADRÕES.parameters.Accept, 
                    await PADRÕES.parameters["Content-Type"]( HEADERS["content-type"].slice(0, 2) )
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
                        MENSAGENS.global.erro.schema_inválido( "{Item que falhou validação}" ), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
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
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            },
            "put": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "atualizar-sorvete",
                "summary": "Atualizar sorvete",
                "parameters": [
                    PADRÕES.parameters.Accept, 
                    await PADRÕES.parameters["Content-Type"]( HEADERS["content-type"].slice(0, 2) ),
                    await PADRÕES.parameters.query( "_id", "ID do sorvete que será atualizado", true, {
                        type: "string"
                    })
                ],
                "requestBody": PADRÕES.request( 
                    "Novo documento que substituirá o original", 
                    "sorvete",
                    PADRÕES.exemplos.sorvete
                ),
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_atualizado, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_atualizado, [ PADRÕES.exemplos.sorvete_id ] )
                    ),
                    "400": PADRÕES.response(
                        "Schema incorreto ou _id não informado", 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
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
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            },
            "delete": {
                "tags": [ PADRÕES.tags[1] ],
                "operationId": "apagar-sorvete",
                "summary": "Apagar sorvete pelo id",
                "parameters": [
                    PADRÕES.parameters.Accept,
                    await PADRÕES.parameters.query( "_id", "ID do sorvete que será apagado", true, {
                        type: "string"
                    })
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        MENSAGENS.sorvete.sucesso.sorvete_apagado, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.sorvete_apagado )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.schema_inválido( "{Item que falhou validação}" ), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
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
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            }
        },
        "/sorvetes/imagens": {
            "get": {
                "tags": PADRÕES.tags.slice( 1, 3 ),
                "operationId": "obter-imagens-sorvetes",
                "summary": "Obter as urls das imagens dos sorvetes",
                "parameters": [
                    PADRÕES.parameters.Accept, 
                ],
                "responses": {
                    "200": PADRÕES.response( 
                        "Urls obtidos com sucesso", 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.obter_imagens( 1 ), [PADRÕES.exemplos.sorvete_imagem] )
                        
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "500": PADRÕES.response(
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            },
            "post": {
                "tags": PADRÕES.tags.slice( 1, 3 ),
                "operationId": "upload-imagem-sorvete",
                "summary": "Upload de imagem de sorvete",
                "parameters": [
                    PADRÕES.parameters.Accept,
                    await PADRÕES.parameters["Content-Type"]( [HEADERS["content-type"][2]] )
                ],
                "requestBody": PADRÕES.request( 
                        "Upload de imagem. Nome e Formato são obtidos do anexo caso omitido", 
                        "anexo",
                        PADRÕES.exemplos.anexo,
                        HEADERS[ "content-type" ][ 2 ]
                ),
                "responses": {
                    "201": PADRÕES.response(
                        MENSAGENS.sorvete.sucesso.upload, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.upload, [PADRÕES.exemplos.sorvete_imagem] )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.schema_inválido( "{Item que falhou validação}" ), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "500": PADRÕES.response(
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            },
            "delete": {
                "tags": PADRÕES.tags.slice( 1, 3 ),
                "operationId": "apagar-imagem-sorvete",
                "summary": "Apagar imagem de sorvete pelo nome",
                "parameters": [
                    PADRÕES.parameters.Accept,
                    await PADRÕES.parameters.query( "nome", "Nome da imagem", true, {
                        type: "string"
                    })
                ],
                "responses": {
                    "200": PADRÕES.response(
                        MENSAGENS.sorvete.sucesso.imagem_apagada, 
                        new Resultado.Resultado( true, MENSAGENS.sorvete.sucesso.imagem_apagada )
                    ),
                    "400": PADRÕES.response(
                        MENSAGENS.global.erro.schema_inválido( "{Item que falhou validação}" ), 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.schema_inválido("{Item que falhou validação}") )
                    ),
                    "401": PADRÕES.response(
                        MENSAGENS.global.erro.não_autorizado, 
                        new Resultado.Resultado( false, MENSAGENS.global.erro.não_autorizado )
                    ),
                    "404": PADRÕES.response(
                        MENSAGENS.sorvete.erro.imagem_não_encontrada, 
                        new Resultado.Resultado( false, MENSAGENS.sorvete.erro.imagem_não_encontrada )
                    ),
                    "500": PADRÕES.response(
                        "Erro interno",
                        new Resultado.Resultado( false, MENSAGENS.global.erro.interno("{Detalhe erro}") )
                    )
                },
                "security": [{
                  "apikey": []
                }]
            }
        }
    },
    "components": {
        "schemas": {
            "resultado": Resultado.SCHEMA,
            "sorvete": Sorvete.SCHEMA_SORVETE,
            "anexo": {
                "type": "object",
                "required": [ "anexo" ],
                "properties": {
                    "nome": {
                        "type": "string",
                        "description": "Nome do anexo"
                    },
                    "tipo": {
                        "type": "string",
                        "description": "Tipo MIME do anexo"
                    },
                    "anexo": {
                        "description": "Conteúdo anexado"
                    }
                },
                "additionalProperties": false
            }
        },
        "securitySchemes": {
            "apikey": {
                "type": "apiKey",
                "in": "header",
                "name": "apikey"
            }
        }
    }
}