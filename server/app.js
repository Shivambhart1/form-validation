const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://form-validation-pearl-three.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

mongoose.connect('mongodb+srv://admin-shivam:psych0boyy@event-management.jdroe.mongodb.net/FormData')
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Form Validation API');
});

app.listen(5000, () => console.log('Server running on port 5000'));