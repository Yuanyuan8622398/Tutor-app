// src/DataProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [tutors, setTutors] = useState(() => {
    const saved = localStorage.getItem("tutors");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("bookings");
    return saved ? JSON.parse(saved) : [];
  });

  const [messagesMap, setMessagesMap] = useState(() => {
    const saved = localStorage.getItem("messagesMap");
    return saved ? JSON.parse(saved) : {};
  });

  // ✅ 自动保存到 localStorage
  useEffect(() => {
    localStorage.setItem("tutors", JSON.stringify(tutors));
  }, [tutors]);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("messagesMap", JSON.stringify(messagesMap));
  }, [messagesMap]);

  return (
    <DataContext.Provider
      value={{ tutors, setTutors, bookings, setBookings, messagesMap, setMessagesMap }}
    >
      {children}
    </DataContext.Provider>
  );
}

// ✅ 外部组件使用这个 hook 取数据
export function useData() {
  return useContext(DataContext);
}
