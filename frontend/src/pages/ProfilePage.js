import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: user?.bio || '', allow_messages: user?.allow_messages ?? true, notifications_enabled: user?.notifications_enabled ?? true });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/profile/update', form);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated ✓');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setLoading(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const res = await api.put('/profile/update', { profile_picture: ev.target.result });
        updateUser(res.data.user);
        toast.success('Profile picture updated!');
      } catch { toast.error('Failed to upload'); }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      await api.put('/auth/change-password', { current_password: pwForm.current_password, new_password: pwForm.new_password });
      toast.success('Password changed!');
      setPwForm({ current_password: '', new_password: '', confirm: '' });
      setActiveSection(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setPwLoading(false); }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f5f3ff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#f5f3ff', marginBottom: '24px' }}>
        Profile
      </h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)', padding: '28px 24px',
          marginBottom: '20px', textAlign: 'center',
        }}
      >
        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: user?.profile_picture ? `url(${user.profile_picture}) center/cover` : 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', cursor: 'pointer', border: '3px solid rgba(168,85,247,0.3)',
              boxShadow: '0 8px 32px rgba(168,85,247,0.2)',
            }}
          >
            {!user?.profile_picture && '😊'}
          </div>
          <div onClick={() => fileRef.current?.click()}
            style={{
              position: 'absolute', bottom: 0, right: 0, width: '26px', height: '26px',
              borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', cursor: 'pointer', border: '2px solid #13121a',
            }}>
            ✏️
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: '#f5f3ff', marginBottom: '4px' }}>
          @{user?.username}
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(245,243,255,0.4)', marginBottom: '4px' }}>{user?.email}</p>
        <p style={{ fontSize: '13px', color: '#a855f7', marginBottom: '16px' }}>
          {BASE_URL.replace('https://', '')}/{user?.username}
        </p>

        {!editing ? (
          <>
            {user?.bio && <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.7)', marginBottom: '16px', lineHeight: 1.5 }}>{user.bio}</p>}
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => { setEditing(true); setForm({ bio: user?.bio || '', allow_messages: user?.allow_messages ?? true, notifications_enabled: user?.notifications_enabled ?? true }); }}
              style={{
                padding: '10px 24px', borderRadius: '12px',
                background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                color: '#a855f7', fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}>
              Edit Profile
            </motion.button>
          </>
        ) : (
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(245,243,255,0.6)', marginBottom: '6px' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell people about yourself..." maxLength={160} rows={3}
              style={{ ...inputStyle, resize: 'none', marginBottom: '6px' }} />
            <p style={{ fontSize: '11px', color: 'rgba(245,243,255,0.3)', textAlign: 'right', marginBottom: '16px' }}>{form.bio.length}/160</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditing(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(245,243,255,0.5)', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSave} disabled={loading}
                style={{ flex: 2, padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '14px', color: 'rgba(245,243,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Settings</h3>
        </div>

        {[
          {
            icon: '💬', label: 'Accept Messages', sub: 'Allow others to send you messages',
            toggle: true, value: form.allow_messages,
            onChange: (v) => { const f = { ...form, allow_messages: v }; setForm(f); api.put('/profile/update', { allow_messages: v }).then(r => updateUser(r.data.user)); },
          },
          {
            icon: '🔔', label: 'Notifications', sub: 'Get notified of new messages',
            toggle: true, value: form.notifications_enabled,
            onChange: (v) => { const f = { ...form, notifications_enabled: v }; setForm(f); api.put('/profile/update', { notifications_enabled: v }).then(r => updateUser(r.data.user)); },
          },
          {
            icon: theme === 'dark' ? '🌙' : '☀️', label: `${theme === 'dark' ? 'Dark' : 'Light'} Mode`, sub: 'Switch between dark and light theme',
            toggle: true, value: theme === 'dark',
            onChange: toggle,
          },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '22px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#f5f3ff' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,243,255,0.4)' }}>{item.sub}</div>
              </div>
            </div>
            <div
              onClick={() => item.onChange(!item.value)}
              style={{
                width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer',
                background: item.value ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'background 0.3s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '3px', left: item.value ? '25px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
          </div>
        ))}

        {/* Change password */}
        <div>
          <button onClick={() => setActiveSection(s => s === 'password' ? null : 'password')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '16px 20px', background: 'none', border: 'none',
              cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '22px' }}>🔒</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#f5f3ff' }}>Change Password</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,243,255,0.4)' }}>Update your login password</div>
              </div>
            </div>
            <span style={{ color: 'rgba(245,243,255,0.3)', fontSize: '18px' }}>{activeSection === 'password' ? '▲' : '▶'}</span>
          </button>

          <AnimatePresence>
            {activeSection === 'password' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}>
                <form onSubmit={handleChangePassword} style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="password" placeholder="Current password" value={pwForm.current_password}
                    onChange={e => setPwForm(f => ({ ...f, current_password: e.target.value }))} style={inputStyle} />
                  <input type="password" placeholder="New password" value={pwForm.new_password}
                    onChange={e => setPwForm(f => ({ ...f, new_password: e.target.value }))} style={inputStyle} />
                  <input type="password" placeholder="Confirm new password" value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} style={inputStyle} />
                  <motion.button type="submit" disabled={pwLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    {pwLoading ? 'Changing...' : 'Change Password'}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        style={{
          width: '100%', padding: '16px', borderRadius: '18px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}
      >
        🚪 Log Out
      </motion.button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(245,243,255,0.2)', marginTop: '24px' }}>
        ASKME+ v1.0.0 · Ask Anything. Stay Anonymous.
      </p>
    </div>
  );
}
