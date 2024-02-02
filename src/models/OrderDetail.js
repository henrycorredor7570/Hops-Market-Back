const { DataTypes } = require("sequelize");
// Exportamos una función que define el modelo

module.exports = (sequelize) => {
  sequelize.define("OrderDetail", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
};