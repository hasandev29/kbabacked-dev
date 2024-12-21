// admission_details.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class AdmissionDetails extends Model {}

AdmissionDetails.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  doa: { type: DataTypes.DATEONLY },
  entrance_mark: { type: DataTypes.INTEGER },
  entrance_rank: { type: DataTypes.INTEGER },
  hafiz: { type: DataTypes.BOOLEAN, defaultValue: false },
  recommended_by: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'AdmissionDetails',
  tableName: 'admission_details',
  timestamps: true,
});

export default AdmissionDetails;
