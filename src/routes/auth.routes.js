import { Router } from "express";
import passport from "passport";
import { ContainerSQL } from "../managers/ContainerSQL.js";
import { options } from "../config/config.js";
import { logger, errorLogger } from "../logger/config.js";

// Instancia del router
const router = Router();

// Instancia de servicios
const serviceProduct = new ContainerSQL(options.mariaDb, 'products')

// Rutas de auth
router.get("/register", async (req, res) => {
  try {
    const errorMessage = req.session.messages ? req.session.messages[0] : "";
    logger.info(req.session);
    res.render("signup", { error: errorMessage });
    req.session.messages = [];
  } catch (error) {
    errorLogger.error(error);
  }
});

router.get("/login", (req, res) => {
  try {
    const errorMessage = req.session.messages ? req.session.messages[0] : "";
    res.render("login", { error: errorMessage });
    req.session.messages = [];
  } catch (error) {
    errorLogger.error(error);
  }
});

router.post(
  "/register",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/auth/register",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      res.redirect("/auth/profile");
    } catch (error) {
      errorLogger.error(error);
    }
  }
);

router.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      res.redirect("/auth/profile");
    } catch (error) {
      errorLogger.error(error);
    }
  }
);

router.get("/profile", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const products = serviceProduct.getAll()
      let { name } = req.user;
      res.render("products", { username: name , products});
    } else {
      res.send(
        "<div>Debes <a href='/auth/login'>inciar sesion</a> o <a href='/auth/register'>registrarte</a></div>"
      );
    }
  } catch (error) {
    errorLogger.error(error);
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    setTimeout(() => {
      res.redirect("/auth/login");
    }, 3000);
  } catch (error) {
    errorLogger.error(error);
  }
});

export { router as authRouter };
