import xlsx from 'xlsx';

const expectedStaffHeaders = [
  'userId', 'pass', 'user_type', 'role_id', 'name', 'photo', 'staff_id', 'designation',
  'qualification', 'employment_nature', 'employment_place', 'doj', 'experience_years',
  'mobile_number', 'secondary_number', 'office_email', 'dob', 'gender', 'religion', 
  'blood_group', 'relationship_status', 'medical_remarks', 'emergency_contact', 'notes',
  'present_address_type', 'permanent_add_door_no', 'permanent_add_street', 'permanent_add_area',
  'permanent_add_district', 'permanent_add_city', 'permanent_add_state', 'permanent_add_country',
  'permanent_add_pin_code', 'present_add_door_no', 'present_add_street', 'present_add_area',
  'present_add_district', 'present_add_city', 'present_add_state', 'present_add_country',
  'present_add_pin_code'
];

const expectedStudentHeaders = [
  'studentId', 'name', 'age', 'gender', 'grade', 'class', 'section', 
  'guardian_name', 'contact_number', 'address'
];

export const uploadFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const fileBuffer = req.file.buffer;
  const fileType = req.file.mimetype;

  let workbook;
  if (fileType === 'text/csv') {
    workbook = xlsx.read(fileBuffer, { type: 'buffer', raw: true });
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileType === 'application/vnd.ms-excel'
  ) {
    workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  } else {
    return res.status(400).json({ message: 'Unsupported file format. Please upload an .xlsx or .csv file.' });
  }

  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

  const headers = sheetData[0];

  let expectedHeaders;
  if (req.path.includes('/students')) {
    expectedHeaders = expectedStudentHeaders;
  } else if (req.path.includes('/staff')) {
    expectedHeaders = expectedStaffHeaders;
  } else {
    return res.status(400).json({ message: 'Endpoint not supported for header validation.' });
  }

  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
  if (missingHeaders.length > 0) {
    return res.status(400).json({ 
      message: 'Invalid file format. Missing headers:',
      missingHeaders: missingHeaders 
    });
  }

  const data = sheetData.slice(1).map(row => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index];
    });
    return record;
  });

  req.body = data;

  next();
};
