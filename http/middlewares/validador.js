"use strict"

// Dependências
import { ESPECIFICAÇÃO, caminho_especificação, HEADERS } from "../../schemas/especificação.js"
import { schema_valido, isNullEmptyUndefined } from "../../helper/funções.js"
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { Response } from "../classes/response.js"
import { Request } from "../classes/request.js"

/**
 * Validar os parâmetros do schema request header/path/query
 * @param { Request } request 
 * @param { Object } espec Especificação da operação
 * @throws 
 * @returns { Promisse< void > }
 */
async function validar_body( request, espec ){
    // Não há body para ser validado
    if( !("requestBody" in espec) ) return

    // Request body não obrigatório e não foi informado
    else if( !espec.requestBody.required && Object.keys(request.body).length === 0 ) return

    // Request body obrigatório e não informado
    else if( espec.requestBody.required && Object.keys(request.body).length === 0 )
        throw "Request obrigatório não informado"

    // Request body e Schema
    else if( "content" in espec.requestBody ){
        let content = Object.keys( espec.requestBody.content )[0],
            schema = espec.requestBody.content[ content ].schema
        
        if( "$ref" in schema )
            schema = ESPECIFICAÇÃO.components.schemas[ schema["$ref"].split("/").slice(-1)[0] ]
        
        if( !await schema_valido(request.body, schema) )
            throw "Request body inválido"
    }
}

/**
 * Validar os parâmetros do schema request header/path/query
 * @param { Request } request 
 * @param { Object } parameter Schema do parameter
 * @param { String } parâmetro nome do parâmetro dentro do Request.parâmetros sendo validado
 * @throws
 * @returns { Promisse< void > }
 */
async function validar_parameter( request, parameter, parâmetro ){
    // Os nomes dos headers no request estão em lower-case
    let nome = ( parâmetro === "headers" ) ? parameter.name.toLowerCase() : parameter.name,
        valor = request.parâmetros[ parâmetro ][ nome ]

    // Required
    if( parameter.required && await isNullEmptyUndefined(valor) )
        throw `${parameter.in} '${nome}' é obrigatório de ser informado`

    // Default
    if( await isNullEmptyUndefined(valor) && "default" in parameter.schema ){
        valor = parameter.schema.default
        request.parâmetros[ parâmetro ][ nome ] = valor
    }

    // Type
    if( "type" in parameter.schema ){
        switch( parameter.schema.type ){
            // Todos os headers são transformados em string, nada a fazer
            case "string": break 
            // Converter para boolean se possível
            case "boolean":
                if( valor === "true" ) valor = true
                else if( valor === "false" ) valor = false
                else throw `${parameter.in} '${nome}' não é um boolean válido`
                break
            // Converter para integer se possível
            case "integer":
                if( !Number.isNaN(parseInt(valor)) ) valor = parseInt( valor )
                else throw `${parameter.in} '${nome}' não é um integer válido`
                break
            // Converter para float se possível
            case "number":
                if( !Number.isNaN(parseFloat(valor)) ) valor = parseFloat( valor )
                else throw `${parameter.in} '${nome}' não é um number válido`
                break
            // object, array e null não são validados
            default: break
        }
        
        request.parâmetros[ parâmetro ][ nome ] = valor
    }

    // Enum
    if( "enum" in parameter.schema && !parameter.schema.enum.includes(valor) )
        throw `${parameter.in} '${nome}' não prevê o valor '${valor}'`
}

/**
 * Validações obrigatórias
 * @param   { Request } request 
 * @param   { Response } response 
 * @throws  { Resultado }
 * @returns { Promisse< void > }
 */
async function obrigatório( request, response ){
    // Operação não existente
    if( request.parâmetros.operação === "" ){
        response.statusCode = 404
        throw new Resultado( false, MENSAGENS.global.erro.operação_não_encontrada, [{ 
            "rel": "especificação", 
            "href": `${ESPECIFICAÇÃO.servers[0].url}${await caminho_especificação()}`, 
            "type" : "GET" 
        }])
    }

    // Validação se a API pode responder em algum dos formatos requisitados, se não default
    request.parâmetros.headers.accept = request.parâmetros.headers.accept.split( "," )
        .find( item => HEADERS.accept.includes( item.split(";")[0] ))
    if( request.parâmetros.headers.accept == undefined )
        request.parâmetros.headers.accept = HEADERS.accept[ 1 ]
    
    // Padronização do Content-Type removendo o ";" se existir
    request.parâmetros.headers[ "content-type" ] = request.parâmetros.headers[ "content-type" ]
        .split( ";" )[ 0 ]
}

/**
 * Middleware de validação se a requisição está 
 * de acordo com a especificação.
 * @param   { Request } request 
 * @param   { Response } response 
 * @throws  { Resultado }
 * @returns { Promisse< void > }
 */
export async function Validador( request, response ){
    await obrigatório( request, response )

    let { método, operação } = request.parâmetros,
        espec = ESPECIFICAÇÃO.paths[ operação ][ método ]
    
    try {
        // Parameters
        for( let parameter of espec.parameters ){
            switch( parameter.in ){
                case "header": 
                    await validar_parameter( request, parameter, "headers" )
                    break
                case "query":
                    await validar_parameter( request, parameter, "querys" )
                    break
                case "path":
                    await validar_parameter( request, parameter, "variáveis" )
                    break
                default: break
            }
        }

        //Body
        await validar_body( request, espec )

    } catch( erro ){
        response.statusCode = 400
        throw new Resultado( false, MENSAGENS.global.erro.schema_inválido(erro) )
    }

    /**
     * Autorização 
     */ 
    if( "security" in espec && espec.security.length >= 1 ){
        // Por enquanto valida apenas a primeira security, pois podem haver várias
        let nome_security = Object.keys( espec.security[0] )[0],
            schema = ESPECIFICAÇÃO.components.securitySchemes[ nome_security ]
        
        switch( schema.type ){
            case "apiKey":
                let apikey = process.env.API_KEY,
                    // Nome dos headers estão sempre em lowercase
                    nome = ( schema.in === "header" ) ? schema.name.toLowerCase() : schema.name
                
                // Se não estiver nos headers ou nas querys
                if( !(nome in request.parâmetros[schema.in + "s"]) ){
                    response.statusCode = 401
                    throw new Resultado( false, MENSAGENS.global.erro.autorização_não_informada )

                // Autorização Incorreta
                } else if( request.parâmetros[schema.in + "s"][nome] !== apikey ){
                    response.statusCode = 401
                    throw new Resultado( false, MENSAGENS.global.erro.não_autorizado )
                }
                
                break
        }
    }
}