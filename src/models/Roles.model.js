import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Role extends Model {}

Role.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  desc: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false
});

export default Role;
