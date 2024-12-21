import Course from "../../models/Academic/Course.model.js";

export const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 25;
        const offset = (page - 1) * perPage;
        const limit = perPage;

        const courses = await Course.findAll({ limit, offset });

        res.status(200).json({
            status: "success",
            message: "Courses fetched successfully",
            total: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourseList = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const perPage = parseInt(req.query.per_page, 10) || 25;
        const offset = (page - 1) * perPage;
        const limit = perPage;

        const courses = await Course.findAll({
            limit, offset,
            attributes: ['id', 'name', 'current_term']
        });
        res.status(200).json({
            status: "success",
            message: "Courses fetched successfully",
            total: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        const course = await Course.findByPk(id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        };

        res.status(200).json({
            status: "success",
            message: "Course fetched successfully",
            data: course
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createCourse = async (req, res) => {
    try {
        const { name, code, duration, desc, current_term } = req.body;
        const course = await Course.create({
            name,
            code,
            duration,
            desc,
            current_term
        });
        res.status(201).json({
            status: "success",
            message: "Course created successfully",
            data: course
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, duration, desc, current_term, isActive } = req.body;
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (name) course.name = name;
        if (code) course.code = code;
        if (duration) course.duration = duration;
        if (desc) course.desc = desc;
        if (current_term) course.current_term = current_term;
        if (isActive !== undefined) course.isActive = isActive;

        await course.save();
        res.status(200).json({
            status: "success",
            message: "Course updated successfully",
            data: course
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        await course.destroy();
        res.status(200).json({
            status: "success",
            message: "Course deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};