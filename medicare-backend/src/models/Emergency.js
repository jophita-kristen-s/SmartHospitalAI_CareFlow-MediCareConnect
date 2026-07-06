const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Emergency = sequelize.define('Emergency', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  patientId:   { type: DataTypes.UUID },
  hospitalId:  { type: DataTypes.UUID },
  description: { type: DataTypes.TEXT },
  severity:    { type: DataTypes.ENUM('low', 'medium', 'critical'), defaultValue: 'medium' },
  status:      { type: DataTypes.ENUM('open', 'responding', 'resolved'), defaultValue: 'open' },
  location:    { type: DataTypes.STRING },
});

module.exports = Emergency;