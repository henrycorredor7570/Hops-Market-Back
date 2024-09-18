const { Router } = require("express");
const usersRouter = Router();
const {
  checkRolesExisted,
  checkDuplicateUserNameOrEmail,
  isAdmin,
  verifyToken,
} = require("../utils/authJwt");
const {
  createUserHandler,
  updateUserHandler,
  signinHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  loginOauth,
  signupOauth,
  destroy,
  activate,
  newPassword,
} = require("../handlers/usersHandler");



usersRouter.post("/signup", checkDuplicateUserNameOrEmail, createUserHandler); // funcion para verificar los roles: checkRolesExisted  (NO USAR POR EL MOMENTO)
usersRouter.post("/signin", signinHandler);
usersRouter.put("/update/:id", verifyToken, updateUserHandler);
usersRouter.get("/allUsers", getAllUsersHandler); //, verifyToken, isAdmin
usersRouter.get("/:id", verifyToken, getUserByIdHandler);


//Rutas para el borrado lógico:
usersRouter.delete("/delete/:id", destroy);
usersRouter.put("/activate/:id", activate);

// logueo con terceros(Google)
usersRouter.post("/login/oauth2.0", loginOauth);
usersRouter.post("/signup/oauth2.0", signupOauth);

//password
usersRouter.put("/password/:id", newPassword);

module.exports = usersRouter;
