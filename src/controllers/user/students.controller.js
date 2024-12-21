import bcrypt from 'bcryptjs';
import sequelize from '../../config/db.js';
import { Op } from 'sequelize';


import { convertImageUrl } from '../../utils/convertImageUrl.js'; 

import {  User, Role, StudentDetails, AcademicDetails, FamilyDetails, AdmissionDetails, StudentAddress, 
  StudentQualifications, Classroom } from '../../models/index.js';
import { extractIncludes, buildStudentQueryOptions, generateStudentDetailsSheet, generatePermanentAddressSheet, generatePresentAddressSheet, 
  generateGrade10QualificationSheet, generateGrade11QualificationSheet, generateGrade12QualificationSheet } from '../../utils/studentUtils.js';



// export const createStudent = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       user,
//       personalDetails,
//       academicDetails,
//       familyDetails,
//       admissionDetails,
//       permanentAddress,
//       presentAddress,
//       grade10Qualification,
//       grade11Qualification,
//       grade12Qualification,
//     } = req.body;

//     if (!personalDetails.roll_number || !personalDetails.classroom_id) {
//       return res.status(400).json({ message: 'personalDetails.roll_number and studentDetails.classroom_id are required' });
//     };

//     const checkUserIdPromise = User.findOne({ where: { userId: personalDetails.roll_number }, transaction });
//     const checkClassroomIdPromise = Classroom.findOne({ where: { id: personalDetails.classroom_id }, transaction });

//     const [checkUserId, checkClassroomId] = await Promise.all([checkUserIdPromise, checkClassroomIdPromise]);

//     if (checkUserId !== null) {
//       return res.status(400).json({ message: 'Roll number already exists, please choose another.' });
//     }

//     if (checkClassroomId === null) {
//       return res.status(400).json({ message: 'Invalid classroom_id provided.' });
//     }

//     const pass = personalDetails.dob.substring(0, 4) + personalDetails.dob.substring(8, 10);
//     const hashedPasswordPromise = bcrypt.hash(pass, 10);

//     const newAcademicDetailsPromise = AcademicDetails.create(academicDetails, { transaction });
//     const newFamilyDetailsPromise = FamilyDetails.create(familyDetails, { transaction });
//     const newAdmissionDetailsPromise = AdmissionDetails.create(admissionDetails, { transaction });

//     const newPermanentAddressPromise = StudentAddress.create(permanentAddress, { transaction });
//     const newPresentAddressPromise = StudentAddress.create(presentAddress, { transaction });

//     const newGrade10QualificationPromise = StudentQualifications.create(grade10Qualification, { transaction });
//     const newGrade11QualificationPromise = StudentQualifications.create(grade11Qualification, { transaction });
//     const newGrade12QualificationPromise = StudentQualifications.create(grade12Qualification, { transaction });

//     // Wait for all promises to resolve
//     const [
//       hashedPassword,
//       newAcademicDetails,
//       newFamilyDetails,
//       newAdmissionDetails,
//       newPermanentAddress,
//       newPresentAddress,
//       newGrade10Qualification,
//       newGrade11Qualification,
//       newGrade12Qualification
//     ] = await Promise.all([
//       hashedPasswordPromise,
//       newAcademicDetailsPromise,
//       newFamilyDetailsPromise,
//       newAdmissionDetailsPromise,
//       newPermanentAddressPromise,
//       newPresentAddressPromise,
//       newGrade10QualificationPromise,
//       newGrade11QualificationPromise,
//       newGrade12QualificationPromise
//     ]);

//     const newUser = await User.create({
//       userId: personalDetails.roll_number,
//       pass: hashedPassword,
//       user_type: "student",
//       role_id: 4
//     }, { transaction });

//     if (personalDetails.photo) {
//       personalDetails.photo = convertImageUrl(personalDetails.photo);
//     }

//     const newStudentDetails = await StudentDetails.create(
//       {
//         ...personalDetails,
//         user_id: newUser.id,
//         academic_details_id: newAcademicDetails.id,
//         family_details_id: newFamilyDetails.id,
//         admission_details_id: newAdmissionDetails.id,
//         permanent_address_id: newPermanentAddress.id,
//         present_address_id: newPresentAddress.id,
//         grade_10_id: newGrade10Qualification.id,
//         grade_11_id: newGrade11Qualification.id,
//         grade_12_id: newGrade12Qualification.id,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     return res.status(201).json({
//       status: 'success',
//       message: 'Student created successfully',
//       data: newStudentDetails,
//     });
//   } catch (error) {
//     if (transaction) await transaction.rollback();
//     console.error('Error creating student:', error);
//     return res.status(500).json({
//       message: 'Failed to create student',
//       error: error.message,
//     });
//   }
// };


export const createStudent = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    const {
      user,
      personalDetails,
      academicDetails,
      familyDetails,
      admissionDetails,
      permanentAddress,
      presentAddress,
      grade10Qualification,
      grade11Qualification,
      grade12Qualification,
    } = req.body;

    if ( !personalDetails.roll_number || !personalDetails.classroom_id) {
      return res.status(400).json({ message: 'personalDetails.roll_number and studentDetails.classroom_id are required' });
    };

    if (personalDetails.isHostel == undefined) {
      return res.status(400).json({ message: 'personalDetails.isHostel is required' });
    };

    const checkUserId = await User.findOne({ where: { userId: personalDetails.roll_number }, transaction });
    if (checkUserId !== null) {
      return res.status(400).json({ message: 'Roll number already exists, please choose another.' });
    };

    const checkClassroomId = await Classroom.findOne({ where: { id: personalDetails.classroom_id }, transaction });
    if (checkClassroomId === null) {
      return res.status(400).json({ message: 'Invalid classroom_id provided.' });
    };

    const pass = personalDetails.dob.substring(0, 4) + personalDetails.dob.substring(8, 10);
      
    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await User.create({
      userId: personalDetails.roll_number,
      pass: hashedPassword,
      user_type: "student",
      role_id: 3
    }, { transaction });

    const newAcademicDetails = await AcademicDetails.create(academicDetails, { transaction });
    const newFamilyDetails = await FamilyDetails.create(familyDetails, { transaction });
    const newAdmissionDetails = await AdmissionDetails.create(admissionDetails, { transaction });

    const newPermanentAddress = await StudentAddress.create(permanentAddress, { transaction });
    const newPresentAddress = await StudentAddress.create(presentAddress, { transaction });

    const newGrade10Qualification = await StudentQualifications.create(grade10Qualification, { transaction });
    const newGrade11Qualification = await StudentQualifications.create(grade11Qualification, { transaction });
    const newGrade12Qualification = await StudentQualifications.create(grade12Qualification, { transaction });

    if (personalDetails.photo) {
      personalDetails.photo = convertImageUrl(personalDetails.photo);
    };

    const newStudentDetails = await StudentDetails.create(
      {
        ...personalDetails,
        user_id: newUser.id,
        academic_details_id: newAcademicDetails.id,
        family_details_id: newFamilyDetails.id,
        admission_details_id: newAdmissionDetails.id,
        permanent_address_id: newPermanentAddress.id,
        present_address_id: newPresentAddress.id,
        grade_10_id: newGrade10Qualification.id,
        grade_11_id: newGrade11Qualification.id,
        grade_12_id: newGrade12Qualification.id,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      status: 'success',
      message: 'Student created successfully',
      data: newStudentDetails,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating student:', error);
    return res.status(500).json({
      message: 'Failed to create student',
      error: error.message,
    });
  }
};

export const createBulkStudents = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const students = req.body;
    
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Expected an array of student data.' });
    }

    const createdStudents = [];

    for (const student of students) {
      const {
        user,
        studentDetails,
        academicDetails,
        familyDetails,
        admissionDetails,
        permanentAddress,
        presentAddress,
        grade10Qualification,
        grade11Qualification,
        grade12Qualification,
      } = student;

      if (!user.role_id || !studentDetails.roll_number || !studentDetails.classroom_id) {
        throw new Error('user.role_id, studentDetails.roll_number and studentDetails.classroom_id are required');
      };

      const role = await Role.findByPk(user.role_id, { transaction });
      
      if (!role) {
        throw new Error(`Invalid role_id provided for student with roll number ${studentDetails.roll_number}`);
      };

      const checkUserId = await User.findOne({ where: { userId: studentDetails.roll_number }, transaction });
      if (checkUserId !== null) {
        throw new Error(`User Id ${studentDetails.roll_number} already exists, please choose another.`);
      };

      const checkClassroomId = await Classroom.findOne({ where: { id: studentDetails.classroom_id }, transaction });
      if (checkClassroomId === null) {
        throw new Error(`Invalid classroom_id provided for student with roll number ${studentDetails.roll_number}`);
      };

      const hashedPassword = await bcrypt.hash(user.pass, 10);

      const newUser = await User.create(
        {
          userId: studentDetails.roll_number,
          pass: hashedPassword,
          user_type: 'student',
          role_id: user.role_id,
        },
        { transaction }
      );

      const newAcademicDetails = await AcademicDetails.create(academicDetails, { transaction });
      const newFamilyDetails = await FamilyDetails.create(familyDetails, { transaction });
      const newAdmissionDetails = await AdmissionDetails.create(admissionDetails, { transaction });
      const newPermanentAddress = await StudentAddress.create(permanentAddress, { transaction });
      const newPresentAddress = await StudentAddress.create(presentAddress, { transaction });

      const newGrade10Qualification = await StudentQualifications.create(grade10Qualification, { transaction });
      const newGrade11Qualification = await StudentQualifications.create(grade11Qualification, { transaction });
      const newGrade12Qualification = await StudentQualifications.create(grade12Qualification, { transaction });

      if (studentDetails.photo) {
        studentDetails.photo = convertImageUrl(studentDetails.photo);
      };

      const newStudentDetails = await StudentDetails.create(
        {
          ...studentDetails,
          user_id: newUser.id,
          academic_details_id: newAcademicDetails.id,
          family_details_id: newFamilyDetails.id,
          admission_details_id: newAdmissionDetails.id,
          permanent_address_id: newPermanentAddress.id,
          present_address_id: newPresentAddress.id,
          grade_10_id: newGrade10Qualification.id,
          grade_11_id: newGrade11Qualification.id,
          grade_12_id: newGrade12Qualification.id,
        },
        { transaction }
      );

      createdStudents.push(newStudentDetails);
    }

    await transaction.commit();

    return res.status(201).json({
      status: 'success',
      message: 'Students created successfully',
      total: createdStudents.length,
      data: createdStudents,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating students:', error);
    return res.status(500).json({
      message: 'Failed to create students',
      error: error.message,
    });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const students = await StudentDetails.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'userId', 'role_id', 'isActive', 'isVerified'] },
        { model: AcademicDetails, as: 'academicDetails' },
        { model: FamilyDetails, as: 'familyDetails' },
        { model: AdmissionDetails, as: 'admissionDetails' },
        { model: StudentAddress, as: 'permanentAddress' },
        { model: StudentAddress, as: 'presentAddress' },
        { model: StudentQualifications, as: 'grade10Qualification' },
        { model: StudentQualifications, as: 'grade11Qualification' },
        { model: StudentQualifications, as: 'grade12Qualification' },
      ],
      limit,
      offset,
    });

    const studentsCount = await StudentDetails.count();

    return res.status(200).json({
      status: 'success',
      message: 'Students fetched successfully',
      total: studentsCount,
      students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const filters = {};

    if (req.query.yoj) {
      filters['$academicDetails.yoj$'] = req.query.yoj;
    }

    if (req.query.rrn) {
      filters['$academicDetails.rrn$'] = req.query.rrn;
    }

    if (req.query.yoc) {
      filters['$academicDetails.yoc$'] = req.query.yoc;
    }

    if (req.query.role) {
      filters['$user.role.name$'] = req.query.role;
    }

    if (req.query.isActive !== undefined) {
      filters['$user.isActive$'] = req.query.isActive === 'true';
    }

    if (req.query.classroom) {
      filters['$classroom.name$'] = { [Op.like]: `%${req.query.classroom}%` };
    }
    
    if (req.query.name) {
      filters.name = { [Op.like]: `%${req.query.name}%` }; 
    }
    
    if (req.query.rollNumber) {
      filters.roll_number = req.query.rollNumber;
    }

    const students = await StudentDetails.findAll({ 
      limit, offset,
      attributes: [ 'id', 'name', 'photo', 'roll_number', ],
      where: filters,
      include: [
      { model: User, as: 'user', attributes: ['isActive'], include: [ { model: Role, as: 'role', attributes: ['name'] } ] },
      { model: AcademicDetails, as: 'academicDetails', attributes: [ 'rrn', 'yoj', 'yoc' ] },
      { model: Classroom, as: 'classroom', attributes: [ 'name' ] }
      ]
    });

    const studentsCount = await StudentDetails.count({ where: filters });

    const studentsData = students.map(student => ({
      id: student.id,
      name: student.name,
      photo: student.photo,
      rollNumber: student.roll_number,
      rrn: student.academicDetails.rrn,
      yoj: student.academicDetails.yoj,
      yoc: student.academicDetails.yoc,
      classroom: student.classroom.name,
      role: student.user.role.name,
      isActive: student.user.isActive,
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Students fetched successfully',
      total: studentsCount,
      data: studentsData,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
};


export const getStudentsList = async (req, res) => {
  try {

    const filters = {};

    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    }

    if (req.query.classroom_id) {
      filters.classroom_id = req.query.classroom_id;
    }

    if (req.query.madhab) {
      filters.madhab = req.query.madhab;
    }

    const students = await StudentDetails.findAll({
      where: filters,
      attributes: ['id', 'name', 'photo', 'roll_number'],
    });

    studentsCount = await StudentDetails.count({ where: filters });

    return res.status(200).json({
      status: 'success',
      message: 'Students fetched successfully',
      total: studentsCount,
      data: students,
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
}


export const getFilteredStudents = async (req, res) => {
  try {

    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const includes = extractIncludes(req.query);

    const students = await StudentDetails.findAll({
      include: includes,
      attributes: { exclude: [ 'user_id', 'academic_details_id', 'family_details_id', 
        'admission_details_id', 'permanent_address_id', 'present_address_id', 'grade_10_id', 
        'grade_11_id', 'grade_12_id'] },
      limit,
      offset,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Students fetched successfully',
      total: students.length,
      students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
};

export const getFilteredStudentByUserId = async (req, res) => {
  try {
    
    const { id } = req.params;
    const query = req.query;

    const includes = extractIncludes(query);

    includes.unshift({ model: Classroom, as: 'classroom' });

    const student = await StudentDetails.findOne({
      where: { id: id },
      include: includes,
      attributes: { exclude: [ 'classroom_id', 'user_id', 'academic_details_id', 'family_details_id', 'admission_details_id', 
        'permanent_address_id', 'present_address_id', 'grade_10_id', 'grade_11_id', 'grade_12_id'] },
    });

    if (!student) {
      return res.status(404).json({ message: `Student with id ${id} not found` });
    };

    return res.status(200).json({
      status: 'success',
      message: 'Student fetched successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({
      message: 'Failed to fetch student',
      error: error.message,
    });
  }
};


export const updateStudentDetails = async (req, res) => {
  const { studentId } = req.params; 
  const { 
    name, photo, dob, gender, blood_group, mother_tongue, orphan_student,
    religion, caste, social_category, madhab, personal_mobile, personal_email, medical_remarks,
    aadhar_no, isHostel
  } = req.body;

  try {

    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    };

    if (name) student.name = name;
    if (photo) student.photo = photo;
    if (dob) student.dob = dob;
    if (gender) student.gender = gender;
    if (blood_group) student.blood_group = blood_group;
    if (mother_tongue) student.mother_tongue = mother_tongue;
    if (orphan_student) student.orphan_student = orphan_student;
    if (religion) student.religion = religion;
    if (caste) student.caste = caste;
    if (social_category) student.social_category = social_category;
    if (madhab) student.madhab = madhab;
    if (personal_mobile) student.personal_mobile = personal_mobile;
    if (personal_email) student.personal_email = personal_email;
    if (medical_remarks) student.medical_remarks = medical_remarks;
    if (aadhar_no) student.aadhar_no = aadhar_no;
    if (isHostel !== undefined) student.isHostel = isHostel;

    await student.save();

    res.status(200).json({ 
      status: 'success',
      message: 'Student updated successfully', 
      data: student });

  } catch (error) {
    console.error('Error updating student details:', error);
    res.status(500).json({ message: 'Error updating student details', error: error.message });
  }
};

export const updateClassroomId = async (req, res) => {
  const { studentId } = req.params; 
  const { classroom_id } = req.body;

  try {
 
    if (!classroom_id || isNaN(classroom_id)) {
      return res.status(400).json({ message: "Invalid classroom_id provided." });
    }

    const classroom = await Classroom.findByPk(classroom_id);
    if (!classroom) {
      return res.status(404).json({ message: `Classroom with id ${classroom_id} not found.` });
    }

    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    student.classroom_id = classroom_id;

    await student.save();

    res.status(200).json({ 
      status: 'success',
      message: 'Student classroom_id updated successfully', 
      data: student });

  } catch (error) {
    console.error('Error updating student classroom_id:', error);
    res.status(500).json({ message: 'Error updating student classroom_id', error: error.message });
  }
};


export const updateAcademicDetails = async (req, res) => {
  const { studentId } = req.params;
  const { rrn, univ_email, yoj, yoc } = req.body;

  try {
    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    const academicDetails = await AcademicDetails.findByPk(student.academic_details_id);

    if (!academicDetails) {
      return res.status(404).json({ message: `Academic details for student with id ${studentId} not found.` });
    }

    if (rrn) academicDetails.rrn = rrn;
    if (univ_email) academicDetails.univ_email = univ_email;
    if (yoj) academicDetails.yoj = yoj;
    if (yoc) academicDetails.yoc = yoc;

    await academicDetails.save();

    res.status(200).json({
      status: 'success',
      message: 'Academic details updated successfully',
      data: academicDetails
    });

  } catch (error) {
    console.error('Error updating academic details:', error);
    res.status(500).json({
      message: 'Error updating academic details',
      error: error.message
    });
  }
};

export const updateFamilyDetails = async (req, res) => {
  const { studentId } = req.params;
  const { 
    parent_email, parent_whatsapp, parent_sms, father_name, father_mobile, 
    father_education, father_occupation, annual_income, mother_name, 
    mother_mobile, mother_education, mother_occupation, guardian_name, 
    guardian_mobile, guardian_relationship, guardian_address 
  } = req.body;

  try {
    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    const familyDetails = await FamilyDetails.findByPk(student.family_details_id);

    if (!familyDetails) {
      return res.status(404).json({ message: `Family details for student with id ${studentId} not found.` });
    }
    
    if (parent_email) familyDetails.parent_email = parent_email;
    if (parent_whatsapp) familyDetails.parent_whatsapp = parent_whatsapp;
    if (parent_sms) familyDetails.parent_sms = parent_sms;
    if (father_name) familyDetails.father_name = father_name;
    if (father_mobile) familyDetails.father_mobile = father_mobile;
    if (father_education) familyDetails.father_education = father_education;
    if (father_occupation) familyDetails.father_occupation = father_occupation;
    if (annual_income) familyDetails.annual_income = annual_income;
    if (mother_name) familyDetails.mother_name = mother_name;
    if (mother_mobile) familyDetails.mother_mobile = mother_mobile;
    if (mother_education) familyDetails.mother_education = mother_education;
    if (mother_occupation) familyDetails.mother_occupation = mother_occupation;
    if (guardian_name) familyDetails.guardian_name = guardian_name;
    if (guardian_mobile) familyDetails.guardian_mobile = guardian_mobile;
    if (guardian_relationship) familyDetails.guardian_relationship = guardian_relationship;
    if (guardian_address) familyDetails.guardian_address = guardian_address;

    await familyDetails.save();

    res.status(200).json({
      status: 'success',
      message: 'Family details updated successfully',
      data: familyDetails
    });

  } catch (error) {
    console.error('Error updating family details:', error);
    res.status(500).json({
      message: 'Error updating family details',
      error: error.message
    });
  }
};

export const updateAdmissionDetails = async (req, res) => {
  const { studentId } = req.params;
  const { doa, entrance_mark, entrance_rank, hafiz, recommended_by } = req.body;

  try {
    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    const admissionDetails = await AdmissionDetails.findByPk(student.admission_details_id);

    if (!admissionDetails) {
      return res.status(404).json({ message: `Admission details for student with id ${studentId} not found.` });
    }

    if(doa) admissionDetails.doa = doa;
    if(entrance_mark) admissionDetails.entrance_mark = entrance_mark;
    if(entrance_rank) admissionDetails.entrance_rank = entrance_rank;
    if(hafiz !== undefined) admissionDetails.hafiz = hafiz;
    if(recommended_by) admissionDetails.recommended_by = recommended_by;

    await admissionDetails.save();

    res.status(200).json({
      status: 'success',
      message: 'Admission details updated successfully',
      data: admissionDetails
    });

  } catch (error) {
    console.error('Error updating admission details:', error);
    res.status(500).json({
      message: 'Error updating admission details',
      error: error.message
    });
  }
};

export const updateStudentAddress = async (req, res) => {
  const { studentId } = req.params;
  const { addressType } = req.query;
  const { door_no, street, area, city, district, state, country, pin_code } = req.body;

  try {
    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    let addressId = null;
    if (addressType === 'permanent') {
      addressId = student.permanent_address_id;
    } else if (addressType === 'present') {
      addressId = student.present_address_id;
    } else {
      return res.status(400).json({ message: 'Invalid address type. Use "permanent" or "present".' });
    }

    const address = await StudentAddress.findByPk(addressId);

    if (!address) {
      return res.status(404).json({ message: `${addressType} address for student with id ${studentId} not found.` });
    }

    if (door_no) address.door_no = door_no;
    if (street) address.street = street;
    if (area) address.area = area;
    if (city) address.city = city;
    if (district) address.district = district;
    if (state) address.state = state;
    if (country) address.country = country;
    if (pin_code) address.pin_code = pin_code;

    await address.save();

    res.status(200).json({
      status: 'success',
      message: `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address updated successfully`,
      data: address
    });

  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      message: 'Error updating address',
      error: error.message
    });
  }
};


export const updateStudentQualifications = async (req, res) => {
  const { studentId } = req.params;
  const { qualificationType } = req.query;
  const { school_name, board, medium, passing_year, passing_month, school_address, reg_number, marks, total_marks, emis } = req.body;

  try {
    const student = await StudentDetails.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: `Student with id ${studentId} not found.` });
    }

    let qualificationId = null;

    if (qualificationType === 'grade_10') {
      qualificationId = student.grade_10_id;
    } else if (qualificationType === 'grade_11') {
      qualificationId = student.grade_11_id;
    } else if (qualificationType === 'grade_12') {
      qualificationId = student.grade_12_id;
    } else {
      return res.status(400).json({ message: 'Invalid qualification type. Use "grade_10", "grade_11", or "grade_12".' });
    }

    const qualification = await StudentQualifications.findByPk(qualificationId);

    if (!qualification) {
      return res.status(404).json({ message: `${qualificationType.charAt(0).toUpperCase() + qualificationType.slice(1)} qualification details for student with id ${studentId} not found.` });
    }

    if (school_name) qualification.school_name = school_name;
    if (board) qualification.board = board;
    if (medium) qualification.medium = medium;
    if (passing_year) qualification.passing_year = passing_year;
    if (passing_month) qualification.passing_month = passing_month;
    if (school_address) qualification.school_address = school_address;
    if (reg_number) qualification.reg_number = reg_number;
    if (marks) qualification.marks = marks;
    if (total_marks) qualification.total_marks = total_marks;
    if (emis) qualification.emis = emis;

    await qualification.save();

    res.status(200).json({
      status: 'success',
      message: `${qualificationType.charAt(0).toUpperCase() + qualificationType.slice(1)} qualification updated successfully`,
      data: qualification
    });

  } catch (error) {
    console.error('Error updating qualification details:', error);
    res.status(500).json({
      message: 'Error updating qualification details',
      error: error.message
    });
  }
};


export const deleteStudentByUserId = async (req, res) => {
  const { userId } = req.params;

  try {

    await sequelize.transaction(async (transaction) => {

      const student = await StudentDetails.findOne({ 
        where: { user_id: userId },
        include: [
          { model: User, as: 'user' },
          { model: AcademicDetails, as: 'academicDetails' },
          { model: FamilyDetails, as: 'familyDetails' },
          { model: AdmissionDetails, as: 'admissionDetails' },
          { model: StudentAddress, as: 'permanentAddress' },
          { model: StudentAddress, as: 'presentAddress' },
          { model: StudentQualifications, as: 'grade10Qualification' },
          { model: StudentQualifications, as: 'grade11Qualification' },
          { model: StudentQualifications, as: 'grade12Qualification' }
        ],
        transaction });

      if (!student) {
        throw new Error('Student not found');
      };

      const { user, academicDetails, familyDetails, admissionDetails, permanentAddress, presentAddress, 
        grade10Qualification, grade11Qualification, grade12Qualification } = student;

      await student.destroy({ transaction });

      if (user) await user.destroy({ transaction });
      if (academicDetails) await academicDetails.destroy({ transaction });
      if (familyDetails) await familyDetails.destroy({ transaction });
      if (admissionDetails) await admissionDetails.destroy({ transaction });
      if (permanentAddress) await permanentAddress.destroy({ transaction });
      if (presentAddress) await presentAddress.destroy({ transaction });
      if (grade10Qualification) await grade10Qualification.destroy({ transaction });
      if (grade11Qualification) await grade11Qualification.destroy({ transaction });
      if (grade12Qualification) await grade12Qualification.destroy({ transaction });
    });

    return res.status(200).json({
      status: 'success',
      message: `Student with userId ${userId} and all associated records deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    if (error.message === 'Student not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Failed to delete student',
      error: error.message,
    });
  }
};

export const deleteAllStudents = async (req, res) => {
  try {
    
    await sequelize.transaction(async (transaction) => {
      
      const students = await StudentDetails.findAll({
        include: [
          { model: User, as: 'user' },
          { model: AcademicDetails, as: 'academicDetails' },
          { model: FamilyDetails, as: 'familyDetails' },
          { model: AdmissionDetails, as: 'admissionDetails' },
          { model: StudentAddress, as: 'permanentAddress' },
          { model: StudentAddress, as: 'presentAddress' },
          { model: StudentQualifications, as: 'grade10Qualification' },
          { model: StudentQualifications, as: 'grade11Qualification' },
          { model: StudentQualifications, as: 'grade12Qualification' },
        ],
        transaction });

      if (students.length === 0) {
        throw new Error('No students found');
      }

      for (const student of students) {
        const {
          user,
          academicDetails,
          familyDetails,
          admissionDetails,
          permanentAddress,
          presentAddress,
          grade10Qualification,
          grade11Qualification,
          grade12Qualification,
        } = student;

        await student.destroy({ transaction });

        if (user) await user.destroy({ transaction });
        if (academicDetails) await academicDetails.destroy({ transaction });
        if (familyDetails) await familyDetails.destroy({ transaction });
        if (admissionDetails) await admissionDetails.destroy({ transaction });
        if (permanentAddress) await permanentAddress.destroy({ transaction });
        if (presentAddress) await presentAddress.destroy({ transaction });
        if (grade10Qualification) await grade10Qualification.destroy({ transaction });
        if (grade11Qualification) await grade11Qualification.destroy({ transaction });
        if (grade12Qualification) await grade12Qualification.destroy({ transaction });
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'All students and their associated records have been deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting all students:', error);

    if (error.message === 'No students found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Failed to delete all students',
      error: error.message,
    });
  }
};


export const createStudentsFromExcel = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    
    const sheets = req.data;

    const studentData = sheets['Student Details'].map(row => ({
      user: {
        userId: row['Roll Number'],
        role_id: 4,
        pass: "pass123",
        user_type: 'student',
      },
      studentDetails: {
        roll_number: row['Roll Number'],
        classroom_id: row['Classroom ID'],
        name: row['Name'],
        photo: row['Photo Url'],
        dob: row['Date of Birth'],
        gender: row['Gender'],
        blood_group: row['Blood Group'],
        mother_tongue: row['Mother Tongue'],
        orphan_student: row['Orphan Student'] === 'Yes',
        religion: row['Religion'],
        caste: row['Caste'],
        social_category: row['Social Category'],
        madhab: row['Madhab'],
        personal_mobile: row['Personal Mobile Number'],
        personal_email: row['Personal Email'],
        medical_remarks: row['Medical Remarks'],
        aadhar_no: row['Aadhar Number'],
      },
      academicDetails: {
        rrn: row['University RRN'],
        univ_email: row['University Email'],
        yoj: row['Year of Joining'],
        yoc: row['Year of Completion'],
      },
      familyDetails: {
        parent_email: row["Parent's Email"],
        parent_whatsapp: row["Parent's WhatsApp"],
        parent_sms: row["Parent's SMS Number"],
        father_name: row["Father's Name"],
        father_mobile: row["Father's Mobile Number"],
        father_education: row["Father's Education"],
        father_occupation: row["Father's Occupation"],
        annual_income: row['Annual Income'],
        mother_name: row["Mother's Name"],
        mother_mobile: row["Mother's Mobile Number"],
        mother_education: row["Mother's Education"],
        mother_occupation: row["Mother's Occupation"],
        guardian_name: row["Guardian's Name"],
        guardian_mobile: row["Guardian's Mobile Number"],
        guardian_relationship: row["Guardian's Relationship"],
        guardian_address: row["Guardian's Address"],
      },
      admissionDetails: {
        doa: row['Date of Admission (DOA)'],
        entrance_mark: row['Entrance Marks'],
        entrance_rank: row['Entrance Rank'],
        hafiz: row['Hafiz'] === 'Yes',
        recommended_by: row['Recommended By'],
      },
    }));

    const permanentAddresses = sheets['Permanent Address'].map(row => ({
      roll_number: row['Roll Number'],
      address_type: 'permanent',
      door_no: row['Door Number'],
      street: row['Street'],
      area: row['Area'],
      city: row['City'],
      district: row['District'],
      state: row['State'],
      country: row['Country'],
      pin_code: row['Pin Code'],
    }));

    const presentAddresses = sheets['Present Address'].map(row => ({
      roll_number: row['Roll Number'],
      address_type: 'present',
      door_no: row['Door Number'],
      street: row['Street'],
      area: row['Area'],
      city: row['City'],
      district: row['District'],
      state: row['State'],
      country: row['Country'],
      pin_code: row['Pin Code'],
    }));

    const grade10Qualification = sheets['Grade 10 Qualification'].map(row => ({
      roll_number: row['Roll Number'],
      exam_type: 'grade_10',
      school_name: row['School Name'],
      board: row['Board'],
      medium: row['Medium'],
      passing_year: row['Passing Year'],
      passing_month: row['Passing Month'],
      school_address: row['School Address'],
      reg_number: row['Registration Number'],
      marks: row['Marks Obtained'],
      total_marks: row['Total Marks'],
      emis: row['EMIS Number']
    }));

    const grade11Qualification = sheets['Grade 11 Qualification'].map(row => ({
      roll_number: row['Roll Number'],
      exam_type: 'grade_11',
      school_name: row['School Name'],
      board: row['Board'],
      medium: row['Medium'],
      passing_year: row['Passing Year'],
      passing_month: row['Passing Month'],
      school_address: row['School Address'],
      reg_number: row['Registration Number'],
      marks: row['Marks Obtained'],
      total_marks: row['Total Marks'],
      emis: row['EMIS Number']
    }));

    const grade12Qualification = sheets['Grade 12 Qualification'].map(row => ({
      roll_number: row['Roll Number'],
      exam_type: 'grade_12',
      school_name: row['School Name'],
      board: row['Board'],
      medium: row['Medium'],
      passing_year: row['Passing Year'],
      passing_month: row['Passing Month'],
      school_address: row['School Address'],
      reg_number: row['Registration Number'],
      marks: row['Marks Obtained'],
      total_marks: row['Total Marks'],
      emis: row['EMIS Number']
    }));

    const createdStudents = [];
    const errors = [];

    for (const student of studentData) {
      const { user, studentDetails, academicDetails, familyDetails, admissionDetails } = student;

      if (!studentDetails.roll_number) {
        errors.push({ user: { roll_number: 'studentDetails.roll_number is required' } });
        continue;
      };

      const checkUserId = await User.findOne({ where: { userId: studentDetails.roll_number }, transaction });

      if (checkUserId !== null) {
        errors.push({ userId: studentDetails.roll_number, message: `This "${studentDetails.roll_number}" User Id already exists, please choose another.` });
        continue;
      };


      if (!studentDetails.classroom_id) {
        errors.push({ roll_number: studentDetails.roll_number, message: 'Classroom ID is required.' });
        continue;
      };

      const classroomExists = await Classroom.findOne({ where: { id: studentDetails.classroom_id }, transaction });
      
      if (!classroomExists) {
        errors.push({ roll_number: studentDetails.roll_number, message: `Classroom ID ${studentDetails.classroom_id} does not exist.` });
        continue;
      };

      const permanentAddress = permanentAddresses.find(addr => addr['roll_number'] == studentDetails.roll_number)
      const presentAddress = presentAddresses.find(addr => addr['roll_number'] == studentDetails.roll_number);
      const grade10 = grade10Qualification.find(qual => qual['roll_number'] == studentDetails.roll_number);
      const grade11 = grade11Qualification.find(qual => qual['roll_number'] == studentDetails.roll_number);
      const grade12 = grade12Qualification.find(qual => qual['roll_number'] == studentDetails.roll_number);


      const hashedPassword = await bcrypt.hash(user.pass, 10);

      const userEntry = await User.create({ ...user, pass: hashedPassword }, { transaction });


      const permanentAddressEntry = await StudentAddress.create({
        address_type: 'permanent',
        door_no: permanentAddress.door_no,
        street: permanentAddress.street,
        area: permanentAddress.area,
        city: permanentAddress.city,
        district: permanentAddress.district,
        state: permanentAddress.state,
        country: permanentAddress.country,
        pin_code: permanentAddress.pin_code
      }, { transaction });

      const presentAddressEntry = await StudentAddress.create({
        address_type: 'present',
        door_no: presentAddress.door_no,
        street: presentAddress.street,
        area: presentAddress.area,
        city: presentAddress.city,
        district: presentAddress.district,
        state: presentAddress.state,
        country: presentAddress.country,
        pin_code: presentAddress.pin_code
      }, { transaction });

      const grade10Entry = await StudentQualifications.create({
        exam_type: 'grade_10',
        school_name: grade10.school_name,
        board: grade10.board,
        medium: grade10.medium,
        passing_year: grade10.passing_year,
        passing_month: grade10.passing_month,
        school_address: grade10.school_address,
        reg_number: grade10.reg_number,
        marks: grade10.marks,
        total_marks: grade10.total_marks,
        emis: grade10.emis
      }, { transaction });

      const grade11Entry = await StudentQualifications.create({
        exam_type: 'grade_11',
        school_name: grade11.school_name,
        board: grade11.board,
        medium: grade11.medium,
        passing_year: grade11.passing_year,
        passing_month: grade11.passing_month,
        school_address: grade11.school_address,
        reg_number: grade11.reg_number,
        marks: grade11.marks,
        total_marks: grade11.total_marks,
        emis: grade11.emis
      }, { transaction });

      const grade12Entry = await StudentQualifications.create({
        exam_type: 'grade_12',
        school_name: grade12.school_name,
        board: grade12.board,
        medium: grade12.medium,
        passing_year: grade12.passing_year,
        passing_month: grade12.passing_month,
        school_address: grade12.school_address,
        reg_number: grade12.reg_number,
        marks: grade12.marks,
        total_marks: grade12.total_marks,
        emis: grade12.emis
      }, { transaction });

      const academicDetailsEntry = await AcademicDetails.create(academicDetails, { transaction });
      const familyDetailsEntry = await FamilyDetails.create(familyDetails, { transaction });
      const admissionDetailsEntry = await AdmissionDetails.create(admissionDetails, { transaction });

      const newStudentDetails = await StudentDetails.create(
        {
          ...studentDetails,
          user_id: userEntry.id,
          academic_details_id: academicDetailsEntry.id,
          family_details_id: familyDetailsEntry.id,
          admission_details_id: admissionDetailsEntry.id,
          permanent_address_id: permanentAddressEntry.id,
          present_address_id: presentAddressEntry.id,
          grade_10_id: grade10Entry.id,
          grade_11_id: grade11Entry.id,
          grade_12_id: grade12Entry.id,
        }, { transaction });

      createdStudents.push(newStudentDetails);
    };

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Some records failed to register.', error: errors });
    };

    await transaction.commit();

    return res.status(201).json({
      status: 'success',
      message: `${createdStudents.length} Students created successfully`,
      data: createdStudents
    });

  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 'error',
      message: 'Error creating students',
      error: error.message,
    });
  }
};

export const exportAllStudents = async (req, res, next) => {
  try {
    
    const students = await StudentDetails.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'userId', 'role_id', 'isActive', 'isVerified'] },
        { model: AcademicDetails, as: 'academicDetails' },
        { model: FamilyDetails, as: 'familyDetails' },
        { model: AdmissionDetails, as: 'admissionDetails' },
        { model: StudentAddress, as: 'permanentAddress' },
        { model: StudentAddress, as: 'presentAddress' },
        { model: StudentQualifications, as: 'grade10Qualification' },
        { model: StudentQualifications, as: 'grade11Qualification' },
        { model: StudentQualifications, as: 'grade12Qualification' },
      ],
    });

    
    const studentDetailsSheet = generateStudentDetailsSheet(students);

    const permanentAddressSheet = generatePermanentAddressSheet(students);

    const presentAddressSheet = generatePresentAddressSheet(students);

    const grade10QualificationSheet = generateGrade10QualificationSheet(students);

    const grade11QualificationSheet = generateGrade11QualificationSheet(students);

    const grade12QualificationSheet = generateGrade12QualificationSheet(students);

    res.locals.excelData = {
      fileName: 'students_export.xlsx',
      sheets: [
        { sheetName: 'Student Details', data: studentDetailsSheet },
        { sheetName: 'Permanent Address', data: permanentAddressSheet },
        { sheetName: 'Present Address', data: presentAddressSheet },
        { sheetName: 'Grade 10 Qualification', data: grade10QualificationSheet },
        { sheetName: 'Grade 11 Qualification', data: grade11QualificationSheet },
        { sheetName: 'Grade 12 Qualification', data: grade12QualificationSheet },
      ],
    };

    next();

  } catch (error) {
    console.error('Error exporting students:', error.message);
    res.status(500).json({ status: 'failed', message: 'Error exporting students', error: error.message });
  }
};


export const getAdvancedSearchStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const includes = extractIncludes(req.query);
    const filters = req.body || {}; 

    const { where, include } = buildStudentQueryOptions(filters);

    includes.push(...include);

    const students = await StudentDetails.findAll({
      where: where, 
      include: includes,
      attributes: {
        exclude: [
          'user_id', 'academic_details_id', 'family_details_id', 'admission_details_id', 
          'permanent_address_id', 'present_address_id', 'grade_10_id', 'grade_11_id', 'grade_12_id'
        ]
      },
      limit,
      offset,
    });

    if (students.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'No students found matching the provided criteria',
        total: 0,
        students: [],
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Students fetched successfully',
      total: students.length,
      students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
};

export const exportAdvancedSearchStudents = async (req, res, next)   => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const includes = extractIncludes(req.query);
    const filters = req.body || {}; 

    const { where, include } = buildStudentQueryOptions(filters);

    includes.push(...include);

    const students = await StudentDetails.findAll({
      where: where,
      include: includes,
      attributes: {
        exclude: [
          'user_id', 'academic_details_id', 'family_details_id', 'admission_details_id', 
          'permanent_address_id', 'present_address_id', 'grade_10_id', 'grade_11_id', 'grade_12_id'
        ]},
      limit,
      offset,
    });

    if (students.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'No students found matching the provided criteria',
        total: 0,
        students: [],
      });
    }

    
    const studentDetailsSheet = generateStudentDetailsSheet(students);

    const permanentAddressSheet = generatePermanentAddressSheet(students);

    const presentAddressSheet = generatePresentAddressSheet(students);

    const grade10QualificationSheet = generateGrade10QualificationSheet(students);

    const grade11QualificationSheet = generateGrade11QualificationSheet(students);

    const grade12QualificationSheet = generateGrade12QualificationSheet(students);

    res.locals.excelData = {
      fileName: 'students_export.xlsx',
      sheets: [
        { sheetName: 'Student Details', data: studentDetailsSheet },
        { sheetName: 'Permanent Address', data: permanentAddressSheet },
        { sheetName: 'Present Address', data: presentAddressSheet },
        { sheetName: 'Grade 10 Qualification', data: grade10QualificationSheet },
        { sheetName: 'Grade 11 Qualification', data: grade11QualificationSheet },
        { sheetName: 'Grade 12 Qualification', data: grade12QualificationSheet },
      ],
    };

    next();

  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      message: 'Failed to fetch students',
      error: error.message,
    });
  }
};


export const searchStudents = async (req, res) => {
  const {
    personalDetails,
    academicDetails,
    admissionDetails,
    familyDetails,
    permanentAddress,
    presentAddress,
    grade10Qualification,
    grade11Qualification,
    grade12Qualification,
  } = req.body;

  const { limit = 10, offset = 0 } = req.query;

  try {
    const where = {};
    const include = [];

    if (personalDetails) {
      where.studentDetails = personalDetails;
    }

    if (academicDetails) {
      include.push({
        model: AcademicDetails,
        as: 'academicDetails',
        where: academicDetails,
      });
    }

    if (admissionDetails) {
      include.push({
        model: AdmissionDetails,
        as: 'admissionDetails',
        where: admissionDetails,
      });
    }

    if (familyDetails) {
      include.push({
        model: FamilyDetails,
        as: 'familyDetails',
        where: familyDetails,
      });
    }

    if (permanentAddress) {
      include.push({
        model: StudentAddress,
        as: 'permanentAddress',
        where: permanentAddress,
      });
    }

    if (presentAddress) {
      include.push({
        model: StudentAddress,
        as: 'presentAddress',
        where: presentAddress,
      });
    }

    if (grade10Qualification) {
      include.push({
        model: StudentQualifications,
        as: 'grade10Qualification',
        where: grade10Qualification,
      });
    }

    if (grade11Qualification) {
      include.push({
        model: StudentQualifications,
        as: 'grade11Qualification',
        where: grade11Qualification,
      });
    }

    if (grade12Qualification) {
      include.push({
        model: StudentQualifications,
        as: 'grade12Qualification',
        where: grade12Qualification,
      });
    }

    const students = await StudentDetails.findAll({
      where: where,
      include: include,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found matching the criteria' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Students found successfully',
      total: students.length,
      students,
    });

  } catch (error) {
    console.error('Error searching for students:', error);
    return res.status(500).json({
      message: 'Failed to search for students',
      error: error.message,
    });
  }
};



export const filterStudents = async (req, res) => {
  const {
    personalDetails,
    academicDetails,
    admissionDetails,
    familyDetails,
    permanentAddress,
    presentAddress,
    grade10Qualification,
    grade11Qualification,
    grade12Qualification,
  } = req.body;

  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  try {
    const include = [
      {
        model: AcademicDetails,
        as: 'academicDetails',
        where: academicDetails || {},
      },
      {
        model: AdmissionDetails,
        as: 'admissionDetails',
        where: admissionDetails || {},
      },
      {
        model: FamilyDetails,
        as: 'familyDetails',
        where: familyDetails || {},
      },
      {
        model: StudentAddress,
        as: 'permanentAddress',
        where: permanentAddress || {},
      },
      {
        model: StudentAddress,
        as: 'presentAddress',
        where: presentAddress || {},
      },
      {
        model: StudentQualifications,
        as: 'grade10Qualification',
        where: grade10Qualification || {},
      },
      {
        model: StudentQualifications,
        as: 'grade11Qualification',
        where: grade11Qualification || {},
      },
      {
        model: StudentQualifications,
        as: 'grade12Qualification',
        where: grade12Qualification || {},
      },
    ];

    const students = await StudentDetails.findAll({
      where: personalDetails || {},
      include: include,
      limit: limit,
      offset: offset,
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found matching the criteria' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Students found successfully',
      total: students.length,
      students,
    });

  } catch (error) {
    console.error('Error searching for students:', error);
    return res.status(500).json({
      message: 'Failed to search for students',
      error: error.message,
    });
  }
};
