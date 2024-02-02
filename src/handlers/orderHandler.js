const { getAllOrders, getOrderWithId } = require("../controllers/orderController");

const getAllOrdersHandler = async (req, res) => {
    try {
      const response = await getAllOrders(req.userId)
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const getOrderWithIdHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await getOrderWithId(req.userId, id)
        res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllOrdersHandler,
    getOrderWithIdHandler
};
  