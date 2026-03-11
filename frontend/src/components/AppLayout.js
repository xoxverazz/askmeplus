import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const navItems = [
  { path: '/inbox', icon: '💬', label: 'Inbox' },
  { path: '/share', icon: '🔗', label: 'Share' },
  { path: '/insights', icon: '📊', label: 'Insights' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    api.get('/messages/unread-count').then(res => setUnreadCount(res.data.unread_count)).catch(() => {});
    const interval = setInterval(() => {
      api.get('/messages/unread-count').then(res => setUnreadCount(res.data.unread_count)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #0a0a0f 0%, #130d1f 50%, #0a0a0f 100%)'
        : 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%)',
      paddingBottom: '80px',
    },
    nav: {
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: isDark ? 'rgba(13,12,20,0.95)' : 'rgba(255,255,255,0.95)',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.15)'}`,
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    },
    navItem: (active) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
      padding: '8px 20px', borderRadius: '16px', cursor: 'pointer', border: 'none',
      background: active ? 'rgba(168,85,247,0.15)' : 'transparent',
      transition: 'all 0.2s ease', position: 'relative',
      minWidth: '64px',
    }),
    navIcon: (active) => ({
      fontSize: '22px',
      filter: active ? 'none' : 'grayscale(50%) opacity(0.6)',
      transition: 'all 0.2s',
    }),
    navLabel: (active) => ({
      fontSize: '10px', fontWeight: active ? '600' : '400',
      color: active ? '#a855f7' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
      fontFamily: 'DM Sans, sans-serif',
      transition: 'color 0.2s',
    }),
    badge: {
      position: 'absolute', top: '4px', right: '12px',
      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
      color: 'white', fontSize: '10px', fontWeight: '700',
      width: '18px', height: '18px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
  };

  return (
    <div style={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <nav style={styles.nav}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              style={styles.navItem(active)}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
            >
              {item.path === '/inbox' && unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={styles.badge}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
              <span style={styles.navIcon(active)}>{item.icon}</span>
              <span style={styles.navLabel(active)}>{item.label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)',
                    width: '20px', height: '3px', borderRadius: '2px',
                    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
