// src/TutorDashboard.jsx
import React, { useState } from "react";
import "./index.css"
import styles from "./Tutor.module.css"

export default function TutorDashboard() {
  const [profile, setProfile] = useState({
    name: "",
    subjects: "",
    rate: "",
    about: "",
    available: true,
    avatar: null,
  });

  const [slots, setSlots] = useState([]);
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [toast, setToast] = useState(null);

  const [bookings, setBookings] = useState([
    { id: 1, student: "Alice", time: "2025-09-06 14:00", status: "pending" },
    { id: 2, student: "Bob", time: "2025-09-07 10:00", status: "pending" },
  ]);
  
  // 改为每个 bookingId 有独立 chat
  const [chats, setChats] = useState({
    1: [{ id: 1, from: "Alice", text: "Hello, can I ask about calculus?" }],
    2: [],
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [msgInput, setMsgInput] = useState("");

  function handleBookingResponse(id, accept, reason = "") {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: accept ? "accepted" : `rejected: ${reason}` } : b
      )
    );
  }

  function handleSendMessage() {
  // 如果 msgInput 是空的（去掉前后空格后为空），或者没有选中的聊天窗口（activeChatId === null）
  // 就直接 return，不发送任何消息。
    if (!msgInput.trim() || activeChatId === null) return;

  // 更新 chats 状态
    setChats((prev) => ({
      ...prev, // 保留之前的所有聊天记录
      [activeChatId]: [ // 针对当前打开的 chat（activeChatId）
        ...(prev[activeChatId] || []), // 取出它已有的消息，如果没有就用空数组
        { id: Date.now(), from: "me", text: msgInput }, // 新增一条消息
      ],
    }));

  // 清空输入框
    setMsgInput("");
  }


  return (
    <div className={styles.container}>
      <header className="app-header" 
        style={{ display: "flex", alignItems: "center", gap: 1 }
      }>
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ width: 60, height: 60, objectFit: "contain" }} 
        />
        <h1 style={{ margin: 0 }}>Tutor Dashboard</h1>
        <div className="meta">Manage your services & bookings</div>
      </header>

      {/* Profile Settings */}
      <section className="bookings">
        <h2>Profile Settings</h2>
        <div className="form-row" style={{ justifyContent: "center", marginBottom: 16 }}>
          <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
            {profile.avatar ? (
                <img
                src={profile.avatar}
                alt="avatar"
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
                />
            ) : (
                <div
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: "2px dashed #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    color: "#888",
                }}
                >
                +
                </div>
            )}
            </label>
            <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setProfile({ ...profile, avatar: ev.target.result }); // 保存 Base64 图片
                };
                reader.readAsDataURL(file);
                }
            }}
            />
        </div>


        <div className="form-row">
          <label>Name : </label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder= "Your Name"
          />
        </div>
        <div className="form-row">
          <label>Subjects : </label>
          <input
            value={profile.subjects}
            onChange={(e) => setProfile({ ...profile, subjects: e.target.value })}
            placeholder= "Mathematic / Physic"
          />
        </div>
        <div className="form-row">
          <label>Rate (RM/hr) : </label>
          <input
            type="number"
            value={profile.rate}
            onChange={(e) => {
                let val = Math.floor(Number(e.target.value)); 
                if (val < 0) val = 0;
                setProfile({ ...profile, rate: val });
            }}
            placeholder="0"
            onKeyDown={(e) => e.preventDefault()} 
            className="no-caret"
          />
        </div>
        <div className="form-row">
          <label>About : </label>
          <textarea
            value={profile.about}
            onChange={(e) => setProfile({ ...profile, about: e.target.value })}
            placeholder="Write about you"
            className="mb-8"
          />
        </div>
        <div className="form-row">
          <label>Status : </label>
          <select
            value={profile.available}
            onChange={(e) =>
              setProfile({ ...profile, available: e.target.value === "true" })
            }
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button
            className="btn btn-save"
            style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 15,
                
            }}
            onClick={() => {
                console.log("Saving profile:", profile);
                setToast("Profile saved successfully!");
                setTimeout(() => setToast(null), 3000);
            }}
            >
            Save
          </button>
        </div>
      </section>
      {toast && (
        <div
            style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#10b981", // 绿色
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 1000,
            }}
        >
            {toast}
        </div>
        )}


      {/* Available Slots */}
      <section className="bookings">
        <h2>Available Time Slots</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="number"
            value={slotStart}
            onChange={(e) => setSlotStart(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Start (e.g. 1400)"
            style={{ flex: 1 }}
          />
          <input
            type="number"
            value={slotEnd}
            onChange={(e) => setSlotEnd(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="End (e.g. 1500)"
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-book"
            onClick={() => {
                // 必须是4位
                if (slotStart.length !== 4 || slotEnd.length !== 4) {
                alert("Please enter the complete 24-hour time (e.g. 0930, 1500)");
                return;
                }

                // 解析开始时间
                const hhStart = parseInt(slotStart.slice(0, 2), 10);
                const mmStart = parseInt(slotStart.slice(2, 4), 10);

                // 解析结束时间
                const hhEnd = parseInt(slotEnd.slice(0, 2), 10);
                const mmEnd = parseInt(slotEnd.slice(2, 4), 10);

                // 检查开始时间是否合法
                if (hhStart > 23 || mmStart > 59) {
                alert("Start time must be a valid 24-hour time");
                return;
                }

                // 检查结束时间是否合法
                if (hhEnd > 23 || mmEnd > 59) {
                alert("End time must be a valid 24-hour time");
                return;
                }

                // 转换成分钟比较
                const startMinutes = hhStart * 60 + mmStart;
                const endMinutes = hhEnd * 60 + mmEnd;

                if (startMinutes >= endMinutes) {
                alert("End time must be later than the start time");
                return;
                }

                // 保存并清空
                const newSlot = `${slotStart} - ${slotEnd}`;
                setSlots([...slots, newSlot]);
                setSlotStart("");
                setSlotEnd("");
            }}
          >
          Add
          </button>
        </div>
        <ul style={{ marginTop: 8, paddingLeft: 16 }}>
          {slots.map((s, i) => (
            <li
                key={i}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                }}
            >
            <span>{s}</span>
            <button
                    style={{
                    backgroundColor: "#dc2626", // 红色
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 8px",
                    cursor: "pointer",
                    fontSize: 12,
                    }}
                    onClick={() => {
                    // 删除该时间段
                    setSlots(slots.filter((_, idx) => idx !== i));
                    }}
            >
                    Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Booking Requests */}
      <section className="bookings" >
        <h2>Booking Requests</h2>
        {bookings.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No requests yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="booking-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {b.student} - {b.time}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Status: {b.status}
                </div>
              </div>
              
            <div style={{ display: "flex", gap: 6 }}>
                {b.status === "pending" && (
                  <>
                  <button
                    className="btn btn-book"
                    onClick={() => handleBookingResponse(b.id, true)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      const reason = prompt("Reason for rejection?");
                      if (reason) handleBookingResponse(b.id, false, reason);
                    }}
                  >
                    Reject
                  </button>
                  </>
                )}
                  <button
                    className="btn btn-view"
                    style={{ backgroundColor: "#007bff", color: "white" }}
                    onClick={() => setActiveChatId(b.id)}
                  >
                  Chat
                  </button>
                </div>
            </div>
          ))
        )}
      </section>
      {activeChatId !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        //   onClick={() => setActiveChatId(null)}  点击外面关闭
        >
        <div
          style={{
            background: "white",
            borderRadius: 8,
            width: "700px",     // 固定宽度
            height: "500px",
            display: "flex",
            flexDirection: "column",
            padding: 16,
            position: "relative", // 为了定位右上角的 ×
          }}
          onClick={(e) => e.stopPropagation()} // 阻止冒泡
        >
      {/* 关闭按钮 */}
        <button
          onClick={() => setActiveChatId(null)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: "none",
            fontSize: 20,
            fontWeight: "bold",
            cursor: "pointer",
            color: "#555",
          }}
        >
        ×
        </button>

        <h3 style={{ marginBottom: 8 }}>Chat</h3>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: 8,
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 6, // 每条消息之间留间距
          }}
        >
          {(chats[activeChatId] || []).map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: "#f3f4f6", // 浅灰色
                  color: "#111",
                  padding: "6px 10px",
                  borderRadius: 12,
                  maxWidth: "70%", // 防止太长
                  wordWrap: "break-word", // 自动换行
                }}
              >
                {m.text} {/* 不再显示用户名 */}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            placeholder="Type your reply..."
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          />
          <button
            className="btn btn-view"
            onClick={handleSendMessage}
            style={{ backgroundColor: "#007bff", color: "white" }}
          >
            Send
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Messages */}
      {/* <section className="bookings">
        <h2>Messages</h2>
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-msg ${m.from === "me" ? "me" : "tutor"}`}
              >
                <b>{m.from}:</b> {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Type your reply..."
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <button className="btn btn-view" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}
