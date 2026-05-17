import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setAuthed(isTokenValid(token));
    setChecked(true);
  }, []);

  function handleLogin() {
    setAuthed(true);
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setAuthed(false);
  }

  if (!checked) return null;

  return authed
    ? <AdminDashboard onLogout={handleLogout} />
    : <AdminLogin onLogin={handleLogin} />;
}
