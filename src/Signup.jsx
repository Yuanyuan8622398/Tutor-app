// src/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css"; // 模块化 CSS

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // axios.post(...) 的逻辑可以放回这里
    navigate("/login");
  };

  return (
    <div className={styles["page-root"]}>
      <div className={styles["logo-wrap"]}  style={{ marginLeft: 100, display: "flex", alignItems: "center", gap: 2}}>
        <Link to="/home">
          <img src="/logo.png" alt="Logo" style={{ width: 150, height: 60, objectFit: "contain" }} />
        </Link>
        <img src="/logo1.png" alt="Logo" style={{ width: 100, objectFit: "contain" }} />
      </div>

      <div className={styles.card}>
        <h2 className={styles["card-title"]}>Register</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles["form-group"]}>
            <label htmlFor="name"><strong>Username</strong></label>
            <input
              id="name"
              type="text"
              placeholder="Enter username"
              autoComplete="off"
              name="name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="password"><strong>Password</strong></label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles["btn-submit"]}>
            Register
          </button>
        </form>

        <p className={styles["footer-text"]}>
          Already have an account?{" "}
          <Link to="/login" className={styles["text-link"]}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
