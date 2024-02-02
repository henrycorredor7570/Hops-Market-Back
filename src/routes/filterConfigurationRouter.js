const { Router } = require("express");
const { getFiltersConfiguration } = require("../handlers/filterConfigurationHandler");
const filterConfigurationRoutes = Router();

filterConfigurationRoutes.get("/configuration", getFiltersConfiguration);

module.exports = filterConfigurationRoutes;