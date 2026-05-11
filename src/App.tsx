import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VendorPage, AdminPage, CustomerPage, LoginPage } from './presentation/pages';
import type { MockAccount } from './domain/entities';

const SESSION_KEY = 'lapakin_session';

function App() {
  const [currentAccount, setCurrentAccount] = useState<MockAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentAccount));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentAccount]);

  const handleLogin = (account: MockAccount) => {
    setCurrentAccount(account);
  };

  const handleLogout = () => {
    setCurrentAccount(null);
  };

  const renderPage = (account: MockAccount) => {
    switch (account.role) {
      case 'vendor':
        return <VendorPage currentAccount={account} onLogout={handleLogout} />;
      case 'admin':
        return <AdminPage currentAccount={account} onLogout={handleLogout} />;
      default:
        return <CustomerPage currentAccount={account} onLogout={handleLogout} />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          currentAccount
            ? <Navigate to="/vendors" replace />
            : <LoginPage onLogin={handleLogin} />
        } />
        <Route path="/vendors" element={
          currentAccount
            ? renderPage(currentAccount)
            : <Navigate to="/login" replace />
        } />
        <Route path="/" element={
          currentAccount
            ? <Navigate to="/vendors" replace />
            : <LoginPage onLogin={handleLogin} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;