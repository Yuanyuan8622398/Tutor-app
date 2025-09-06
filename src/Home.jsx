// src/Home.jsx
import React, { useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate(); 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.home}>
      {/* 顶部橙色横栏 */}
      <header className={styles.navbar}>
        <Link to="/home">
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: 80, height: 60, marginRight: 50, marginLeft: 50}}
          />
        </Link>
        <nav className={styles.navLinks}>
          <Link to="/bookingsystem">Booking</Link>
          <Link to="/tutor">Tutor</Link>
          <a href="#about">About us</a>
        </nav>

        <div className={styles.accountWrapper}>
          <div
            className={styles.account} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={styles.accountText}>Account</span> 
            <span className={styles.arrow}>{menuOpen ? "v" : "^"}</span>
          </div>
          {menuOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/login">Login</Link>
              <Link to="/register">Create Account</Link>
              <Link to="/history">My Booking</Link>
            </div>
          )}
        </div>
      </header>

      {/* 主体内容 */}
      <main className={styles.hero}>
        <img
          src="./bg.jpg"
          alt="students"
          className={styles.heroImg}
        />
        <div className={styles.heroText}>
          <h1>Your perfect tutor, anytime, anywhere</h1>
          <p>Unlock smarter learning</p>
          <button 
            className={styles.btnBook}
            onClick={() => navigate("/bookingsystem")}
          >
            Book now
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
