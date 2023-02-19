"use strict"

import * as dotenv from "dotenv"
import { initializeApp } from "firebase/app"

// Inicializar o dotenv
dotenv.config()

// Informações de configuração do Web App Firebase
const firebaseConfig = {
	apiKey: process.env.firebaseConfig_apiKey,
	authDomain: process.env.firebaseConfig_authDomain,
	databaseURL: process.env.firebaseConfig_databaseURL,
	projectId: process.env.firebaseConfig_projectId,
	storageBucket: process.env.firebaseConfig_storageBucket,
	messagingSenderId: process.env.firebaseConfig_messagingSenderId,
	appId: process.env.firebaseConfig_appId,
	measurementId: process.env.firebaseConfig_measurementId
}

// Inicialização do App Firebase
export const App = initializeApp( firebaseConfig )

// const { apagar_imagem_sorvete } = await import("./storage/sorvetes.js")