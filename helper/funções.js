"use strict"

export function remover_acento( string ){
    return string.normalize( "NFD" ).replace( /[\u0300-\u036f]/g, "" )
}