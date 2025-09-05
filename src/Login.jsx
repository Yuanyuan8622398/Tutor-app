// src/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.module.css"; // 新增 CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // axios.post(...) 的逻辑可以放回这里
    navigate("/home");
  };

  return (
    <div className="page-root">
      <div className="logo-wrap">
        <img src="/logo.png" alt="Logo" width="80" />
      </div>

      <div className="card">
        <h2 className="card-title">Login</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit">Login</button>
        </form>

        <p className="footer-text">
          Create an account?{" "}
          <Link to="/register" className="text-link">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;