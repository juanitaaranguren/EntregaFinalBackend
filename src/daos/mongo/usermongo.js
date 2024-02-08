import UserModel from "./models/userModel.js";

export default class User {
  async createUser(data) {
    return UserModel.create(data);
  }

  async createDocuments(userId, files, fileType) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (files && files.length > 0) {
        const updatedDocuments = files.map(file => ({
          fileType: fileType,
          name: file.originalname,
          reference: file.path,
        }));

        user.documents = user.documents.concat(updatedDocuments);
        await user.save();
        return { message: 'Documentos cargados', user };
      }

      throw new Error('No archivos');
    } catch (error) {
      throw new Error('error al procesar la solicitud: ' + error.message);
    }
  }

  async getUsers(limit) {
    const users = await UserModel.find().limit(limit);
    return users;
  }

  async getUserByEmail(email) {
    return UserModel.findOne({ email: email });
  }

  async getUserById(id) {
    return UserModel.findById(id);
  }

  async updateUserById(id, updatedUser) {
    return UserModel.findByIdAndUpdate(id, updatedUser);
  }

  async updateUserRole(id, updatedRole) {
    return UserModel.findByIdAndUpdate(id, updatedRole);
  }

  async deleteUser(id) {
    return UserModel.findByIdAndDelete(id);
  }
}
