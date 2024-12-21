import { Classroom, StaffDetails, StudentDetails, Course } from "../../models/index.js";


// export const createClassroom = async (req, res) => {
//   const { name, course_id, advisor_id, leader_id, room_no, term, semester, batch } = req.body;

//   try {
//     if (!name || !course_id || !term) {
//       return res.status(400).json({ message: 'Classroom name, course ID, and term are required' });
//     }

//     const course = await Course.findByPk(course_id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     const validationPromises = [];

//     if (advisor_id) {
//       validationPromises.push(StaffDetails.findByPk(advisor_id));
//     }
//     if (leader_id) {
//       validationPromises.push(StudentDetails.findByPk(leader_id));
//     }

//     const [staff, student] = await Promise.all(validationPromises);

//     if (advisor_id && !staff) {
//       return res.status(404).json({ message: 'Advisor not found' });
//     }

//     if (leader_id && !student) {
//       return res.status(404).json({ message: 'Leader not found' });
//     }

//     const existingClass = await Classroom.findOne({ where: { name } });
//     if (existingClass) {
//       return res.status(409).json({ message: 'Classroom with this name already exists' });
//     }

//     const newClass = await Classroom.create({
//       name,
//       room_no,
//       term,
//       semester,
//       batch,
//       course_id,
//       advisor_id,
//       leader_id,
//     });

//     return res.status(201).json({
//       status: 'success',
//       message: 'New Classroom created successfully!',
//       data: newClass
//     });
//   } catch (error) {
//     console.error('Error in creating classroom:', error);
//     return res.status(500).json({
//       message: 'An error occurred while creating the Classroom',
//       error: error.message || error
//     });
//   }
// };


export const createClassroom = async (req, res) => {
    try {
      const request = req.body;
  
      if (!request.name) {
        return res.status(400).json({ message: 'Classroom name is required' });
      }

      if (!request.course_id) {
        return res.status(400).json({ message: 'Course ID is required' });
      }

      const course = await Course.findByPk(request.course_id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      if (request.advisor_id) {
        const staff = await StaffDetails.findByPk(request.advisor_id);
        if (!staff) {
          return res.status(404).json({ message: 'Advisor not found' });
        }
      }

      if (request.leader_id) {
        const student = await StudentDetails.findByPk(request.leader_id);
        if (!student) {
          return res.status(404).json({ message: 'Leader not found' });
        }
      }
  
      const existingClass = await Classroom.findOne({ where: { name: request.name } });
      if (existingClass) {
        return res.json({ message: 'This Classroom name already exists' });
      }
  
      const newClass = await Classroom.create({
        name: request.name,
        room_no: request.room_no,
        term: request.term,
        semester: request.semester,
        batch: request.batch,
        course_id: request.course_id,
        advisor_id: request.advisor_id,
        leader_id: request.leader_id
      });

      res.status(201).json({
        status: 'success',
        message: `Classroom created successfully!`,
        data: newClass
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'An error occurred while creating the Classroom',
        error: error
      });
    }
};

export const createBulkClassrooms = async (req, res) => {
  try {
    const classrooms = req.body;

    if (!Array.isArray(classrooms) || classrooms.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of classrooms' });
    }

    const errors = [];
    const newClassrooms = [];

    for (const classroom of classrooms) {
      if (!classroom.name || !classroom.term) {
        errors.push('Classroom name and term are required for each classroom');
      } else {
        const existingClass = await Classroom.findOne({ where: { name: classroom.name } });
        if (existingClass) {
          errors.push(`Classroom with name "${classroom.name}" already exists`);
        } else {
          newClassrooms.push(classroom);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: errors });
    }

    const createdClassrooms = await Classroom.bulkCreate(newClassrooms, { returning: true });

    res.status(201).json({
      status: 'success',
      message: `Classes created successfully!`,
      total: createdClassrooms.length,
      classes: createdClassrooms
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failed',
      message: 'An error occurred while creating the classrooms',
      error: error.message || error
    });
  }
};

export const getAllClassrooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const filters = {};

    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    }
    
    if (req.query.term) {
      filters.term = req.query.term;
    }

    if (req.query.sem) {
      filters.semester = req.query.sem;
    }

    if (req.query.batch) {
      filters.batch = req.query.batch;
    }

    if (req.query.course_id) {
      filters.course_id = req.query.course_id;
    }

    const classrooms = await Classroom.findAll({
      limit, offset,
      where: filters,
      include: [
        { model: StaffDetails, as: 'advisor', attributes: ['id', 'name', 'short_name', 'photo'] },
        { model: StudentDetails, as: 'leader', attributes: ['id', 'name', 'photo'] },
        { model: Course, as: 'course', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['advisor_id', 'leader_id', 'course_id'] }
    });

    const classroomsWithStrength = await Promise.all(classrooms.map(async (classroom) => {
      const studentCount = await StudentDetails.count({
        where: { classroom_id: classroom.id }
      });
      return {
        ...classroom.toJSON(),
        strength: studentCount
      };
    }));

    const classStrength = await Classroom.count({ where: filters });

    res.status(200).json({
      status: 'success',
      message: 'Fetched classrooms successfully!',
      total: classStrength,
      data: classroomsWithStrength
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all classrooms', error: error.message });
  }
};

export const getClassroomList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 25;
    const offset = (page - 1) * perPage;
    const limit = perPage;

    const filters = {};

    if (req.query.isActive !== undefined) {
      filters.isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    }
    
    if (req.query.term) {
      filters.term = req.query.term;
    }

    if (req.query.sem) {
      filters.semester = req.query.sem;
    }

    if (req.query.batch) {
      filters.batch = req.query.batch;
    }

    if (req.query.course_id) {
      filters.course_id = req.query.course_id;
    }

    const classrooms = await Classroom.findAll({
      limit, offset,
      where: filters,
      attributes: ['id', 'name']
    });

    const classTotal = await Classroom.count({ where: filters });

    res.status(200).json({
      status: 'success',
      message: 'Fetched classrooms List successfully!',
      total: classTotal,
      data: classrooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching classroom list', error: error.message });
  }
}


export const getClassroomById = async (req, res) => {
  const { id } = req.params;

  try {
    const classroom = await Classroom.findByPk(id, {
      include: [
        { model: StaffDetails, as: 'advisor', attributes: ['id', 'name', 'short_name', 'photo'] },
        { model: StudentDetails, as: 'leader', attributes: ['id', 'name','photo'] },
        { model: Course, as: 'course', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['advisor_id', 'leader_id', 'course_id'] }
    });

    if (!classroom) {
      return res.status(404).json({ message: `Classroom with id ${id} not found.` });
    };

    const students = await StudentDetails.findAll({
      where: { classroom_id: id },
    });
    
    
    res.status(200).json({
      status: 'success',
      message: 'Class fetched successfully',
      data: {...classroom.toJSON(), strength: students.length}
    });

  } catch (error) {
    console.error('Error fetching classroom:', error);
    res.status(500).json({
      message: 'Error fetching classroom',
      error: error.message
    });
  }
};


export const updateClassroom = async (req, res) => {
  const { id } = req.params;
  const { name, room_no, term, semester, batch, course, isActive, advisor_id, leader_id } = req.body;

  try {
    const classroom = await Classroom.findByPk(id);

    if (!classroom) {
      return res.status(404).json({ message: `Classroom with id ${id} not found.` });
    };

    if (name) classroom.name = name;
    if (room_no) classroom.room_no = room_no;
    if (term) classroom.term = term;
    if (semester) classroom.semester = semester;
    if (batch) classroom.batch = batch;
    if (course) classroom.course = course;
    if (isActive !== undefined) classroom.isActive = isActive;
    if (advisor_id) classroom.advisor_id = advisor_id;
    if (leader_id) classroom.leader_id = leader_id;

    if (advisor_id) {
      const staff = await StaffDetails.findByPk(advisor_id);
      if (!staff) {
        return res.status(404).json({ message: `Staff with id ${advisor_id} not found for advisor.` });
      }
      classroom.advisor_id = advisor_id;
    }

    if (leader_id) {
      const student = await StudentDetails.findByPk(leader_id);
      if (!student) {
        return res.status(404).json({ message: `Student with id ${leader_id} not found for leader.` });
      }
      classroom.leader_id = leader_id;
    }

    await classroom.save();

    res.status(200).json({
      status: 'success',
      message: 'Classroom updated successfully',
      data: classroom
    });

  } catch (error) {
    console.error('Error updating classroom:', error);
    res.status(500).json({
      message: 'Error updating classroom',
      error: error.message
    });
  }
};


export const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findByPk(id);

    if (!classroom) {
      return res.status(404).json({ message: 'classroom not found' });
    }

    await classroom.destroy();

    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    console.error('Error deleting classroom:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the classroom',
      error: error.message,
    });
  }
};