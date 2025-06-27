import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profilePhoto: null,
    currentPassword: '',
    newPassword: '',
    username: '',
    profession: '',
    companyName: '',
    addressLine1: '',
    country: '',
    state: '',
    city: '',
    subscriptionPlan: 'Basic',
    newsletter: true,
    dob: ''
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const res = await axios.get('https://form-validation-yc2d.onrender.com/api/countries');
        setCountries(res.data); 
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    if (formData.country) {
      const countryObj = countries.find(c => c.name === formData.country);
      if (countryObj) {
        setStates(countryObj.states.map(s => s.name));
      } else {
        setStates([]);
      }
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    }
  }, [formData.country, countries]);

  useEffect(() => {
    if (formData.country && formData.state) {
      const countryObj = countries.find(c => c.name === formData.country);
      const stateObj = countryObj?.states.find(s => s.name === formData.state);
      if (stateObj) {
        setCities(stateObj.cities);
      } else {
        setCities([]);
      }
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.state, formData.country, countries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username.length >= 4) {
        checkUsernameAvailability(formData.username);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.username]);

  const checkUsernameAvailability = async (username) => {
    setIsCheckingUsername(true);
    try {
      const res = await axios.get(`https://form-validation-yc2d.onrender.com/api/check-username/${username}`);
      setUsernameAvailable(res.data.available);
    } catch (err) {
      console.error('Error checking username:', err);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ['image/jpeg', 'image/png'];
    return validTypes.includes(file.type) && file.size <= 2 * 1024 * 1024;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasSpecialChar && hasNumber;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === 'file') {
      newValue = files[0];
      if (validateFile(newValue)) {
        setFormData({ ...formData, [name]: newValue });
        setPreview(URL.createObjectURL(newValue));
        setErrors({ ...errors, [name]: '' });
      } else {
        setErrors({ ...errors, [name]: 'Invalid file type or size (>2MB)' });
      }
    } else if (type === 'checkbox') {
      newValue = checked;
      setFormData({ ...formData, [name]: newValue });
    } else {
      newValue = value;
      setFormData({ ...formData, [name]: newValue });

      if (name === 'newPassword') {
        setPasswordStrength(validatePassword(value) ? 100 : (value.length / 8) * 100);
      }
      if (name === 'username') {
        setUsernameAvailable(null);
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
      if (formData.newPassword && !formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (formData.newPassword && !validatePassword(formData.newPassword)) {
        newErrors.newPassword = 'Password must be 8+ chars, 1 special char, 1 number';
      }
      if (formData.username.length < 4) {
        newErrors.username = 'Username must be 4+ chars';
      }
      if (usernameAvailable === false) {
        newErrors.username = 'Username is already taken';
      }
    } else if (step === 2) {
      if (!formData.profession) newErrors.profession = 'Profession is required';
      if (formData.profession === 'Entrepreneur' && !formData.companyName) {
        newErrors.companyName = 'Company name is required';
      }
    } else if (step === 3) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.city) newErrors.city = 'City is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form Data:', formData);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="App">
      <h1>User Profile Update</h1>
      <div className="step-indicator">Step {step} of 3</div>
      <form onSubmit={handleSubmit} className="form-container">
        {step === 1 && (
          <div className="step-content">
            <h2>Personal Info</h2>
            <div className="form-group">
              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" onChange={handleChange} />
              {preview && <img src={preview} alt="Preview" className="preview-image" />}
              {errors.profilePhoto && <p className="error">{errors.profilePhoto}</p>}
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
              {isCheckingUsername && <p className="status">Checking...</p>}
              {usernameAvailable === true && <p className="success">Username available!</p>}
              {usernameAvailable === false && <p className="error">Username taken</p>}
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
              {errors.currentPassword && <p className="error">{errors.currentPassword}</p>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
              {errors.newPassword && <p className="error">{errors.newPassword}</p>}
              <div>Strength: <progress value={passwordStrength} max="100" /></div>
            </div>
            <button type="button" onClick={nextStep} className="next-btn">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Professional Details</h2>
            <div className="form-group">
              <label>Profession</label>
              <select name="profession" value={formData.profession} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Student">Student</option>
                <option value="Developer">Developer</option>
                <option value="Entrepreneur">Entrepreneur</option>
              </select>
              {errors.profession && <p className="error">{errors.profession}</p>}
            </div>
            {formData.profession === 'Entrepreneur' && (
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />
                {errors.companyName && <p className="error">{errors.companyName}</p>}
              </div>
            )}
            <div className="button-group">
              <button type="button" onClick={prevStep} className="prev-btn">Previous</button>
              <button type="button" onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Preferences</h2>
            <div className="form-group">
              <label>Address Line 1</label>
              <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
              {errors.addressLine1 && <p className="error">{errors.addressLine1}</p>}
            </div>
            <div className="form-group">
              <label>Country</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.name}>{country.name}</option>
                ))}
              </select>
              {errors.country && <p className="error">{errors.country}</p>}
            </div>
            {formData.country && (
              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange}>
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="error">{errors.state}</p>}
              </div>
            )}
            {formData.state && (
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="error">{errors.city}</p>}
              </div>
            )}
            <div className="form-group">
              <label>Subscription Plan</label>
              <div className="radio-group">
                {['Basic', 'Pro', 'Enterprise'].map(plan => (
                  <label key={plan}>
                    <input
                      type="radio"
                      name="subscriptionPlan"
                      value={plan}
                      checked={formData.subscriptionPlan === plan}
                      onChange={handleChange}
                    /> {plan}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                /> Subscribe to Newsletter
              </label>
            </div>
            <div className="button-group">
              <button type="button" onClick={prevStep} className="prev-btn">Previous</button>
              <button type="submit" className="submit-btn">Submit</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
