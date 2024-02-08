import { userService } from "../services/index.js";
import config from "../config/config.js";
import { handleError, upload } from "../utils.js";
import multer from 'multer';

const uploadDocuments = upload('profile');

export const createDocuments = async (req, res) => {
  try {
    uploadDocuments(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Error al cargar el archivo', error: err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Hubo un error al procesar la solicitud', error: err.message });
      }

      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const files = req.files;
      const fileType = req.body.fileType; 

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No se han subido archivos' });
      }

      user.status = 'file uploaded';
      await user.save();

      const result = await userService.createDocuments(id, files, fileType);
      return res.status(200).json(result);
    });
  } catch (error) {
    console.error('Error al crear documentos:', error);
    return res.status(500).json({ message: 'Hubo un error al procesar la solicitud', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const userCreate = await userService.createUser(req.body);
    res.status(201).json({ status: "success", payload: userCreate });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    req.logger.error("No se pudo crear usuario");
    handleError(config.user_not_add, res);
  }
};

export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const result = await userService.getUsers(limit);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    req.logger.error("No se pudo obtener usuarios");
    handleError(config.user_not_found, res);
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    res.json({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    req.logger.error("No se pudo obtener usuario por email");
    handleError(config.user_not_found, res);
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.json({ message: "Usuario encontrado", payload: user });
  } catch (error) {
    console.error('Error al obtener usuario por id:', error);
    req.logger.error("No se pudo obtener usuario por id");
    handleError(config.user_not_found, res);
  }
};

export const updatedUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const result = await userService.updatedUserById(userId, updatedUser);
    res.json({ status: "Usuario actualizado exitosamente", payload: result });
  } catch (error) {
    console.error('Error al actualizar usuario por id:', error);
    req.logger.error("No se pudo actualizar usuario");
    handleError(config.user_not_update, res);
  }
};

export const updatedUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roles } = req.body;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const documents = user.documents.map(doc => doc.fileType);
    const requiredDocuments = ['Identificacion', 'Domicilio', 'Estado_cuenta'];

    const hasRequiredDocuments = requiredDocuments.every(doc => documents.includes(doc));

    if (!hasRequiredDocuments) {
      return res.status(400).json({ message: 'El usuario no ha cargado todos los documentos requeridos' });
    }

    const result = await userService.updatedUserById(userId, { roles });
    return res.json({ status: 'Rol actualizado exitosamente', payload: result });
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar el rol del usuario', error: error.message });
  }
};

export const deletedUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await userService.deletedUser(userId);

    if (result) {
      res.json({ status: "Usuario eliminado exitosamente", payload: result });
    } else {
      console.error('No se pudo eliminar usuario');
      req.logger.warning("No se pudo eliminar usuario");
      res.json({ status: "No se pudo eliminar" });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    req.logger.error("Error al eliminar usuario");
    handleError(config.user_not_delete, res);
  }
};
