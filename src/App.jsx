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
  {
    id: 4,
    name: "Azan",
    subjects: ["Mathematic"],
    rate: 5,
    about: "I am a math peer tutor who enjoys helping others understand concepts in a clear and simple way.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2NpzIdiJcNOVYQKeJ3cn8tK4VG7U8sAXoIQ&s",
    available: true,
  },
  {
    id: 5,
    name: "Sophia",
    subjects: ["Pharmacy"],
    rate: 6,
    about: "Senior Pharmacy student offering clear and friendly tutoring to help you succeed.",
    avatar: "data:image/jpeg;base64,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",
    available: true,
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

  // --------------------------------------------------
  // CHANGED: messages state is now a map keyed by tutorId.
  // REASON: allows each tutor to have its own independent chat array
  // and enables persistence per tutor in localStorage.
  // Structure: { [tutorId]: [{id, text, from}, ...], ... }
  // --------------------------------------------------
  const [messagesMap, setMessagesMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("messagesMap") || "{}");
    } catch {
      return {};
    }
  });

  // Keep a simple input state (cleared when switching tutors)
  const [msgInput, setMsgInput] = useState("");

  // Persist bookings and messagesMap to localStorage
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("messagesMap", JSON.stringify(messagesMap));
  }, [messagesMap]);

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
    // Clear input when switching to a different tutor view/chat
    setMsgInput("");
  }
  function closeModal() {
    setSelected(null);
    setOpenBooking(false);
    setMsgInput("");
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

  // --------------------------------------------------
  // REPLACED: The old handleSendMessage (single global messages array)
  // with this function which writes to messagesMap[tutorId]
  // - It ensures messages are stored per tutor
  // - It persists them to localStorage via useEffect above
  // - It schedules a simulated tutor reply scoped to the same tutorId
  // --------------------------------------------------
  function handleSendMessage(tutorId) {
    if (!msgInput.trim()) return;
    const text = msgInput.trim();

    const newMsg = { id: Date.now(), text, from: "me" };
    setMessagesMap((prev) => {
      const prevList = prev[tutorId] || [];
      return { ...prev, [tutorId]: [...prevList, newMsg] };
    });

    setMsgInput("");

    // simulated reply — NOTE: captures tutorId so reply goes to correct tutor
    setTimeout(() => {
      const reply = { id: Date.now() + 1, text: "Got it! I’ll get back to you soon.", from: "tutor" };
      setMessagesMap((prev) => {
        const prevList = prev[tutorId] || [];
        return { ...prev, [tutorId]: [...prevList, reply] };
      });
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
                      {/* CHANGED: show messages for the selected tutor only */}
                      {(!messagesMap[selected.id] || messagesMap[selected.id].length === 0) ? (
                        <div style={{color:'#6b7280'}}>No messages yet, start by saying hello!</div>
                      ) : (
                        (messagesMap[selected.id] || []).map(m => (
                          <div key={m.id} className={`chat-msg ${m.from === 'me' ? 'me' : 'tutor'}`}>{m.text}</div>
                        ))
                      )}
                    </div>
                    <div style={{display:'flex', gap:8, marginTop:8}}>
                      {/* Send must target selected tutor id */}
                      <input value={msgInput} onChange={(e) => setMsgInput(e.target.value)} placeholder="Enter your message..." style={{flex:1, padding:8, borderRadius:8, border:'1px solid #e5e7eb'}} />
                      <button className="btn btn-view" onClick={() => handleSendMessage(selected.id)}>Send</button>
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
