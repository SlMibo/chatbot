const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
//const { BaileysProvider } = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const axios = require('axios');


const POSTGRES_DB_HOST = 'localhost'
const POSTGRES_DB_USER = 'postgres'
const POSTGRES_DB_PASSWORD = 'postgres'
const POSTGRES_DB_NAME = 'test'
const POSTGRES_DB_PORT = '5432'

const flow = createFlow([
    addKeyword('hola').addAnswer('¡Hola! ¿Cómo puedo ayudarte hoy?'),
    addKeyword('usuarios').addAnswer(async (ctx) => {
        const response = await axios.get('http://127.0.0.1:8000/users/');
        return `La información es: ${response.data}`;
    }),
    addKeyword('menu').addAnswer('Selecciona una opción:', {
        buttons: [
            { body: 'Opción 1' },
            { body: 'Opción 2' },
        ],
    }),
    addKeyword('Opción 1').addAnswer('Has seleccionado la Opción 1'),
    addKeyword('Opción 2').addAnswer('Has seleccionado la Opción 2'),
]);

const main = async () => {
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
    })
    const adapterFlow = createFlow([flow])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()

};


main();
