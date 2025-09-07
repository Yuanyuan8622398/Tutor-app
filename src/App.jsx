// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useData } from "./DataProvider";  // 引入 DataProvider

/* SAMPLE */
const SAMPLE_TUTORS = [
  {
    id: 1,
    name: "Emily",
    subjects: ["Mathematic", "Physic"],
    rate: 15,
    rating: 4.0,
    about:
      "I am  passionate about teaching and skilled at breaking down problems step by step from the basics to advanced levels. I can explain in both Chinese and simple English.",
    avatar: "https://images.openai.com/thumbnails/url/HsrOhXicu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw62TEo1cPOKLDcOMXf3TA5NDjdyjAz2jjDTDQz3LU_2ysuLivcILYp3TczMCywtj_DKSczIjw8uTdNVKwYAqx8pLQ?utm_source=chatgpt.com",
    available: true,
    availableTimes: ["14:00-17:00"],
    bookedCount: 12,
    year_level: "",
    academic_title: "Professor"
  },
  {
    id: 2,
    name: "Lily",
    subjects: ["Chemistry", "Biology"],
    rate: 12,
    rating: 4.7,
    about:
      "Skilled in handling experimental questions and organizing memorization-based knowledge points, and adept at using analogies to aid understanding.",
    avatar: "https://images.openai.com/thumbnails/url/0V9FhXicu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw5090xLcfOtcHY1z9MtqwwPD893LMhyTfXMdwktSDWq9LKw9I10c0oMiirJcQoPi3BMMwovco13NY5QKwYAwXYoyw?utm_source=chatgpt.com",
    available: true,
    availableTimes: ["19:00-20:00"],
    bookedCount: 5,
    year_level: "",
    academic_title: "PhD"
  },
  {
    id: 3,
    name: "Amit",
    subjects: ["Computer Science", "Mathematic"],
    rate: 20,
    rating: 4.2,
    about:
      "Proficient in programming and algorithm training camps, capable of leading groups in problem-solving practice. English instruction available upon request.",
    avatar: "https://i.pravatar.cc/150?img=12",
    available: false,
    availableTimes: ["14:00-17:00"],
    bookedCount: 20,
    year_level: "Year 3",
    academic_title: ""
  },
  {
    id: 4,
    name: "Azan",
    subjects: ["Mathematic"],
    rate: 5,
    rating: 4.5,
    about: "I am a math peer tutor who enjoys helping others understand concepts in a clear and simple way.",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2NpzIdiJcNOVYQKeJ3cn8tK4VG7U8sAXoIQ&s",
    available: true,
    availableTimes: ["11:00-12:00"],
    bookedCount: 7,
    year_level: "Year 3",
    academic_title: ""
  },
  {
    id: 5,
    name: "Sophia",
    subjects: ["Pharmacy"],
    rate: 6,
    rating: 4.8,
    about: "Senior Pharmacy student offering clear and friendly tutoring to help you succeed.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuQx1BW3rIelOwXMnsSwprVnqpML4FRRlF7g&s",
    available: false,
    availableTimes: ["21:00-23:00"],
    bookedCount: 17,
    year_level: "Year 4",
    academic_title: ""
  },
];

const SAMPLE_COMMENTS = {
  1: [
    {
      id: 1,
      avatar: "https://i.pravatar.cc/40?img=5",
      username: "Alice",
      rating: 5.0,
      text: "Emily is a great tutor! She explains everything clearly.",
    },
    {
      id: 2,
      avatar: "http://img.touxiangkong.com/uploads/allimg/2022021820/cmnxkq5k5ga.jpg",
      username: "Ben",
      rating: 4.8,
      text: "Good at math but sometimes replies a bit slow.",
    },
  ],
  2: [
    {
      id: 3,
      avatar: "https://i.pravatar.cc/40?img=7",
      username: "Charlie",
      rating: 4.5,
      text: "Very patient and helpful in biology.",
    },
  ],
};


function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <span style={{ color: "gold" }}>
      {"★".repeat(fullStars)}
      {halfStar && <span style={{ color: "gold" }}>☆</span>}
      {"☆".repeat(emptyStars)}
    </span>
  );
}

function TutorCard({ tutor, onView}) {
  return (
    <div className="card">
      <div className="top">
        <img className="avatar" src={tutor.avatar} alt={tutor.name} />
        <div>
          <h3>{tutor.name}</h3>
          <div className="subjects">{[tutor.year_level || tutor.academic_title, ...tutor.subjects].filter(Boolean).join(" • ")}</div>
          <div className="available-times" style={{ whiteSpace: "nowrap" }}>
            {tutor.availableTimes.join(" | ")}
          </div>
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

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* Toast component */
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "12px 20px",
        borderRadius: 8,
        color: "white",
        backgroundColor: toast.type === "success" ? "#16a34a" : "#dc2626",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        fontWeight: "bold",
        zIndex: 1000,
      }}
    >
      {toast.message}
    </div>
  );
}

export default function App() {
  const { bookings, setBookings, messagesMap, setMessagesMap } = useData(); // ✅ 从 DataProvider 获取
  const [tutors, setTutors] = useState(SAMPLE_TUTORS);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [selected, setSelected] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [msgInput, setMsgInput] = useState("");
  const chatRef = useRef(null);
  const [openComment, setOpenComment] = useState(false);


  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [selected]);


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messagesMap]);

    useEffect(() => {
      if (toast) {
        const t = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(t);
      }
    }, [toast]);

  const subjects = Array.from(
    new Set(tutors.flatMap((t) => t.subjects))
  );
  const timeSlots = Array.from(
    new Set(tutors.flatMap((t) => t.availableTimes))
  );

  const filtered = tutors.filter((t) => {
    const hay = [t.name, t.about, t.subjects.join(" ")].join(" ").toLowerCase();
    const matchQ = hay.includes(query.toLowerCase());
    const matchS = subject ? t.subjects.includes(subject) : true;
    const matchT = timeSlot ? t.availableTimes.includes(timeSlot) : true;
    return matchQ && matchS && matchT;
  });

  function handleView(t, opts = {}) {
    setSelected(t);
    setOpenBooking(Boolean(opts.openBooking));
    setMsgInput("");
    setSelectedSubject("");
    setSelectedTime("");
  }
  function closeModal() {
    setSelected(null);
    setOpenBooking(false);
    setMsgInput("");
    setSelectedSubject("");
    setSelectedTime("");
  }

  function handleBook(tutor) {
    if (!tutor.available) {
      setToast({ type: "error", message: "Tutor currently unavailable." });
      return;
    }

    if (!selectedSubject && !selectedTime) {
      setToast({ type: "error", message: "Please select a subject and a time slot." });
      return;
    }
    if (!selectedSubject) {
      setToast({ type: "error", message: "Please select a subject." });
      return;
    }
    if (!selectedTime) {
      setToast({ type: "error", message: "Please select a time slot." });
      return;
    }

    const duplicate = bookings.some(
      (b) => 
        b.tutorId === tutor.id && 
        b.time === selectedTime &&
        b.subject === selectedSubject &&
        (b.status === "Pending" || b.status === "Accepted")
    );
    if (duplicate) {
      setToast({
        type: "error",
        message: "You have already booked this tutor for the selected time.",
      });
      return;
    }

    const newBooking = {
      id: Date.now(),
      tutorId: tutor.id,
      tutorName: tutor.name,
      subject: selectedSubject,
      time: selectedTime,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);

    setToast({ type: "success", message: "Successfully booked!" });
    closeModal();
  }

  function handleSendMessage(tutorId) {
    if (!msgInput.trim()) return;
    const text = msgInput.trim();

    const newMsg = { id: Date.now(), text, from: "me" };
    setMessagesMap((prev) => {
      const prevList = prev[tutorId] || [];
      return { ...prev, [tutorId]: [...prevList, newMsg] };
    });

    setMsgInput("");

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: "Thanks for your message!",
        from: "tutor",
      };
      setMessagesMap((prev) => {
        const prevList = prev[tutorId] || [];
        return { ...prev, [tutorId]: [...prevList, reply] };
      });
    }, 700);
  }

  return (
    <div className="app-root">
      <div className="container">
        <header
          className="app-header"
          style={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Link to="/home">
            <img
            src="/logo.png"
            alt="Logo"
            style={{ width: 60, height: 60, objectFit: "contain" }}
          />
          </Link>
          <h1 style={{ margin: 0 }}>Book System</h1>
          <div className="meta">Find your best life tutor!</div>
        </header>

        <div className="search-row">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutor / subject / keyword..."
          />
          <select
            className="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="subject-select"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="">Time Slot</option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            className="btn-clear"
            onClick={() => {
              setQuery("");
              setSubject("");
              setTimeSlot("");
            }}
          >
            Clear
          </button>
        </div>

        <div
          className="tutor-grid"
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          {filtered.map((t) => (
            <TutorCard key={t.id} tutor={t} onView={handleView} />
          ))}
        </div>

        {selected && (
          <Modal onClose={closeModal}>
            {/* ⭐ 外层 flex，分左右两栏 */}
            <div style={{ display: "flex", gap: 16 }}>
              {/* ⭐ Tutor + Chat 区域，宽度会在 openComment=true 时缩小 */}
              <div style={{ flex: openComment ? 2 : 1 }}>
                <img
                  src={selected.avatar}
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: 999,
                    objectFit: "cover",
                  }}
                  alt=""
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 20 }}>{selected.name}</h3>
                  <div style={{ color: "#6b7280", marginTop: 6 }}>
                    {[selected.year_level || selected.academic_title, ...selected.subjects]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                  <div
                    style={{
                      color: "#374151",
                      fontSize: 13,
                      marginTop: 4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selected.availableTimes.join(" | ")}
                  </div>
                  <p style={{ marginTop: 12 }}>{selected.about}</p>

                  {selected.availableTimes.length > 0 && (
                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                      {/* subject 下拉 */}
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <option value="">Select Subject</option>
                        {selected.subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {/* time 下拉 */}
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        style={{
                          flex: 1,
                          padding: 8,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <option value="">Select Time</option>
                        {selected.availableTimes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* ⭐ 按钮组 */}
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button
                      className="btn btn-book"
                      onClick={() => handleBook(selected)}
                    >
                      Book Now
                    </button>
                    <button
                      className="btn btn-view"
                      onClick={() => setOpenBooking((s) => !s)}
                    >
                      Chat
                    </button>
                    {/* ⭐ 新增 Comment 按钮 */}
                    <button
                      className="btn"
                      style={{ backgroundColor: "#374151", color: "white" }}
                      onClick={() => setOpenComment((s) => !s)}
                    >
                      Comment
                    </button>
                  </div>

                  {/* Chat 框 */}
                  {openBooking && (
                    <div className="chat-box">
                      <div className="chat-messages" ref={chatRef}>
                        {!(messagesMap?.[selected?.id]?.length) ? (
                          <div style={{ color: "#6b7280" }}>
                            No messages yet, start by saying hello!
                          </div>
                        ) : (
                          (messagesMap[selected.id] || []).map((m) => (
                            <div
                              key={m.id}
                              className={`chat-msg ${m.from === "me" ? "me" : "tutor"}`}
                            >
                              {m.text}
                            </div>
                          ))
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input
                          value={msgInput}
                          onChange={(e) => setMsgInput(e.target.value)}
                          placeholder="Enter your message..."
                          style={{
                            flex: 1,
                            padding: 8,
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <button
                          className="btn btn-view"
                          onClick={() => handleSendMessage(selected.id)}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ⭐ 评论区 */}
              {openComment && (
                <div
                  style={{
                    flex: 1,
                    borderLeft: "1px solid #e5e7eb",
                    paddingLeft: 16,
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Comments</h3>
                  {!(SAMPLE_COMMENTS[selected.id]?.length) ? (
                    <div style={{ color: "#6b7280" }}>No comments yet</div>
                  ) : (
                    SAMPLE_COMMENTS[selected.id].map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          gap: 10,
                          marginBottom: 16,
                          borderBottom: "1px solid #e5e7eb",
                          paddingBottom: 8,
                        }}
                      >
                        <img
                          src={c.avatar}
                          alt={c.username}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: "bold" }}>{c.username}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: "#111827", fontSize: 14 }}>
                              {c.rating.toFixed(1)}
                            </span>
                            <span style={{ color: "gold", fontSize: 14 }}>
                              <StarRating rating={c.rating}/>
                            </span>
                          </div>
                          <p style={{ margin: "4px 0" }}>{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Modal>

        )}

        <Toast toast={toast} />
      </div>
    </div>
  );
}
