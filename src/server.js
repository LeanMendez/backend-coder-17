import * as dotenv from "dotenv";
dotenv.config()
import express from "express";
import path from "path";
import {engine} from "express-handlebars";
import { Server } from "socket.io";
import { normalize, schema } from "normalizr";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import parseArgs from "minimist";
import cluster from "cluster";
import os from "os";

import { productRouter } from "./routes/product.routes.js";
import { childRouter } from "./routes/child.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { options } from "./config/config.js";
import { ContainerSQL } from "./managers/ContainerSQL.js";
import { UserModel } from "./models/user.js";
import { createHash } from "./helpers/generateHash.js";
import { isValidPassword } from "./helpers/desencriptarHash.js";
import { credenciales } from "./config/configCredenciales.js";
import { chatRouter } from "./routes/chat.routes.js";
import { errorLogger, logger, warningLogger } from "./logger/config.js";


//config de los args de minimist
const optionsFork = {alias: {m: "mode", p: "port"}, default: {mode: "FORK", port: 8080}}
const objArguments = parseArgs(process.argv.slice(2), optionsFork)
const PORT = objArguments.port
const MODO = objArguments.mode
logger.info("objArguments", MODO, "port", PORT)

//instancia de servicios
const serviceProduct = new ContainerSQL(options.mariaDb, 'products');
const serviceChat = new ContainerSQL(options.sqlite, 'chat');

const app = express();
//const PORT = process.env.PORT || 8080;
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "/src/views")));
app.use(cookieParser());

// session configuracion
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: credenciales.MONGO_SESSION_API_KEY,
    }),
    secret: "claveUltraSecreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);

//Conexion a la base de datos para las autenticaciones
const mongoURI = credenciales.MONGO_AUTENTICATION_API_KEY;

mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) return errorLogger.error(`ERROR MESSAGE: ${error}`);
    logger.info("Connected to mongo-session DB");
  }
);

//Passport configuracion
app.use(passport.initialize());
app.use(passport.session());

//Serializar y deserializar usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (error, userFound) => {
    if (error) return done(error);
    return done(null, userFound);
  });
});

//Passport Strategy - crear usuario
passport.use(
  "signupStrategy",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
    },
    (req, username, password, done) => {
      logger.info(username);
      UserModel.findOne({ email: username }, (error, userFound) => {
        if (error) return done(error, null, { message: "hubo un error" });
        if (userFound)
          return done(null, null, {
            message: "YA EXISTE OTRO USUARIO CON ESE CORREO",
          });
        const newUser = {
          name: req.body.name,
          email: username,
          password: createHash(password),
        };
        logger.info(newUser);
        UserModel.create(newUser, (error, userCreated) => {
          if (error)
            return done(error, null, { message: "error al registrar" });
          return done(null, userCreated, { message: "USUARIO CREADO" });
        });
      });
    }
  )
);

//Passport Strategy - iniciar la sesion
passport.use(
  "loginStrategy",
  new LocalStrategy((username, password, done) => {
    logger.info(username);
    logger.info(password);
    UserModel.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "USUARIO INCORRECTO" });
      }
      if (!isValidPassword(user, password)) {
        return done(null, false, { message: "PASSWORD INCORRECTA" });
      }
      return done(null, user);
    });
  })
);


//motor de plantillas
app.set('views','./src/views');
app.set('view engine','hbs');

app.engine(
  'hbs',
  engine({
      extname: '.hbs',
      defaultLayout: 'main.hbs',
  })
);

//Normalizacion de la data
//autor
const authorSchema = new schema.Entity("autor");
//msg
const msgSchema = new schema.Entity("mensajes", { autor: authorSchema });
//esquema chat
const chatSchema = new schema.Entity(
  "chat",
  {
    mensajes: [msgSchema],
  },
  { idAttribute: "id" }
);

//aplico normalizacion
const DataNormalize = (data) => {
  const normalizacion = normalize(
    { id: "historial", mensajes: data },
    chatSchema
  );
  return normalizacion;
};

const NormalizeMsg = async () => {
  const resultado = await serviceChat.getAll();
  const mensajesNormalizados = DataNormalize(resultado);
  return mensajesNormalizados;
};
NormalizeMsg();


//router
app.use("/api", productRouter, chatRouter);
app.use("/", childRouter)
app.use('/auth', authRouter)
//app.use("/api", chatRouter)


//instancia del server
if(MODO ==='CLUSTER' && cluster.isPrimary){
  const numCPUs = os.cpus().length
  logger.info("NUMERO DE NUCLEOS:",numCPUs)

  for(let i=0; i<numCPUs; i++){
    cluster.fork()
  }
  cluster.on('exit', (worker)=>{
    errorLogger.error(`el subproceso ${worker.process.pid} fallo`);
    cluster.fork()
  })
}else{

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT} on process ${process.pid}`);
});

//websockets
const io = new Server(server);

io.on("connection", async (socket) => {
  logger.info("se conecto un nuevo cliente", socket.id);

  socket.on("newProduct", async (newProduct) => {
    await serviceProduct.save(newProduct);
    const productos = await serviceProduct.getAll()
    io.sockets.emit("list", productos);
  });

  //Emisor de chat
  io.sockets.emit("chat", await NormalizeMsg());

  socket.broadcast.emit("nuevoUsuario");

  socket.on("newMsgs", async (newMsgs) => {
    await serviceChat.save(newMsgs);
    logger.info(newMsgs);
    io.sockets.emit("chat", await NormalizeMsg());
  });
 
});
}