const { Router } = require("express");
const { getAllBuys, getBuyById, createBuy, getAmountTotal } = require("../handlers/buysHandler");
const buysRouter = Router();

buysRouter.get("/getAllBuys", getAllBuys);
buysRouter.get("/getBuy/:id", getBuyById);
buysRouter.post("/createBuy", createBuy);
buysRouter.get("/amountTotal", getAmountTotal);

module.exports = buysRouter;