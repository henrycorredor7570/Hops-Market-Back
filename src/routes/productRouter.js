const { Router } = require("express");
const {createProduct,allProducts,getProduct,deleteProduct,activeProduct,editProduct,qualify,qualified} = require("../handlers/productHandler");
const productRouter = Router();

productRouter.post("/create", createProduct);
productRouter.get("/all", allProducts);
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.post("/:id", activeProduct);
productRouter.put("/:id", editProduct);
productRouter.get("/qualify/:id", qualify);
productRouter.get("/qualified/:id", qualified);

module.exports = productRouter;
