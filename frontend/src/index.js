import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Queue from './pages/Queue';
import Drugs from './pages/Drugs';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Schedules from './pages/Schedules';
import Examinations from './pages/Examinations'; // Import Examinations page
import './styles/global.css'; // Correct path for global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="queue" element={<Queue />} />
          <Route path="drugs" element={<Drugs />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="schedules"element={<Schedules />} />
          <Route path="examinations" element={<Examinations />} /> {/* Add Examinations route */}
          {/* Add other nested routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
