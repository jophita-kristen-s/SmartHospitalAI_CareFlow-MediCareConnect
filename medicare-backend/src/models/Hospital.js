const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hospital = sequelize.define('Hospital', {
  id:       { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:     { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  contact:  { type: DataTypes.STRING },
  totalBeds:{ type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Hospital;