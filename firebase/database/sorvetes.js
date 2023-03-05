"use strict"

// Dependencias
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc } from "firebase/firestore/lite"
import { corrigir_nome } from "../../schemas/sorvete.js"
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import * as Helper from "../../helper/funções.js"
import { firebase } from "../firebase.js"

const DB = getFirestore( firebase ),
      DB_NOME = "sorvetes",
      SORVETE_COLLECTION = collection( DB, DB_NOME )

/**
 * Obter todos os documentos da Collection
 * @returns { Promisse< Resultado > }
 */
export async function obter_sorvetes(){
	let resultado = new Resultado()

	try {
		let documentos = await getDocs( SORVETE_COLLECTION )

		await documentos.docs.forEach( async(documento) => {
			let sorvete = documento.data()
            resultado.resultados.push({ 
                _id: documento.id, 
                ...sorvete
            })
        })
        
        resultado.mensagem = MENSAGENS.sorvete.sucesso.sorvete_obtido( resultado.resultados.length ) 

	} catch( erro ){
		console.error( "--- Erro obter_sorvetes --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
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
        resultado.mensagem = MENSAGENS.global.erro.id_invalido
        return resultado
    }
    
    try {
        let documento = doc( DB, DB_NOME, id ),
            sorvete = await getDoc( documento )

        // Encontrado na Collection
        if( sorvete.exists() ){
            resultado.mensagem = MENSAGENS.sorvete.sucesso.sorvete_obtido( 1 )
            resultado.resultados = [{
                _id: sorvete.id,
                ...sorvete.data()
            }]
        
        // Não encontrado
        } else {
            resultado.sucesso = false
            resultado.mensagem = MENSAGENS.sorvete.erro.não_encontrado
        }

    } catch( erro ){
        console.error( "--- Erro obter_sorvete_id --- \n", erro )
        resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
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
    
    try {
        // Padronização dos nomes
        sorvete.nome = await corrigir_nome( sorvete.nome )
        // Caso tenha sido passado _id no request, ele será removido
        delete sorvete._id

        let sorvetes = await obter_sorvetes(),
            duplicado = sorvetes.resultados.some( item => 
                item.nome === sorvete.nome
            )
            
        // Nome duplicado no banco de dados
        if( duplicado ){
            resultado.sucesso = false
            resultado.mensagem = MENSAGENS.sorvete.erro.sorvete_duplicado
            return resultado
        }

        // Validado com Sucesso, inserir no database
        let documento = await addDoc( SORVETE_COLLECTION, sorvete )
        resultado.mensagem = MENSAGENS.sorvete.sucesso.sorvete_adicionado
        resultado.resultados = [{
            _id: documento.id,
            ...sorvete
        }]

	} catch( erro ){
		console.error( "--- Erro adicionar_sorvete --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
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
        resultado.mensagem = MENSAGENS.global.erro.id_invalido
        return resultado
    }

    resultado = await obter_sorvete_id( id )
    
    // Validação se o id existe
    if( !resultado.sucesso ) 
        return resultado
    
    try {
		let documento = doc( DB, DB_NOME, id )
        await deleteDoc( documento )
        
        resultado.mensagem = MENSAGENS.sorvete.sucesso.sorvete_apagado
        resultado.resultados = []

	} catch( erro ){
		console.error( "--- Erro apagar_sorvete --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
	}

    return resultado
}

/**
 * Atualizar sorvete na Collection. Não suporta atualização do _id
 * @param   { String } id ID do Sorvete
 * @param   { Sorvete } sorvete Classe/Objeto Sorvete
 * @returns { Promisse< Resultado > }
 */
export async function atualizar_sorvete( id, sorvete ){
    let resultado = await obter_sorvete_id( id )
    
    // Validação se o id foi encontrado
    if( !resultado.sucesso ) 
        return resultado
    
    try {
        delete sorvete._id
        // Padronização dos nomes
        sorvete.nome = await corrigir_nome( sorvete.nome )

		let documento = doc( DB, DB_NOME, id )
        await setDoc( documento, sorvete )
        
        resultado.mensagem = MENSAGENS.sorvete.sucesso.sorvete_atualizado
        resultado.resultados = [{
            _id: id,
            ...sorvete
        }]

	} catch( erro ){
		console.error( "--- Erro atualizar_sorvete --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
	}

    return resultado
}