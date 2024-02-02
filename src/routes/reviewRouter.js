const { Router } = require("express");
const {
  createReview,
  deleteReview,
  updateReview,
  listReview,
  listUnreviewedReviews,
} = require("../handlers/reviewHandler.js");
const reviewRouter = Router();

reviewRouter.post("/create", createReview);
reviewRouter.delete("/delete/:idReview", deleteReview);
reviewRouter.put("/update/:idReview", updateReview);
reviewRouter.get("/list", listReview);
reviewRouter.get("/unreviewed", listUnreviewedReviews);

module.exports = reviewRouter;
