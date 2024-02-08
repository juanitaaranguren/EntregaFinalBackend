import { UserDAO } from "../daos/users.daos.js";

class UserService {
  constructor() {}

  async getAllUsers() {
    try {
      return await UserDAO.getAll();
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async getUserById(userId) {
    try {
      return await UserDAO.getById(userId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async createUser(userData) {
    try {
      return await UserDAO.create(userData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async updateUserById(userId, newData) {
    try {
      return await UserDAO.updateById(userId, newData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async deleteUserById(userId) {
    try {
      return await UserDAO.deleteById(userId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

export default new UserService();
