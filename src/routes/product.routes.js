import express from "express";

import { productosTest } from "../mocks/productMocks.js";
import { ContainerSQL } from "../managers/ContainerSQL.js";
import { options } from "../config/config.js";
import { logger, errorLogger } from "../logger/config.js";

// Instancia del router
const router = express.Router();

// Instancia de los servicios
const serviceProduct = new ContainerSQL(options.mariaDb, "products");

// Rutas de productos
router.get("/", async (req, res) => {
  try {
    const products = await serviceProduct.getAll()
    res.render("products", {products});
  } catch (error) {
    errorLogger.error(error);
  }
});

router.get("/productos", async (req, res) => {
  try {
    const data = await serviceProduct.getAll();
    res.status(200).send(data);
  } catch (error) {
    errorLogger.error(error);
  }
});

router.get("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await serviceProduct.getById(id);
    if (product) {
      logger.info(product);
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: `item with ID: ${id} doesnt exist` });
    }
  } catch (error) {
    errorLogger.error(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const newData = req.body;
    await serviceProduct.save(newData);
    const result = await serviceProduct.getAll();
    res.status(201).send(result);
  } catch (error) {
    errorLogger.error(error);
  }
});

router.put("/productos/:id", async (req, res) => {
  try {
    const updateData = req.body;
    const { id } = req.params;
    const itemToUpdate = await serviceProduct.getById(id);
    if (!itemToUpdate) {
      res.status(404).json({ error: `item with ID: ${id} doesnt exist` });
    } else {
      const updatedProduct = await serviceProduct.updateById(id, updateData);
      res.status(201).send(updatedProduct);
    }
  } catch (error) {
    errorLogger.error(error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id } = req.params;
    const itemToDelete = await serviceProduct.getById(id);
    if (!itemToDelete) {
      res
        .status(404)
        .json({ error: `item with ID: ${id} already doesnt exist` });
    } else {
      await serviceProduct.deleteById(id);
      res.status(200).json({ message: `item with ID: ${id} deleted` });
    }
  } catch (error) {
    errorLogger.error(error);
  }
});

//rutas de testeo con FAKER
router.get("/productos-test", async (req, res) => {
  try {
    res.send(productosTest);
  } catch (error) {
    errorLogger.error(error);
  }
});

// Instancia de los servicios
const serviceChat = new ContainerSQL(options.sqlite, "chat");

// Rutas de chat
router.get("/chat", async (req, res) => {
  try {
    const data = await serviceChat.getAll();
    res.render("chat", { data });
  } catch (error) {
    errorLogger.error(error);
  }
});

router.post("/chat", async (req, res) => {
  try {
    const newMsg = req.body;
    await serviceChat.save(newMsg);
    res.status(201).json({ message: `message sent` });
  } catch (error) {
    errorLogger.error(error);
  }
});

export { router as productRouter };
