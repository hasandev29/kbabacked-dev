// TimetableFormat.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/db.js';
import Classroom from '../../Academic/Classroom.model.js';

class TimetableFormat extends Model {}

TimetableFormat.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    desc: { type: DataTypes.STRING },
    // classroom_id: { type: DataTypes.INTEGER, references: { model: 'classrooms', key: 'id'} },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    sequelize,
    modelName: 'TimetableFormat',
    tableName: 'timetable_formats',
    timestamps: true
});

// TimetableFormat.belongsTo(Classroom, { foreignKey: 'classroom_id' });

export default TimetableFormat;