// student_qualifications.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class StudentQualifications extends Model {}

StudentQualifications.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  exam_type: { type: DataTypes.ENUM('grade_10', 'grade_11', 'grade_12'), allowNull: false },
  school_name: { type: DataTypes.STRING },
  board: { type: DataTypes.STRING },
  medium: { type: DataTypes.STRING },
  passing_year: { type: DataTypes.STRING },
  passing_month: { type: DataTypes.STRING },
  school_address: { type: DataTypes.STRING },
  reg_number: { type: DataTypes.STRING },
  marks: { type: DataTypes.INTEGER },
  total_marks: { type: DataTypes.INTEGER },
  emis: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'StudentQualifications',
  tableName: 'student_qualifications',
  timestamps: true,
});

export default StudentQualifications;
