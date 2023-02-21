"use strict"

export class Resultado {
	sucesso
	mensagem
	resultados

	/**
	 * Classe resultado padrão para resposta do Express e Firebase
	 * @param  { Boolean   } sucesso Mensagem foi bem sucedida ou não. Default: True
	 * @param  { String    } mensagem Texto sobre o resultado obtido. Default: ""
	 * @param  { Array     } resultados Itens de resposta, caso haja. Default: []
	 * @return { Resultado } Classe Resultado
	 */
	constructor( sucesso, mensagem, resultados ){
		this.sucesso = ( sucesso === undefined || typeof sucesso !== "boolean" )
			? true
			: sucesso
		this.mensagem = ( mensagem === undefined || typeof mensagem !== "string" )
			? ""
			: mensagem
		this.resultados = ( resultados === undefined || !Array.isArray(resultados) ) 
			? [] 
			: resultados
	}
}

export const schema = {
	"type": "object",
	"required": ["sucesso", "mensagem", "resultados"],
	"properties": {
		"sucesso": {
			"type": "boolean",
			"description": "Flag de mensagem bem sucedida ou não"
		},
		"mensagem": {
			"type": "string",
			"description": "Texto sobre o resultado obtido"
		},
		"resultados": {
			"type": "array",
			"description": "Itens de resposta, caso haja"
		}
	},
	"additionalProperties": false
}