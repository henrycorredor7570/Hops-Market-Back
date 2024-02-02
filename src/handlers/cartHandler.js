const {
  getCart,
  setProduct,
} = require("../controllers/cartController");

const getCartHandler = async (req, res) => {
  try {
    const response = await getCart(req.userId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const setProductHandler = async (req, res) => {
  const userId = req.userId;
  const { productId, quantity = 1 } = req.body;
  try {
    const response = await setProduct(userId, productId, quantity);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCartHandler,
  setProductHandler
};
