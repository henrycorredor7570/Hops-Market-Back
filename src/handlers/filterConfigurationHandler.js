const { getConfiguration } = require("../controllers/filterConfigurationController");

const getFiltersConfiguration = async (req, res) => {
    try {
        const response = await getConfiguration()
        res.status(200).json(response);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

module.exports = {
    getFiltersConfiguration
}