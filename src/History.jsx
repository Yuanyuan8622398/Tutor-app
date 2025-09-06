// src/History.jsx
import React, { useState, useRef, useEffect } from "react";
import { useData } from "./DataProvider";

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

export default function History() {
  const { bookings, setBookings, messagesMap, setMessagesMap } = useData(); // ✅ 改用 DataProvider
  const [selected, setSelected] = useState(null); // 当前点击的 booking
  const [msgInput, setMsgInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messagesMap, selected]);

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
    <div className="container">
      <h2>My Booking History</h2>

      {bookings.length === 0 ? (
        <p style={{ color: "#6b7280", marginTop: 8 }}>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div
            className="booking-item"
            key={b.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {b.tutorName}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 2,
                }}
              >
                <span>{b.subject}</span>
                <span style={{ margin: "0 8px" }}>|</span>
                <span>{b.time}</span>
                <span style={{ margin: "0 8px" }}>|</span>
                <span>{new Date(b.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* ✅ 按钮组：Cancel + Chat */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-danger"
                onClick={() =>
                  setBookings((p) => p.filter((x) => x.id !== b.id))
                }
              >
                Cancel
              </button>
              <button
                className="btn btn-view"
                onClick={() => setSelected(b)}
              >
                Chat
              </button>
            </div>
          </div>
        ))
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <h3 style={{ margin: 0, fontSize: 18 }}>
            Chat with {selected.tutorName}
          </h3>
          <div className="chat-box">
            <div className="chat-messages" ref={chatRef}>
              {(!messagesMap[selected.tutorId] ||
                messagesMap[selected.tutorId].length === 0) ? (
                <div style={{ color: "#6b7280" }}>
                  No messages yet, start by saying hello!
                </div>
              ) : (
                (messagesMap[selected.tutorId] || []).map((m) => (
                  <div
                    key={m.id}
                    className={`chat-msg ${
                      m.from === "me" ? "me" : "tutor"
                    }`}
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
                onClick={() => handleSendMessage(selected.tutorId)}
              >
                Send
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
