import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import CustomerList from './pages/customers/CustomerList';

function App() {
  const { user } = useAuth();

  // 1. POKUD NENÍ UŽIVATEL PŘIHLÁŠEN
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Jakákoliv jiná adresa tě hodí na login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 2. POKUD JE PŘIHLÁŠEN (Zobrazíme aplikaci)
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          {/* Tady časem přibudou další chráněné stránky */}
        </Routes>
      </main>
    </div>
  );
}

export default App;