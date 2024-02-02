const { Router } = require("express");
const {
  getTotalUsers,
  getMonthlyIncomeForTheYear,
  getTenProducts,
  historicalTotal,
} = require("../handlers/stadisticsHandler");
const stadisticsRouter = Router();

stadisticsRouter.get("/totalUsers", getTotalUsers);
stadisticsRouter.get("/monthlyIncomeForTheYear", getMonthlyIncomeForTheYear);
stadisticsRouter.get("/getTenProduct",getTenProducts );
stadisticsRouter.get("/historixalTotalSales", historicalTotal);

module.exports = stadisticsRouter;
