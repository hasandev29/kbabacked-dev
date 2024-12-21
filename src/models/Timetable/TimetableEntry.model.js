// TimetableEntry.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import Timetable from './Timetable.model.js';
import Subject from '../Academic/Subject.model.js';
import Weekdays from './Format/Weekdays.model.js';
import TimePeriod from './Format/Timeperiod.model.js';

class TimetableEntry extends Model {}

TimetableEntry.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    timetable_id: { type: DataTypes.INTEGER, references: { model: 'timetables', key: 'id' } },
    weekdays_id: { type: DataTypes.INTEGER, references: { model: 'weekdays', key: 'id' } },
    timePeriod_id: { type: DataTypes.INTEGER, references: { model: 'timeperiods', key: 'id' } },
    subject_id: { type: DataTypes.INTEGER, references: { model: 'subjects', key: 'id' } }
}, {
    sequelize,
    modelName: 'TimetableEntry',
    tableName: 'timetable_entries',
    timestamps: true
})

TimetableEntry.belongsTo(Timetable, { foreignKey: 'timetable_id' });
TimetableEntry.belongsTo(Weekdays, { foreignKey: 'weekdays_id' });
TimetableEntry.belongsTo(TimePeriod, { foreignKey: 'timePeriod_id' });
TimetableEntry.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

export default TimetableEntry;