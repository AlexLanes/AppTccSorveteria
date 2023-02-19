export class Resultado {
	sucesso  // Boolean
	mensagem // String
	dados	 // Array

	constructor( sucesso, mensagem, dados ){
		this.sucesso = (sucesso === undefined || typeof sucesso !== "boolean")
			? true
			: sucesso
		this.mensagem = (mensagem === undefined || typeof sucesso !== "string")
			? ""
			: mensagem
		this.dados = (dados === undefined || !Array.isArray(dados)) 
			? [] 
			: dados
	}
}
