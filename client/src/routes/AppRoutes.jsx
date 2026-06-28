import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; 
import Books from './pages/Books';
import Borrowing from './pages/Borrowing'; // Soo dhoweynta bogga amaahda

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Marka nidaamka la furo si toos ah ha u aado Dashboard-ka */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* 2. Bogga Dashboard-ka Guud */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* 3. Bogga Maamulka Buugaagta */}
      <Route path="/books" element={<Books />} />
      
      {/* 4. Bogga Amaahinta Buugaagta (Kan cusub) */}
      <Route path="/borrow" element={<Borrowing />} />
      
      {/* 5. Haddii la qoro waddo aan jirin, dib ugu celi Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;