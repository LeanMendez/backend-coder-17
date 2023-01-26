import { credenciales } from './configCredenciales.js';




export const options = {
    mariaDb:{
        client:'mysql',
        connection:{
            host: credenciales.MARIADB_HOST,
            user: credenciales.MARIADB_USER,
            password:credenciales.MARIADB_PASSWORD,
            database:credenciales.MARIADB_DB,
            port: '4433'
        }
    },
    sqlite:{
        client:'sqlite',
        connection:{
            filename: credenciales.SQLITE_FILENAME
        },
        useNullAsDefault: true
    }
}