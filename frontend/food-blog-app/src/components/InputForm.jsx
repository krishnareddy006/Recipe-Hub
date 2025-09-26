import React, { useState } from 'react';
import axios from 'axios';
import { login } from '../utils/AuthUtils';

function InputForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle login/signup submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage("");

    const endpoint = signUp ? "signup" : "login";

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/${endpoint}`, { 
        email: email.trim(), 
        password 
      });
      
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        props.closeModal();
        window.location.reload();
      } else {
        setMessage("Invalid response from server");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-control">
        <label>Email</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      <div className="form-control">
        <label>Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (signUp ? "Creating Account..." : "Logging in...") : (signUp ? "Sign Up" : "Login")}
      </button><br />
      
      {message && <h6 className="error">{message}</h6>}
      
      <p 
        onClick={() => !isSubmitting && setSignUp(!signUp)} 
        style={{ 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1 
        }}
      >
        {signUp ? "Already have an account" : "Create new account"}
      </p>
    </form>
  );
}

export default InputForm;
