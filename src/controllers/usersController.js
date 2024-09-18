const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { decodeTokenOauth } = require("../utils/google");
const { normalizarCoincidencia } = require("../utils/generic_functions");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { PASSWORD_JWT } = process.env;
const nodemailer = require("nodemailer");
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const checkEmailExists = async (email) => {
  const existingUser = await User.findOne({ where: { email: email } });
  return !!existingUser;
};

const createUser = async ({
  name,
  lastName,
  address,
  email,
  phone,
  role,
  password,
  postalCode,
  city,
  country,
}) => {
  const emailExists = await checkEmailExists(email);

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const user = await User.create({
    name,
    lastName,
    address,
    email,
    phone,
    role,
    password,
    postalCode,
    city,
    country,
  });
  
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      phone: user.phone,
      role: user.role,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
    },
    PASSWORD_JWT,
    { expiresIn: 86400 }
  );
  return token;
};

const getUserById = async (id) => {
  const userById = await User.findOne({ where: { id } });
  if (!userById) throw Error("User not found");
  return userById;
};

const updateUser = async (id, dataUser) => {
  const allowedFields = [
    "name",
    "lastName",
    "address",
    "email",
    "phone",
    "password",
    "postalCode",
    "city",
    "country",
  ]; //contiene los nombres de los campos que se pueden actualizar
  const updateFields = Object.keys(dataUser); //Se obtienen los nombres de los campos que se desean actualizar
  const invalidFields = updateFields.filter(
    (field) => !allowedFields.includes(field)
  ); //validación para asegurarse de que los campos que se desean actualizar estén incluidos en la lista de campos permitidos
  if (invalidFields.length > 0) throw Error("Invalid Fields");

  await User.update(dataUser, { where: { id } });
  const user = await User.findByPk(id);
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      address: user.address,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
    },
    PASSWORD_JWT,
    { expiresIn: 86400 }
  );

  return {
    data: user,
    token: token,
  };
};

const signIn = async (email, password) => {
  const userFound = await User.findOne({ where: { email: email } });
  if (!userFound) throw Error("User not found");
  const matchPassword = await userFound.comparePassword(password);
  if (!matchPassword) throw Error("Invalid password");
  console.log(userFound);
  const token = jwt.sign(
    {
      id: userFound.id,
      name: userFound.name,
      lastName: userFound.lastName,
      address: userFound.address,
      email: userFound.email,
      phone: userFound.phone,
      role: userFound.role,
      password: userFound.password,
      postalCode: userFound.postalCode,
      city: userFound.city,
      country: userFound.country,
    },
    PASSWORD_JWT,
    { expiresIn: 86400 }
  );

  return token;
};

const getAllUsers = async () => {
  const users = await User.findAll();
  if (users.length === 0) throw Error("¡No hay usuarios en la base de datos!");
  return users;
};

//FUNCIONES AUTENTICACION CON TERCEROS:
// registro OAuth2: se utiliza para procesar y autenticar a un usuario que inicia sesión a través de Google OAuth2.
const newUserOauth = async (data) => {
  try {
    const { email, given_name, family_name, sub } = await decodeTokenOauth(
      data
    );
    const [{ id, role }, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: given_name,
        lastName: family_name,
        email,
        googleId: sub,
      },
    });
    if (!created) {
      throw new Error("User Already exist");
    }
    console.log("el usuario se creo con exito");
    await sendWelcomeEmail(email);
    const token = jwt.sign(
      { id, role, name: given_name, lastName: family_name },
      PASSWORD_JWT,
      { audience: "" }
    );
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

const sendWelcomeEmail = async (userEmail) => {
  // Send a welcome email to the user
  const mailOptions = {
    from: emailUser,
    to: userEmail,
    subject: "Bienvenido a Hop Passion!",
    text: "Bienvenido a nuestra plataforma. Estamos felices de tener por aca!",
    html: `
      <p>Welcome to our platform. We are excited to have you on board!</p>
      <img src="cid:unique-image-id" alt="Welcome Image" />
    `,
    attachments: [
      {
        filename: "welcome-image.png", // The name for the attached file
        path: "src/utils/hombre-beber-cerveza.webp", // Replace with the actual path to your image
        cid: "unique-image-id", // A unique identifier for the image
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to: " + userEmail);
  } catch (error) {
    console.error("Error sending welcome email: " + error);
  }
};

//login OAuth: controlador de autenticación que se utiliza para autenticar a un usuario que ha iniciado sesión a través de OAuth
const authenticationOauth = async (data) => {
  const { email } = await decodeTokenOauth(data);
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("¡A gmail account is not regiter for this user!");
  if (user.isActive === false) throw new Error("This user is banned");

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      address: user.address,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: user.password,
      postalCode: user.postalCode,
      city: user.city,
      country: user.country,
    },
    PASSWORD_JWT,
    { audience: "" }
  );
  return token;
};

// delete user
const deleteUser = async (id) => {
  try {
    const user = await User.findOne({ where: { id, isActive: true } });
    if (!user) {
      return {
        status: "User not found",
      };
    }
    await User.update({ isActive: false }, { where: { id } });
    return user; // Devuelve el usuario eliminado
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

//activate user
const activateUser = async (id) => {
  try {
    if (!id) {
      throw new Error(`No ID provided for restoration!`);
    }
    await User.update({ isActive: true }, { where: { id } });

    const restoredNutritionist = await User.findByPk(id);

    return restoredNutritionist;
  } catch (error) {
    throw new Error(`Error updating nutritionist: ${error.message}`);
  }
};

//obtiene los usuarios que coincidan con el nombre ingresado
const getUserByName = async (name) => {
  const infoServer = await getAllUsers();
  const usersFiltered = infoServer.filter((user) =>
    normalizarCoincidencia(user.name).includes(normalizarCoincidencia(name))
  );
  if (usersFiltered.length < 1)
    throw Error(`No existe el usuario con el nombre: ${name}`);
  return usersFiltered;
};

const contraseñaNueva = async (userId, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    const [passwordUpdated, [updatedUser]] = await User.update(
      { password: hashedNewPassword },
      { where: { id: userId }, returning: true }
    );

    if (passwordUpdated === 0) {
      // Si no se actualizó ninguna fila, significa que el usuario no fue encontrado
      throw new Error("Usuario no encontrado");

    }

    return "Contraseña actualizada con éxito";
  } catch (error) {
    throw new Error("Error al actualizar la contraseña: " + error.message);
  }
};

module.exports = {
  createUser,
  updateUser,
  signIn,
  getAllUsers,
  getUserById,
  newUserOauth,
  authenticationOauth,
  deleteUser,
  activateUser,
  getUserByName,
  contraseñaNueva,
};
