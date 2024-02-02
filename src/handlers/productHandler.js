const {
  createProd,
  searchProducts,
  getProductById,
  bloquear,
  desbloquear,
  editarProducto,
  qualifyProd,
  qualifiedProd,
} = require("../controllers/productController");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      description,
      category,
      country,
      price,
      stock,
      amountMl,
      alcoholContent,
    } = req.body;
    const response = await createProd({
      name,
      image,
      description,
      country,
      price,
      stock,
      category,
      amountMl,
      alcoholContent,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const allProducts = async (req, res) => {
  try {
    const { query, country, order, page, category } = req.query;
    const response = await searchProducts(
      query,
      country,
      order,
      category,
      parseInt(page ?? 1, 10)
    );
    return res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productbloqued = await bloquear(id);
    res.status(200).json(productbloqued);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const activeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productUnlocked = await desbloquear(id);
    res.status(200).json({ message: productUnlocked });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, alcoholContent, image, stock, price, country, description, amountMl} = req.body;

  try {
    const result = await editarProducto(
      id,
      name,
      alcoholContent,
      image,
      stock,
      price,
      country, 
      description,
      amountMl
    );
    if (result) {
      res
        .status(200)
        .json({ message: "Producto editado con éxito", product: result });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al editar el producto: " + error.message });
  }
};

const qualify = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await qualifyProd(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const qualified = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await qualifiedProd(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  allProducts,
  getProduct,
  deleteProduct,
  activeProduct,
  editProduct,
  qualify,
  qualified,
};
