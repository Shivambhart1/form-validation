export default function Step2({ form, handleChange, nextStep, prevStep }) {
  return (
    <div className="step">
      <h2>Professional Details</h2>

      <div className="form-group">
        <label>Profession</label>
        <select name="profession" value={form.profession} onChange={handleChange}>
          <option value="Student">Student</option>
          <option value="Developer">Developer</option>
          <option value="Entrepreneur">Entrepreneur</option>
        </select>
      </div>

      {form.profession === 'Entrepreneur' && (
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="form-group">
        <label>Address Line 1</label>
        <input
          type="text"
          name="address.line1"
          value={form.address.line1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="button-group">
        <button className="prev-btn" onClick={prevStep}>Back</button>
        <button className="next-btn" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}