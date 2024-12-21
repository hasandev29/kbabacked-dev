import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
});


async function initializeDb() {
  try {

    await sequelize.authenticate()
    .then(() => console.log('Connected to MySQL database using Sequelize.'))
    .catch((err) => console.error('Unable to connect to the database:', err));


    // console.log("Tables updating...");
    // await sequelize.sync({ alter: true })
    //   .then(() => console.log('Database & tables created or updated!'))
    //   .catch((error) => console.error('Error creating or updating database & tables:', error));

    // console.log("Tables updating...");
    // sequelize.sync({ force: true })
    //   .then(() => console.log('Database & tables created or updated!'))
    //   .catch((error) => console.error('Error creating or updating database & tables:', error));
  
  } catch (error) {
    console.error('Error creating database & tables:', error);
  }
}

initializeDb();

// console.log("Tables updating...");
// sequelize.sync({ alter: true })
//   .then(() => console.log('Database & tables created or updated!'))
//   .catch((error) => console.error('Error creating or updating database & tables:', error));

// console.log("Tables updating...");
// sequelize.sync({ force: true })
//   .then(() => console.log('Database & tables created or updated!'))
//   .catch((error) => console.error('Error creating or updating database & tables:', error));

// sequelize.authenticate()
//   .then(() => {
//     console.log('Connected to MySQL database using Sequelize.');
//     return sequelize.sync({ alter: true });
//   })
//   .then(() => console.log('Database & tables created or updated!'))
//   .catch((error) => console.error('Error connecting or syncing database:', error));

export default sequelize;
