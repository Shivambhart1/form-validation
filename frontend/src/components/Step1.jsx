import '../styles/Step1.css'; 

export default function Step1({ form, handleChange, isCheckingUsername, nextStep }) {
  return (
    <div>
      <h2>Personal Information</h2>
      
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          minLength="4"
          maxLength="20"
          required
        />
        
        {isCheckingUsername && <div className="status-message">Checking...</div>}
        {form.usernameAvailable === false && (
          <div className="error-message">Username is already taken</div>
        )}
        {form.usernameAvailable === true && (
          <div className="success-message">Username available!</div>
        )}
      </div>

      <div className="form-group">
        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {form.gender === 'Other' && (
          <input
            type="text"
            name="customGender"
            value={form.customGender}
            onChange={handleChange}
            placeholder="Specify your gender"
          />
        )}
      </div>
      <button 
        onClick={nextStep} 
        disabled={!form.username || form.usernameAvailable === false}
      >
        Next
      </button>
    </div>
  );
}