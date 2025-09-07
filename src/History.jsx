// src/History.jsx
import React, { useState, useRef, useEffect } from "react";
import { useData } from "./DataProvider";
import { Link } from "react-router-dom";

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
  const [reviews, setReviews] = useState({}); 
  const [reviewing, setReviewing] = useState(null); // 当前打开的 review modal
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [toast, setToast] = useState(null);
  const [cancelling, setCancelling] = useState(null); 
  const [cancelReason, setCancelReason] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" | "error"



  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (reviewing) {
      setReviewRating(reviews[reviewing.id]?.rating || "");
      setReviewComment(reviews[reviewing.id]?.comment || "");
    }
  }, [reviewing, reviews]);


  useEffect(() => {
    console.log("📌 Current bookings:", bookings);
  }, [bookings]);


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
      <header 
        className="app-header" 
        style={{ display: "flex", alignItems: "center", gap: 1 }
        }>
        <Link to="/home">
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ width: 60, height: 60, objectFit: "contain" }} 
        />
        </Link>
        <h1 style={{ margin: 0 }}>My Booking</h1>
        <div className="meta">Tailored tutoring, faster progress</div>
      </header>

      {bookings.length > 0 && (
        <div style={{ marginTop: 12, marginBottom: 8, textAlign: "right" }}>
          <button
            className="btn"
            style={{
              backgroundColor: "#9ca3af",
              color: "white",
              height: 32,
              padding: "0 12px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: "bold",
            }}
            onClick={() => {
              setBookings((prev) =>
                prev.filter(
                  (b) => b.status !== "Cancelled" && b.status !== "Rejected" && b.status !== "Completed"
                )
              );
            }}
          >
            Clear
          </button>
        </div>
      )}

      {bookings.length === 0 ? (
        <p style={{ color: "#6b7280", marginTop: 8 }}>No bookings yet</p>
      ) : (
        bookings.map((b) => {
          // 🔹 处理状态显示
          const displayStatus =
            b.status === "Accepted" ? "Accepted" :
            b.status === "Completed" ? "Completed" :
            b.status; // Pending, Cancelled, Rejected 等保持原样

          const statusColor =
            displayStatus === "Accepted" || displayStatus === "Completed"
              ? "#059669"
              : displayStatus === "Rejected" || displayStatus === "Cancelled"
              ? "#ef4444"
              : "#6b7280";

          return (
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
                  <span
                    style={{
                      marginLeft: 8,
                      color: statusColor,
                      fontSize: 12,
                    }}
                  >
                    Status:{" "}
                    {displayStatus === "Cancelled" && b.reason
                      ? `Cancelled (${b.reason})`
                      : displayStatus}
                    {b.status === "Rejected" && b.reason
                      ? ` (${b.reason})`
                      : ""}
                  </span>
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

              {/* 🔹 按钮显示逻辑 */}
              <div style={{ display: "flex", gap: 8 }}>
                {(displayStatus === "Pending" || displayStatus === "Accepted") && (
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setCancelling(b);
                        setCancelReason("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-view"
                      onClick={() => setSelected(b)}
                    >
                      Chat
                    </button>
                  </>
                )}

                {(displayStatus === "Cancelled" ||
                  displayStatus === "Rejected" ||
                  displayStatus === "Completed") && (
                  <>
                    <button
                      className="btn btn-view"
                      onClick={() => setSelected(b)}
                    >
                      Chat
                    </button>
                    <button
                      className="btn"
                      style={{ backgroundColor: "#059669", color: "white" }}
                      onClick={() => setReviewing(b)}
                    >
                      Review
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}


      {reviewing && (
        <Modal onClose={() => setReviewing(null)}>
          <h3 style={{ margin: 0 }}>Review {reviewing.tutorName}</h3>
    
    {/* Rating 输入框 */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 500 }}>Rating (1.0 - 5.0)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={reviewRating}
                onChange={(e) => {
                  let value = parseFloat(e.target.value);
                  if (isNaN(value)) {
                    setReviewRating("");
                    return;
                  }
                  if (value < 1.0) value = 1.0;
                  if (value > 5.0) value = 5.0;
                  setReviewRating(value.toFixed(1)); // 保留一位小数
                }}
                style={{
                  width: 80,
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
              />
              {/* 五颗星 */}
              <div style={{ fontSize: 20, color: "gold" }}>
                {"★".repeat(Math.floor(reviewRating || 0))}
                {"☆".repeat(5 - Math.floor(reviewRating || 0))}
              </div>
            </div>
          </div>

          {/* Comment 输入框 */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontWeight: 500 }}>Comment</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                marginTop: 4,
               }}
            />
          </div>

          {/* 底部按钮 */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}>
            <button
                className="btn"
                style={{ backgroundColor: "#3b82f6", color: "white" }}
                onClick={() => {
                    if (!reviewRating) {
                    setToast("Please give a rating");
                    setToastType("error");   // 🚨 红色
                    return;
                    }
                    setReviews((prev) => ({
                    ...prev,
                    [reviewing.id]: {
                        rating: parseFloat(reviewRating),
                        comment: reviewComment,
                    },
                    }));
                    setToast("Review sent successfully!");
                    setToastType("success");   // ✅ 绿色
                    setReviewing(null);
                }}
                >
                Send
                </button>

           </div>
        </Modal>
      )}

      {cancelling && (
  <Modal onClose={() => setCancelling(null)}>
    <h3 style={{ margin: 0 }}>Cancel {cancelling.tutorName}</h3>

    {/* Reason 输入框 */}
    <div style={{ marginTop: 12 }}>
      <label style={{ fontWeight: 500 }}>Reason</label>
      <textarea
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          marginTop: 4,
        }}
      />
    </div>

    {/* 底部按钮 */}
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 16,
        gap: 8,
      }}
    >
      <button
        className="btn"
        style={{ backgroundColor: "#ef4444", color: "white" }} // 红色 cancel
        onClick={() => {
          if (!cancelReason.trim()) {
            setToast("Please give a reason");
            setToastType("error");
            return;
          }
          // ✅ 执行原本的删除逻辑
          setBookings((prev) =>
            prev.map((x) =>
              x.id === cancelling.id
                ? { ...x, status: "Cancelled", reason: cancelReason }
                : x
            )
          );


          // ✅ 成功提示
          setToast("Booking cancelled successfully!");
          setToastType("success");

          // 关闭 modal
          setCancelling(null);
        }}
      >
        Cancel
      </button>
    </div>
  </Modal>
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

      {toast && (
        <div
            style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: toastType === "error" ? "#ef4444" : "#059669", 
            color: "white",
            padding: "10px 16px",
            borderRadius: 8,
            fontWeight: "bold"
            }}
        >
            {toast}
        </div>
        )}

    </div>
  );
}
