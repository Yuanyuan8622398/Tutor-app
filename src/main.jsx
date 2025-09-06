import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Signup from "./Signup"
import Login from "./Login"
import Home from "./Home"
import Tutor from "./Tutor"
import History from "./History"
import "./index.css"; // 引入样式
import { SpeedInsights } from '@vercel/speed-insights/react'
import { DataProvider } from "./DataProvider";

const root = createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/bookingsystem' element={<App />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tutor' element={<Tutor />}></Route>
        <Route path='/history' element={<History />}></Route>
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  </DataProvider>
);
