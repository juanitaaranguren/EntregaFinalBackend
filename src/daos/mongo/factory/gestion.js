import config from "../config/config.js";
import mongoose from "mongoose";
import * as MongoModels from "./mongoManager/index.js";

export let Cart;
export let Product;
export let User;
export let Ticket;

console.log(`Persistence: ${config.persistence}`);

switch (config.persistence) {
  case "MONGO":
    mongoose.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.dbName,
    });

    Cart = MongoModels.Cart;
    Product = MongoModels.Product;
    User = MongoModels.User;
    Ticket = MongoModels.Ticket;
    break;

  default:
    throw new Error("invalid persistence: " + config.persistence);
}
