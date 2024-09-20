const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Order", {
    //FALTA LA COLUMNA USER_ID QUE SE MENCIONA EN EL DB.JS
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["pending", "send", "delivered"],
      defaultValue: "pending",
    },

    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  });
};
