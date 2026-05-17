import { useState } from 'react';
import AboutEditor from './editors/AboutEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import SkillsEditor from './editors/SkillsEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import ContactEditor from './editors/ContactEditor';
import PasswordEditor from './editors/PasswordEditor';

const NAV_ITEMS = [
  { key: 'about', label: '◈  About / Bio', icon: '◈' },
  { key: 'projects', label: '♠  Projects', icon: '♠' },
  { key: 'skills', label: '⬡  Skills', icon: '⬡' },
  { key: 'experience', label: '◎  Experience & Background', icon: '◎' },
  { key: 'contact', label: '✉  Contact Info', icon: '✉' },
  { key: 'password', label: '⚿  Change Password', icon: '⚿' },
];

export default function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState('about');

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={brandStyle}>
          <span style={brandIcon}>◈</span>
          <div>
            <p style={brandTitle}>Portfolio Admin</p>
            <p style={brandSub}>Content Manager</p>
          </div>
        </div>

        <nav style={navStyle}>
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                ...navBtnStyle,
                ...(active === key ? navBtnActiveStyle : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div style={sidebarFooter}>
          <a href="/" target="_blank" style={viewSiteLink}>
            ↗ View Portfolio
          </a>
          <button onClick={onLogout} style={logoutBtn}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={mainStyle}>
        <div style={contentPad}>
          {active === 'about' && <AboutEditor />}
          {active === 'projects' && <ProjectsEditor />}
          {active === 'skills' && <SkillsEditor />}
          {active === 'experience' && <ExperienceEditor />}
          {active === 'contact' && <ContactEditor />}
          {active === 'password' && <PasswordEditor />}
        </div>
      </main>
    </div>
  );
}

const layoutStyle = {
  display: 'flex',
  height: '100vh',
  background: '#0d0d0d',
  fontFamily: "'Segoe UI', sans-serif",
  color: '#e0e0e0',
};

const sidebarStyle = {
  width: '240px',
  minWidth: '240px',
  background: '#111',
  borderRight: '1px solid #1e1e1e',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 0',
};

const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  padding: '0 1.25rem 1.5rem',
  borderBottom: '1px solid #1e1e1e',
  marginBottom: '1rem',
};

const brandIcon = { fontSize: '1.6rem', color: '#e4d4c8' };

const brandTitle = { margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#e4d4c8' };
const brandSub = { margin: 0, fontSize: '0.72rem', color: '#444' };

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  padding: '0 0.75rem',
  flex: 1,
};

const navBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#555',
  textAlign: 'left',
  padding: '0.65rem 0.75rem',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.88rem',
  transition: 'all 0.15s',
  letterSpacing: '0.01em',
};

const navBtnActiveStyle = {
  background: '#1a1a1a',
  color: '#e4d4c8',
};

const sidebarFooter = {
  padding: '1rem 1.25rem 0',
  borderTop: '1px solid #1e1e1e',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const viewSiteLink = {
  color: '#a3785b',
  fontSize: '0.82rem',
  textDecoration: 'none',
  padding: '0.4rem 0',
};

const logoutBtn = {
  background: 'transparent',
  border: '1px solid #2a2a2a',
  color: '#555',
  borderRadius: '8px',
  padding: '0.55rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  textAlign: 'center',
};

const mainStyle = {
  flex: 1,
  overflowY: 'auto',
  background: '#0d0d0d',
};

const contentPad = {
  padding: '2rem 2.5rem',
  maxWidth: '900px',
};
