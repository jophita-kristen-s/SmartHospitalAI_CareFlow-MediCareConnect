/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId:   { type: DataTypes.UUID, allowNull: false },
  doctorId:    { type: DataTypes.UUID, allowNull: false },
  hospitalId:  { type: DataTypes.UUID },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status:      { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'done'), defaultValue: 'pending' },
  notes:       { type: DataTypes.TEXT },
});

module.exports = Appointment;*/
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId:   { type: DataTypes.UUID, allowNull: false },
  doctorId:    { type: DataTypes.UUID, allowNull: false },
  hospitalId:  { type: DataTypes.UUID },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status:      { type: DataTypes.ENUM('pending','confirmed','cancelled','done'), defaultValue: 'pending' },
  notes:       { type: DataTypes.TEXT },
});

module.exports = Appointment;