const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());          // frontend ko backend se baat karne deta hai
app.use(express.json());  // JSON data ko samajhne ke liye

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Test route — check karne ke liye ki server chal raha hai
app.get('/', (req, res) => {
  res.send('Job Tracker API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));