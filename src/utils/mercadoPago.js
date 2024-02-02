const mercadopago = require("mercadopago");
require("dotenv").config();
const { API_KEY_PRUBEBAS } = process.env;

mercadopago.configure({
  access_token: API_KEY_PRUBEBAS,
});

module.exports = mercadopago;
