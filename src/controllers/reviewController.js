const Sequelize = require("sequelize");
const { Review, Product, User } = require("../db");

const createRev = async (review) => {
  try {
    const { idProd, idUser, ...reviewData } = review;
    const product = await Product.findByPk(idProd);
    if (!product) {
      throw new Error(`Producto con id ${idProd} no encontrado.`);
    }

    const user = await User.findByPk(idUser);
    if (!user) {
      throw new Error(`Usuario con id ${idUser} no encontrado.`);
    }

    const existingReview = await Review.findOne({
      where: { UserId: idUser, ProductId: idProd },
    });

    if (existingReview) {
      throw new Error(
        "El usuario ya ha realizado una revisión para este producto."
      );
    }

    const newReview = await Review.create(reviewData);
    await newReview.setProduct(product);
    await newReview.setUser(user);

    return newReview;
  } catch (error) {
    throw new Error(`Error creating Review: ${error.message}`);
  }
};

const deleteRev = async (idReview) => {
  try {
    const deletedReview = await Review.destroy({
      where: {
        id: idReview,
      },
    });

    return deletedReview;
  } catch (error) {
    throw new Error(`Error deleting Review: ${error.message}`);
  }
};

const updateRev = async (idReview, changes) => {
  try {
    const allowedFields = ["rating", "comment", "isReviewed"];
    const invalidFields = Object.keys(changes).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new Error(
        `Los siguientes campos no son válidos: ${invalidFields.join(", ")}`
      );
    }

    const [updatedCount, updatedReviews] = await Review.update(changes, {
      where: {
        id: idReview,
      },
      returning: true,
    });

    if (updatedCount === 0 || updatedReviews.length === 0) {
      throw new Error(`No se encontró ninguna revisión con ID ${idReview}.`);
    }

    return updatedReviews[0];
  } catch (error) {
    throw new Error(`Error updating Review: ${error.message}`);
  }
};

const listRev = async (idUser, idProd) => {
  try {
    let whereCondition = {};

    if (idUser) {
      whereCondition.UserId = idUser;
    }

    if (idProd) {
      whereCondition.ProductId = idProd;
    }

    const reviews = await Review.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: [["name", "user"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!idUser && !idProd) {
      return reviews;
    }

    if (idUser && idProd) {
      const otherReviews = await Review.findAll({
        where: {
          ProductId: idProd,
          UserId: {
            [Sequelize.Op.ne]: idUser,
          },
        },
        include: [
          {
            model: User,
            attributes: [["name", "user"]],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return [...reviews, ...otherReviews];
    }

    return reviews;
  } catch (error) {
    throw new Error(`Error retrieving Review: ${error.message}`);
  }
};

const listUnreviewedRevs = async () => {
  try {
    const UnreviewedRevs = await Review.findAll({
      where: {
        isReviewed: false,
      },
      include: [
        {
          model: User,
          attributes: ["email"],
        },
      ],
    });

    return UnreviewedRevs;
  } catch (error) {
    throw new Error(`Error retrieving unreviewed reviews: ${error.message}`);
  }
};

module.exports = {
  createRev,
  deleteRev,
  updateRev,
  listRev,
  listUnreviewedRevs,
};
