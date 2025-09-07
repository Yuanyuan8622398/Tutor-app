// src/Home.jsx
import React, { useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_TUTORS } from "./data";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span style={{ color: "gold" }}>
      {"★".repeat(fullStars)}
      {halfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

// 首页导师卡片，复刻 App.jsx 样式
function HomeTutorCard({ tutor, onView }) {
  return (
    <div className="card">
      <div className="top">
        <img className="avatar" src={tutor.avatar} alt={tutor.name} />
        <div>
          <h3>{tutor.name}</h3>
          <div className="subjects">
            {[tutor.year_level || tutor.academic_title, ...tutor.subjects]
              .filter(Boolean)
              .join(" • ")}
          </div>
          <div className="available-times">{tutor.availableTimes.join(" | ")}</div>
        </div>
        <div className="rate">
          <div style={{ display: "flex", alignItems: "center", fontSize: 14, marginBottom: 4 }}>
            <span style={{ marginRight: 4 }}>
              <StarRating rating={tutor.rating} />
            </span>
            <span style={{ color: "#111827" }}>{tutor.rating.toFixed(1)}</span>
          </div>
          <div className="price">RM{tutor.rate}/hr</div>
          <div
            className="status"
            style={{ color: tutor.available ? "#059669" : "#ef4444" }}
          >
            {tutor.available ? "Available" : "Unavailable"}
          </div>
        </div>
      </div>

      <p>{tutor.about}</p>

      <div className="btn-row">
        <button onClick={() => onView(tutor)} className="btn btn-view">
          View
        </button>
        <button
          onClick={() => onView(tutor, { openBooking: true })}
          className="btn btn-book"
        >
          Book
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 17,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        {tutor.bookedCount > 0
          ? `${tutor.bookedCount} students booked`
          : "No students booked yet"}
      </div>
    </div>
  );
}


function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 取评分最高的前三位导师
  const topTutors = [...SAMPLE_TUTORS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleView = (tutor) => {
    navigate("/bookingsystem", { state: { tutorId: tutor.id, openModal: true } });
  };

  const handleChat = (tutor) => {
    navigate("/bookingsystem", { state: { tutorId: tutor.id, openModal: true, openChat: true } });
  };

  return (
    <div className={styles.home}>
      {/* 顶部橙色横栏 */}
      <header className={styles.navbar}>
        <Link to="/home">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 80, height: 60, marginRight: 50, marginLeft: 50 }}
          />
        </Link>
        <nav className={styles.navLinks}>
          <Link to="/bookingsystem">Booking</Link>
          <Link to="/tutor">Tutor</Link>
          <a href="#about">About us</a>
        </nav>

        <div className={styles.accountWrapper}>
          <div className={styles.account} onClick={() => setMenuOpen(!menuOpen)}>
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
        <img src="./bg.jpg" alt="students" className={styles.heroImg} />
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

      {/* 高分导师推荐 */}
      <section style={{ padding: "40px 50px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>
          Top Rated Tutors
      </h2>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            marginTop: 20,
          }}
        >
          {topTutors.map((tutor) => (
            <HomeTutorCard
              key={tutor.id}
              tutor={tutor}
              onView={handleView}
              onChat={handleChat}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
