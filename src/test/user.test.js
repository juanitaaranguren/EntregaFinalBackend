import UserService from "../services/user.service.js";

describe("Testeo de usuarios", () => {
  it("mostrar todos los users", async () => {
    const users = await UserService.getAllUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0); 
  });

  it("crear nuevo user", async () => {
    const userData = { name: "juanita", email: "jarangor8@gmail.com" };
    const newUser = await UserService.createUser(userData);
    expect(newUser).toBeDefined();
    expect(newUser.name).toBe(userData.name); 
    expect(newUser.email).toBe(userData.email);
  });

  it("encontrar un user por su id", async () => {
    const userId = "some_user_id";
    const user = await UserService.getUserById(userId);
    expect(user).toBeDefined();
    expect(user._id).toBe(userId); 
  });
});
