const { Router } = require("express");
const { getCategory, findOneCategorie, createNewCategory } = require("../handlers/categoriesHandler");
const categoriesRoutes = Router();

categoriesRoutes.get("/all", getCategory);
categoriesRoutes.get("/findOneCategorie", findOneCategorie);
categoriesRoutes.post("/createNewCategory", createNewCategory);

module.exports = categoriesRoutes;