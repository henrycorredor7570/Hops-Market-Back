const { Router } = require("express");
const { saveAllInfo, updateData } = require("../handlers/saveAllHandler");
const saveAllRoute = Router();

saveAllRoute.post("/", saveAllInfo);
saveAllRoute.get("/update", updateData)

module.exports = saveAllRoute