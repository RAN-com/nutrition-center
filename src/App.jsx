import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import IdealWeightCalculator from './IdealWeightCalculator';
import AppointmentBookingForm from './AppointmentBookingForm';
import AdminScreen from './AdminScreen';
import AdminLogin from './Login';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import logo from './assets/mrhealth.png';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar with Logo */}
        <header className="bg-green-500 text-white p-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="Health App Logo" className="h-20" />
          </div>
          <h1 className="text-3xl font-bold underline text-green-700">Nutrition Centre</h1>
        </header>

        <main className="container my-4">
          <Routes>
            <Route path="/" element={<IdealWeightCalculator />} />
            <Route path="/book-appointment" element={<AppointmentBookingForm />} />
            <Route
              path="/admin"
              element={isAdminLoggedIn ? <AdminScreen /> : <Navigate to="/admin-login" />}
            />
            <Route path="/admin-login" element={<AdminLogin onLogin={setIsAdminLoggedIn} />} />
          </Routes>
        </main>

        <footer className="bg-green-500 text-white text-center p-4">
          
        </footer>
      </div>
    </Router>
  );
}

export default App;
