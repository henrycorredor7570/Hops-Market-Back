const { saveCategoriesDB } = require("../controllers/saveCategories");

const saveCategories = async (req, res) => {
  try {
    const { data } = req.body;
    const saveCategory = saveCategoriesDB(data);
    res.status(200).json({ message: "Categorias creadas con exito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  saveCategories,
}