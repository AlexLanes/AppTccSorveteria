/**
 * Classe resultado padrão para resposta do Express e Firebase
 * @param  { boolean   } sucesso Mensagem foi bem sucedida ou não. Default: True
 * @param  { string    } mensagem Texto sobre o resultado obtido. Default: ""
 * @param  { Array     } resultados Itens de resposta, caso haja. Default: []
 * @return { Resultado } Classe Resultado
 */
export class Resultado {
	sucesso  	// Boolean
	mensagem 	// String
	resultados	// Array

	constructor( sucesso, mensagem, resultados ){
		this.sucesso = ( sucesso === undefined || typeof sucesso !== "boolean" )
			? true
			: sucesso
		this.mensagem = ( mensagem === undefined || typeof sucesso !== "string" )
			? ""
			: mensagem
		this.resultados = ( resultados === undefined || !Array.isArray(resultados) ) 
			? [] 
			: resultados
	}
}
