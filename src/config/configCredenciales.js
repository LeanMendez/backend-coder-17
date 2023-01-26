import * as dotenv from "dotenv";
dotenv.config()

export const credenciales = {
    MARIADB_HOST: process.env.MARIADB_HOST,
    MARIADB_DB: process.env.MARIADB_DB,
    MARIADB_USER: process.env.MARIADB_USER,
    MARIADB_PASSWORD: process.env.MARIADB_PASSWORD,
    MONGO_AUTENTICATION_API_KEY:process.env.MONGO_AUTHENTICATION_API_KEY,
    MONGO_SESSION_API_KEY:process.env.MONGO_SESSION_API_KEY,
    SQLITE_FILENAME: process.env.SQLITE_FILENAME
};