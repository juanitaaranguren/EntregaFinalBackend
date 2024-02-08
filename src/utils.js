import { dirname, fileURLToPath } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import multer from "multer";
import config from "./config/config.js";
import { productService } from "./services/index.js";
import { faker } from "@faker-js/faker/locale/es";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPass = (user, password) => bcrypt.compareSync(password, user.password);
export const generateToken = (user, expiresIn = "24h") => jwt.sign({ user }, config.secret_jwt, { expiresIn });
export const extractCookie = (req) => req?.cookies?.[config.secret_cookie] ?? null;
export const authorizationStrategy = (strategy) => async (req, res, next) => {
 
    passport.authenticate(strategy, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizationProfiles = (validRoles) => async (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).send({ error: "No estás autorizado" });
  if (validRoles.includes(user.user.roles)) return next();
  res.status(403).send({ error: "No estás autorizado" });
};

export const authorizationProducts = async (req, res, next) => {
  const id = req.params.pid;
  const { email, roles } = req.user.user;
  const product = await productService.getProductById(id);

  if (roles === "Admin" || (product.owner === email && roles === "usuarioPremium")) return next();
  console.log("No tienes permisos");
  res.status(403).send({ status: "No tienes permisos" });
};

export const authorizationAddToCart = async (req, res, next) => {
  const id = req.params.pid;
  const { email, roles } = req.user.user;
  const product = await productService.getProductById(id);

  if (roles === "usuarioPremium" && product.owner === email) {
    console.log("Error de usuario");
    return res.status(403).send({ status: "Error de usuario." });
  }
  next();
};

export const extractNonSensitiveUserInfo = (req, res, next) => {
  if (req.user) {
    const { first_name, last_name, email, age, cart } = req.user.user;
    req.nonSensitiveUserInfo = { first_name, last_name, email, age, cart };
  }
  next();
};

export const generateProducts = () => ({
  id: faker.commerce.isbn(),
  title: faker.commerce.productName(),
  code: faker.number.hex({ min: 100, max: 65535 }),
  description: faker.commerce.productDescription(),
  price: faker.commerce.price(),
  stock: faker.number.int(1000),
  thumbnail: faker.image.urlLoremFlickr({ category: "motos" }),
});

export const handleError = (code, res) => {
  const message = code || "Error desconocido";
  res.status(500).json({ error: message });
};

export const upload = (type) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = `${__dirname}/public/files/`;
      switch (type) {
        case "profile":
          uploadPath += "profiles/";
          break;
        case "product":
          uploadPath += "products/";
          break;
        case "document":
          uploadPath += "documents/";
          break;
        default:
          return cb(new Error("Invalid fileType"));
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  return multer({ storage }).array("files", 5);
};
