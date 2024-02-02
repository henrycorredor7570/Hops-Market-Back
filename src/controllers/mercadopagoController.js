const mp = require("../utils/mercadoPago");
require("dotenv").config();
const nodemailer = require("nodemailer"); // Import Nodemailer
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const { conn, Order, OrderDetail, Product } = require("../db");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
});

const processPayment = async (userId, info) => {
    try {
        const cart = await getCurrentCart(userId)
        const total = getTotalFromCart(cart)

        // we check that the amount to pay is the same as the cart
        if (total != info.transaction_amount) {
            throw new Error(`Invalid amount: total is ${info.transaction_amount} and cart is ${total}`);
        }

        // we check that all products have the necessary stock
        if (!validateStockFromCart(cart)) {
            throw new Error("Invalid quantities");
        }

        const preference = {
            description: "Pago en HopPassion",
            payment_method_id: info.payment_method_id,
            token: info.token,
            installments: info.installments,
            payer: {
              email: info.payer.email,
            },
            transaction_amount: total
        };

        const payerEmail = info.payer.email;
        const { response } = await mp.payment.save(preference)

        if (response.status == "approved" && response.status_detail == "accredited") {
            const t = await conn.transaction();
        
            cart.status = "send"
            cart.total = parseInt(total, 10)

            const operations = []
            const updateStock = cart.OrderDetails.map((row) => {
                if (row.quantity <= row.Product.stock) {
                    row.Product.stock -= row.quantity
                    return row.Product.save( { transaction: t} )
                } else {
                    throw new Error("Invalid quantities");
                }
            })

            operations.push(...updateStock)

            try {
                await Promise.all(operations)
                await cart.save( { transaction: t} )
                await t.commit()
            } catch(error) {
                throw error
            }

            sendPaymentNotification(payerEmail, total);
        }

        return { status: response.status, payment_id: response.id };
    } catch(error) {
        console.error("Error al procesar el pago:", error);
        throw new Error(error.message);
    }
}

async function getCurrentCart(userId) {
    return await Order.findOne({
        attributes: ["id", "total", "status"],
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
                  attributes: ["stock", "id"],
                },
              ],
          },
        ],
    });
}

function getTotalFromCart(cart) {
    return parseFloat(cart.OrderDetails.reduce((accumulator, row) => {
        return accumulator + row.unitPrice * row.quantity;
    }, 0).toFixed(2))
}

function validateStockFromCart(cart) {
    const invalid = cart.OrderDetails.find((row) => {
        return row.quantity > row.Product.stock
    })

    return invalid == null
}

const sendPaymentNotification = async (payerEmail, total) => {
    const mailOptions = {
      from: emailUser,
      to: payerEmail,
      subject: "Confirmacion de pago",
      text: `Gracias por confiar en nosotros. El monto total de tu compra fue de: ${total} pesos`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending payment notification email: " + error);
    }
  };

module.exports = {
    processPayment
}