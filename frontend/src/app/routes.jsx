import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import RegisterClient from '../pages/auth/RegisterClient';
import RegisterAgency from '../pages/auth/RegisterAgency';
import Home from '../pages/client/Home';
import ServicesList from '../pages/client/ServicesList';
import ServiceDetail from '../pages/client/ServiceDetail';
import Booking from '../pages/client/Booking';
import Payment from '../pages/client/Payment';
import Confirmation from '../pages/client/Confirmation';
import ClientDashboard from '../pages/client/Dashboard';
import Favorites from '../pages/client/Favorites';
import Reviews from '../pages/client/Reviews';
import Profile from '../pages/client/Profile';
import AgencyDashboard from '../pages/agency/Dashboard';
import AgencyServices from '../pages/agency/Services';
import ServiceForm from '../pages/agency/ServiceForm';
import ServiceList from '../pages/services/ServiceList';
import AgencyBookings from '../pages/agency/Bookings';
import AgencyAnalytics from '../pages/agency/Analytics';
import AgencyProfile from '../pages/agency/Profile';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminAgencies from '../pages/admin/Agencies';
import  AdminAnalytics from '../pages/admin/Analytics';
import AdminSettings from '../pages/admin/Settings';
import AdminTransactions from '../pages/admin/Transactions';
import Register from '../pages/auth/Register';
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />
  <Route path="/services" element={<ServicesList />} />
  <Route path="/services/manage" element={<ServiceList />} />
    <Route path="/services/:id" element={<ServiceDetail />} />
    <Route path="/booking/:serviceId" element={<Booking />} />
    <Route path="/payment/:bookingId" element={<Payment />} />
    <Route path="/confirmation/:bookingId" element={<Confirmation />} />
  <Route path="/client/dashboard" element={<ClientDashboard />} />
  <Route path="/client/favorites" element={<Favorites />} />
  <Route path="/client/reviews" element={<Reviews />} />
  <Route path="/client/profile" element={<Profile />} />
    <Route path="/agency/dashboard" element={<AgencyDashboard />} />
    <Route path="/agency/services" element={<AgencyServices />} />
    <Route path="/agency/services/create" element={<ServiceForm />} />
    <Route path="/agency/services/edit/:id" element={<ServiceForm />} />
    <Route path="/agency/bookings" element={<AgencyBookings />} />
    <Route path="/agency/analytics" element={<AgencyAnalytics />} />
    <Route path="/agency/profile" element={<AgencyProfile />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/agencies" element={<AdminAgencies />} />
    <Route path="/admin/analytics" element={<AdminAnalytics />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
    <Route path="/admin/transactions" element={<AdminTransactions />} />
  </Routes>
);

export default AppRoutes;
