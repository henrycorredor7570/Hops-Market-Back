const { Router } = require("express");
const { saveCategories } = require("../handlers/saveCategories");
const categoriesSave = Router();

categoriesSave.post("/", saveCategories);

module.exports = categoriesSave;