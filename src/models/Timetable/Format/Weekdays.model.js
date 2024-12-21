// Weekdays.model.js

import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/db.js';

class Weekdays extends Model { }

Weekdays.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    order: { type: DataTypes.INTEGER },
    day_name: { type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') },
    isWeekend: { type: DataTypes.BOOLEAN, defaultValue: false, },
    format_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'timetable_formats', key: 'id' } }
}, {
    sequelize,
    modelName: 'Weekdays',
    tableName: 'weekdays',
    timestamps: true
});

export default Weekdays;