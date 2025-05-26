import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import CandidateList from './pages/CandidateList';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}>
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
        path="/candidate-list"
        element={<CandidateList />}>
      </Route>
    </Routes>
  );
}