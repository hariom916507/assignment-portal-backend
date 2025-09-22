require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB(process.env.MONGO_URI);
//   await User.deleteMany({});
  await User.create({ name: 'Teacher One', email: 'teacher@example.com', password: 'password123', role: 'teacher' });
  await User.create({ name: 'Student One', email: 'student@example.com', password: 'password123', role: 'student' });
  console.log('seed done');
  process.exit(0);
};

run();
