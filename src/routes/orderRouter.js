const { Router } = require("express");
const { verifyToken } = require ("../utils/authJwt");
const { getAllOrdersHandler, getOrderWithIdHandler } = require("../handlers/orderHandler");
const orderRouter = Router();

orderRouter.get("/", verifyToken, getAllOrdersHandler);
orderRouter.get("/:id", verifyToken, getOrderWithIdHandler);

module.exports = orderRouter;

