require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { User, Categorie, Product, Order, OrderDetail, Review, Buy } =
  sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Categorie.belongsToMany(Product, {
  through: "categorie_product",
  timestamps: false,
  as: "Products",
});
Product.belongsToMany(Categorie, {
  through: "categorie_product",
  timestamps: false,
  as: "Categories",
});

User.hasMany(Order, { foreignKey: "user_id", as: "Orders" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasMany(OrderDetail, { foreignKey: "order_id", as: "OrderDetails" });
OrderDetail.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(Review);
Review.belongsTo(Product);

User.hasOne(Review);
Review.belongsTo(User);

Product.hasMany(OrderDetail, { foreignKey: "product_id", as: "OrderDetails" });
OrderDetail.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Buy, {foreignKey: 'UserId'}); 
Buy.belongsTo(User); 

Product.belongsToMany(Buy, { through: 'ProductBuy' }); 
Buy.belongsToMany(Product, { through: 'ProductBuy' }); 

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
