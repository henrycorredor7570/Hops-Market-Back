const { getCategories, findCategorie, createNewCategorie } = require("../controllers/categoriesController");

const createNewCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if(!name){
      res.status(400).json({ message: "No se Psao ningun nombre para la categoria" })
    } else {
      const category = await createNewCategorie({name, description});
      res.status(200).json({ message: category });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getCategory = async (req, res) => {
  try {
    const categories = await getCategories()
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const findOneCategorie = async (req, res) => {
  try {
    const { name } = req.query;
    const category = await findCategorie(name);
    if(!name){
      res.status(404).json({ message: "No se paso ninguna consulta" })
    } else {
      res.status(200).json({ data: category });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getCategory,
  findOneCategorie,
  createNewCategory,
}