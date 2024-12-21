// Course.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class Course extends Model { }

Course.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true,
        validate: {
            notEmpty: { msg: 'Classroom name cannot be empty' }
          }
     },
    code: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER },
    desc: { type: DataTypes.STRING },
    current_term: { type: DataTypes.ENUM('ODD', 'EVEN'), allowNull: false,
        validate: {
            isIn:{ args: [['ODD', 'EVEN']], msg: 'Term must be either ODD or EVEN' }
        }
     },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true
});

export default Course;