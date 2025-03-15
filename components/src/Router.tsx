import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import StudentListPage from "./pages/StudentListPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router> 
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/main" element={<App />} />
        <Route path="/studentlist" element={<StudentListPage />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
