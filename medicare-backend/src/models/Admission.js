const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admission = sequelize.define('Admission', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId:    { type: DataTypes.UUID, allowNull: false },
  hospitalId:   { type: DataTypes.UUID, allowNull: false },
  bedId:        { type: DataTypes.UUID },
  admittedAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  dischargedAt: { type: DataTypes.DATE },
  status:       { type: DataTypes.ENUM('active', 'discharged'), defaultValue: 'active' },
  diagnosis:    { type: DataTypes.TEXT },
});

module.exports = Admission;