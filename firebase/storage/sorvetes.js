"use strict"

import { getStorage, ref, listAll, getDownloadURL, deleteObject, uploadBytes } from "firebase/storage";
import { Resultado } from "../../schemas/resultado.js"
import { remover_acento } from "../../helper/funções.js"
import { firebase } from "../firebase.js"

const STORAGE = getStorage( firebase ),
      STORAGE_NAME = "sorvetes"

export async function obter_nomes_imagens_sorvetes(){
    let resultado = new Resultado(),
        referencia = ref( STORAGE, STORAGE_NAME )
        
    try {
        let imagens = await listAll( referencia )
        imagens.items.forEach( item => 
            resultado.resultados.push( item.fullPath ) 
        )
        resultado.mensagem = `${resultado.resultados.length} nome(s) encontrado(s)`

    } catch( e ){
		console.error( "--- Erro obter_nomes_imagens_sorvetes --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao obter nomes das imagens dos sorvetes`
	}

    return resultado
}

async function validacao_nome_sorvete( nome ){
    let resultado = new Resultado()
    
    // Validação nome
    if( typeof nome == "string" )
        nome = remover_acento( nome.toLowerCase().trim() )
    else {
        resultado.sucesso = false
        resultado.mensagem = "Falha na validação dos dados"
        return resultado
    }

    resultado = await obter_nomes_imagens_sorvetes()
    
    // Erro obter_nomes_imagens_sorvetes
    if( !resultado.sucesso ) return resultado

    let termoDeProcura = `${STORAGE_NAME}/${nome}.`,
        caminho = resultado.resultados.find( dado => 
            remover_acento( dado ).includes( termoDeProcura )
        )
        
    // Nome existe no Storage
    if( caminho == undefined ){
		resultado.sucesso = false
        resultado.mensagem = `Imagem de nome ${nome} não encontrada em ${STORAGE_NAME}`
        resultado.resultados = []
        return resultado
    
        // Encontrado com sucesso
    } else {
        resultado.mensagem = "Caminho da imagem do sorvete encontrado"
        resultado.resultados = [ caminho ]
    }

    return resultado
}

export async function obter_url_imagem_sorvete( nome ){
    let resultado = await validacao_nome_sorvete( nome )
    
    // Validação nome
    if( !resultado.sucesso ) return resultado
    else 
        nome = remover_acento( nome.toLowerCase().trim() )

    try {
        let referencia = ref( STORAGE, caminho ),
            url = await getDownloadURL( referencia )
        
        resultado.resultados = [ url ]
        resultado.mensagem = "Url encontrado com sucesso"

    } catch( e ){
		console.error( "--- Erro obter_url_imagem_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao obter url da imagens do sorvete ${nome}`
	}

    return resultado
}

export async function apagar_imagem_sorvete( nome ){
    let resultado = await validacao_nome_sorvete( nome )
    
    // Validação nome
    if( !resultado.sucesso ) return resultado
    else 
        nome = remover_acento( nome.toLowerCase().trim() )

    try {
        let referencia = ref( STORAGE, caminho )
        await deleteObject( referencia )
        
        resultado.resultados = []
        resultado.mensagem = "Imagem apagada com sucesso"

    } catch( e ){
		console.error( "--- Erro apagar_imagem_sorvete --- \n", e )
		resultado.sucesso = false
        resultado.mensagem = `Falha ao apagar imagem do sorvete ${nome}`
	}

    return resultado
}

export async function upload_imagem_sorvete( imagem ){
    console.log( imagem )
    // let resultado = new Resultado()

    // try {
    //     let referencia = ref( STORAGE, caminho ),
    //         url = await getDownloadURL( referencia )
        
    //     resultado.resultados = [ url ]
    //     resultado.mensagem = "Url encontrado com sucesso"

    // } catch( e ){
	// 	console.error( "--- Erro obter_url_imagem_sorvete --- \n", e )
	// 	resultado.sucesso = false
    //     resultado.mensagem = `Falha ao obter url da imagens do sorvete ${nome}`
	// }

    // return resultado
}