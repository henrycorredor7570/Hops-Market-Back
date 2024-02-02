const {
  totalUsersStadistics,
  monthlyIncome,
  getTen,
  historicalTotalSales,
} = require("../controllers/stadisticsController");

const getTotalUsers = async (req, res) => {
  try {
    const response = await totalUsersStadistics();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMonthlyIncomeForTheYear = async (req, res) => {
  try {
    const { type } = req.query;
    const actualDate = new Date();
    const actualYear = actualDate.getFullYear();
    const response = await monthlyIncome(type, actualYear);
    res.status(200).json({ data: response, actualYear: actualYear });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getTenProducts=async(req,res)=>{
  try{
    const filtrado=await getTen();
    res.status(200).json(filtrado)

  }catch(error){
res.status(400).json({error:error.message})
  }
}

const historicalTotal = async (req, res) => {
  try {
    const actualDate = new Date();
    const actualYear = actualDate.getFullYear();
    const total = await historicalTotalSales(actualYear);
    const totalNotDecimal = Math.round(total);
    res.status(200).json({ data: totalNotDecimal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTotalUsers,
  getMonthlyIncomeForTheYear,
  getTenProducts,
  historicalTotal,
};
