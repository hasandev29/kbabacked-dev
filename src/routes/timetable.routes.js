import express from 'express';

import { createTimetableEntry,
    createTimetableFormat, getAllTimetableFormats, getTimetableFormat, getTimetableFormatsList,
    
    addEntry, getTimetableList, getTimetableEntries, deleteEntry
 } from '../controllers/timetable.controller.js';

const router = express.Router();


router.post('/format', createTimetableFormat);

router.get('/formats', getAllTimetableFormats);

router.get('/format/:formatId', getTimetableFormat);

router.get('/formats/list', getTimetableFormatsList);

// * Timetable

router.get('/list', getTimetableList);

router.get('/entries/:id', getTimetableEntries);

router.post('/entry', addEntry);

router.post('/entries', createTimetableEntry);

router.delete('/entry/:entryId', deleteEntry);

export default router;