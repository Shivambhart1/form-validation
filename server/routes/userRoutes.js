const express = require('express');
const multer = require('multer');
const path = require('fs');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const db = mongoose.connection

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    mimetype && extname ? cb(null, true) : cb('Images only!');
  }
});

router.get('/check-username/:username', async (req, res) => {
  try {
    const exists = await User.findOne({ username: req.params.username });
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ error: 'Error checking username' });
  }
});

router.get('/countries', async (req, res) => {
  try {
    const countries = await db.collection('countries').find().toArray();
    console.log(countries)
    res.json(countries)
  } catch(err) {
    res.status(500).json({ error: 'Error fetching countries' });
  }
})

router.get('/states/:country', async (req, res) => {
  try {
    const countryName = req.params.country;
    const collection = db.collection('countries');
    const country = await collection.findOne({ name: countryName });

    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({ states: country.states });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching states' });
  }
});

router.post('/save', upload.single('profilePhoto'), async (req, res) => {
  try {
    const userData = {
      ...req.body,
      profilePhoto: req.file?.filename,
      newsletter: req.body.newsletter === 'true',
      dob: new Date(req.body.dob)
    };

    if (req.body.newPassword) {
      if (req.body.currentPassword !== 'valid_current_password') { check
        return res.status(400).json({ error: 'Current password invalid' });
      }
    }

    const user = new User(userData);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;