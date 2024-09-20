const { Categorie } = require("../db.js");
const { Op } = require("sequelize");

const filterConfiguration = (query, country) => {
  const filters = [];
  if (query) filters.push({ name: { [Op.iLike]: `%${query}%` } });
  if (country) filters.push({ country: { [Op.eq]: country } });
  return {[Op.and]: filters};
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

module.exports = { filterConfiguration, orderingConfiguration, includeConfiguration, orderByName };