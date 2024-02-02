const { saveAllData, updateAllData } = require("../controllers/saveAllDataAPI");

const saveAllInfo = async (req, res) => {
  try {
    const { data } = req.body;
    const response = saveAllData(data);
    res.status(200).json({ message: "DB cargada con exito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateData = async (req, res) => {
  try {
    const updateData = await updateAllData();
    res.status(200).json({ message: "DB actualizada con exito" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  saveAllInfo,
  updateData
};
