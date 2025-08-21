import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/client/Home';
import DirectBooking from '../pages/client/DirectBooking';
import ConfirmationPage from '../pages/client/ConfirmationPage';
import ClientSpace from '../pages/client/ClientSpace';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />
    <Route path="/direct-booking/:serviceId" element={<DirectBooking />} />
    <Route path="/confirmed/:bookingId" element={<ConfirmationPage />} />
    <Route path="/client-space" element={<ClientSpace />} />
  </Routes>
);

export default AppRoutes;
