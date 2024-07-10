const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("genres", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false, // Desactivar la generación de createdAt y updatedAt
    freezeTableName: true,
  });


  
};