import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import StudentListPage from "./pages/StudentListPage";

const Main: React.FC = () => { 
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/studentlist" element={<StudentListPage />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}

export default Main;
