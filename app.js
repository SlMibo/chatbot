const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const axios = require('axios')
/**
 * Declaramos las conexiones de PostgreSQL
 */

const POSTGRES_DB_HOST = 'localhost'
const POSTGRES_DB_USER = 'postgres'
const POSTGRES_DB_PASSWORD = 'postgres'
const POSTGRES_DB_NAME = 'test'
const POSTGRES_DB_PORT = '5432'



const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer('Los usuarios existentes son: ', null, async (ctx, {flowDynamic}) => {
        const data = await users_API()
        await flowDynamic(data)
    })

const users_API = async () => {
    const config = {
        method: 'get',
        url: 'http://127.0.0.1:8000/users/'
    }

    try {
        const response = await axios.get('http://127.0.0.1:8000/users/');

        const data = response.data; // Ya que es un array directamente

        // Asegúrate de que 'data' sea un array
        if (Array.isArray(data)) {
            return data.map(user => ({
                body: [`*${user.name} ${user.surname}:* ${user.email}`] // Cambié attributes por las propiedades correctas
            }));
        } else {
            console.warn('La respuesta no es un array:', data);
            return [{ body: ['No se encontraron usuarios.'] }];
        }
    } catch (error) {
        console.error('Error al hacer la solicitud a la API:', error.message);
        return [{ body: ['Hubo un error al obtener los datos.'] }];
    }
}

const main = async () => {
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
