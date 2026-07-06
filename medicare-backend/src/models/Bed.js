const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bed = sequelize.define('Bed', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  hospitalId: { type: DataTypes.UUID, allowNull: false },
  bedNumber:  { type: DataTypes.STRING },
  ward:       { type: DataTypes.STRING },
  status:     { type: DataTypes.ENUM('available', 'occupied', 'maintenance'), defaultValue: 'available' },
});

module.exports = Bed;