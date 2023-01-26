import Router from "express";

import { ContainerSQL } from "../managers/ContainerSQL.js";
import { options } from "../config/config.js";
import { logger, errorLogger } from "../logger/config.js";

// Instancia del router
const router = Router();

router.get('/chat', (req, res)=>{
res.status(200).render('chat')
})


export { router as chatRouter };
