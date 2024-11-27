import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PatientDash from "./components/dashboard/PatientDash";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { PollingProvider } from "./components/appointments/PollingContext";
import VideoCall from "./components/appointments/VideoCall";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <Toaster />
      <PollingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call" element={<VideoCall />} />
            <Route path="/*" element={<div>404</div>} />
          </Routes>
        </BrowserRouter>
      </PollingProvider>
    </>
  );
}

export default App;
