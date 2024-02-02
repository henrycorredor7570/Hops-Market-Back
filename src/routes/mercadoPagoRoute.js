const { Router } = require("express");
const { processPaymentHandler } = require("../handlers/mercadoPagoHandler");
const { verifyToken } = require("../utils/authJwt");
const mercadoPagoRoute = Router();

mercadoPagoRoute.post("/process_payment", verifyToken, processPaymentHandler);

module.exports = mercadoPagoRoute;
