// src/App.jsx
import React, { useEffect, useState } from "react";

/* SAMPLE */
const SAMPLE_TUTORS = [
  {
    id: 1,
    name: "Emily",
    subjects: ["Mathematic", "Physic"],
    rate: 15,
    about:
      "I am  passionate about teaching and skilled at breaking down problems step by step from the basics to advanced levels. I can explain in both Chinese and simple English.",
    avatar: "https://images.openai.com/thumbnails/url/HsrOhXicu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw62TEo1cPOKLDcOMXf3TA5NDjdyjAz2jjDTDQz3LU_2ysuLivcILYp3TczMCywtj_DKSczIjw8uTdNVKwYAqx8pLQ?utm_source=chatgpt.com",
    available: true,
  },
  {
    id: 2,
    name: "Lily",
    subjects: ["Chemistry", "Biology"],
    rate: 12,
    about: "Skilled in handling experimental questions and organizing memorization-based knowledge points, and adept at using analogies to aid understanding.",
    avatar: "https://images.openai.com/thumbnails/url/0V9FhXicu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw5090xLcfOtcHY1z9MtqwwPD893LMhyTfXMdwktSDWq9LKw9I10c0oMiirJcQoPi3BMMwovco13NY5QKwYAwXYoyw?utm_source=chatgpt.com",
    available: true,
  },
  {
    id: 3,
    name: "Amit",
    subjects: ["Computer Science", "Mathematic"],
    rate: 20,
    about: "Proficient in programming and algorithm training camps, capable of leading groups in problem-solving practice. English instruction available upon request.",
    avatar: "https://i.pravatar.cc/150?img=12",
    available: false,
  },
];

function TutorCard({ tutor, onView }) {
  return (
    <div className="card">
      <div className="top">
        <img className="avatar" src={tutor.avatar} alt={tutor.name} />
        <div>
          <h3>{tutor.name}</h3>
          <div className="subjects">{tutor.subjects.join(" • ")}</div>
        </div>

        <div className="rate">
          RM<div className="price">{tutor.rate}/hr</div>
          <div className="status" style={{ color: tutor.available ? "#059669" : "#ef4444" }}>
            {tutor.available ? "Available" : "Unavailable"}
          </div>
        </div>
      </div>

      <p>{tutor.about}</p>

      <div className="btn-row">
        <button onClick={() => onView(tutor)} className="btn btn-view">
          View
        </button>
        <button onClick={() => onView(tutor, { openBooking: true })} className="btn btn-book">
          Book
        </button>
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

export default function App() {
  const [tutors, setTutors] = useState(SAMPLE_TUTORS);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [selected, setSelected] = useState(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookings") || "[]");
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const subjects = Array.from(new Set(tutors.flatMap((t) => t.subjects)));

  const filtered = tutors.filter((t) => {
    const hay = [t.name, t.about, t.subjects.join(" ")].join(" ").toLowerCase();
    const matchQ = hay.includes(query.toLowerCase());
    const matchS = subject ? t.subjects.includes(subject) : true;
    return matchQ && matchS;
  });

  function handleView(t, opts = {}) {
    setSelected(t);
    setOpenBooking(Boolean(opts.openBooking));
  }
  function closeModal() {
    setSelected(null);
    setOpenBooking(false);
  }
  function handleBook(tutor) {
    if (!tutor.available) {
      alert("Tutor currently unavailable.");
      return;
    }
    const b = { id: Date.now(), tutorId: tutor.id, tutorName: tutor.name, time: new Date().toISOString() };
    setBookings((p) => [b, ...p]);
    alert("Successfully booked");
    closeModal();
  }
  function handleSendMessage() {
    if (!msgInput.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), text: msgInput, from: "me" }]);
    setMsgInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, text: "Got it! I’ll get back to you soon.", from: "tutor" }]);
    }, 700);
  }

  return (
    <div className="app-root">
      <div className="container">
        <header className="app-header" 
          style={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ width: 60, height: 60, objectFit: "contain" }} 
          />
          <h1 style={{ margin: 0 }}>Book System</h1>
          <div className="meta">Find your best life tutor!</div>       
        </header>


        <div className="search-row">
          <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tutor / subject / keyword..." />
          <select className="subject-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn-clear" onClick={() => { setQuery(""); setSubject(""); }}>Clear</button>
        </div>

        <div className="tutor-grid" style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {filtered.map((t) => <TutorCard key={t.id} tutor={t} onView={handleView} />)}
        </div>

        <section className="bookings">
          <h2>My Booking</h2>
          {bookings.length === 0 ? <p style={{color:'#6b7280', marginTop:8}}>No bookings yet</p> :
            bookings.map(b => (
              <div className="booking-item" key={b.id}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600, fontSize:14}}>{b.tutorName}</div>
                  <div style={{fontSize:12, color:'#6b7280'}}>{new Date(b.time).toLocaleString()}</div>
                </div>
                <button className="btn btn-danger" onClick={() => setBookings(p => p.filter(x => x.id !== b.id))}>Cancel</button>
              </div>
            ))
          }
        </section>

        {selected && (
          <Modal onClose={closeModal}>
            <div style={{display:'flex', gap:16}}>
              <img src={selected.avatar} style={{width:112, height:112, borderRadius:999, objectFit:'cover'}} alt="" />
              <div style={{flex:1}}>
                <h3 style={{margin:0, fontSize:20}}>{selected.name}</h3>
                <div style={{color:'#6b7280', marginTop:6}}>{selected.subjects.join(' ・ ')}</div>
                <p style={{marginTop:12}}>{selected.about}</p>

                <div style={{display:'flex', gap:10, marginTop:12}}>
                  <button className="btn btn-book" onClick={() => handleBook(selected)}>Book Now</button>
                  <button className="btn btn-view" onClick={() => setOpenBooking(s => !s)}>Chat</button>
                </div>

                {openBooking && (
                  <div className="chat-box">
                    <div className="chat-messages">
                      {messages.length === 0 ? <div style={{color:'#6b7280'}}>No messages yet, start by saying hello!</div> :
                        messages.map(m => (
                          <div key={m.id} className={`chat-msg ${m.from === 'me' ? 'me' : 'tutor'}`}>{m.text}</div>
                        ))
                      }
                    </div>
                    <div style={{display:'flex', gap:8, marginTop:8}}>
                      <input value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="Enter your message..." style={{flex:1, padding:8, borderRadius:8, border:'1px solid #e5e7eb'}} />
                      <button className="btn btn-view" onClick={handleSendMessage}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
