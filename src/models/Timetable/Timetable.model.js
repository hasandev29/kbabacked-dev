// Timetable.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import TimetableFormat from '../Timetable/Format/TimetableFormat.model.js';
import Classroom from '../Academic/Classroom.model.js';

class Timetable extends Model { }

Timetable.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    term: { type: DataTypes.ENUM('ODD', 'EVEN') },
    sem: { type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8') },
    version: { type: DataTypes.INTEGER },
    effective_from: { type: DataTypes.DATEONLY },
    classroom_id: { type: DataTypes.INTEGER, references: { model: 'classrooms', key: 'id' } },
    format_id: { type: DataTypes.INTEGER, references: { model: 'timetable_formats', key: 'id' } },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    sequelize, 
    modelName: 'Timetable',
    tableName: 'timetables',
    timestamps: true,
});

Timetable.belongsTo(TimetableFormat, { foreignKey: 'format_id', as: 'format' });
TimetableFormat.hasMany(Timetable, { foreignKey: 'format_id' });

Classroom.hasMany(Timetable, { foreignKey: 'classroom_id' });
Timetable.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });

export default Timetable;