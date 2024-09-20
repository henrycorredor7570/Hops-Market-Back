const { Product, Categorie, Review, Buy } = require("../db");
const { filterConfiguration,orderingConfiguration,includeConfiguration,orderByName } = require("../utils/productFunctions.js")

//#1: CREAR PRODUCTO:
const createProd = async ({name,image,description,country,category,price,stock,amountMl,alcoholContent}) => {
  // Busca la categoría por nombre
  const categorie = await Categorie.findOne({where: {name: category}});

  if (!categorie) throw new Error("Categoria no encontrada")

  const [createNewProd, created] = await Product.findOrCreate({
    where: {name:name},
    defaults: {name,image,description,country,price,stock,amountMl,alcoholContent}
  });

  // if (created) await createNewProd.addCategorie(categorie);//Este método es parte de la API de Sequelize
  //y se usa para asociar un producto con una categoría en la tabla intermedia categorie_product.

  return createNewProd;
};

//#2: OBTENER TODOS LOS PRODUCTOS:
const searchProducts = async (query, country, order, category, page) => {
  const pageSize = 20;
  const offset = (page - 1) * pageSize;
  //parche caso alfabetizacion("error": "column reference \"name\" is ambiguous") para Z_A || A_Z
  let type;
  if (order === "Z_A" || order === "A_Z") type = order, order = undefined;

  let result = await Product.findAndCountAll({
    attributes: ["id","name","price","image","stock","alcoholContent","isDeleted",],
    where: filterConfiguration(query, country),
    order: orderingConfiguration(order),
    include: includeConfiguration(category),
    limit: pageSize,
    offset: offset,
  });

  if (type && result.rows.length) result.rows = orderByName(type, result.rows);

  //const filteredRows = result.rows[0].filter(e => e.dataValues.isDeleted !== true);
  
  const filtered = [];
  for (const product of result.rows) {
    if(product.dataValues.isDeleted === true) filtered.push(product);
  }
  return {
    products: filtered,
    page: { page, hasMore: offset + result.rows.length < result.count },
  };
};

// #3: OBTENER PRODUCTO POR ID:
const getProductById = async (id) => {
  const result = (await Product.findByPk(id,{
      include: {
        model: Categorie,// incluir tambien los datos relacionados con el modelo categorie
        attributes: ["name"],
        through: { attributes: [] },
        as: "Categories"
      },
  })).toJSON();
  
  const product = {
    ...result, // con spread operator se copian todas las propiedades del objeto result.
    categories: result.Categories.map((category) => category.name)
  };
  delete product.Categories;
  return product;
};

// #4: ELIMINAR PRODUCTO POR ID:
const bloquear = async (id) => {
  const productsd = await Product.update(
    { isDeleted: false }, // Corrige isDeleted en lugar de isDelete
    { where: { id } }
  );

  if (productsd[0] === 1) return "Producto bloqueado"
  else return "Producto no encontrado";
};

//#5: ACTIVAR PRODUCTO:
const desbloquear = async (id) => {
  const productsu = await Product.update(
    { isDeleted: true },
    { where: { id } }
  );

  if (productsu[0] === 1) return "Producto desbloqueado";
  else throw new Error("Producto no encontrado o no pudo ser desbloqueado");
};

//#6: EDITAR PRODUCTO:
const editarProducto = async (id,name,image,description,country,price,stock,amountMl,alcoholContent) => {
  const [rowsUpdated, [updatedProduct]] = await Product.update(
    {name,image,description,country,price,stock,amountMl,alcoholContent},
    { where: { id }, returning: true }
  );

  return rowsUpdated === 1 ? updatedProduct : null;
};

//#7: CALIFICAR PRODUCTO:
const qualifyProd = async (UserId) => {
  const productsWithoutReviews = await Product.findAll({
    include: [
      {
        model: Buy,
        where: { UserId },
        attributes: [],
      },
      { model: Review, required: false },
    ],
    where: {
      "$Reviews.id$": null,
    },
  });

  if(!productsWithoutReviews) throw new Error("No se encontraron productos con reseñas.");
  return productsWithoutReviews;
};

//#8: PRODUCTO CALIFICADO:
const qualifiedProd = async (UserId) => {
  const productsWithReviews = await Product.findAll({
    include: [
      {
        model: Buy,
        where: { UserId },
        attributes: [],
      },
      {
        model: Review,
        where: { UserId },
        required: true,
      },
    ],
  });

  if(!productsWithReviews) throw new Error("No se encontraron productos con reseñas.");
  return productsWithReviews;
};

module.exports = {createProd,searchProducts,getProductById,bloquear,desbloquear,editarProducto,qualifyProd,qualifiedProd};
