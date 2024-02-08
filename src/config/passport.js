import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import passportJWT from "passport-jwt";
import config from "./config.js";
import {
  createHash,
  isValidPass,
  extractCookie,
  generateToken,
} from "../utils.js";
import { userService } from "../services/index.js";
import { cartService } from "../services/index.js";
import { logger } from "./logger.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const initPassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "411058",
        clientSecret: "369998d348da38335892877aa45b20dcb17ba7f6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        logger.info(profile);
        try {
          const user = await userService.getUserByEmail(profile._json.email);
          const cart = await cartService.createCart();

          if (user) {
            const token = generateToken(user);
            user.token = token;
            logger.info("Usuario existente");

            return done(null, user);
          } else {
            const newUser = {
              first_name: profile._json.name,
              email: profile._json.email,
              password: "",
              cart: cart._id,
              roles: "Usuario",
            };

            const result = await userService.createUser(newUser);
            logger.info("Nuevo usuario logueado con GitHub");

            const token = generateToken(result);
            result.token = token;
            return done(null, result);
          }
        } catch (e) {
          return done("Error login con git", e);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userService.getUserByEmail(username);
          const cart = await cartService.createCart();

          if (user) {
            logger.info("Este usuario ya existe");
            const token = generateToken(user);
            user.token = token;

            return done(null, user);
          } else {
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
              cart: cart._id,
            };

            const result = await userService.createUser(newUser);
            logger.info("Usuario creado");

            const token = generateToken(result);
            result.token = token;
            return done(null, result);
          }
        } catch (e) {
          return done("Error registro local", e);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.getUserByEmail(username);

          if (!user) {
            logger.info("Este usuario no existe");
            return done(null, false);
          }
          if (!isValidPass(user, password)) {
            logger.info("esta contraseña incorrecta");
            return done(null, false);
          }

          const payload = {
            sub: user._id,
            roles: user.roles,
          };

          const token = generateToken(payload);
          return done(null, user, { token });
        } catch (e) {
          return done("Error de login local", e);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: config.secret_jwt,
      },
      async (jwt_payload, done) => {
        return done(null, jwt_payload);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
  });
};

export default initPassport;
