"use strict"

export class Sorvete {
	nome
	estoque
	url_imagem

	/**
	 * Classe Sorvete
	 * @param   { string  } nome Nome do sorvete
	 * @param   { boolean } estoque Flag do estoque
	 * @param   { string  } url_imagem Url da imagem no Firebase Storage
	 * @returns { Sorvete }
	 */
	constructor( nome, estoque, url_imagem ){
		this.nome = nome
		this.estoque = estoque
		this.url_imagem = url_imagem
	}
}

import { validate } from "jsonschema"

export const schema = {
	"type": "object",
	"required": ["nome", "estoque", "url_imagem"],
	"properties": {
		"_id": {
			"type": "string",
			"pattern": "^\\w+$",
			"description": "Metadata do id"
		},
		"nome": {
			"type": "string",
			"pattern": "^[\\w\\sÀ-ú]{3,}$",
			"description": "Nome do sorvete"
		},
		"estoque": {
			"type": "boolean",
			"description": "Flag do estoque"
		},
		"url_imagem": {
			"type": "string",
			"description": "Url da imagem no Firebase Storage"
		}
	},
	"additionalProperties": false
}

/**
 * Validador da Classe e objetos Sorvete
 * @param   { Object } sorvete Objeto/Classe Sorvete
 * @returns { Primisse< boolean > } Retorna true caso seja compatível com o json-schema
 */
export async function validador( sorvete ){
	return validate( sorvete, schema ).valid
};

import { remover_acento } from "../helper/funções.js"

/**
 * Correção dos nomes dos sorvetes para padronização
 * @param  	{ string } nome Nome do sorvete
 * @returns { Promise< string > } Nome do sorvete sem acentuação e minúsculo
 */
export async function corrigir_nome( nome ){
	return ( typeof nome == "string" ) 
		? await remover_acento( nome.trim().toLowerCase() )
		: nome
}