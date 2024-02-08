import dotenv from "dotenv";

dotenv.config();

export default {
  persistence: process.env.PERSISTENCE,
  entorno: process.env.ENTORNO,
  port: process.env.PORT || 8080,
  dbName: process.env.DB_NAME,
  dbNameTest: process.env.DB_NAME_TEST,
  dbURL: process.env.MONGO_URL,

  secretKeyStripe: process.env.SECRET_KEY_STRIPE,
  publicKeyStripe: process.env.PUBLIC_KEY_STRIPE,

  client_id_gith: process.env.CLIENT_ID_GITHUB,
  client_secret_gith: process.env.CLIENT_SECRET_GITHUB,
  callback_url_gith: process.env.CALLBACK_URL_GITHUB,

  secret_jwt: "369998d348da38335892877aa45b20dcb17ba7f6",
  secret_cookie: process.env.SECRET_COOKIE_JWT,

  twilio_sid: process.env.TWILIO_ACOUNT_SID,
  twilio_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone: process.env.TWILIO_PHONE,

  product_not_add: "En este momento, no se pueden agregar productos",
  product_not_found: "En este momento, no se hay dispoibilidad de productos",
  product_not_update: "En este momento, no se pueden actualizar los productos",
  product_not_delete: "En este momento, no se pueden eliminar los productos",

  cart_not_add: "En este momento, no se puede agregar un carrito",
  cart_not_found: "En este momento, no se puede cargar el carrito",
  cart_not_delete: "En este momento, no se puede eliminar el carrito",
  cart_not_purchase: "En este momento, no se puede finalizar la compra",
  cart_not_add_product: "En este momento, no se pueden agregar los productos al carrito",
  cart_not_delete_product: "En este momento, no se pueden eliminar los productos al carrito",

  user_not_add: "No pudimos agregar el usuario",
  user_not_found: "No pudimos encontrar el usuario",
  user_not_update: "No pudimos actualizar el usuario",
  user_not_delete: "No pudimos eliminar el usuario",

};
