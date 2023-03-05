/**
 * Mensagens de Resposta utilizadas pela API
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
		
			/** "Sorvete adicionado com sucesso" */
			sorvete_adicionado: "Sorvete adicionado com sucesso",
		
			/** "Sorvete apagado com sucesso" */
			sorvete_apagado: "Sorvete apagado com sucesso",
		
			/** "Sorvete atualizado com sucesso" */
			sorvete_atualizado: "Sorvete atualizado com sucesso",

			/**
			 * @param 	{ Number } quantidade Length do Resultado.resultados
			 * @returns { String } `${quantidade} imagem(ns) obtida(s)` 
			 */
			obter_imagens: ( quantidade ) => {
				return `${quantidade} imagem(ns) obtida(s)`
			},

			/** "Upload da imagem feito com sucesso" */
			upload: "Upload da imagem feito com sucesso",

			/** "Imagem de sorvete apagada com sucesso" */
			imagem_apagada: "Imagem de sorvete apagada com sucesso"
		},
		erro: {
            /** "Sorvete já existente na base de dados" */
            sorvete_duplicado : "Sorvete já existente na base de dados",
            
            /** "Sorvete não encontrado" */
            não_encontrado: "Sorvete não encontrado",
            
            /** "Imagem não encontrada" */
            imagem_não_encontrada: "Imagem não encontrada"
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
			conversão_body: ( erro ) => { return `Falha na conversão do body. ${erro}` },

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

            /** "Campo não presente no schema" */
            campo_inválido: "Campo não presente no schema",
        
            /** "Dados informados não estão de acordo com o schema. ${erro}" */
            schema_inválido: ( erro ) => { return `Dados informados não estão de acordo com o schema. ${erro}` }
        }
    }
}