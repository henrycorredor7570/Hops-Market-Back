const {
  createRev,
  deleteRev,
  updateRev,
  listRev,
  listUnreviewedRevs,
} = require("../controllers/reviewController.js");

const createReview = async (req, res) => {
  try {
    const review = req.body;
    const response = await createRev(review);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { idReview } = req.params;
    const response = await deleteRev(idReview);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateReview = async (req, res) => {
  try {
    const { idReview } = req.params;
    const { ...changes } = req.body;
    const response = await updateRev(idReview, changes);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const listReview = async (req, res) => {
  try {
    const { idUser, idProd } = req.query;
    const response = await listRev(idUser, idProd);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listUnreviewedReviews = async (req, res) => {
  try {
    const { idUser, idProd } = req.query;
    const response = await listUnreviewedRevs(idUser, idProd);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  deleteReview,
  updateReview,
  listReview,
  listUnreviewedReviews,
};
