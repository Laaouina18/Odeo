import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/client/Home';
import ServicesPage from '../pages/ServicesPage';
import DirectBooking from '../pages/client/DirectBooking';
import ConfirmationPage from '../pages/client/ConfirmationPage';
import ClientSpace from '../pages/client/ClientSpace';
import ClientDashboard from '../pages/client/ClientDashboard';
import AgencyDashboard from '../pages/agency/AgencyDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ServiceDetail from '../pages/ServiceDetail';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/services/:id" element={<ServiceDetail />} />
    <Route path="/direct-booking/:serviceId" element={<DirectBooking />} />
    <Route path="/confirmed/:bookingId" element={<ConfirmationPage />} />
    <Route path="/client-space" element={<ClientSpace />} />
    
    {/* Dashboards spécialisés par rôle */}
    <Route path="/client/dashboard" element={<ClientDashboard />} />
    <Route path="/agency/dashboard" element={<AgencyDashboard />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
  </Routes>
);

export default AppRoutes;
