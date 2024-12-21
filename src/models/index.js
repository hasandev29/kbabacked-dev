import User from './user/User.model.js';
import Role from './Roles.model.js';
import Classroom from './Academic/Classroom.model.js';
import Subject from './Academic/Subject.model.js';

import StaffDetails from './user/Staff_details.model.js';
import StaffAddress from './Staff/Staff_address.model.js';

import StudentDetails from './user/Student_details.model.js';

import AcademicDetails from './Student/Academic_details.model.js';
import FamilyDetails from './Student/Family_details.model.js';
import AdmissionDetails from './Student/Admission_details.model.js';
import StudentAddress from './Student/Student_address.model.js';
import StudentQualifications from './Student/Student_qualifications.model.js';
import Timetable from './Timetable/Timetable.model.js';
import Course from './Academic/Course.model.js';

// Timetable
import Weekdays from './Timetable/Format/Weekdays.model.js';
import TimePeriod from './Timetable/Format/Timeperiod.model.js';
import TimetableFormat from './Timetable/Format/TimetableFormat.model.js';
import TimetableEntry from './Timetable/TimetableEntry.model.js';

export { User, Role, Classroom, Subject, StaffDetails, StaffAddress, StudentDetails, 
    AcademicDetails, FamilyDetails, AdmissionDetails, StudentAddress, 
    StudentQualifications, Timetable, Course,

    Weekdays, TimePeriod, TimetableFormat, TimetableEntry };