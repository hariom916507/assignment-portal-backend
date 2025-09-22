require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// connect db
connectDB();

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/submissions', require('./routes/submission.routes'));

// basic health
app.get('/', (req, res) => res.send('Assignment Portal API'));

// error handling (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
