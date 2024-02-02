const { Order, OrderDetail, Product, User } = require("../db");
const { Op } = require("sequelize");

const getAllOrders = async (userId) => {
    try {
        const orders = await Order.findAll({
          attributes: [ "id", "createdAt", "total", "status" ],
          where: {
            user_id: userId,
            status: {
                [Op.not]: "pending"
            },
          },
          order: [['createdAt', 'DESC']]
        });
        return mapOrdersToOrders(orders);
    } catch (error) {
    throw new Error(error.message);
    }
}

const getOrderWithId = async (userId, orderId) => {
    try {
        const fetchUser = User.findByPk(userId, {
            attributes: [ "address", "postalCode", "city", "country" ],
        })
        const fetchOrder = Order.findOne({
            attributes: [ "id", "createdAt", "total", "status" ],
            where: {
                id: orderId,
                user_id: userId,
                status: {
                    [Op.not]: "pending"
                }
            },
            include: [
                {
                    model: OrderDetail,
                    as: "OrderDetails",
                    attributes: [ "quantity", "unitPrice" ],
                    include: [
                    {
                        model: Product,
                        attributes: [ "name" ],
                    },
                    ],
                },
            ],
        });

        const [ order, user ] = await Promise.all([fetchOrder, fetchUser])
        return mapOrderUserToOrder(order, user);
    } catch (error) {
    throw new Error(error.message);
    }
}

function mapOrdersToOrders(orders) {
    return orders.map((order) => {
        return {
            id: order.id,
            created_at: order.createdAt,
            total: order.total,
            status: order.status
        }
    })
}

function mapOrderUserToOrder(order, user) {
    return {
        id: order.id,
        created_at: order.createdAt,
        status: order.status,
        payment: {
            total: order.total
        },
        address: {
            street: user.address,
            postal_code: user.postalCode,
            city: user.city,
            country: user.country 
        },
        products: order.OrderDetails.map((row) => {
            return {
                name: row.Product.name,
                quantity: row.quantity,
                price: row.unitPrice,
                subtotal: row.quantity * row.unitPrice
            }
        })
    }
}

module.exports = {
    getAllOrders,
    getOrderWithId
}