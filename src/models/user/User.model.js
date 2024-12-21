// userModel.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Role from '../Roles.model.js'; 

class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.STRING, allowNull: false, unique: true },
  pass: { type: DataTypes.STRING, allowNull: false },
  user_type: { type: DataTypes.ENUM('student', 'staff'), allowNull: false },
  role_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },

  resetOtp: { type: DataTypes.STRING, allowNull: true },
  otpExpiration: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true
});

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id' });

export default User;