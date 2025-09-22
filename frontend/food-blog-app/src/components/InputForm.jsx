// import React, { useState } from 'react';
// import axios from 'axios';

// function InputForm(props) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [signUp, setSignUp] = useState(false);
//   const [message, setMessage] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     const endpoint = signUp ? "signup" : "login";

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_URL}/${endpoint}`, { email, password });
      
//       // ✅ Store token and user data
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
      
//       // ✅ Trigger global state update event
//       window.dispatchEvent(new Event('user-login'));
//       window.dispatchEvent(new StorageEvent('storage', {
//         key: 'token',
//         newValue: res.data.token
//       }));
      
//       // ✅ Close modal after slight delay to ensure state updates
//       setTimeout(() => {
//         props.closeModal();
//       }, 100);
      
//     } catch (err) {
//       setMessage(err.response?.data?.message);
//     }
//   }

//   return (
//     <>
//       <form className="form" onSubmit={handleSubmit}>
//         <div className="form-control">
//           <label>Email</label>
//           <input
//             type="email"
//             className="input"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-control">
//           <label>Password</label>
//           <input
//             type="password"
//             className="input"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit">{signUp ? "Sign Up" : "Login"}</button><br />
//         {message && <h6 className="error">{message}</h6>}
//         <p onClick={() => setSignUp((pre) => !pre)}>
//           {signUp ? "Already have an account" : "Create new account"}
//         </p>
//       </form>
//     </>
//   );
// }

// export default InputForm;

import React, { useState } from 'react';
import axios from 'axios';
import { login } from '../utils/AuthUtils';

function InputForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const endpoint = signUp ? "signup" : "login";

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/${endpoint}`, { email, password });
      
      // ✅ Instant login
      login(res.data.user, res.data.token);
      props.closeModal();
      window.location.reload(); // Force refresh for instant update
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
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
          required
        />
      </div>

      <button type="submit">
        {signUp ? "Sign Up" : "Login"}
      </button><br />
      
      {message && <h6 className="error">{message}</h6>}
      
      <p onClick={() => setSignUp(!signUp)}>
        {signUp ? "Already have an account" : "Create new account"}
      </p>
    </form>
  );
}

export default InputForm;
