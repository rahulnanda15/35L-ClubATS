import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import CandidateDetail from './pages/CandidateDetail';
import UserDashboard from './pages/UserDashboard';
import ApplicationList from './pages/ApplicationList';
import ApplicationDetail from './pages/ApplicationDetail';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import ApplicationCycleManager from './pages/ApplicationCycleManager';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}>
      </Route>
      <Route
        path="/admin"
        element={<AdminDashboard />}>
      </Route>
      <Route
        path="/signup"
        element={<SignUp />}>
      </Route>
      <Route
        path="/login"
        element={<Login />}>
      </Route>

      <Route
        path="/application-list"
        element={<ApplicationList />}>
      </Route>

      <Route
        path="/application/:id"
        element={<ApplicationDetail />}>
      </Route>

      <Route
        path="/dashboard"
        element={<UserDashboard />}>
      </Route>

      <Route
        path="/user-dashboard"
        element={<UserDashboard />}>
      </Route>

      <Route
        path="/application-cycles"
        element={<ApplicationCycleManager />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}