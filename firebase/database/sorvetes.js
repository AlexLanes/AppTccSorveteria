"use strict"

import { getFirestore, collection, getDocs, addDoc, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore/lite"
import { Resultado } from "../../schemas/resultado.js"
import { validador_schema, Sorvete } from "../../schemas/sorvete.js"
import { remover_acento } from "../../helper/funções.js"

const { firebase } = import( "./firebase.js" ),
      DB = getFirestore( firebase ),
      DB_NOME = "sorvetes",
      SORVETE_COLLECTION = collection( DB, DB_NOME )

// Obter todos os documentos da collection sorvetes
export async function obter_sorvetes(){
	let resultado = new Resultado()

	try {
		let documentos = await getDocs( SORVETE_COLLECTION ),
            contemInvalido = false

		for( let doc of documentos.docs ){
			let sorvete = doc.data()
			if( validador_schema(sorvete) )
                resultado.resultados.push( new Sorvete(sorvete.nome, sorvete.estoque, sorvete.url_imagem) )
            else contemInvalido = true
		}

        resultado.mensagem = ( contemInvalido ) 
            ? resultado.resultados.length + " dado(s) obtido(s). Banco de dados possui 1 ou mais itens inválidos"
            : resultado.resultados.length + " dado(s) obtido(s)"

	} catch( e ){
		console.error( "--- Erro obter_sorvetes --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = "Falha ao obter sorvetes. Olhe o Log para mais detalhes"
	}

	return resultado
}

// Adicionar um sorvete na collection
export async function adicionar_sorvete( nome, estoque, url_imagem ){
    if( typeof nome == "string" )
        nome = remover_acento( nome.toLowerCase().trim() )

    let resultado = new Resultado(),
        sorvete = new Sorvete( nome, estoque, url_imagem )

    // Dados não válidos
    if( !validador_schema(sorvete) ){
        resultado.sucesso = false
        resultado.mensagem = "Dados informados não estão de acordo com o schema do sorvete"
        return resultado
    }
    
    try {
        let sorvetes = (await obter_sorvetes()).resultados,
            duplicado = sorvetes.some( item => 
                remover_acento( item.nome ) == nome
            )
            
        // Nome duplicado no banco de dados
        if( duplicado ){
            resultado.sucesso = false
            resultado.mensagem = "Sorvete já existente na base de dados"
            return resultado
        }

        // Validado com Sucesso, inserir no database
        await addDoc( SORVETE_COLLECTION, {...sorvete} )
        resultado.mensagem = "Sorvete adicionado com sucesso"

	} catch( e ){
		console.error( "--- Erro adicionar_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao adicionar sorvete ${nome}. Olhe o Log para mais detalhes`
	}

	return resultado
}

// Obter um id de um documento com base no nome do sorvete
export async function obter_id_sorvete( nome ){
    let resultado = new Resultado()
    
    // Validação nome
    if( typeof nome == "string" )
        nome = remover_acento( nome.toLowerCase().trim() )
    else {
        resultado.sucesso = false
        resultado.mensagem = "Nome do sorvete inválido"
        return resultado
    }

    try {
		let documentos = await getDocs( 
                query( SORVETE_COLLECTION, where("nome", "==", nome) )
            )
        
        // Não encontrado
        if( documentos.empty ){
            resultado.sucesso = false
            resultado.mensagem = "Nome do sorvete não encontrado"
            return resultado
        }

        documentos.docs.forEach( doc => resultado.resultados.push(doc.id) )
        resultado.mensagem = `${documentos.docs.length} sorvete(s) encontrado(s)`

	} catch( e ){
		console.error( "--- Erro obter_id_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao obter id do sorvete ${nome}. Olhe o Log para mais detalhes`
	}

    return resultado
}

// Atualizar sorvete com base no nome
export async function atualizar_sorvete( nome, estoque, url_imagem ){
    if( typeof nome == "string" )
        nome = remover_acento( nome.toLowerCase().trim() )

    let resultado = new Resultado(),
        sorvete = new Sorvete( nome, estoque, url_imagem )

    // Dados não válidos
    if( !validador_schema(sorvete) ){
        resultado.sucesso = false
        resultado.mensagem = "Dados informados não estão de acordo com o schema do sorvete"
        return resultado
    }

    resultado = await obter_id_sorvete( nome )
    
    // Validação se o id foi encontrado
    if( !resultado.sucesso ) return resultado
    
    let id = resultado.resultados[0]
    
    try {
		let documento = doc( DB, DB_NOME, id )
        await updateDoc( documento, {...sorvete} )
        
        resultado.mensagem = "Sorvete atualizado com sucesso"
        resultado.resultados = []

	} catch( e ){
		console.error( "--- Erro atualizar_estoque_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao atualizar o estoque do sorvete ${nome}. Olhe o Log para mais detalhes`
	}

    return resultado
}

// Apagar sorvete
export async function apagar_sorvete( nome ){
    let resultado = new Resultado()
    
    // Validação nome
    if( typeof nome == "string" )
        nome = remover_acento( nome.toLowerCase().trim() )
    else {
        resultado.sucesso = false
        resultado.mensagem = "Falha na validação dos dados"
        return resultado
    }

    resultado = await obter_id_sorvete( nome )
    
    // Validação se o id foi encontrado
    if( !resultado.sucesso ) return resultado
    
    let id = resultado.resultados[0]
    
    try {
		let documento = doc( DB, DB_NOME, id )
        await deleteDoc( documento )
        
        resultado.mensagem = "Sorvete apagado com sucesso"
        resultado.resultados = []

	} catch( e ){
		console.error( "--- Erro apagar_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao apagar o sorvete ${nome}. Olhe o Log para mais detalhes`
	}

    return resultado
}