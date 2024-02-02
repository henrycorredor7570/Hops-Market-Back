const { Router } = require("express");
const router = Router();

const saveAllRoute = require("./saveAllInfoAPI");
const reviewRouter = require("./reviewRouter");
const productRouter = require("./productRouter");
const usersRouter = require("./usersRouter");
const categoriesSave = require("./saveCategoriesRoute");
const categoriesRoutes = require("./categoriesRoute");
const filterConfigurationRoutes = require("./filterConfigurationRouter");
const cartRouter = require("./cartRouter");
const protectedRouter = require("./protectedRouter");
const mercadoPagoRoute = require("./mercadoPagoRoute");
const buysRouter = require("./buysRouter");
const stadisticsRouter = require("./stadisticsRouter");
const orderRouter = require("./orderRouter")

router.use("/dataUpload", saveAllRoute);
router.use("/review", reviewRouter);
router.use("/users", usersRouter);
router.use("/saveCategories", categoriesSave);
router.use("/product", productRouter);
router.use("/categories", categoriesRoutes);
router.use("/pay", mercadoPagoRoute);
router.use("/filters", filterConfigurationRoutes);
router.use("/cart", cartRouter);
router.use("/protected", protectedRouter);
router.use("/buy", buysRouter);
router.use("/stadistics", stadisticsRouter);
router.use("/orders", orderRouter);

module.exports = router;
