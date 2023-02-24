/**
 * Mensagens utilizadas pela API
 * @typedef { Object }
 */
 export const MENSAGENS = {
	sorvete: {
		sucesso: {
			/**
			 * @param 	{ Number } quantidade Length do Resultado.resultados
			 * @returns { String } `${quantidade} sorvete(s) obtido(s)` 
			 */
			sorvete_obtido: ( quantidade ) => { 
				return `${quantidade} sorvete(s) obtido(s)` 
			},
		
			/**
			 * @param 	{ Number } quantidade Length do Resultado.resultados
			 * @param 	{ Number } quantidade_inválidos Quantidade dos inválidos
			 * @returns { String } `${quantidade} sorvete(s) obtido(s). ${quantidade_inválidos} sorvete(s) inválido(s) não retornado(s)`
			 */
			sorvete_obtido_aviso: ( quantidade, quantidade_inválidos ) => { 
				return `${quantidade} sorvete(s) obtido(s). ${quantidade_inválidos} sorvete(s) inválido(s) não retornado(s)`
			},
		
			/** "Campo do sorvete obtido com sucesso" */
			campo_obtido: "Campo do sorvete obtido com sucesso",
		
			/** "Sorvete adicionado com sucesso" */
			sorvete_adicionado: "Sorvete adicionado com sucesso",
		
			/** "Sorvete apagado com sucesso" */
			sorvete_apagado: "Sorvete apagado com sucesso",
		
			/** "Sorvete atualizado com sucesso" */
			sorvete_atualizado: "Sorvete atualizado com sucesso",
		},
		erro: {
            /** "Sorvete já existente na base de dados" */
            sorvete_duplicado : "Sorvete já existente na base de dados",
            
            /** "Sorvete não encontrado" */
            não_encontrado: "Sorvete não encontrado"
		}
	},
    global: {
        sucesso: {

        },
        erro: {
            /**
             * @param   { Error } erro Erro capturado no Catch
             * @returns { String } `Erro interno. ${erro}`
             */
            interno: ( erro ) => { return `Erro interno. ${erro}` },
			
			/** "Operação não encontrada" */
			operação_não_encontrada: "Operação não encontrada",
 
			/** 
			 * @param	{ Error } erro Erro capturado no Catch
			 * @returns { String } `Falha na conversão do body. ${erro}` 
			 * */
			conversãobody: ( erro ) => { return `Falha na conversão do body. ${erro}` },

			/**
			 * @param 	{ String } nome Nome do Accept informado no Request
			 * @returns { String } `Accept '${nome}' não suportado`
			 */
			accept: ( nome ) => { return `Accept '${nome}' não suportado` },

			/**
			 * @param 	{ String } nome Nome do Content-Type informado no Request
			 * @returns { String } `Content-Type' ${nome} 'não suportado`
			 */
			"content-type": ( nome ) => { return `Content-Type '${nome}' não suportado` },

			/** "Autorização não informada" */
			autorização_não_informada: "Autorização não informada",

			/** "Não autorizado" */
			não_autorizado: "Não autorizado",
            
            /** "id inválido" */
            id_invalido: "id inválido",
        
            /** "Obrigatório informar o _id presente no schema" */
            id_obrigatório: "Obrigatório informar o _id presente no schema",

            /** "Campo não presente no schema" */
            campo_inválido: "Campo não presente no schema",
        
            /** "Dados informados não estão de acordo com o schema" */
            schema_inválido: "Dados informados não estão de acordo com o schema"
        }
    }
}