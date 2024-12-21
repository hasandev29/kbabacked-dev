// family_details.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class FamilyDetails extends Model {}

FamilyDetails.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  parent_email: { type: DataTypes.STRING },
  parent_whatsapp: { type: DataTypes.STRING },
  parent_sms: { type: DataTypes.STRING },
  father_name: { type: DataTypes.STRING },
  father_mobile: { type: DataTypes.STRING },
  father_education: { type: DataTypes.STRING },
  father_occupation: { type: DataTypes.STRING },
  annual_income: { type: DataTypes.INTEGER },
  mother_name: { type: DataTypes.STRING },
  mother_mobile: { type: DataTypes.STRING },
  mother_education: { type: DataTypes.STRING },
  mother_occupation: { type: DataTypes.STRING },
  guardian_name: { type: DataTypes.STRING },
  guardian_mobile: { type: DataTypes.STRING },
  guardian_relationship: { type: DataTypes.STRING },
  guardian_address: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'FamilyDetails',
  tableName: 'family_details',
  timestamps: true,
});

export default FamilyDetails;
