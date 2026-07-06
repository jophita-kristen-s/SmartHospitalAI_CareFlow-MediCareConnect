const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId: { type: DataTypes.UUID, allowNull: false },
  doctorId:  { type: DataTypes.UUID, allowNull: false },
  drugs:     { type: DataTypes.JSONB }, // [{ name, dose, frequency }]
  notes:     { type: DataTypes.TEXT },
  issuedAt:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Prescription;