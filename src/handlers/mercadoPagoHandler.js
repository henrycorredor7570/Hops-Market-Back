const { processPayment } = require("../controllers/mercadopagoController");

const processPaymentHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const response = await processPayment(userId, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processPaymentHandler,
}