const express = require('express');
const app = express();
const mentorRoutes = require('./routes/mentorRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api/requests', requestRoutes);

app.use(express.json());

app.use('/api/mentors', mentorRoutes);

app.get('/', (req, res) => {
  res.send('Mentor-Mentee Platform API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});