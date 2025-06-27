import { useEffect, useState } from 'react';

export default function Step3({ form, handleChange, prevStep, handleSubmit }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (form.address.country) {
      fetch(`/api/states?country=${form.address.country}`)
        .then(res => res.json())
        .then(setStates);
    }
  }, [form.address.country]);

  useEffect(() => {
    if (form.address.state) {
      fetch(`/api/cities?state=${form.address.state}`)
        .then(res => res.json())
        .then(setCities);
    }
  }, [form.address.state]);

  return (
    <div className="step">
      <h2>Preferences</h2>

      <div className="form-group">
        <label>Country</label>
        <select 
          name="address.country" 
          value={form.address.country} 
          onChange={handleChange}
          required
        >
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>State</label>
        <select 
          name="address.state" 
          value={form.address.state} 
          onChange={handleChange}
          disabled={!form.address.country}
          required
        >
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>City</label>
        <select 
          name="address.city" 
          value={form.address.city} 
          onChange={handleChange}
          disabled={!form.address.state}
          required
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Subscription Plan</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="subscriptionPlan"
              value="Basic"
              checked={form.subscriptionPlan === 'Basic'}
              onChange={handleChange}
            /> Basic
          </label>
          <label>
            <input
              type="radio"
              name="subscriptionPlan"
              value="Pro"
              checked={form.subscriptionPlan === 'Pro'}
              onChange={handleChange}
            /> Pro
          </label>
          <label>
            <input
              type="radio"
              name="subscriptionPlan"
              value="Enterprise"
              checked={form.subscriptionPlan === 'Enterprise'}
              onChange={handleChange}
            /> Enterprise
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={form.newsletter}
            onChange={handleChange}
          /> Subscribe to Newsletter
        </label>
      </div>

      <div className="button-group">
        <button className="prev-btn" onClick={prevStep}>Back</button>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}