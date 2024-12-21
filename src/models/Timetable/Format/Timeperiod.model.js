// Timeperiod.model.js

import { Model, DataTypes, or } from 'sequelize';
import sequelize from '../../../config/db.js';

class Timeperiod extends Model {}

Timeperiod.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    order: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    start_time: { type: DataTypes.TIME },
    end_time: { type: DataTypes.TIME },
    format_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'timetable_formats', key: 'id' } }
}, {
    sequelize,
    modelName: 'Timeperiod',
    tableName: 'timeperiods',
    timestamps: true
});

export default Timeperiod;