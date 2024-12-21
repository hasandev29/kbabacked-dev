// academic_details.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class AcademicDetails extends Model {}

AcademicDetails.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rrn: { type: DataTypes.STRING },
  univ_email: { type: DataTypes.STRING },
  yoj: { type: DataTypes.INTEGER },
  yoc: { type: DataTypes.INTEGER }
}, {
  sequelize,
  modelName: 'AcademicDetails',
  tableName: 'academic_details',
  timestamps: true,
});

export default AcademicDetails;