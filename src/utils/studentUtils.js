import { User, AcademicDetails, FamilyDetails, AdmissionDetails, StudentAddress, StudentQualifications } from '../models/index.js';


const validIncludes = {
  userDetails: { model: User, as: 'user', attributes: ['userId', 'role_id', 'isActive', 'isVerified'] },

  academicDetails: { model: AcademicDetails, as: 'academicDetails' },

  familyDetails: { model: FamilyDetails, as: 'familyDetails' },

  admissionDetails: { model: AdmissionDetails, as: 'admissionDetails' },

  permanentAddress: { model: StudentAddress, as: 'permanentAddress' },

  presentAddress: { model: StudentAddress, as: 'presentAddress' },

  grade10Qualification: { model: StudentQualifications, as: 'grade10Qualification' },

  grade11Qualification: { model: StudentQualifications, as: 'grade11Qualification' },

  grade12Qualification: { model: StudentQualifications, as: 'grade12Qualification' },
};


export const extractIncludes = (query) => {
  const includes = [];
  for (const field in query) {

    if (field === 'page' || field === 'per_page') {
      continue;
    }

    if (validIncludes[field]) {
      includes.push(validIncludes[field]);
    }
  }
  return includes;
};


export const buildStudentQueryOptions = (filters) => {
    const whereClause = {};
    const includes = [];
  
    if (filters.studentDetails) {
      Object.assign(whereClause, filters.studentDetails);
    }
  
    if (filters.permanentAddress) {
        includes.push({ model: StudentAddress, as: 'permanentAddress', where: filters.permanentAddress });
    }

    if (filters.presentAddress) {
      includes.push({ model: StudentAddress, as: 'presentAddress', where: filters.presentAddress });
    }

    if (filters.admissionDetails) {
      includes.push({ model: AdmissionDetails, as: 'admissionDetails', where: filters.admissionDetails });
    }

    if (filters.academicDetails) {
      includes.push({ model: AcademicDetails, as: 'academicDetails', where: filters.academicDetails });
    }

    if (filters.familyDetails) {
      includes.push({ model: FamilyDetails, as: 'familyDetails', where: filters.familyDetails });
    }

    if (filters.grade10Qualification) {
      includes.push({ model: StudentQualifications, as: 'grade10Qualification', where: filters.grade10Qualification });
    }

    if (filters.grade11Qualification) {
      includes.push({ model: StudentQualifications, as: 'grade11Qualification', where: filters.grade11Qualification });
    }

    if (filters.grade12Qualification) {
      includes.push({ model: StudentQualifications, as: 'grade12Qualification', where: filters.grade12Qualification });
    }
  
    return { where: whereClause, include: includes };
};


export const generateStudentDetailsSheet = (students) => {
  return students.map((student) => ({
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
};
  

export const generatePermanentAddressSheet = (students) => {
    return students
      .filter((student) => student.permanentAddress)
      .map((student) => ({
        'Roll Number': student.roll_number,
        'Name': student.name,
        'Door Number': student.permanentAddress.door_no || '',
        'Street': student.permanentAddress.street || '',
        'Area': student.permanentAddress.area || '',
        'City': student.permanentAddress.city || '',
        'District': student.permanentAddress.district || '',
        'State': student.permanentAddress.state || '',
        'Country': student.permanentAddress.country || '',
        'Pin Code': student.permanentAddress.pin_code || '',
    }));
};


export const generatePresentAddressSheet = (students) => {
    return students
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
};
  
export const generateGrade10QualificationSheet = (students) => {
    return students
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
};

export const generateGrade11QualificationSheet = (students) => {
    return students
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
};

export const generateGrade12QualificationSheet = (students) => {
    return students
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
};