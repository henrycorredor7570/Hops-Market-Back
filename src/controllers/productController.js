const { Product, Categorie, Review, OrderDetail, User, Buy } = require("../db");
const { Op, Sequelize, where } = require("sequelize");

const createProd = async ({
  name,
  image,
  description,
  country,
  category,
  price,
  stock,
  amountMl,
  alcoholContent,
}) => {
  try {
    // Busca la categoría por nombre
    const categorie = await Categorie.findOne({
      where: {
        name: category,
      },
    });

    if (!categorie) {
      throw new Error("Categoria no encontrada");
    } else {
      const [createNewProd, created] = await Product.findOrCreate({
        where: { name: name },
        defaults: {
          name,
          image,
          description,
          country,
          price,
          stock,
          amountMl,
          alcoholContent,
        },
      });
      await createNewProd.addCategorie(categorie);
      return createNewProd;
    }
  } catch (error) {
    return error;
  }
};

const searchProducts = async (query, country, order, category, page) => {
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  //parche caso alfabetizacion("error": "column reference \"name\" is ambiguous") para Z_A || A_Z
  let type;
  if (order === "Z_A" || order === "A_Z") {
    type = order;
    order = undefined;
  }

  try {
    let result = await Product.findAndCountAll({
      attributes: [
        "id",
        "name",
        "price",
        "image",
        "stock",
        "alcoholContent",
        "isDeleted",
      ],
      where: filterConfiguration(query, country),
      order: orderingConfiguration(order),
      include: includeConfiguration(category),
      limit: pageSize,
      offset: offset,
    });

    if (type && result.rows.length) {
      result.rows = orderByName(type, result.rows);
    }
    //const filteredRows = result.rows[0].filter(e => e.dataValues.isDeleted !== true);
    const filtered = [];
    for (const product of result.rows) {
      if(product.dataValues.isDeleted === true){
        filtered.push(product);
      }
    }
    return {
      products: filtered,
      page: { page, hasMore: offset + result.rows.length < result.count },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const orderByName = (type, result) => {
  return result
    .map((prod) => prod.dataValues)
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return type === "Z_A"
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    });
};

const getProductById = async (id) => {
  try {
    const result = (
      await Product.findByPk(id, {
        include: {
          model: Categorie,
          attributes: ["name"],
          through: { attributes: [] },
          as: "Categories",
        },
      })
    ).toJSON();
    const product = {
      ...result,
      categories: result.Categories.map((category) => category.name),
    };
    delete product.Categories;
    return product;
  } catch (error) {
    return error;
  }
};

const filterConfiguration = (query, country) => {
  const filters = [];
  if (query) {
    filters.push({ name: { [Op.iLike]: `%${query}%` } });
  }
  if (country) {
    filters.push({ country: { [Op.eq]: country } });
  }
  return {
    [Op.and]: filters,
  };
};

const orderingConfiguration = (order) => {
  switch (order) {
    case "priceASC":
      return [["price", "ASC"]];
    case "priceDESC":
      return [["price", "DESC"]];
    case "alcoholASC":
      return [["alcoholContent", "ASC"]];
    case "alcoholDESC":
      return [["alcoholContent", "DESC"]];
    default:
      return [];
  }
};

const includeConfiguration = (category) => {
  const configuration = [];
  if (category) {
    configuration.push({
      model: Categorie,
      as: "Categories",
      attributes: [],
      where: { id: category },
      through: { attributes: [] },
    });
  }
  return configuration;
};
const bloquear = async (id) => {
  const productsd = await Product.update(
    { isDeleted: false }, // Corrige isDeleted en lugar de isDelete
    { where: { id } }
  );

  if (productsd[0] === 1) {
    return "Producto bloqueado";
  } else {
    return "Producto no encontrado";
  }
};

const desbloquear = async (id) => {
  const productsu = await Product.update(
    { isDeleted: true },
    { where: { id } }
  );

  if (productsu[0] === 1) {
    return "Producto desbloqueado";
  } else {
    throw new Error("Producto no encontrado o no pudo ser desbloqueado");
  }
};

const editarProducto = async (
  id,
  name,
  alcoholContent,
  image,
  stock,
  price,
  country,
  description, 
  amountMl
) => {
  const [rowsUpdated, [updatedProduct]] = await Product.update(
    {
      name,
      alcoholContent,
      image,
      stock,
      price,
      country,
      description, 
      amountMl
    },
    { where: { id }, returning: true }
  );

  return rowsUpdated === 1 ? updatedProduct : null;
};

const qualifyProd = async (UserId) => {
  try {
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

    return productsWithoutReviews;
  } catch (error) {
    throw new Error(`Error al obtener productos sin reseñas: ${error.message}`);
  }
};

const qualifiedProd = async (UserId) => {
  try {
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

    return productsWithReviews;
  } catch (error) {
    throw new Error(`Error al obtener productos con reseñas: ${error.message}`);
  }
};

module.exports = {
  createProd,
  searchProducts,
  getProductById,
  bloquear,
  desbloquear,
  editarProducto,
  qualifyProd,
  qualifiedProd,
};
