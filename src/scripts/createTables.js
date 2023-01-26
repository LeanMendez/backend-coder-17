import { options } from "../config/config.js";
import knex from "knex";
import { errorLogger, logger } from "../logger/config.js";

const dbmysql = knex(options.mariaDb);
const dbsqlite = knex(options.sqlite);

export const createTables = async () => {
  try {
    const tableProductsExists = await dbmysql.schema.hasTable("products");
    if (tableProductsExists) {
      await dbmysql.schema.dropTable("products");
    }
    await dbmysql.schema.createTable("products", (table) => {
      table.increments("id");
      table.string("title", 40).notNullable();
      table.integer("price").notNullable();
      table.string("thumbnail", 250).notNullable();
    });
    logger.info("table products created successfully");
    dbmysql.destroy();

    const tableMessageExists = await dbsqlite.schema.hasTable("chat");

    if (tableMessageExists) {
      await dbsqlite.schema.dropTable("chat");
    }
    await dbsqlite.schema.createTable("chat", (table) => {
      table.increments("id");
      table.string("user", 30).nullable(false);
      table.string("timestamp", 20).nullable(false);
      table.string("msg", 200).nullable(false);
    });
    logger.info("table chat created successfully");
    dbsqlite.destroy();
  } catch (err) {
    errorLogger.error(err);
  }
};

createTables()