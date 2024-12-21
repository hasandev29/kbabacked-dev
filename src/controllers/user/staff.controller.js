import bcrypt from 'bcryptjs';
import { Role, User, StaffDetails, StaffAddress } from '../../models/index.js';
import sequelize from '../../config/db.js';


export const createStaff = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      personalDetails,
      permanentAddress,
      presentAddress
    } = req.body;

    const checkRoleId = Role.findByPk(3, { transaction });
    if (!checkRoleId) {
      return res.status(404).json({ message: 'Staff role not found' });
    }

    const checkUserId = User.findOne({ where: { userId: personalDetails.staff_id }, transaction });

    const pass = personalDetails.dob.substring(0, 4) + personalDetails.dob.substring(8, 10); // 1980-11-25 = 198025

    const hashedPasswordPromise = bcrypt.hash(pass, 10);

    const createPermanentAddressPromise = StaffAddress.create({
      address_type: 'permanent',
      door_no: permanentAddress.door_no,
      street: permanentAddress.street,
      area: permanentAddress.area,
      district: permanentAddress.district,
      city: permanentAddress.city,
      state: permanentAddress.state,
      country: permanentAddress.country,
      pin_code: permanentAddress.pin_code
    }, { transaction });

    let createPresentAddressPromise = null;
    if (personalDetails.present_address_type === 'outside' || personalDetails.present_address_type === 'hostel') {
      createPresentAddressPromise = StaffAddress.create({
        address_type: 'present',
        door_no: presentAddress?.door_no || null,
        street: presentAddress?.street || null,
        area: presentAddress?.area || null,
        district: presentAddress?.district || null,
        city: presentAddress?.city || null,
        state: presentAddress?.state || null,
        country: presentAddress?.country || null,
        pin_code: presentAddress?.pin_code || null,
      }, { transaction });
    }

    const [existingUser, hashedPassword, createdPermanentAddress, createdPresentAddress] = await Promise.all([
      checkUserId, 
      hashedPasswordPromise,
      createPermanentAddressPromise, 
      createPresentAddressPromise
    ]);

    if (existingUser) {
      return res.status(400).json({ message: 'User Id already exists, please choose another.' });
    }

    const createdUser = await User.create({
      userId: personalDetails.staff_id,
      pass: hashedPassword,
      user_type: "staff",
      role_id: 3
    }, { transaction });

    const staff = await StaffDetails.create({
      ...personalDetails,
      user_id: createdUser.id,
      permanent_address_id: createdPermanentAddress.id,
      present_address_id: createdPresentAddress?.id
    }, { transaction });

    await transaction.commit();

    return res.status(201).json({ 
      status: 'success',
      message: 'Staff registered successfully', 
      data: staff });

  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Error registering staff', error: err.message });
  }
};


// export const oldcreateStaff = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {

//     const {
//         staffDetails,
//         permanentAddress,
//         presentAddress
//     } = req.body;

//     const checkUserId = await User.findOne({ where: { userId: staffDetails.staff_id }, transaction });
//     if (checkUserId) {
//       return res.status(400).json({ message: 'User Id already exists, please choose another.' });
//     }

//     const pass = staffDetails.dob.substring(0, 4) + staffDetails.dob.substring(8, 10);
//     console.log(pass);

//     const hashedPassword = await bcrypt.hash(pass, 10);

//     const createdUser = await User.create({
//       userId: staffDetails.staff_id,
//       pass: hashedPassword,
//       user_type: "staff",
//       role_id: 3
//     }, { transaction });

//     const createdPermanentAddress = await StaffAddress.create({
//       address_type: 'permanent',
//       door_no: permanentAddress.door_no,
//       street: permanentAddress.street,
//       area: permanentAddress.area,
//       district: permanentAddress.district,
//       city: permanentAddress.city,
//       state: permanentAddress.state,
//       country: permanentAddress.country,
//       pin_code: permanentAddress.pin_code
//     }, { transaction });

//     let createdPresentAddress = null;
//     if (staffDetails.present_address_type === 'outside' || staffDetails.present_address_type === 'hostel') {
//       createdPresentAddress = await StaffAddress.create({
//         address_type: 'present',
//         door_no: presentAddress?.door_no || null,
//         street: presentAddress?.street || null,
//         area: presentAddress?.area || null,
//         district: presentAddress?.district || null,
//         city: presentAddress?.city || null,
//         state: presentAddress?.state || null,
//         country: presentAddress?.country || null,
//         pin_code: presentAddress?.pin_code || null,
//       }, { transaction });
//     }

//     const staff = await StaffDetails.create({
//       ...staffDetails,
//       user_id: createdUser.id,
//       permanent_address_id: createdPermanentAddress.id,
//       present_address_id: createdPresentAddress.id
//     }, { transaction });

//     await transaction.commit();

//     return res.status(201).json({ message: 'Staff registered successfully', data: staff });

//   } catch (err) {
//     await transaction.rollback();
//     console.error(err);
//     return res.status(500).json({ message: 'Error registering staff', error: err.message });
//   }
// };


export const createBulkStaff = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const staffArray = req.body;
  
      if (!Array.isArray(staffArray) || staffArray.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Expected an array of staff data.' });
      }
  
      const createdStaffs = [];
  
      for (const staff of staffArray) {
        const {
          user,
          staffDetails,
          permanentAddress,
          presentAddress,
        } = staff;
  
        if (!user.pass || !user.role_id || !staffDetails.staff_id) {
          throw new Error('user.pass, user.role_id, staffDetails.staff_id are required.');
        }
  
        // const role = await Role.findByPk(user.role_id, { transaction });
        // if (!role) {
        //   throw new Error(`Invalid role_id provided for staff with staff_id ${staffDetails.staff_id}`);
        // }
  
        const checkUserId = await User.findOne({ where: { userId: staffDetails.staff_id }, transaction });
        if (checkUserId) {
          throw new Error(`User Id ${user.userId} already exists, please choose another.`);
        }
  
        const hashedPassword = await bcrypt.hash(user.pass, 10);
  
        const newUser = await User.create(
          {
            userId: staffDetails.staff_id,
            pass: hashedPassword,
            user_type: 'staff',
            role_id: 3,
          },
          { transaction }
        );
  
        const createdPermanentAddress = await StaffAddress.create({
          address_type: 'permanent',
          door_no: permanentAddress.door_no,
          street: permanentAddress.street,
          area: permanentAddress.area,
          district: permanentAddress.district,
          city: permanentAddress.city,
          state: permanentAddress.state,
          country: permanentAddress.country,
          pin_code: permanentAddress.pin_code,
        }, { transaction });
  
        let createdPresentAddress = null;
        if (staffDetails.present_address_type === 'outside' || staffDetails.present_address_type === 'hostel') {
          createdPresentAddress = await StaffAddress.create({
            address_type: 'present',
            door_no: presentAddress?.door_no || null,
            street: presentAddress?.street || null,
            area: presentAddress?.area || null,
            district: presentAddress?.district || null,
            city: presentAddress?.city || null,
            state: presentAddress?.state || null,
            country: presentAddress?.country || null,
            pin_code: presentAddress?.pin_code || null,
          }, { transaction });
        }
  
        const newStaffDetails = await StaffDetails.create({
          ...staffDetails,
          user_id: newUser.id,
          permanent_address_id: createdPermanentAddress.id,
          present_address_id: createdPresentAddress.id,
        }, { transaction });
  
        createdStaffs.push(newStaffDetails);
      }
  
      await transaction.commit();
  
      return res.status(201).json({
        status: 'success',
        message: 'Staff members created successfully',
        total: createdStaffs.length,
        data: createdStaffs,
      });
  
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error creating staff:', error);
      return res.status(500).json({
        message: 'Failed to create staff members',
        error: error.message,
      });
    }
};

export const getAllStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const filters = {};
    const userFilters = {};

    if (req.query.isActive !== undefined) {
      userFilters.isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    }

    if (req.query.role_id) {
      userFilters.role_id = req.query.role_id;
    }
    
    if (req.query.staff_type) {
      filters.staff_type = req.query.staff_type; // Teaching or Non-Teaching
    }

    if (req.query.employment_place) {
      filters.employment_place = req.query.employment_place; // KBA or UNIVERSITY
    }

    if (req.query.present_address_type) {
      filters.present_address_type = req.query.present_address_type;
    }

    const staff = await StaffDetails.findAll({
      limit, offset,
      where: filters,
      include: [
        { model: User, as: 'user', required: true, where: userFilters, attributes: [ 'isActive' ], include: [ { model: Role, as: 'role', attributes: ['name'] } ] },
        { model: StaffAddress, as: 'permanentAddress' },
        { model: StaffAddress, as: 'presentAddress' }
      ],
      attributes: [ 'id', 'photo', 'salutation', 'name', 'short_name', 'staff_id', 'employment_place', 'designation' ]
    });

    if (staff.length === 0) {
      return res.status(404).json({ message: 'No staff found' });
    }

    const staffCount = await StaffDetails.count({ where: filters });

    const staffData = staff.map(staff => ({
      id: staff.id,
      photo: staff.photo,
      salutation: staff.salutation,
      name: staff.name,
      short_name: staff.short_name,
      staff_id: staff.staff_id,
      employment_place: staff.employment_place,
      designation: staff.designation,
      role: staff.user.role.name,
      isActive: staff.user.isActive
    }));

    return res.status(200).json({ 
        status: 'success',
        message: 'Staff records fetched successfully',
        total: staffCount,
        data: staffData });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching staff records', error: err.message });
  }
};

export const getStaffList = async (req, res) => {
  try {
    const filters = {};
    const userFilters = {};

    if (req.query.isActive !== undefined) {
      userFilters.isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    }

    if (req.query.role_id) {
      userFilters.role_id = req.query.role_id;
    }

    if (req.query.staff_type) {
      filters.staff_type = req.query.staff_type; // Teaching or Non-Teaching
    }

    if (req.query.employment_place) {
      filters.employment_place = req.query.employment_place;
    }

    if (req.query.present_address_type) {
      filters.present_address_type = req.query.present_address_type;
    }
    
    const staff = await StaffDetails.findAll({
      where: filters,
      include: [
        { model: User, as: 'user', required: true, where: userFilters, attributes: [ 'isActive' ],  },
      ],
      attributes: [ 'id', 'photo', 'salutation', 'name', 'short_name' ]
    });

    if (staff.length === 0) {
      return res.status(404).json({ message: 'No staff found' });
    }
    
    const staffCount = await StaffDetails.count({ where: filters });

    return res.status(200).json({ 
        status: 'success',
        message: 'Staff records fetched successfully',
        total: staffCount,
        data: staff });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching staff records', error: err.message });
  }
}

export const getStaffById = async (req, res) => {
  const { id } = req.params;

  try {

    const staff = await StaffDetails.findOne({
      where: { id },
      include: [
        { model: User, as: 'user',
          attributes: ['id', 'isActive'], include: [ { model: Role, as: 'role', attributes: ['name'] } ] },
        { model: StaffAddress, as: 'permanentAddress' },
        { model: StaffAddress, as: 'presentAddress' }
      ],
      attributes: { exclude: ['user_id', 'permanent_address_id', 'present_address_id'] }
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    return res.status(200).json({ 
      status: 'success',
      message: 'Staff record fetched successfully', 
      data: staff });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching staff record', error: err.message });
  }
};

export const getStaffByStaffId = async (req, res) => {
  const { staff_id } = req.params;

  try {
  
    const staff = await StaffDetails.findOne({
      where: { staff_id: staff_id },
      include: [
        { model: User, as: 'user',
          attributes: { exclude: ['pass'] } },
        { model: StaffAddress, as: 'permanentAddress' },
        { model: StaffAddress, as: 'presentAddress' }
      ]
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    return res.status(200).json({ message: 'Staff record fetched successfully', data: staff });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching staff record', error: err.message });
  }
};

export const updateStaffDetails = async (req, res) => {
    const { id } = req.params; 
    const { 
      univ_id, name, short_name, salutation, photo, dob, gender, blood_group, religion, marital_status, medical_remarks, 
      mobile_number, email, emergency_contact, staff_type,  designation, qualifications, 
      employment_nature, employment_place, doj, experience_years, work_email, aadhar_no, 
      notes
    } = req.body;
  
    const transaction = await sequelize.transaction();
  
    try {
  
      const staff = await StaffDetails.findByPk(id);
      if (!staff) {
        return res.status(404).json({ message: `Staff with id ${id} not found.` });
      }
  
      const user = await User.findByPk(staff.user_id);
      if (!user) {
        return res.status(404).json({ message: `User for staff with id ${id} not found.` });
      }

      if (univ_id) staff.univ_id = univ_id;
      if (name) staff.name = name;
      if (short_name) staff.short_name = short_name;
      if (salutation) staff.salutation = salutation;
      if (photo) staff.photo = photo;
      if (dob) staff.dob = dob;
      if (gender) staff.gender = gender;
      if (blood_group) staff.blood_group = blood_group;
      if (religion) staff.religion = religion;
      if (marital_status) staff.marital_status = marital_status;
      if (medical_remarks) staff.medical_remarks = medical_remarks;
      if (mobile_number) staff.mobile_number = mobile_number;
      if (email) staff.email = email;
      if (emergency_contact) staff.emergency_contact = emergency_contact;
      if (staff_type) staff.staff_type = staff_type;
      if (designation) staff.designation = designation;
      if (qualifications) staff.qualifications = qualifications;
      if (employment_nature) staff.employment_nature = employment_nature;
      if (employment_place) staff.employment_place = employment_place;
      if (doj) staff.doj = doj;
      if (experience_years) staff.experience_years = experience_years;
      if (work_email) staff.work_email = work_email;
      if (aadhar_no) staff.aadhar_no = aadhar_no;
      if (notes) staff.notes = notes;
  
      await staff.save({ transaction });
      await transaction.commit();
  
      return res.status(200).json({
        status: 'success',
        message: 'Staff updated successfully',
        data: staff
      });
  
    } catch (error) {
      if (transaction) await transaction.rollback();
      console.error('Error updating staff details:', error);
      return res.status(500).json({
        message: 'Error updating staff details',
        error: error.message
      });
    }
};


export const updateStaffAddress = async (req, res) => {
  const { staff_id } = req.params;
  const { addressType } = req.query;
  const { door_no, street, area, city, district, state, country, pin_code, present_address_type } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const staff = await StaffDetails.findByPk(staff_id, {
      include: [{ model: StaffAddress, as: 'permanentAddress' }, { model: StaffAddress, as: 'presentAddress' }]
    });

    if (!staff) {
      return res.status(404).json({ message: `Staff with id ${staff_id} not found.` });
    }

    let addressId = null;
    if (addressType === 'permanent') {
      addressId = staff.permanent_address_id;
    } else if (addressType === 'present') {
      addressId = staff.present_address_id;
    } else {
      return res.status(400).json({ message: 'Invalid address type. Use "permanent" or "present".' });
    }

    const address = await StaffAddress.findByPk(addressId);

    if (!address) {
      return res.status(404).json({ message: `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address for staff with id ${staff_id} not found.` });
    }

    if (addressType === 'present' && present_address_type) {
      if (present_address_type === 'hostel') {
        address.door_no = null;
        address.street = null;
        address.area = null;
        address.district = null;
        address.city = null;
        address.state = null;
        address.country = null;
        address.pin_code = null;

      } else if (present_address_type === 'outside') {
        
        if(door_no) address.door_no = door_no;
        if(street) address.street = street;
        if(area) address.area = area;
        if(city) address.city = city;
        if(district) address.district = district;
        if(state) address.state = state;
        if(country) address.country = country;
        if(pin_code) address.pin_code = pin_code;
      }

      if (staff.present_address_type !== present_address_type) {
        staff.present_address_type = present_address_type;
        await staff.save({ transaction });
      }
    } else {
      
      if(door_no) address.door_no = door_no;
      if(street) address.street = street;
      if(area) address.area = area;
      if(city) address.city = city;
      if(district) address.district = district;
      if(state) address.state = state;
      if(country) address.country = country;
      if(pin_code) address.pin_code = pin_code;
    }

    await address.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      status: 'success',
      message: `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} address updated successfully`,
      data: address
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error updating address:', error);
    res.status(500).json({
      message: 'Error updating address',
      error: error.message
    });
  }
};


export const deleteStaff = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params; 

    const staff = await StaffDetails.findOne({
      where: { id },
      include: [
        { model: User, as: 'user' },
        { model: StaffAddress, as: 'permanentAddress' },
        { model: StaffAddress, as: 'presentAddress' }
      ],
      transaction
    });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const { user, permanentAddress, presentAddress } = staff;

    await staff.destroy({ transaction });

    if (permanentAddress) {
      await permanentAddress.destroy({ transaction });
    }

    if (presentAddress) {
      await presentAddress.destroy({ transaction });
    }

    if (user) {
      await user.destroy({ transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: 'Staff and associated data deleted successfully' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Error deleting staff', error: err.message });
  }
};


export const createStaffFromExcel = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const sheets = req.data;

    const staffData = sheets['Staff Details'].map(row => ({
      user: {
        userId: row['Staff ID'],
        role_id: 3,
        pass: 'pass123',
        user_type: 'staff',
      },
      staffDetails: {
        staff_id: row['Staff ID'],
        univ_id: row['University ID'],
        name: row['Full Name'],
        short_name: row['Short Name'],
        salutation: row['Salutation'],
        photo: row['Photo URL'],
        gender: row['Gender'],
        dob: row['Date of Birth'],
        mobile_number: row['Mobile Number'],
        email: row['Email'],
        emergency_contact: row['Emergency Contact'],
        marital_status: row['Marital Status'],
        medical_remarks: row['Medical Remarks'],
        blood_group: row['Blood Group'],
        religion: row['Religion'],
        staff_type: row['Staff Type'],
        designation: row['Designation'],
        qualifications: row['Qualifications'],
        employment_nature: row['Nature of Employment'],
        employment_place: row['Place of Employment'],
        doj: row['Date of Joining'],
        experience_years: row['Years of Experience'],
        work_email: row['Work Email'],
        aadhar_no: row['Aadhar Number'],
        notes: row['Notes'],
      },
    }));

    const permanentAddresses = sheets['Permanent Address'].map(row => ({
      staff_id: row['Staff ID'],
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
      staff_id: row['Staff ID'],
      address_type: 'present',
      present_address_type: row['Present Address Type'],
      door_no: row['Door Number'],
      street: row['Street'],
      area: row['Area'],
      city: row['City'],
      district: row['District'],
      state: row['State'],
      country: row['Country'],
      pin_code: row['Pin Code'],
    }));

    const createdStaff = [];
    const errors = [];

    for (const staff of staffData) {
      const { user, staffDetails } = staff;

      if (!staffDetails.staff_id) {
        errors.push({ message: 'Staff ID is required.' });
        continue;
      }

      const existingUser = await User.findOne({ where: { userId: staffDetails.staff_id }, transaction });
      if (existingUser) {
        errors.push({ staff_id: staffDetails.staff_id, message: 'Staff ID already exists.' });
        continue;
      }

      const permanentAddress = permanentAddresses.find(addr => addr.staff_id === staffDetails.staff_id);
      const presentAddress = presentAddresses.find(addr => addr.staff_id === staffDetails.staff_id);

      const hashedPassword = await bcrypt.hash(user.pass, 10);

      const userEntry = await User.create({ ...user, pass: hashedPassword }, { transaction });

      const permanentAddressEntry = await StaffAddress.create(permanentAddress, { transaction });

      const presentAddressEntry = await StaffAddress.create(presentAddress, { transaction });

      const newStaffDetails = await StaffDetails.create(
        {
          ...staffDetails,
          present_address_type: presentAddress.present_address_type,
          user_id: userEntry.id,
          permanent_address_id: permanentAddressEntry.id,
          present_address_id: presentAddressEntry.id,
        },
        { transaction }
      );

      createdStaff.push(newStaffDetails);
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Some records failed to register.', errors });
    }

    await transaction.commit();

    return res.status(201).json({
      status: 'success',
      message: `${createdStaff.length} Staff members created successfully`,
      data: createdStaff,
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 'error',
      message: 'Error creating staff members',
      error: error.message,
    });
  }
};
