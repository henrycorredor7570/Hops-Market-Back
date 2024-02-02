const { getAllBuy, getBuyId, createBuys, amounTotal } = require("../controllers/buysControlles");

const getAllBuys = async (req, res) => {
  try {
    const response = await getAllBuy();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getBuyById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getBuyId(id);
    res.status(200).json({ data: response.Buys });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const createBuy = async (req, res) => {
  try {
    const { amount, payment_id, userId, productId } = req.body;
    if (!amount || !payment_id || !userId || !productId){
      throw new Error("Faltan datos")
    }
    const response = await createBuys(amount, payment_id, userId, productId);
    res.status(200).json({ success: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getAmountTotal = async (req, res) => {
  try {
    const response = await amounTotal();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getAllBuys,
  getBuyById,
  createBuy,
  getAmountTotal,
}