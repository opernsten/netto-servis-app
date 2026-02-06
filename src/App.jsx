import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PageLayout from './components/layout/PageLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import CustomerList from './pages/customers/CustomerList';
import MachineList from './pages/machines/MachineList'; 
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import MachineDetail from './pages/machines/MachineDetail';
import OfflineNotification from './components/ui/OfflineNotification';
import CustomerDetail from './pages/customers/CustomerDetail';
import CalendarPage from './pages/calendar/CalendarPage';

function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <OfflineNotification />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </>
    );
  }

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/machines" element={<MachineList />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/machines/:id" element={<MachineDetail />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
