import ExcelJS from 'exceljs';
import path from 'path';
import XLSX from 'xlsx';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import sequelize from '../config/db.js';

import { StudentDetails, User, Role, Classroom, AcademicDetails, FamilyDetails, AdmissionDetails, StudentAddress, StudentQualifications } from '../models/index.js';



export const exportAllStudent = async (req, res, next) => {
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

    
    const studentDetailsSheet = students.map((student) => ({
      'Roll Number': student.roll_number,
      'Name': student.name,
      'Classroom ID': student.classroom_id,
      'Photo Url': student.photo || '',
      'Date of Birth': student.dob || '',
      'Gender': student.gender || '',
      'Blood Group': student.blood_group || '',
      'Mother Tongue': student.mother_tongue || '',
      'Orphan Student': student.orphan_student ? 'Yes' : 'No',
      'Religion': student.religion || '',
      'Caste': student.caste || '',
      'Social Category': student.social_category || '',
      'Madhab': student.madhab,
      'Personal Email': student.personal_email || '',
      'Medical Remarks': student.medical_remarks || '',
      'Aadhar Number': student.aadhar_no || '',
      'University RRN': student.academicDetails?.rrn || '',
      'University Email': student.academicDetails?.univ_email || '',
      'Year of Joining': student.academicDetails?.yoj || '',
      'Year of Completion': student.academicDetails?.yoc || '',
      "Parent's Email": student.familyDetails?.parent_email || '',
      "Parent's WhatsApp": student.familyDetails?.parent_whatsapp || '',
      "Parent's SMS Number": student.familyDetails?.parent_sms || '',
      "Father's Name": student.familyDetails?.father_name || '',
      "Father's Mobile Number": student.familyDetails?.father_mobile || '',
      "Father's Education": student.familyDetails?.father_education || '',
      "Father's Occupation": student.familyDetails?.father_occupation || '',
      'Annual Income': student.familyDetails?.annual_income || '',
      "Mother's Name": student.familyDetails?.mother_name || '',
      "Mother's Mobile Number": student.familyDetails?.mother_mobile || '',
      "Mother's Education": student.familyDetails?.mother_education || '',
      "Mother's Occupation": student.familyDetails?.mother_occupation || '',
      "Guardian's Name": student.familyDetails?.guardian_name || '',
      "Guardian's Mobile Number": student.familyDetails?.guardian_mobile || '',
      "Guardian's Relationship": student.familyDetails?.guardian_relationship || '',
      "Guardian's Address": student.familyDetails?.guardian_address || '',
      'Date of Admission (DOA)': student.admissionDetails?.doa || '',
      'Entrance Marks': student.admissionDetails?.entrance_mark || '',
      'Entrance Rank': student.admissionDetails?.entrance_rank || '',
      'Hafiz': student.admissionDetails?.hafiz ? 'Yes' : 'No',
      'Recommended By': student.admissionDetails?.recommended_by || '',
    }));
    

    const permanentAddressSheet = students
      .filter((student) => student.permanentAddress)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Door Number': student.permanentAddress?.door_no || '',
        'Street': student.permanentAddress?.street || '',
        'Area': student.permanentAddress?.area || '',
        'City': student.permanentAddress?.city || '',
        'District': student.permanentAddress?.district || '',
        'State': student.permanentAddress?.state || '',
        'Country': student.permanentAddress?.country || '',
        'Pin Code': student.permanentAddress?.pin_code || '',
      }));

    const presentAddressSheet = students
      .filter((student) => student.presentAddress)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Door Number': student.presentAddress.door_no || '',
        'Street': student.presentAddress.street || '',
        'Area': student.presentAddress.area || '',
        'City': student.presentAddress.city || '',
        'District': student.presentAddress.district || '',
        'State': student.presentAddress.state || '',
        'Country': student.presentAddress.country || '',
        'Pin Code': student.presentAddress.pin_code || '',
      }));

    const grade10QualificationSheet = students
      .filter((student) => student.grade10Qualification)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Registration Number': student.grade10Qualification.reg_number || '',
        'Board': student.grade10Qualification.board || '',
        'Medium': student.grade10Qualification.medium || '',
        'Passing Year': student.grade10Qualification.passing_year || '',
        'Passing Month': student.grade10Qualification.passing_month || '',
        'Marks Obtained': student.grade10Qualification.marks || '',
        'Total Marks': student.grade10Qualification.total_marks || '',
        'School Name': student.grade10Qualification.school_name || '',
        'School Address': student.grade10Qualification.school_address || '',
        'EMIS Number': student.grade10Qualification.emis || '',
      }));

    const grade11QualificationSheet = students
      .filter((student) => student.grade11Qualification)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Registration Number': student.grade11Qualification.reg_number || '',
        'Board': student.grade11Qualification.board || '',
        'Medium': student.grade11Qualification.medium || '',
        'Passing Year': student.grade11Qualification.passing_year || '',
        'Passing Month': student.grade11Qualification.passing_month || '',
        'Marks Obtained': student.grade11Qualification.marks || '',
        'Total Marks': student.grade11Qualification.total_marks || '',
        'School Name': student.grade11Qualification.school_name || '',
        'School Address': student.grade11Qualification.school_address || '',
        'EMIS Number': student.grade11Qualification.emis || '',
      }));

    const grade12QualificationSheet = students
      .filter((student) => student.grade12Qualification)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Registration Number': student.grade12Qualification.reg_number || '',
        'Board': student.grade12Qualification.board || '',
        'Medium': student.grade12Qualification.medium || '',
        'Passing Year': student.grade12Qualification.passing_year || '',
        'Passing Month': student.grade12Qualification.passing_month || '',
        'Marks Obtained': student.grade12Qualification.marks || '',
        'Total Marks': student.grade12Qualification.total_marks || '',
        'School Name': student.grade12Qualification.school_name || '',
        'School Address': student.grade12Qualification.school_address || '',
        'EMIS Number': student.grade12Qualification.emis || '',
      }));

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


export const exportStudent = async (req, res) => {
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

    // Prepare data for each sheet
    const studentDetailsSheet = students.map((student) => ({
      'Roll Number': student.roll_number,
      'Classroom ID': student.classroom_id,
      Name: student.name,
      'Photo Url': student.photo,
      'Date of Birth': student.dob,
      Gender: student.gender,
      'Blood Group': student.blood_group,
      // Add remaining fields...
    }));

    const permanentAddressSheet = students
      .filter((student) => student.permanentAddress)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Door Number': student.permanentAddress.door_no,
        Street: student.permanentAddress.street,
        Area: student.permanentAddress.area,
        City: student.permanentAddress.city,
        District: student.permanentAddress.district,
        State: student.permanentAddress.state,
        Country: student.permanentAddress.country,
        'Pin Code': student.permanentAddress.pin_code,
      }));

    const presentAddressSheet = students
      .filter((student) => student.presentAddress)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Door Number': student.presentAddress.door_no,
        Street: student.presentAddress.street,
        Area: student.presentAddress.area,
        City: student.presentAddress.city,
        District: student.presentAddress.district,
        State: student.presentAddress.state,
        Country: student.presentAddress.country,
        'Pin Code': student.presentAddress.pin_code,
      }));

    const grade10QualificationSheet = students
      .filter((student) => student.grade10Qualification)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'School Name': student.grade10Qualification.school_name,
        Board: student.grade10Qualification.board,
        Medium: student.grade10Qualification.medium,
        'Passing Year': student.grade10Qualification.passing_year,
        'Passing Month': student.grade10Qualification.passing_month,
        'School Address': student.grade10Qualification.school_address,
        'Registration Number': student.grade10Qualification.reg_number,
        Marks: student.grade10Qualification.marks,
        'Total Marks': student.grade10Qualification.total_marks,
        'EMIS Number': student.grade10Qualification.emis,
      }));

    // Repeat for Grade 11 and Grade 12...

    // Create a workbook and append sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(studentDetailsSheet),
      'Student Details'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(permanentAddressSheet),
      'Permanent Address'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(presentAddressSheet),
      'Present Address'
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(grade10QualificationSheet),
      'Grade 10 Qualification'
    );
    // Repeat for Grade 11 and Grade 12...

    // Write workbook to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Send the buffer as a response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="students_export.xlsx"');
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting students:', error.message);
    res.status(500).json({ message: 'Error exporting students', error: error.message });
  }
};


export const exportStudentsToExcel = async (req, res) => {
  try {
    const students = await StudentDetails.findAll({
      include: [
        { model: User, as: 'user', attributes: ['userId', 'pass', 'user_type', 'role_id', 'isActive', 'isVerified'] },
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

    const workbook = new ExcelJS.Workbook();

    const studentDetailsSheet = workbook.addWorksheet('Student Details');
    studentDetailsSheet.addRow([
      'User ID', 'Password', 'User Type', 'Role ID', 'Is Active', 'Is Verified', 'Roll Number', 'Name', 'Photo',
      'Date of Birth', 'Gender', 'Blood Group', 'Mother Tongue', 'Orphan Student', 'Religion', 'Caste', 'Personal Mobile Number',
      'Personal Email', 'Medical Remarks', 'Aadhar Number', 'Classroom ID', 'Registration Number (RRN)', 'University Email',
      'Year of Joining', 'Year of Completion', "Parent's Email", "Parent's WhatsApp", "Parent's SMS Number", "Father's Name",
      "Father's Mobile Number", "Father's Education", "Father's Occupation", 'Annual Income', "Mother's Name", "Mother's Mobile Number",
      "Mother's Education", "Mother's Occupation", "Guardian's Name", "Guardian's Mobile Number", "Guardian's Relationship",
      "Guardian's Address", 'Date of Admission (DOA)', 'Entrance Marks', 'Entrance Rank', 'Hafiz Status', 'Recommended By'
    ]);

    students.forEach(student => {
      studentDetailsSheet.addRow([
        student.user?.userId, null, student.user?.user_type, student.user?.role_id, student.user?.isActive, student.user?.isVerified,
        student.roll_number, student.name, student.photo, student.dob, student.gender, student.blood_group, student.mother_tongue,
        student.orphan_student, student.religion, student.caste, student.personal_mobile, student.personal_email, student.medical_remarks,
        student.aadhar_no, student.classroom_id, student.rrn, student.univ_email, student.yoj, student.yoc, student.parent_email,
        student.parent_whatsapp, student.parent_sms, student.familyDetails?.father_name, student.familyDetails?.father_mobile,
        student.familyDetails?.father_education, student.familyDetails?.father_occupation, student.familyDetails?.annual_income,
        student.familyDetails?.mother_name, student.familyDetails?.mother_mobile, student.familyDetails?.mother_education,
        student.familyDetails?.mother_occupation, student.familyDetails?.guardian_name, student.familyDetails?.guardian_mobile,
        student.familyDetails?.guardian_relationship, student.familyDetails?.guardian_address, student.admissionDetails?.doa,
        student.admissionDetails?.entrance_mark, student.admissionDetails?.entrance_rank, student.admissionDetails?.hafiz,
        student.admissionDetails?.recommended_by
      ]);
    });

    const permanentAddressSheet = workbook.addWorksheet('Permanent Address');
    permanentAddressSheet.addRow(['Roll Number', 'Name', 'Address Type (Permanent/Present)', 'Door Number', 'Street', 'Area', 'City', 'District', 'State', 'Country', 'Pin Code']);
    students.forEach(student => {
      if (student.permanentAddress) {
        permanentAddressSheet.addRow([
          student.roll_number, student.name, student.permanentAddress.address_type, student.permanentAddress.door_no, student.permanentAddress.street,
          student.permanentAddress.area, student.permanentAddress.city, student.permanentAddress.district,
          student.permanentAddress.state, student.permanentAddress.country, student.permanentAddress.pin_code
        ]);
      }
    });

    const presentAddressSheet = workbook.addWorksheet('Present Address');
    presentAddressSheet.addRow(['Roll Number', 'Name', 'Address Type (Permanent/Present)', 'Door Number', 'Street', 'Area', 'City', 'District', 'State', 'Country', 'Pin Code']);
    students.forEach(student => {
      if (student.presentAddress) {
        presentAddressSheet.addRow([
          student.roll_number, student.name, student.presentAddress.address_type, student.presentAddress.door_no, student.presentAddress.street,
          student.presentAddress.area, student.presentAddress.city, student.presentAddress.district,
          student.presentAddress.state, student.presentAddress.country, student.presentAddress.pin_code
        ]);
      }
    });

    const addQualificationSheet = (sheetName, qualificationKey) => {
      const sheet = workbook.addWorksheet(sheetName);
      sheet.addRow(['Roll Number', 'Name', 'Exam Type (Grade 10/11/12)', 'School Name', 'Board', 'Medium', 'Exam Year', 'School Address', 'Registration Number', 'Marks Obtained', 'Total Marks', 'EMIS Number']);
      students.forEach(student => {
        const qualification = student[qualificationKey];
        if (qualification) {
          sheet.addRow([
            student.roll_number, student.name, qualification.exam_type, qualification.school_name, qualification.board, qualification.medium,
            qualification.exam_year, qualification.school_address, qualification.reg_number, qualification.marks,
            qualification.total_marks, qualification.emis
          ]);
        }
      });
    };

    addQualificationSheet('Grade 10 Qualification', 'grade10Qualification');
    addQualificationSheet('Grade 11 Qualification', 'grade11Qualification');
    addQualificationSheet('Grade 12 Qualification', 'grade12Qualification');

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Students.xlsx"');
    res.send(buffer);

  } catch (error) {
    res.status(500).json({
      message: 'Failed to export students to Excel',
      error: error.message,
    });
  }
};


// export const exportStudents = async (req, res) => {
//   try {
//     const students = await StudentDetails.findAll({
//       include: [
//         { model: User, as: 'user', attributes: ['userId', 'pass', 'user_type', 'role_id', 'isActive', 'isVerified'] },
//         { model: AcademicDetails, as: 'academicDetails' },
//         { model: FamilyDetails, as: 'familyDetails' },
//         { model: AdmissionDetails, as: 'admissionDetails' },
//         { model: StudentAddress, as: 'permanentAddress' },
//         { model: StudentAddress, as: 'presentAddress' },
//         { model: StudentQualifications, as: 'grade10Qualification' },
//         { model: StudentQualifications, as: 'grade11Qualification' },
//         { model: StudentQualifications, as: 'grade12Qualification' },
//       ],
//     });

//     const data = {};

//     data['Student Details'] = [
//       [
//         'User ID', 'Password', 'User Type', 'Role ID', 'Is Active', 'Is Verified', 'Roll Number', 'Name', 'Photo',
//         'Date of Birth', 'Gender', 'Blood Group', 'Mother Tongue', 'Orphan Student', 'Religion', 'Caste', 'Personal Mobile Number',
//         'Personal Email', 'Medical Remarks', 'Aadhar Number', 'Classroom ID', 'Registration Number (RRN)', 'University Email',
//         'Year of Joining', 'Year of Completion', "Parent's Email", "Parent's WhatsApp", "Parent's SMS Number", "Father's Name",
//         "Father's Mobile Number", "Father's Education", "Father's Occupation", 'Annual Income', "Mother's Name", "Mother's Mobile Number",
//         "Mother's Education", "Mother's Occupation", "Guardian's Name", "Guardian's Mobile Number", "Guardian's Relationship",
//         "Guardian's Address", 'Date of Admission (DOA)', 'Entrance Marks', 'Entrance Rank', 'Hafiz Status', 'Recommended By'
//       ],
//       ...students.map(student => [
//         student.user?.userId, null, student.user?.user_type, student.user?.role_id, student.user?.isActive, student.user?.isVerified,
//         student.roll_number, student.name, student.photo, student.dob, student.gender, student.blood_group, student.mother_tongue,
//         student.orphan_student, student.religion, student.caste, student.personal_mobile, student.personal_email, student.medical_remarks,
//         student.aadhar_no, student.classroom_id, student.rrn, student.univ_email, student.yoj, student.yoc, student.parent_email,
//         student.parent_whatsapp, student.parent_sms, student.familyDetails?.father_name, student.familyDetails?.father_mobile,
//         student.familyDetails?.father_education, student.familyDetails?.father_occupation, student.familyDetails?.annual_income,
//         student.familyDetails?.mother_name, student.familyDetails?.mother_mobile, student.familyDetails?.mother_education,
//         student.familyDetails?.mother_occupation, student.familyDetails?.guardian_name, student.familyDetails?.guardian_mobile,
//         student.familyDetails?.guardian_relationship, student.familyDetails?.guardian_address, student.admissionDetails?.doa,
//         student.admissionDetails?.entrance_mark, student.admissionDetails?.entrance_rank, student.admissionDetails?.hafiz,
//         student.admissionDetails?.recommended_by
//       ]),
//     ];

//     const createAddressSheet = (sheetName, addressKey) => {
//       data[sheetName] = [
//         ['Roll Number', 'Name', 'Address Type (Permanent/Present)', 'Door Number', 'Street', 'Area', 'City', 'District', 'State', 'Country', 'Pin Code'],
//         ...students
//           .filter(student => student[addressKey])
//           .map(student => [
//             student.roll_number, student.name, student[addressKey].address_type, student[addressKey].door_no, student[addressKey].street,
//             student[addressKey].area, student[addressKey].city, student[addressKey].district, student[addressKey].state,
//             student[addressKey].country, student[addressKey].pin_code
//           ]),
//       ];
//     };

//     createAddressSheet('Permanent Address', 'permanentAddress');
//     createAddressSheet('Present Address', 'presentAddress');

//     const createQualificationSheet = (sheetName, qualificationKey) => {
//       data[sheetName] = [
//         ['Roll Number', 'Name', 'Exam Type (Grade 10/11/12)', 'School Name', 'Board', 'Medium', 'Exam Year', 'School Address', 'Registration Number', 'Marks Obtained', 'Total Marks', 'EMIS Number'],
//         ...students
//           .filter(student => student[qualificationKey])
//           .map(student => [
//             student.roll_number, student.name, student[qualificationKey].exam_type, student[qualificationKey].school_name,
//             student[qualificationKey].board, student[qualificationKey].medium, student[qualificationKey].exam_year,
//             student[qualificationKey].school_address, student[qualificationKey].reg_number, student[qualificationKey].marks,
//             student[qualificationKey].total_marks, student[qualificationKey].emis
//           ]),
//       ];
//     };

//     createQualificationSheet('Grade 10 Qualification', 'grade10Qualification');
//     createQualificationSheet('Grade 11 Qualification', 'grade11Qualification');
//     createQualificationSheet('Grade 12 Qualification', 'grade12Qualification');

//     const workbook = XLSX.utils.book_new();

//     Object.keys(data).forEach(sheetName => {
//       const sheet = XLSX.utils.aoa_to_sheet(data[sheetName]);
//       XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
//     });

//     const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', 'attachment; filename="Students.xlsx"');
//     res.send(buffer);

//   } catch (error) {
//     res.status(500).json({
//       message: 'Failed to export students to Excel',
//       error: error.message,
//     });
//   }
// };


const upload = multer({ dest: 'uploads/' });

export const readStudentsFromExcel = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const parseSheet = (sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error(`Sheet ${sheetName} not found in the Excel file`);
      return XLSX.utils.sheet_to_json(sheet);
    };

    const studentDetails = parseSheet('Student Details');
    const permanentAddress = parseSheet('Permanent Address');
    const presentAddress = parseSheet('Present Address');
    const grade10Qualification = parseSheet('Grade 10 Qualification');
    const grade11Qualification = parseSheet('Grade 11 Qualification');
    const grade12Qualification = parseSheet('Grade 12 Qualification');

    res.status(200).json({
      message: 'Excel file data read successfully',
      data: {
        studentDetails,
        permanentAddress,
        presentAddress,
        grade10Qualification,
        grade11Qualification,
        grade12Qualification,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to read Excel file',
      error: error.message,
    });
  }
};

export const importAndCreateStudents = async (req, res) => {
  const transaction = await StudentDetails.sequelize.transaction();

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const parseSheet = (sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) throw new Error(`Sheet "${sheetName}" not found in the Excel file`);
      return XLSX.utils.sheet_to_json(sheet);
    };

    const studentDetailsSheet = parseSheet('Student Details');
    const permanentAddressSheet = parseSheet('Permanent Address');
    const presentAddressSheet = parseSheet('Present Address');
    const grade10QualificationSheet = parseSheet('Grade 10 Qualification');
    const grade11QualificationSheet = parseSheet('Grade 11 Qualification');
    const grade12QualificationSheet = parseSheet('Grade 12 Qualification');

    const studentsData = studentDetailsSheet.map((studentDetail) => {
      const roll_number = studentDetail['Roll Number'];

      return {
        user: {
          userId: studentDetail['User ID'],
          pass: studentDetail['Password'],
          role_id: studentDetail['Role ID'],
        },
        studentDetails: {
          roll_number,
          classroom_id: studentDetail['Classroom ID'],
          name: studentDetail['Name'],
          photo: studentDetail['Photo'],
          dob: studentDetail['Date of Birth'],
          gender: studentDetail['Gender'],
          blood_group: studentDetail['Blood Group'],
          mother_tongue: studentDetail['Mother Tongue'],
          orphan_student: studentDetail['Orphan Student'],
          religion: studentDetail['Religion'],
          caste: studentDetail['Caste'],
          personal_mobile: studentDetail['Personal Mobile Number'],
          personal_email: studentDetail['Personal Email'],
          medical_remarks: studentDetail['Medical Remarks'],
          aadhar_no: studentDetail['Aadhar Number'],
          rrn: studentDetail['Registration Number (RRN)'],
          univ_email: studentDetail['University Email'],
          yoj: studentDetail['Year of Joining'],
          yoc: studentDetail['Year of Completion'],
        },
        academicDetails: {
          rrn: studentDetail['Registration Number (RRN)'],
          univ_email: studentDetail['University Email'],
          yoj: studentDetail['Year of Joining'],
          yoc: studentDetail['Year of Completion'],
        },
        familyDetails: {
          parent_email: studentDetail["Parent's Email"],
          parent_whatsapp: studentDetail["Parent's WhatsApp"],
          parent_sms: studentDetail["Parent's SMS Number"],
          father_name: studentDetail["Father's Name"],
          father_mobile: studentDetail["Father's Mobile Number"],
          father_education: studentDetail["Father's Education"],
          father_occupation: studentDetail["Father's Occupation"],
          annual_income: studentDetail['Annual Income'],
          mother_name: studentDetail["Mother's Name"],
          mother_mobile: studentDetail["Mother's Mobile Number"],
          mother_education: studentDetail["Mother's Education"],
          mother_occupation: studentDetail["Mother's Occupation"],
          guardian_name: studentDetail["Guardian's Name"],
          guardian_mobile: studentDetail["Guardian's Mobile Number"],
          guardian_relationship: studentDetail["Guardian's Relationship"],
          guardian_address: studentDetail["Guardian's Address"],
        },
        admissionDetails: {
          doa: studentDetail['Date of Admission (DOA)'],
          entrance_mark: studentDetail['Entrance Marks'],
          entrance_rank: studentDetail['Entrance Rank'],
          hafiz: studentDetail['Hafiz Status'],
          recommended_by: studentDetail['Recommended By'],
        },
        // permanentAddress: permanentAddressSheet.find((addr) => addr['Roll Number'] === roll_number),
        // presentAddress: presentAddressSheet.find((addr) => addr['Roll Number'] === roll_number),
        // grade10Qualification: grade10QualificationSheet.find((qual) => qual['Roll Number'] === roll_number),
        // grade11Qualification: grade11QualificationSheet.find((qual) => qual['Roll Number'] === roll_number),
        // grade12Qualification: grade12QualificationSheet.find((qual) => qual['Roll Number'] === roll_number),
      };
    });

    for (const student of studentsData) {
      console.log(student);
    }

    return res.status(200).json({
      message: 'Excel file data read successfully',
      data: {
        studentDetails: studentsData.map((student) => student.studentDetails),
        permanentAddress: studentsData.map((student) => student.permanentAddress),
        presentAddress: studentsData.map((student) => student.presentAddress),
        grade10Qualification: studentsData.map((student) => student.grade10Qualification),
        grade11Qualification: studentsData.map((student) => student.grade11Qualification),
        grade12Qualification: studentsData.map((student) => student.grade12Qualification),
      },
    });

    const createdStudents = [];

    for (const student of studentsData) {
      console.log(student);
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
        throw new Error('Missing required fields: role_id, roll_number, or classroom_id');
      }

      const role = await Role.findByPk(user.role_id, { transaction });
      if (!role) throw new Error(`Invalid role_id for student with roll number ${studentDetails.roll_number}`);

      const existingUser = await User.findOne({ where: { userId: studentDetails.roll_number }, transaction });
      if (existingUser) throw new Error(`User ID ${studentDetails.roll_number} already exists`);

      const classroom = await Classroom.findByPk(studentDetails.classroom_id, { transaction });
      if (!classroom) throw new Error(`Invalid classroom_id for student with roll number ${studentDetails.roll_number}`);

      const hashedPassword = await bcrypt.hash(user.pass, 10);

      const newUser = await User.create(
        { userId: studentDetails.roll_number, pass: hashedPassword, user_type: 'student', role_id: user.role_id },
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
      message: 'Students imported and created successfully',
      total: createdStudents.length,
      data: createdStudents,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    return res.status(500).json({ message: 'Failed to import and create students', error: error.message });
  }
};

let studentResult;


export const readExcelFormulaValue = async (req, res) => {
  try {


    // Read the Excel workbook from the uploaded file buffer
    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get the first sheet's name
    const sheetName = workbook.SheetNames[0];

    // Access the worksheet
    const worksheet = workbook.Sheets[sheetName];

    // Access the specific cell with a formula (e.g., A3)
    const cellAddress = 'A3';
    const cell = worksheet[cellAddress];

    if (cell) {
      // Get the computed value
      const computedValue = cell.v; // Computed value of the cell
      const formula = cell.f;

      console.log({
        value: worksheet['A1'],
        condition: worksheet['A1'] == 5
      });

      const sheet1 = workbook.Sheets['Sheet1'];

      res.status(200).json({
        message: 'Cell data retrieved successfully.',
        cellAddress,
        computedValue,
        formula: formula || 'No formula in this cell',
        data: sheet1 || 'No data in this sheet'
      });
    } else {
      res.status(404).json({ message: `Cell ${cellAddress} does not exist.` });
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};



export const downloadExcel = async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Excel file downloaded successfully',
    data: studentResult ? studentResult : []
  });
};

