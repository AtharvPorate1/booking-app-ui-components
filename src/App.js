// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoresPage from './components/StoresPage';
import DoctorBookingUI from './components/DoctorBookingUI';
import SalonBookingUI from './components/SalonBookingUI';

import storeData from './data/storeData.json';
import ArcadeBookingUI from './components/ArcadeBookingUI';
import HospitalUI from './components/HospitalUI';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoresPage storeData={storeData} />} />
        <Route path="/doctorBooking" element={<DoctorBookingUI />} />
        <Route path="/salonBooking" element={<SalonBookingUI />} />
        <Route path="/arcadeBooking" element={<ArcadeBookingUI />} />
        <Route path="/hospitalBooking" element={<HospitalUI />} />
        {/* Add more routes for other store types */}
      </Routes>
    </Router>
  );
};

export default App;
