"use strict"

// Conexão com o Firestore Database
import { firebase } from "../firebase.js"
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc } from "firebase/firestore/lite"

const DB = getFirestore( firebase ),
      DB_NOME = "sorvetes",
      SORVETE_COLLECTION = collection( DB, DB_NOME )

// Dependencias
import { Resultado } from "../../schemas/resultado.js"
import * as Schema from "../../schemas/sorvete.js"
import * as Helper from "../../helper/funções.js"

/**
 * Obter todos os documentos da Collection
 * @returns { Promisse< Resultado > }
 */
export async function obter_sorvetes(){
	let resultado = new Resultado()

	try {
		let documentos = await getDocs( SORVETE_COLLECTION ),
            documentos_invalidos = 0

		await documentos.docs.forEach( async (documento) => {
			let sorvete = documento.data()
			if( await Schema.validador(sorvete) ){
                resultado.resultados.push({ 
                    _id: documento.id, 
                    ...sorvete
                })
            }
            else documentos_invalidos++
        })
        
        resultado.mensagem = ( !documentos_invalidos ) 
            ? resultado.resultados.length + " dado(s) obtido(s)"
            : `${resultado.resultados.length} dado(s) obtido(s). ${documentos_invalidos} dado(s) inválido(s) não retornado`

	} catch( e ){
		console.error( "--- Erro obter_sorvetes --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = "Falha ao obter sorvetes"
	}

	return resultado
}

/**
 * Obter documento da Collection pelo id
 * @param   { string } id Id do documento
 * @returns { Promisse< Resultado > }
 */
export async function obter_sorvete_id( id ){
    let resultado = new Resultado()
    
    if( !await Helper.validador_id(id) ){
        resultado.sucesso = false
        resultado.mensagem = "ID inválido"
        return resultado
    }
    
    try {
        let documento = doc( DB, DB_NOME, id ),
            sorvete = await getDoc( documento )

        // Encontrado na Collection
        if( sorvete.exists() ){
            resultado.mensagem = "Sorvete obtido com sucesso"
            resultado.resultados = [{
                _id: sorvete.id,
                ...sorvete.data()
            }]
        
        // Não encontrado
        } else {
            resultado.sucesso = false
            resultado.mensagem = "Sorvete não encontrado"
        }

    } catch( e ){
        console.error( "--- Erro obter_sorvete_id --- \n", e )
        resultado.sucesso = false
        resultado.mensagem = `Falha interna ao obter sorvete ${id}`
    }

    return resultado
}

/**
 * Obter campo específico de determinado documento pelo id
 * @param   { string } id Id do documento
 * @param   { string } campo Nome do campo
 * @returns { Promisse< Resultado > }
 */
export async function obter_campo_sorvete( id, campo ){
    // Validação campo
    if( typeof campo == "string" && campo != ""  ) 
        campo = campo.toLowerCase().trim()

    let resultado = await obter_sorvete_id( id )
    
    // Documento não encontrado
    if( !resultado.sucesso ){
        return resultado
    }

    // Campo encontrado
    if( campo in resultado.resultados[0] ){
        resultado.mensagem = "Campo obtido com sucesso"
        resultado.resultados = [ 
            resultado.resultados[ 0 ][ campo ] 
        ]
    
    // Campo não encontrado
    } else {
        resultado.sucesso = false
        resultado.mensagem = "Campo não presente no schema do sorvete"
        resultado.resultados = []
    }

    return resultado
}

/**
 * Adicionar um sorvete na Collection
 * @param   { Sorvete } sorvete Classe/Objeto Sorvete
 * @returns { Promisse< Resultado > }
 */
export async function adicionar_sorvete( sorvete ){
    let resultado = new Resultado()

    // Dados não válidos
    if( !await Schema.validador(sorvete) ){
        resultado.sucesso = false
        resultado.mensagem = "Dados informados não estão de acordo com o schema do sorvete"
        return resultado
    }
    
    try {
        // Padronização dos nomes
        sorvete.nome = await Schema.corrigir_nome( sorvete.nome )

        let sorvetes = await obter_sorvetes(),
            duplicado = sorvetes.resultados.some( item => 
                item.nome == sorvete.nome
            )
            
        // Nome duplicado no banco de dados
        if( duplicado ){
            resultado.sucesso = false
            resultado.mensagem = "Sorvete já existente na base de dados"
            return resultado
        }

        // Validado com Sucesso, inserir no database
        let documento = await addDoc( SORVETE_COLLECTION, sorvete )
        resultado.mensagem = "Sorvete adicionado com sucesso"
        resultado.resultados = [{
            _id: documento.id,
            ...sorvete
        }]

	} catch( e ){
		console.error( "--- Erro adicionar_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha interna ao adicionar sorvete ${sorvete.nome}`
	}

	return resultado
}

/**
 * Apagar um sorvete na Collection
 * @param   { string } id Id do documento
 * @returns { Promisse< Resultado > }
 */
export async function apagar_sorvete( id ){
    let resultado = new Resultado()
    
    // Validação do id
    if( !await Helper.validador_id(id) ){
        resultado.sucesso = false
        resultado.mensagem = "ID inválido"
        return resultado
    }

    resultado = await obter_sorvete_id( id )
    
    // Validação se o id existe
    if( !resultado.sucesso ) 
        return resultado
    
    try {
		let documento = doc( DB, DB_NOME, id )
        await deleteDoc( documento )
        
        resultado.mensagem = "Sorvete apagado com sucesso"
        resultado.resultados = []

	} catch( e ){
		console.error( "--- Erro apagar_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha interna ao apagar o sorvete ${id}`
	}

    return resultado
}

/**
 * Atualizar sorvete na Collection. Não suporta atualização do _id
 * @param   { Sorvete } sorvete Classe/Objeto Sorvete
 * @returns { Promisse< Resultado > }
 */
export async function atualizar_sorvete( sorvete ){
    let resultado = new Resultado()
    
    // Dados não válidos
    if( !await Schema.validador(sorvete) ){
        resultado.sucesso = false
        resultado.mensagem = "Dados informados não estão de acordo com o schema do sorvete"
        return resultado
    
    // ID não presente
    } else if( !("_id" in sorvete) ){
        resultado.sucesso = false
        resultado.mensagem = "Obrigatório informar o _id presente no schema para atualização"
        return resultado
    }

    resultado = await obter_sorvete_id( sorvete._id )
    
    // Validação se o id foi encontrado
    if( !resultado.sucesso ) 
        return resultado
    
    try {
        // Padronização dos nomes
        sorvete.nome = await Schema.corrigir_nome( sorvete.nome )

		let documento = doc( DB, DB_NOME, sorvete._id )
        
        // Id não fica dentro do documento
        delete sorvete._id

        await setDoc( documento, sorvete )
        
        resultado.mensagem = "Sorvete atualizado com sucesso"
        resultado.resultados = []

	} catch( e ){
		console.error( "--- Erro atualizar_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha interna ao atualizar o sorvete ${sorvete.nome}`
	}

    return resultado
}