// classroomModel.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Course from './Course.model.js';

class Classroom extends Model { }

Classroom.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  room_no: { type: DataTypes.STRING },
  term: { type: DataTypes.ENUM('ODD', 'EVEN') , allowNull: false,
    validate: {
      isIn:{ args: [['ODD', 'EVEN']], msg: 'Term must be either ODD or EVEN' }
  }
   },
  semester: { type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8') },
  advisor_id: { type: DataTypes.INTEGER, references: { model: 'staff_details', key: 'id'} },
  leader_id: { type: DataTypes.INTEGER, references: { model: 'student_details', key: 'id'} },
  batch: { type: DataTypes.INTEGER },
  course_id: { type: DataTypes.INTEGER, references: { model: 'courses', key: 'id'} },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  modelName: 'Classroom',
  tableName: 'classrooms',
  timestamps: true
});

Classroom.belongsTo(Course, { as: 'course', foreignKey: 'course_id' });
Course.hasMany(Classroom, { foreignKey: 'course_id' });

export default Classroom;