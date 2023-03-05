"use strict"

import { getStorage, ref, listAll, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Resultado } from "../../schemas/resultado.js"
import { MENSAGENS } from "../../schemas/mensagens.js"
import { firebase } from "../firebase.js"

const STORAGE = getStorage( firebase ),
      STORAGE_NAME = "sorvetes",
      REFERÊNCIA = ref( STORAGE, STORAGE_NAME )

/**
 * Obter as urls das imagens dos sorvetes
 * @returns { Promisse< Resultado > }
 */
export async function obter_imagens_sorvetes(){
    let resultado = new Resultado()
        
    try {
        let imagens = await listAll( REFERÊNCIA )
        for( let item of imagens.items ){
            resultado.resultados.push({
                nome: item.name,
                url: await getDownloadURL( ref(item.parent, item.name) )
            })
        }

        resultado.mensagem = MENSAGENS.sorvete.sucesso.obter_imagens( resultado.resultados.length )

    } catch( erro ){
		console.error( "--- Erro obter_imagens_sorvetes --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
	}

    return resultado
}

/**
 * Upload de imagem de sorvete
 * @param { ArrayBuffer } imagem 
 * @returns { Promisse< Resultado > }
 */
export async function upload_imagem_sorvete({ anexo, nome, tipo }){
    let resultado = new Resultado()

    try {
        let referencia = ref( REFERÊNCIA, nome ),
            upload = await uploadBytes( referencia, anexo, {
                "contentType": tipo
            })

        resultado.mensagem = MENSAGENS.sorvete.sucesso.upload
        resultado.resultados.push({
            nome: upload.ref.name,
            url: await getDownloadURL( upload.ref )
        })

    } catch( erro ){
		console.error( "--- Erro upload_imagem_sorvete --- \n", erro )
		resultado.sucesso = false
        resultado.mensagem = MENSAGENS.global.erro.interno( erro )
	}

    return resultado
}

/**
 * Apagar imagem de sorvete
 * @param { String } nome nome da imagem
 * @returns { Promisse< Resultado > }
 */
export async function apagar_imagem_sorvete( nome ){
    let resultado = new Resultado(),
        referência = ref( REFERÊNCIA, nome )
    
    try {
        await deleteObject( referência )
        resultado.mensagem = MENSAGENS.sorvete.sucesso.imagem_apagada

    } catch( erro ){
        resultado.sucesso = false
        switch( erro.code ){
            case "storage/object-not-found":
                resultado.mensagem = MENSAGENS.sorvete.erro.imagem_não_encontrada
                break
                
            default:
                console.error( "--- Erro apagar_imagem_sorvete --- \n", erro )
                resultado.mensagem = MENSAGENS.global.erro.interno( erro )
                break
        }
    }
    
    return resultado
}