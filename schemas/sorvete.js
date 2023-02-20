export class Sorvete {
	nome
	estoque
	url_imagem

	constructor( nome, estoque, url_imagem ){
		this.nome = nome
		this.estoque = estoque
		this.url_imagem = url_imagem
	}
}

import { validate } from "jsonschema"
export function validador_schema( objeto ){
	const schema = {
		"id": "sorvete",
		"type": "object",
		"required": ["nome", "estoque", "url_imagem"],
		"properties": {
			"nome": {
				"type": "string",
				"pattern": "^[\\w\\sÀ-ú]{3,}$"
			},
			"estoque": {
				"type": "boolean"
			},
			"url_imagem": {
				"type": "string"
			}
		}
	}
	return validate( objeto, schema ).valid
};