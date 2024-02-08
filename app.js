import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import ticketsRouter from "./routes/ticket.router.js";
import mailingRouter from "./routes/correos.router.js";
import mockingProducts from "./routes/simuladorProductos.router.js";
import loggerTest from "./routes/loggerTest.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import paymentsRouter from "./routes/pagos.router.js";


import __dirname from "./utils.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import initPassport from "./config/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import { addLogger, logger } from "./config/logger.js";

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(
    session({
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://jarangor8:4YiVWoDxm3inbzK7@cluster0.wcm1olg.mongodb.net/<tu-base-de-datos>?retryWrites=true&w=majority",
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        ttl: 60 * 60 * 10000,
      }),
      secret: "8939484jkdllsgg", 
      resave: true,
      saveUninitialized: true,
    })
  )

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", loggerTest);
app.use("/", viewsRouter);
app.use("/", correosRouter);
app.use("/api", simuladorProductosRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/api", usersRouter);
app.use("/api", ticketsRouter);
app.use("/api/pagos", pagosRouter);
app.use("/api/sessions", sessionsRouter);

mongoose.set("strictQuery", false);

async function startServer() {
  try {
    await mongoose.connect(config.dbURL, { dbName: config.dbName });
    logger.info("Base de datos conectada");

    const httpServer = app.listen(config.port, () => {
      logger.http("Servidor escuchando...");
    });

    const io = new Server(httpServer);
    let messages = [];

    io.on("connection", (socket) => {
      socket.on("new", (user) => {
        logger.info(`${user} Entró al chat`);
      });

      socket.on("message", (data) => {
        messages.push(data);
        io.emit("logs", messages);
      });
    });
  } catch (error) {
    logger.error("Error al conectar la base de datos:", error.message);
  }
}

startServer();