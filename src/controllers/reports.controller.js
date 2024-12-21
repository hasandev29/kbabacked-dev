import { Op } from 'sequelize';
import { StudentDetails, AcademicDetails, FamilyDetails, AdmissionDetails, StudentAddress, StudentQualifications } from '../models/index.js';

export const getReport = async (req, res) => {
    try {
        const students = await StudentDetails.findAll();
        res.status(200).json({ data: students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchStudents = async (req, res) => {
  try {
    const { filters } = req.body;
    
    console.log(filters);

    const whereConditions = {};
    const includeConditions = [];

    filters.map(filter => {
      const { module, field, comparator, value } = filter;

      
    })

    // filters.forEach(filter => {
    //   const { module, field, comparator, value } = filter;

    //   const condition = {};
    //   switch (comparator) {
    //     case 'is':
    //       condition[field] = value;
    //       break;
    //     case 'starts with':
    //       condition[field] = { [Op.startsWith]: value };
    //       break;
    //     case 'ends with':
    //       condition[field] = { [Op.endsWith]: value };
    //       break;
    //     case 'contains':
    //       condition[field] = { [Op.substring]: value };
    //       break;
    //     case '>':
    //       condition[field] = { [Op.gt]: value };
    //       break;
    //     case '<':
    //       condition[field] = { [Op.lt]: value };
    //       break;
    //     case '=':
    //       condition[field] = value;
    //       break;
    //   }

    //   console.log("whereConditions", whereConditions);
    //   console.log("condition", condition);
    //   console.log("module", module);

    //   // Add conditions to appropriate module
    //   if (module === 'student') {
    //     // Object.assign(whereConditions, condition);
    //   } else {
    //     // includeConditions.push({
    //     //   model: getModelByName(module),
    //     //   where: condition,
    //     // });
    //   }
    // });



    const students = await StudentDetails.findAll({
      where: { gender: 'Male' },
      include: [
        { model: AcademicDetails, as: 'academicDetails' },
      ],
    });

    res.status(200).json({ data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getModelByName = (name) => {
  switch (name) {
    case 'academic':
      return AcademicDetails;
    case 'admission':
      return AdmissionDetails;
    case 'address':
      return StudentAddress;
    default:
      throw new Error('Invalid module');
  }
};
