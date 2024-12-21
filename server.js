import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import sequelize from './src/config/db.js';
import { authRoutes, userRoutes, roleRoutes, classroomRoutes, subjectRoutes, staffRoutes, 
  studentRoutes, importRoutes, exportRoutes, communicationRoutes, imageurlRoutes, 
  excelRoutes, reportRoutes, timetableRoutes, courseRoutes } from './src/routes/index.js';


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// app.use((req, res, next) => {
//   const userAgent = req.headers['user-agent'] || '';
//   if (userAgent.includes('Mozilla')) {
//     console.log('Request from a browser:', userAgent);
//     next();
//   } else {
//     console.log('Request from non-browser client:', userAgent);
//     res.status(403).send('Access denied. Not from a browser.');
//   }
// });

app.get('/', (req, res) => {
    res.send('This is the root endpoint');
});

app.use('/excel', excelRoutes);

app.use('/imageurl', imageurlRoutes);

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.use('/roles', roleRoutes);
app.use('/classroom', classroomRoutes);
app.use('/subjects', subjectRoutes);

app.use('/staff', staffRoutes);
app.use('/students', studentRoutes);

app.use('/timetable', timetableRoutes);

app.use('/import', importRoutes);
app.use('/export', exportRoutes);

app.use('/send', communicationRoutes);

app.use('/report', reportRoutes);

app.use('/courses', courseRoutes);

sequelize.authenticate()

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});