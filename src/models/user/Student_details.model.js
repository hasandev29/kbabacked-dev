// student_details.model.js

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';
import AcademicDetails from '../Student/Academic_details.model.js';
import FamilyDetails from '../Student/Family_details.model.js';
import AdmissionDetails from '../Student/Admission_details.model.js';
import StudentAddress from '../Student/Student_address.model.js';
import StudentQualifications from '../Student/Student_qualifications.model.js';
import User from './User.model.js';
import Classroom from '../Academic/Classroom.model.js';

class StudentDetails extends Model { }

StudentDetails.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: 'users', key: 'id' } },
  roll_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  photo: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATEONLY, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  blood_group: { type: DataTypes.STRING },
  mother_tongue: { type: DataTypes.STRING },
  orphan_student: { type: DataTypes.BOOLEAN, defaultValue: false },
  religion: { type: DataTypes.STRING },
  caste: { type: DataTypes.STRING },
  social_category: { type: DataTypes.STRING },
  madhab: { type: DataTypes.STRING },
  personal_mobile: { type: DataTypes.STRING },
  personal_email: { type: DataTypes.STRING },
  medical_remarks: { type: DataTypes.STRING },
  aadhar_no: { type: DataTypes.STRING },
  isHostel: { type: DataTypes.BOOLEAN, defaultValue: false },
  classroom_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'classrooms', key: 'id' } },
  
  // Foreign keys for addresses and qualifications
  academic_details_id: { type: DataTypes.INTEGER, references: { model: 'academic_details', key: 'id' } },
  family_details_id: { type: DataTypes.INTEGER, references: { model: 'family_details', key: 'id' } },
  admission_details_id: { type: DataTypes.INTEGER, references: { model: 'admission_details', key: 'id' } },
  permanent_address_id: { type: DataTypes.INTEGER, references: { model: 'student_address', key: 'id' } },
  present_address_id: { type: DataTypes.INTEGER, references: { model: 'student_address', key: 'id' } },
  grade_10_id: { type: DataTypes.INTEGER, references: { model: 'student_qualifications', key: 'id' } },
  grade_11_id: { type: DataTypes.INTEGER, references: { model: 'student_qualifications', key: 'id' } },
  grade_12_id: { type: DataTypes.INTEGER, references: { model: 'student_qualifications', key: 'id' } }
}, {
  sequelize,
  modelName: 'StudentDetails',
  tableName: 'student_details',
  timestamps: true,
});

StudentDetails.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
StudentDetails.belongsTo(AcademicDetails, { foreignKey: 'academic_details_id', as: 'academicDetails' });
StudentDetails.belongsTo(FamilyDetails, { foreignKey: 'family_details_id', as: 'familyDetails' });
StudentDetails.belongsTo(AdmissionDetails, { foreignKey: 'admission_details_id', as: 'admissionDetails' });
StudentDetails.belongsTo(StudentAddress, { foreignKey: 'permanent_address_id', as: 'permanentAddress' });
StudentDetails.belongsTo(StudentAddress, { foreignKey: 'present_address_id', as: 'presentAddress' });
StudentDetails.belongsTo(StudentQualifications, { foreignKey: 'grade_10_id', as: 'grade10Qualification' });
StudentDetails.belongsTo(StudentQualifications, { foreignKey: 'grade_11_id', as: 'grade11Qualification' });
StudentDetails.belongsTo(StudentQualifications, { foreignKey: 'grade_12_id', as: 'grade12Qualification' });

User.hasOne(StudentDetails, { foreignKey: 'user_id' });
AcademicDetails.hasOne(StudentDetails, { foreignKey: 'academic_details_id' });
FamilyDetails.hasOne(StudentDetails, { foreignKey: 'family_details_id' });
AdmissionDetails.hasOne(StudentDetails, { foreignKey: 'admission_details_id' });
StudentAddress.hasMany(StudentDetails, { foreignKey: 'permanent_address_id' });
StudentAddress.hasMany(StudentDetails, { foreignKey: 'present_address_id' });
StudentQualifications.hasMany(StudentDetails, { foreignKey: 'grade_10_id' });
StudentQualifications.hasMany(StudentDetails, { foreignKey: 'grade_11_id' });
StudentQualifications.hasMany(StudentDetails, { foreignKey: 'grade_12_id' });

StudentDetails.belongsTo(Classroom, { foreignKey: 'classroom_id', as: 'classroom' });
Classroom.hasOne(StudentDetails, { foreignKey: 'id', sourceKey: 'leader_id', as: 'leader' });

export default StudentDetails;