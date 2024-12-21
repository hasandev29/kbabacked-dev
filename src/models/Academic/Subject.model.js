// Subject.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Classroom from './Classroom.model.js';

class Subject extends Model {}

Subject.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  short_name: { type: DataTypes.STRING },
  book_name: { type: DataTypes.STRING },
  credits: { type: DataTypes.INTEGER },
  univ_credits: { type: DataTypes.INTEGER },
  term: { type: DataTypes.ENUM('ODD', 'EVEN') },
  sem: { type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8') },
  classroom_id: { type: DataTypes.INTEGER, references: { model: 'classrooms', key: 'id' } },
  course_staff_id: { type: DataTypes.INTEGER, references: { model: 'staff_details', key: 'id' } },
  handling_staff_id: { type: DataTypes.INTEGER, references: { model: 'staff_details', key: 'id' } },
  desc: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  modelName: 'Subject',
  tableName: 'subjects',
  timestamps: true
});

Subject.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Classroom.hasMany(Subject, { foreignKey: 'classroom_id' });

export default Subject;

