const { Router } = require("express");
const { getCartHandler, setProductHandler } = require("../handlers/cartHandler");
const { verifyToken } = require ("../utils/authJwt");
const cartRouter = Router();

cartRouter.get("/", verifyToken, getCartHandler);
cartRouter.put("/set", verifyToken, setProductHandler);

module.exports = cartRouter;