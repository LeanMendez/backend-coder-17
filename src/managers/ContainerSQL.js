import knex from "knex";
import { logger, errorLogger } from "../logger/config.js";

class ContainerSQL {
  constructor(options, tableName) {
    this.database = knex(options);
    this.table = tableName;
  }

  async getById(id) {
    try {
      const result = await this.database(this.table)
        .select("*")
        .where("id", id);
      return result;
    } catch (err) {
      errorLogger.error(err);
    }
  }

  async getAll() {
    try {
      const result = await this.database(this.table).select("*");
            const products = result.map(elm=>({...elm}));
            logger.info(products)
            return products
    } catch (err) {
      errorLogger.error(err);
    }
  }

  async deleteById(id) {
    try {
      this.database
        .from(this.table)
        .where("id", "=", id)
        .del()
        .then(() => logger.info("producto eliminado"));
    } catch (err) {
      errorLogger.error(err);
    }
  }

  async deleteAll() {
    try {
      this.database
        .from(this.table)
        .del()
        .then(() => logger.info("productos eliminados"));
    } catch (err) {
      errorLogger.error(err);
    }
  }

  async save(obj) {
    try {
      const [id] = await this.database(this.table).insert(obj);
      return logger.info(`producto agregado ${id}`);
    } catch (err) {
      errorLogger.error(err);
    }
  }

  async putById(id, body) {
    try {
      await this.database.from(this.table).where("id", id).update({
        timestamp: body.timestamp,
        stock: body.stock,
        nombre: body.nombre,
        price: body.price,
        url: body.url,
      });
      return this.getById(id);
    } catch (err) {
      errorLogger.error(err);
    }
  }
}



export {ContainerSQL};
