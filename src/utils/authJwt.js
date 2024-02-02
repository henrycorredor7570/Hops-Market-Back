// funcion que nos indica para que confirmemos si el usuario esta enviado su token:
// verifica si tiene token:
//  verifica el tipo de susuario:
const { User } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PASSWORD_JWT } = process.env;

//para verificar en las rutas si el token existe; se puede pasar como funcion a cualquier ruta donde se desee
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    } 

    const decoded = jwt.verify(token, PASSWORD_JWT);
    const user = await User.findOne(
      { where: { id: decoded.id } }
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
    return
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = async (req, res, next) => {
  if (!req.userId) {
    throw new Error("Not authenticated")
  }

  const user = await User.findOne({ where: { id: req.userId } });
  if (user.role === "admin") {
    next()
    return
  }

  return res.status(403).json({ message: "Forbidden" });
};

// verifica si el rol que fue enviado ya fue creado
const checkRolesExisted = (req, res, next) => {
  if (req.body.role !== "admin" && req.body.role !== "user") {
    return res.status(400).json({
      message: `Role ${req.body.role} does not exists`,
    });
  }
  next();
};

// verificar si me esta enviando un correo nuevo o si ya existe ese correo
// verifica si el usuario ya existe:
const checkDuplicateUserNameOrEmail = async (req, res, next) => {
  const email = await User.findOne({ where: { email: req.body.email } });
  if (email)
    return res.status(400).json({ message: "The email already exists" });

  next();
};
module.exports = {
  verifyToken,
  isAdmin,
  checkRolesExisted,
  checkDuplicateUserNameOrEmail,
};
