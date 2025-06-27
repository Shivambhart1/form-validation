const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  profilePhoto: { type: String, required: true },
  username: { 
    type: String, 
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20,
    match: /^[^\s]+$/ 
  },
  currentPassword: { type: String },
  newPassword: { 
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /[!@#$%^&*(),.?":{}|<>]/.test(v) && /\d/.test(v);
      },
      message: 'Password needs 1 special char and 1 number'
    }
  },
  profession: {
    type: String,
    enum: ['Student', 'Developer', 'Entrepreneur'],
    required: true
  },
  companyName: {
    type: String,
    required: function() { return this.profession === 'Entrepreneur'; }
  },
  address: {
    line1: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  subscriptionPlan: {
    type: String,
    enum: ['Basic', 'Pro', 'Enterprise'],
    required: true
  },
  newsletter: {
    type: Boolean,
    default: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  customGender: {
    type: String,
    required: function() { return this.gender === 'Other'; }
  },
  dob: {
    type: Date,
    required: true,
    max: Date.now()
  }
});

module.exports = mongoose.model('User', UserSchema);