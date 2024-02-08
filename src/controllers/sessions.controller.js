import { generateToken } from "../utils.js";
import config from "../config/config.js";
import { userService } from "../services/index.js";
import bcrypt from "bcrypt";

export const registerLocal = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);

    if (user) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }


    const newUser = await userService.createUser(req.body);

    const access_token = generateToken(newUser);
    res.cookie(config.secret_cookie, access_token, {
      maxAge: 60 * 60 * 10000,
      httpOnly: true,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const loginLocal = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    user.last_connection = new Date().toLocaleString();
    await user.save();

    const access_token = generateToken(user);
    res.cookie(config.secret_cookie, access_token, {
      maxAge: 60 * 60 * 10000,
      httpOnly: true,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const loginGithub = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    user.last_connection = new Date().toLocaleString();
    await user.save();

    const access_token = generateToken(user);
    res.cookie(config.secret_cookie, access_token, {
      maxAge: 60 * 60 * 10000,
      httpOnly: true,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error("Error en el inicio de sesión de GitHub:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentPassword = user.password;

    if (await bcrypt.compare(password, currentPassword)) {
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la actual",
      });
    }

    const updatedUser = { password: hashedPassword };
    await userService.updatedUserById(user.id, updatedUser);

    return res.redirect("/login");
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    const user = req.user;
    user.last_connection = new Date().toLocaleString();
    await user.save();

    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar sesión:", err);
        return res.status(500).json({
          success: false,
          message: "Error al cerrar sesión",
          error: err,
        });
      }

      res.clearCookie(config.secret_cookie);
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error,
    });
  }
};
