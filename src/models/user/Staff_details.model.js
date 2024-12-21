// staff_details.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js'; 
import User from './User.model.js';
import StaffAddress from '../Staff/Staff_address.model.js';
import Classroom from '../Academic/Classroom.model.js';
import Subject from '../Academic/Subject.model.js';

class StaffDetails extends Model { }

StaffDetails.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
  staff_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  univ_id: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  short_name: { type: DataTypes.STRING },
  salutation: { type: DataTypes.STRING},
  photo: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATEONLY },
  mobile_number: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  emergency_contact: { type: DataTypes.STRING },
  marital_status: { type: DataTypes.STRING },
  medical_remarks: { type: DataTypes.TEXT },
  blood_group: { type: DataTypes.STRING },
  religion: { type: DataTypes.STRING },
  
  staff_type: { type: DataTypes.ENUM('teaching', 'nonTeaching') },
  designation: { type: DataTypes.STRING },
  qualifications: { type: DataTypes.STRING },
  employment_nature: { type: DataTypes.STRING }, // Permanent, Contract
  employment_place: { type: DataTypes.ENUM('KBA', 'UNIVERSITY') },
  doj: { type: DataTypes.DATEONLY },
  experience_years: { type: DataTypes.INTEGER },
  work_email: { type: DataTypes.STRING },
  aadhar_no: { type: DataTypes.STRING },

  notes: { type: DataTypes.TEXT },
  present_address_type: { type: DataTypes.ENUM('hostel', 'outside'), allowNull: false },
  permanent_address_id: { type: DataTypes.INTEGER, references: { model: 'staff_address', key: 'id' } },
  present_address_id: { type: DataTypes.INTEGER, references: { model: 'staff_address', key: 'id' }}
}, {
  sequelize,
  modelName: 'StaffDetails',
  tableName: 'staff_details',
  timestamps: true
});

StaffDetails.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasOne(StaffDetails, { foreignKey: 'user_id' });

StaffDetails.belongsTo(StaffAddress, { as: 'permanentAddress', foreignKey: 'permanent_address_id' });
StaffDetails.belongsTo(StaffAddress, { as: 'presentAddress', foreignKey: 'present_address_id' });

StaffAddress.hasMany(StaffDetails, { foreignKey: 'permanent_address_id' });
StaffAddress.hasMany(StaffDetails, { foreignKey: 'present_address_id' });

StaffDetails.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Classroom.hasOne(StaffDetails, { foreignKey: 'id', sourceKey: 'advisor_id', as: 'advisor' });

StaffDetails.hasMany(Subject, { foreignKey: 'course_staff_id', as: 'courseSubjects' });
StaffDetails.hasMany(Subject, { foreignKey: 'handling_staff_id', as: 'handlingSubjects' });

Subject.belongsTo(StaffDetails, { foreignKey: 'course_staff_id', as: 'courseStaff' });
Subject.belongsTo(StaffDetails, { foreignKey: 'handling_staff_id', as: 'handlingStaff' });



export default StaffDetails;