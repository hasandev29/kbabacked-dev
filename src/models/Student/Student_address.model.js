// student_address.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class StudentAddress extends Model {}

StudentAddress.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  address_type: { type: DataTypes.ENUM('permanent', 'present'), allowNull: false },
  door_no: { type: DataTypes.STRING },
  street: { type: DataTypes.STRING },
  area: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  pin_code: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'StudentAddress',
  tableName: 'student_address',
  timestamps: true,
});

export default StudentAddress;
