import express from "express";
import { fork } from "child_process";
import { info } from "../child/info.js";
import compression from "compression";
import { calcRandomNumbers } from "../child/random.js";
import { logger, errorLogger } from "../logger/config.js";

const router = express.Router();

// Rutas info
router.get("/info", async (req, res) => {
  try {
    res.render("info", { info });
  } catch (error) {
    errorLogger.error(error);
  }
});

router.get("/infozip", compression(), async (req, res) => {
  try {
    res.render("info", { info });
  } catch (error) {
    errorLogger.error(error);
  }
});

// Rutas de numeros random
router.get("/randoms", async (req, res) => {
  try {
    const { cant } = req.query;
    const numbers = calcRandomNumbers(cant);
    res.render("tableNumbers", { numbers });

    //     const child = fork("src/child/child.js");
    //   child.on("message", (msgChild)=> {
    //   //compruebo la flag enviada por el hijo
    //   if(msgChild === "listo") {
    //     const {cant} = req.query
    //         child.send(cant)
    //   }else{
    //         res.render("tableNumbers", { msgChild });
    //   }
    // });
  } catch (error) {
    errorLogger.error(error);
  }
});

export { router as childRouter };
