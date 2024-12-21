import { Timetable, Subject, StaffDetails } from '../models/index.js';

import { Classroom, Weekdays, TimePeriod, TimetableFormat, TimetableEntry } from '../models/index.js';

export const createTimetableFormat = async (req, res) => {
  try {
    const { formatDetails, weekdays, timePeriods } = req.body;

    if ( !formatDetails.name ) {
      return res.status(400).json({ error: 'Format Name in formatDetails is required' });
    }

    if (!weekdays || weekdays.length === 0) {
      return res.status(400).json({ error: 'At least one day is required' });
    }

    if (!timePeriods || timePeriods.length === 0) {
      return res.status(400).json({ error: 'At least one period is required' });
    }

    const CreatedFormat = await TimetableFormat.create({ 
      name: formatDetails.name, 
      desc: formatDetails.desc, 
    });
    
    const validDays = weekdays.map(day => ({
      order: day.order,
      day_name: day.day_name,
      isWeekend: typeof day.isWeekend === 'boolean' ? day.isWeekend : false,
      format_id: CreatedFormat.id
    }));

    const createdDays = await Weekdays.bulkCreate(validDays);

    const validPeriods = timePeriods.map(period => ({
      order: period.order,
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      format_id: CreatedFormat.id
    }));

    const createdPeriods = await TimePeriod.bulkCreate(validPeriods);

    res.status(201).json({
      status: 'success',
      message: 'Timetable format created successfully.',
      data: {
        formatDetails: CreatedFormat,
        weekdays: createdDays,
        timePeriods: createdPeriods
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTimetableFormat = async (req, res) => {
  const { formatId } = req.params;
  try {
    if (!formatId) {
      return res.status(400).json({ error: 'Template ID is required' });
    }
    const format = await TimetableFormat.findByPk(formatId);

    if (!format) {
      return res.status(404).json({ error: 'Format not found' });
    }

    const days = await Weekdays.findAll({ where: { format_id: formatId }, order: [['order', 'ASC']] });
    const periods = await TimePeriod.findAll({ where: { format_id: formatId }, order: [['order', 'ASC']] });

    res.status(200).json({
      status: 'success',
      message: 'Format fetched successfully.',
      data: {
        formatDetails: format,
        weekdays: days,
        timePeriods: periods
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTimetableFormats = async (req, res) => {
  try {
    const formats = await TimetableFormat.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Timetable Formats fetched successfully.',
      total: formats.length,
      data: formats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTimetableFormatsList = async (req, res) => {
  try {
    const formats = await TimetableFormat.findAll({
      attributes: ['id', 'name', 'desc', 'isActive']
    });
    res.status(200).json({
      status: 'success',
      message: 'Timetable Formats fetched successfully.',
      total: formats.length,
      data: formats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getTimetableList = async (req, res) => {
  try {
    const timetables = await Timetable.findAll({
      attributes: ['id', 'name', 'classroom_id', 'term', 'sem', 'version', 'format_id']
    });
    res.status(200).json({
      status: 'success',
      message: 'Timetables fetched successfully.',
      total: timetables.length,
      data: timetables
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const addEntry = async (req, res) => {
  try {
    const { timetable_id, weekdays_id, timePeriod_id, subject_id } = req.body;

    if (!timetable_id || !weekdays_id || !timePeriod_id || !subject_id) {
      return res.status(400).json({ error: 'All fields are required' });
    };

    const existTimetable = await Timetable.findByPk(timetable_id);
    const weekdays = await Weekdays.findByPk(weekdays_id);
    const timePeriod = await TimePeriod.findByPk(timePeriod_id);
    const subject = await Subject.findByPk(subject_id);

    if (!existTimetable) {
      return res.status(404).json({ error: `Timetable not found: ${timetable_id}` });
    }
    if (!weekdays) {
      return res.status(404).json({ error: `Weekdays not found: ${weekdays_id}` });
    }
    if (!timePeriod) {
      return res.status(404).json({ error: `TimePeriod not found: ${timePeriod_id}` });
    }
    if (!subject) {
      return res.status(404).json({ error: `Subject not found: ${subject_id}` });
    }

    const createdEntry = await TimetableEntry.create({
      timetable_id,
      weekdays_id,
      timePeriod_id,
      subject_id
    });

    res.status(201).json({
      status: 'success',
      message: 'Entry added successfully.',
      data: createdEntry
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createTimetableEntry = async (req, res) => {
  try {
    const { timetableDetails, entries } = req.body;

    if (!timetableDetails.name || !timetableDetails.term || !timetableDetails.sem || 
      !timetableDetails.version || !timetableDetails.classroom_id || !timetableDetails.format_id) {
      return res.status(400).json({ error: 'All fields in timetableDetails are required' });
    }

    const classroom = await Classroom.findByPk(timetableDetails.classroom_id);
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const timetableFormat = await TimetableFormat.findByPk(timetableDetails.format_id);
    if (!timetableFormat) {
      return res.status(404).json({ error: 'Timetable format not found' });
    }

    if (!entries || entries.length === 0) {
      return res.status(400).json({ error: 'At least one timetable entry is required' });
    }

    const createdTimetable = await Timetable.create({
      name: timetableDetails.name,
      term: timetableDetails.term,
      sem: timetableDetails.sem,
      version: timetableDetails.version,
      effective_from: timetableDetails.effective_from,
      classroom_id: timetableDetails.classroom_id,
      format_id: timetableDetails.format_id
    });

    const validEntries = await Promise.all(entries.map(async (entry) => {
      if (!entry.weekdays_id || !entry.timePeriod_id || !entry.subject_id) {
        throw new Error('Each timetable entry must have weekdays_id, timePeriod_id, and subject_id');
      }

      const weekdays = await Weekdays.findByPk(entry.weekdays_id);
      const timePeriod = await TimePeriod.findByPk(entry.timePeriod_id);
      const subject = await Subject.findByPk(entry.subject_id);

      if (!weekdays) {
        throw new Error(`Invalid weekdays_id: ${entry.weekdays_id}`);
      }
      if (!timePeriod) {
        throw new Error(`Invalid timePeriod_id: ${entry.timePeriod_id}`);
      }
      if (!subject) {
        throw new Error(`Invalid subject_id: ${entry.subject_id}`);
      }

      return {
        timetable_id: createdTimetable.id,
        weekdays_id: entry.weekdays_id,
        timePeriod_id: entry.timePeriod_id,
        subject_id: entry.subject_id,
      };
    }));

    const createdEntries = await TimetableEntry.bulkCreate(validEntries);

    res.status(201).json({
      status: 'success',
      message: 'Timetable and entries created successfully.',
      data: {
        timetableDetails: createdTimetable,
        entries: createdEntries,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTimetableEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const timetable = await Timetable.findByPk(id, {
      include: [
        { model: Classroom, as: 'classroom', attributes: ['id', 'name'] },
      ],
      attributes: { exclude: ['classroom_id'] }

    });
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' });
    }

    const formatId = timetable.format_id;

    const days = await Weekdays.findAll({ where: { format_id: formatId }, order: [['order', 'ASC']] });
    const periods = await TimePeriod.findAll({ where: { format_id: formatId }, order: [['order', 'ASC']] });


    const entries = await TimetableEntry.findAll({ 
      where: { timetable_id: id },
      include: [
        { model: Subject, as: 'subject',
          include: [
            { model: StaffDetails, as: 'handlingStaff', attributes: ['id', 'name', 'short_name', 'staff_id'] }
          ]
         },
      ]
    });

    if (entries.length === 0) {
      return res.status(404).json({ error: 'No entries found for the timetable' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Timetable entries fetched successfully.',
      totalEntries: entries.length,
      data: {
        timetableDetails: timetable,
        format: {
          weekdays: days,
          timePeriods: periods
        },
        entries,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteEntry = async (req, res) => {
  const { entryId } = req.params;
  try {
    const entry = await TimetableEntry.findByPk(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    await entry.destroy();
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};