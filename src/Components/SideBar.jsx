import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaGamepad, FaCode, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import { useResponsive } from '../hooks/useResponsive';

const NAV_ITEMS = [
  { num: '01', Icon: FaHome,     label: 'HOME',    href: '#home' },
  { num: '02', Icon: FaGamepad,  label: 'PROJECTS', href: '#projects' },
  { num: '03', Icon: FaCode,     label: 'SKILLS',  href: '#skills' },
  { num: '04', Icon: FaEnvelope, label: 'CONTACT', href: '#contact' },
];

// ─── Mobile HUD drawer ────────────────────────────────────────────────────────

function HUDCorner({ pos }) {
  const style = {
    position: 'absolute',
    width: 14,
    height: 14,
    ...pos,
    pointerEvents: 'none',
    zIndex: 2,
  };
  const isTop = pos.top !== undefined;
  const isLeft = pos.left !== undefined;
  return (
    <div style={{
      ...style,
      borderTop:    isTop    ? '2px solid rgba(156,31,232,0.7)' : 'none',
      borderBottom: !isTop   ? '2px solid rgba(156,31,232,0.7)' : 'none',
      borderLeft:   isLeft   ? '2px solid rgba(156,31,232,0.7)' : 'none',
      borderRight:  !isLeft  ? '2px solid rgba(156,31,232,0.7)' : 'none',
    }} />
  );
}

function Scanlines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
    }} />
  );
}

function DotGrid() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: 'radial-gradient(rgba(156,31,232,0.06) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    }} />
  );
}

function PlayerCard() {
  const [xpReady, setXpReady] = useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setXpReady(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      style={playerCardStyle}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Avatar */}
      <div style={avatarStyle} />

      {/* Identity */}
      <div style={{ flex: 1 }}>
        <p style={playerLabelStyle}>◈ PLAYER</p>
        <p style={playerNameStyle}>bluePomegranate</p>
        <p style={playerClassStyle}>Game Programmer</p>
      </div>

      {/* XP row */}
      <div style={xpRowStyle}>
        <span style={xpLabelStyle}>XP</span>
        <div style={xpTrackStyle}>
          <motion.div
            style={xpFillStyle}
            initial={{ width: 0 }}
            animate={{ width: xpReady ? '87%' : 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <span style={xpLvlStyle}>LV.99</span>
      </div>
    </motion.div>
  );
}

function NavLink({ item, index, close }) {
  const [hovered, setHovered] = useState(false);
  const { num, Icon, label, href } = item;

  return (
    <motion.a
      href={href}
      style={{
        ...navLinkStyle,
        background: hovered ? 'rgba(156,31,232,0.08)' : 'transparent',
        borderLeft: hovered ? '3px solid #9C1FE8' : '3px solid transparent',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onClick={close}
    >
      {/* Number prefix */}
      <span style={{ ...numStyle, color: hovered ? '#9C1FE8' : 'rgba(156,31,232,0.35)' }}>
        {num}
      </span>

      {/* Icon */}
      <Icon
        size={15}
        style={{
          color: hovered ? '#9C1FE8' : 'rgba(200,210,255,0.5)',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
      />

      {/* Label */}
      <span style={{
        ...linkLabelStyle,
        color: hovered ? '#ffffff' : '#c8d0ff',
        textShadow: hovered ? '0 0 8px rgba(200,210,255,0.6)' : 'none',
      }}>
        {label}
      </span>

      {/* Arrow */}
      <motion.span
        style={{ marginLeft: 'auto', color: hovered ? '#9C1FE8' : 'transparent', flexShrink: 0 }}
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <FaChevronRight size={10} />
      </motion.span>

      {/* Bottom rule */}
      <div style={{
        position: 'absolute', bottom: 0, left: '2.2rem', right: '0.5rem',
        height: '1px',
        background: hovered
          ? 'linear-gradient(90deg, rgba(156,31,232,0.5), transparent)'
          : 'rgba(255,255,255,0.05)',
      }} />
    </motion.a>
  );
}

function StatusDot() {
  return (
    <motion.span
      style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4caf50' }}
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function MobileDrawer({ onClose }) {
  return (
    <motion.div
      style={drawerStyle}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      onClick={e => e.stopPropagation()}
    >
      <DotGrid />
      <Scanlines />
      <HUDCorner pos={{ top: 8, left: 8 }} />
      <HUDCorner pos={{ top: 8, right: 8 }} />
      <HUDCorner pos={{ bottom: 8, left: 8 }} />
      <HUDCorner pos={{ bottom: 8, right: 8 }} />

      <div style={drawerInner}>
        {/* System header */}
        <motion.p
          style={sysHeaderStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          ◈ NJ.PORTFOLIO <span style={{ color: 'rgba(156,31,232,0.4)' }}>// SYS_NAV</span>
        </motion.p>

        {/* Player card */}
        <PlayerCard />

        {/* Divider */}
        <motion.div
          style={dividerStyle}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span style={dividerLabel}>NAVIGATION</span>
        </motion.div>

        {/* Nav links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NAV_ITEMS.map((item, i) => (
            <NavLink key={item.href} item={item} index={i} close={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <motion.div
          style={footerStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div style={footerDivider} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={footerTextStyle}>SYS v1.0.0</span>
            <span style={footerTextStyle}>
              STATUS&nbsp;<StatusDot />&nbsp;<span style={{ color: '#4caf50' }}>ONLINE</span>
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Sidebar() {
  const { isMobile, isTablet } = useResponsive();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile || isTablet) {
    return (
      <>
        {/* HUD Menu Button */}
        <motion.button
          style={hudButtonStyle}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.92 }}
          animate={{
            boxShadow: menuOpen
              ? '0 0 14px rgba(156,31,232,0.6), inset 0 0 6px rgba(156,31,232,0.15)'
              : ['0 0 4px rgba(156,31,232,0.3)', '0 0 10px rgba(156,31,232,0.5)', '0 0 4px rgba(156,31,232,0.3)'],
          }}
          transition={{ duration: 1.8, repeat: menuOpen ? 0 : Infinity, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={menuOpen ? 'close' : 'open'}
              style={{ fontSize: '1.2rem', lineHeight: 1, color: '#9C1FE8' }}
              initial={{ opacity: 0, rotate: -30 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 30 }}
              transition={{ duration: 0.18 }}
            >
              {menuOpen ? '✕' : '☰'}
            </motion.span>
          </AnimatePresence>
          <span style={menuLabelStyle}>{menuOpen ? 'CLOSE' : 'MENU'}</span>
        </motion.button>

        {/* Overlay + Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              style={overlayStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
            >
              <MobileDrawer onClose={() => setMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ─── Desktop sidebar (unchanged) ───────────────────────────────────────────
  return (
    <div style={sidebarStyle}>
      <div style={logoSpaceStyle}>
        <div style={logoPlaceholderStyle} />
      </div>
      <nav style={navStyle}>
        <SidebarLink text="Home"                  href="#home" />
        <SidebarLink text="Projects"              href="#projects" />
        <SidebarLink text="Skills and Experience" href="#skills" />
        <SidebarLink text="Contact"               href="#contact" />
      </nav>
    </div>
  );
}

function SidebarLink({ text, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      style={{
        ...linkStyle,
        color: hovered ? '#E4D4C8' : '#ccc',
        textShadow: hovered ? '0 0 5px #E4D4C8, 0 0 10px #E4D4C8' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '2px',
          height: hovered ? '20px' : '0px',
          backgroundColor: '#E4D4C8',
          marginRight: '5px',
          transition: 'all 0.3s ease',
        }} />
        {text}
      </div>
    </a>
  );
}

// ─── Mobile Styles ────────────────────────────────────────────────────────────

const hudButtonStyle = {
  position: 'fixed',
  top: '1rem',
  left: '1rem',
  zIndex: 300,
  background: 'rgba(10, 12, 24, 0.92)',
  border: '1px solid rgba(156, 31, 232,0.5)',
  color: '#9C1FE8',
  width: '52px',
  height: '52px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  padding: 0,
};

const menuLabelStyle = {
  fontSize: '0.44rem',
  letterSpacing: '0.18em',
  color: 'rgba(156,31,232,0.7)',
  textTransform: 'uppercase',
  lineHeight: 1,
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.65)',
  zIndex: 299,
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
};

const drawerStyle = {
  position: 'relative',
  background: 'linear-gradient(160deg, #0a0d1a 0%, #111828 60%, #0a0d1a 100%)',
  width: '280px',
  maxWidth: '85vw',
  height: '100%',
  borderRight: '1px solid rgba(156,31,232,0.2)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const drawerInner = {
  position: 'relative',
  zIndex: 5,
  padding: '4.5rem 1.2rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '1.2rem',
};

const sysHeaderStyle = {
  margin: 0,
  fontSize: '0.62rem',
  letterSpacing: '0.12em',
  color: 'rgba(156,31,232,0.55)',
  textTransform: 'uppercase',
  fontFamily: 'monospace',
};

const playerCardStyle = {
  background: 'rgba(156,31,232,0.07)',
  border: '1px solid rgba(156,31,232,0.2)',
  borderRadius: '8px',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

const avatarStyle = {
  width: '52px',
  height: '52px',
  borderRadius: '6px',
  backgroundImage: 'url("public/images/logo2.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1px solid rgba(156,31,232,0.3)',
  marginBottom: '0.2rem',
};

const playerLabelStyle = {
  margin: 0,
  fontSize: '0.58rem',
  letterSpacing: '0.14em',
  color: 'rgba(200,210,255,0.45)',
  textTransform: 'uppercase',
};

const playerNameStyle = {
  margin: 0,
  fontSize: '0.88rem',
  fontWeight: 700,
  color: '#c8d0ff',
  letterSpacing: '0.03em',
};

const playerClassStyle = {
  margin: 0,
  fontSize: '0.68rem',
  color: '#224D75',
  letterSpacing: '0.05em',
};

const xpRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '0.2rem',
};

const xpLabelStyle = {
  fontSize: '0.58rem',
  letterSpacing: '0.1em',
  color: 'rgba(200,210,255,0.4)',
  textTransform: 'uppercase',
  flexShrink: 0,
};

const xpTrackStyle = {
  flex: 1,
  height: '4px',
  background: 'rgba(255,255,255,0.08)',
  borderRadius: '2px',
  overflow: 'hidden',
};

const xpFillStyle = {
  height: '100%',
  background: 'linear-gradient(90deg, #224D75, #9C1FE8)',
  borderRadius: '2px',
  boxShadow: '0 0 6px rgba(156,31,232,0.5)',
};

const xpLvlStyle = {
  fontSize: '0.62rem',
  fontWeight: 700,
  color: '#9C1FE8',
  letterSpacing: '0.06em',
  flexShrink: 0,
};

const dividerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  transformOrigin: 'left',
};

const dividerLabel = {
  fontSize: '0.58rem',
  letterSpacing: '0.2em',
  color: 'rgba(156,31,232,0.5)',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  padding: '0 0.3rem',
  background: 'linear-gradient(90deg, rgba(156,31,232,0.15), transparent)',
  borderRadius: '2px',
};

const navLinkStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem',
  padding: '0.75rem 0.6rem',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease, border-left-color 0.2s ease',
  borderLeft: '3px solid transparent',
};

const numStyle = {
  fontSize: '0.6rem',
  fontFamily: 'monospace',
  letterSpacing: '0.05em',
  transition: 'color 0.2s',
  flexShrink: 0,
  minWidth: '18px',
};

const linkLabelStyle = {
  fontSize: '0.82rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: 'Sensation, sans-serif',
  transition: 'color 0.2s ease, text-shadow 0.2s ease',
  flex: 1,
};

const footerStyle = {
  marginTop: 'auto',
};

const footerDivider = {
  height: '1px',
  background: 'linear-gradient(90deg, rgba(156,31,232,0.3), transparent)',
  marginBottom: '0.6rem',
};

const footerTextStyle = {
  fontSize: '0.6rem',
  fontFamily: 'monospace',
  letterSpacing: '0.1em',
  color: 'rgba(200,210,255,0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

// ─── Desktop Styles ───────────────────────────────────────────────────────────

const sidebarStyle = {
  position: 'fixed',
  top: '2%',
  left: '2%',
  height: '100vh',
  width: '100px',
  backgroundColor: 'transparent',
  padding: '1rem 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 20,
};

const logoSpaceStyle = {
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoPlaceholderStyle = {
  width: '150px',
  height: '150px',
  backgroundImage: 'url("public/images/logo2.png")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '10px',
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3rem',
  marginTop: '2rem',
};

const linkStyle = {
  textDecoration: 'none',
  fontSize: '0.9rem',
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  fontFamily: 'Sensation, sans-serif',
};
