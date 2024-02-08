import pino from "pino";
import config from "./config.js";

let entorno = config.entorno;

const customLevelsLoggers = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "bold red",
    error: "bold magenta",
    warning: "bold yellow",
    info: "bold green",
    http: "bold blue",
    debug: "bold white",
  },
};

const logger = pino({
  level: entorno === "PRODUCCION" ? "info" : "debug",
  prettyPrint: {
    colorize: true,
    levelFirst: true,
    translateTime: "SYS:standard",
  },
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};
