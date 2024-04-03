const { Order, OrderDetail, Product } = require("../db");

const getCart = async (userId) => { 
  try { 
    const cart = await Order.findOne({
      attributes: ["id"],
      where: {
        user_id: userId,
        status: "pending",
      },
      include: [
        {
          model: OrderDetail,
          as: "OrderDetails",
          attributes: ["quantity", "unitPrice"],
          include: [
            {
              model: Product,
              attributes: ["name", "image", "stock", "id"],
            },
          ],
        },
      ],
    });
    if (cart == null || cart.OrderDetails.length == 0) {
      return null;
    }
    return mapOrderToCart(cart.toJSON());
  } catch (error) {
    throw new Error(error.message);
  }
};

const setProduct = async (userId, productId, quantity) => {
  if (quantity < 0) {
    throw new Error("Invalid quantity");
  }
  try {
    const product = await Product.findByPk(productId);
    if (product == null) {
      throw new Error("Product not found");
    }
    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }
    const [cart, cartCreated] = await Order.findOrCreate({
      where: {
        user_id: userId,
        status: "pending",
      },
      defaults: {
        date: new Date(),
      },
    });
    const [entry, entryCreated] = await OrderDetail.findOrCreate({
      where: {
        order_id: cart.id,
        product_id: product.id,
      },
      defaults: {
        order_id: cart.id,
        product_id: product.id,
        quantity: quantity,
        unitPrice: product.price,
      },
      include: [
        {
          model: Product,
          attributes: ["name", "image", "stock", "id"],
        },
      ],
    });
    if (!entryCreated) {
      entry.quantity = quantity;
      await entry.save();
    }
    if (entry.quantity == 0) {
      await entry.destroy();
    }
    return { id: product.id, quantity: quantity };
  } catch (error) {
    throw new Error(error.message);
  }
};

const mapOrderToCart = (order) => {
  return {
    id: order.id,
    products: order.OrderDetails.map((row) => {
      return {
        quantity: row.quantity,
        price: row.unitPrice.toString(),
        name: row.Product.name,
        image: row.Product.image,
        stock: row.Product.stock,
        id: row.Product.id,
      };
    }),
    total: order.OrderDetails.reduce((accumulator, row) => {
      return accumulator + row.unitPrice * row.quantity;
    }, 0)
      .toFixed(2)
      .toString(),
  };
};

module.exports = {
  getCart,
  setProduct
};
