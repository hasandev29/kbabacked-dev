import { Subject, Classroom, StaffDetails } from "../../models/index.js";

export const createSubject = async (req, res) => {
    try {

        const { code, name, short_name, credits, univ_credits, term, sem, book_name, classroom_id, 
            course_staff_id, handling_staff_id, desc } = req.body;

        if (!code || !name) {
            return res.status(400).json({ message: 'Code and name are required' });
        } else {
          const existingCode = await Subject.findOne({ where: { code: code } });
          const existingName = await Subject.findOne({ where: { name: name } });
          const classroom = await Classroom.findByPk(classroom_id);
  
          if (existingCode) {
            return res.status(409).json({ message: `Subject with code '${code}' already exists` });
          }
  
          if (existingName) {
            return res.status(409).json({ message: `Subject with name '${name}' already exists` });
          }
  
          if (!classroom) {
            return res.status(404).json({ message: `Classroom with id '${classroom_id}' does not exist` });
          }
        }

        const subject = await Subject.create({ 
            code, name, short_name, book_name, credits, univ_credits, term, sem, classroom_id, 
            course_staff_id, handling_staff_id, desc });

        return res.status(201).json({ 
          staus: 'success',
          message: 'Subject created successfully', 
          data: subject });

    } catch (error) {
        console.error("Error creating subject:", error);
        return res.status(500).json({
          message: "An error occurred while creating the subject.",
          error: error.message
        });
    }
};


export const createBulkSubjects = async (req, res) => {
  try {
    const subjects = req.body;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of subjects' });
    };

    const errors = [];
    const newSubjects = [];

    for (const subject of subjects) {
      if (!subject.code || !subject.name || !subject.classroom_id) {
        errors.push('Code, name and classroom_id are required for each subject');
      } else {
        const existingCode = await Subject.findOne({ where: { code: subject.code } });
        const existingName = await Subject.findOne({ where: { name: subject.name } });

        if (existingCode) {
          errors.push(`Subject with code "${subject.code}" already exists`);
        }

        if (existingName) {
          errors.push(`Subject with name "${subject.name}" already exists`);
        }

        if (!existingCode && !existingName) {
          newSubjects.push(subject);
        }
      }
    };

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: errors });
    };

    const createdSubjects = await Subject.bulkCreate(newSubjects, { returning: true });

    res.status(201).json({
      status: 'success',
      message: `Subjects created successfully!`,
      total: createdSubjects.length,
      subjects: createdSubjects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'failed',
      message: 'An error occurred while creating the subjects',
      error: error.message || error
    });
  }
};


export const getAllSubjects = async (req, res) => {
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
      filters.sem = req.query.sem;
    }

    if (req.query.classroom_id) {
      filters.classroom_id = req.query.classroom_id;
    }

    const subjects = await Subject.findAll({
      limit, offset,
      where: filters,
      include: [
        { model: Classroom, as: 'classroom', attributes: ['name'] },
        { model: StaffDetails, as: 'handlingStaff', attributes: ['short_name'] },
      ],
      attributes: { exclude: ['classroom_id', 'course_staff_id', 'handling_staff_id', 'book_name', 'univ_credits', 'desc', 'createdAt', 'updatedAt'] }
    });

    const subjectsCount = await Subject.count({ where: filters });

    return res.status(200).json({ 
      status: 'success',
      message: 'Subjects retrieved successfully',
      total: subjectsCount,
      data: subjects });

  } catch (error) {
    console.error('Error retrieving subjects:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'An error occurred while retrieving subjects',
      error: error.message
    });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id, {
      include: [
        { model: Classroom, as: 'classroom', attributes: ['id', 'name'] },
        { model: StaffDetails, as: 'courseStaff', attributes: ['id', 'name', 'short_name', 'staff_id'] },
        { model: StaffDetails, as: 'handlingStaff', attributes: ['id', 'name', 'short_name', 'staff_id'] },
      ],
      attributes: { exclude: ['classroom_id', 'course_staff_id', 'handling_staff_id'] }
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    return res.status(200).json({ 
      status: 'success',
      message: 'Subject retrieved successfully', 
      data: subject });
    
  } catch (error) {
    console.error('Error retrieving subject:', error);
    return res.status(500).json({
      message: 'An error occurred while retrieving the subject',
      error: error.message
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, short_name, credits, univ_credits, term, sem, book_name, classroom_id, 
        course_staff_id, handling_staff_id, desc, isActive } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (code) subject.code = code;
    if (name) subject.name = name;
    if (short_name) subject.short_name = short_name;
    if (credits) subject.credits = credits;
    if (univ_credits) subject.univ_credits = univ_credits;
    if (term) subject.term = term;
    if (sem) subject.sem = sem;
    if (book_name) subject.book_name = book_name;
    if (classroom_id) subject.classroom_id = classroom_id;
    if (course_staff_id) subject.course_staff_id = course_staff_id;
    if (handling_staff_id) subject.handling_staff_id = handling_staff_id;
    if (desc) subject.desc = desc;
    if (isActive !== undefined  ) subject.isActive = isActive;

    await subject.save();

    return res.status(200).json({ message: 'Subject updated successfully', data: subject });

  } catch (error) {
    console.error('Error updating subject:', error);
    return res.status(500).json({
      message: 'An error occurred while updating the subject',
      error: error.message
    });
  }
};

export const deleteSubject = async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await subject.destroy();
      return res.status(200).json({ 
        staus: 'success', 
        message: 'Subject deleted successfully' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      return res.status(500).json({
        message: 'An error occurred while deleting the subject',
        error: error.message
      });
    }
  };