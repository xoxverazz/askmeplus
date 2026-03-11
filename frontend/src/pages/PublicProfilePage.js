import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const PROMPTS = [
  'What\'s your biggest secret? 🤫',
  'What do you really think of me? 🤔',
  'Give me honest advice 💡',
  'Ask me anything! 👀',
  'What\'s something you\'ve always wanted to tell me?',
  'Rate me honestly 🔥',
  'What song reminds you of me? 🎵',
];

export default function PublicProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [activePrompt, setActivePrompt] = useState(null);

  useEffect(() => {
    api.get(`/public/user/${username}`).then(res => {
      setUser(res.data.user);
      api.post(`/analytics/track-click/${username}`).catch(() => {});
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, [username]);

  const handlePrompt = (prompt) => {
    setMessage(prompt);
    setCharCount(prompt.length);
    setActivePrompt(prompt);
  };

  const handleSend = async () => {
    if (!message.trim()) { toast.error('Please write a message first'); return; }
    if (message.trim().length < 2) { toast.error('Message too short'); return; }
    setSending(true);
    try {
      await api.post(`/messages/send/${username}`, { message: message.trim() });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Please try again.');
    } finally { setSending(false); }
  };

  const handleReset = () => {
    setSent(false);
    setMessage('');
    setCharCount(0);
    setActivePrompt(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #130d1f, #0a0a0f)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0,1,2].map(i => (
            <motion.div key={i} animate={{ scale: [1,1.5,1], opacity: [0.4,1,0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i*0.2 }}
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #130d1f)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>👻</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '24px', color: '#f5f3ff', marginBottom: '8px' }}>
          User not found
        </h2>
        <p style={{ color: 'rgba(245,243,255,0.4)', marginBottom: '24px' }}>This link doesn't exist or has been removed.</p>
        <Link to="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ padding: '12px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
            Get your own ASKME+ link
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1825', color: '#f5f3ff', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' },
      }} />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 16px 48px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        {/* Logo */}
        <Link to="/" style={{ marginBottom: '28px', zIndex: 1 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ASKME+
          </div>
        </Link>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            width: '100%', maxWidth: '440px', zIndex: 1,
            background: 'rgba(255,255,255,0.04)', borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
            padding: '32px 24px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '84px', height: '84px', borderRadius: '50%', margin: '0 auto 14px',
                background: user.profile_picture ? `url(${user.profile_picture}) center/cover` : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                border: '3px solid rgba(168,85,247,0.3)', boxShadow: '0 0 30px rgba(168,85,247,0.25)',
              }}>
              {!user.profile_picture && '😊'}
            </motion.div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '22px', color: '#f5f3ff', marginBottom: '6px' }}>
              @{user.username}
            </h1>
            {user.bio && (
              <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.6)', lineHeight: 1.5 }}>{user.bio}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Prompt suggestions */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.3)', marginBottom: '10px', textAlign: 'center', letterSpacing: '0.5px' }}>
                    💡 QUICK PROMPTS
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    {PROMPTS.slice(0, 4).map((p, i) => (
                      <motion.button
                        key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => handlePrompt(p)}
                        style={{
                          padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500',
                          border: `1px solid ${activePrompt === p ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          background: activePrompt === p ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)',
                          color: activePrompt === p ? '#a855f7' : 'rgba(245,243,255,0.5)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        {p.length > 28 ? p.slice(0, 28) + '...' : p}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <textarea
                    value={message}
                    onChange={e => { setMessage(e.target.value); setCharCount(e.target.value.length); setActivePrompt(null); }}
                    placeholder={`Send ${user.username} an anonymous message...`}
                    maxLength={500} rows={4}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '18px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#f5f3ff', fontSize: '15px', outline: 'none', resize: 'none',
                      boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  <span style={{ position: 'absolute', bottom: '12px', right: '14px', fontSize: '11px', color: 'rgba(245,243,255,0.25)' }}>
                    {charCount}/500
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: sending ? 1 : 1.03, boxShadow: sending ? 'none' : '0 12px 40px rgba(168,85,247,0.4)' }}
                  whileTap={{ scale: sending ? 1 : 0.97 }}
                  onClick={handleSend} disabled={sending || !message.trim()}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '16px',
                    background: !message.trim() ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
                    border: 'none', color: 'white', fontSize: '16px', fontWeight: '800',
                    cursor: !message.trim() ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.5px', transition: 'all 0.3s',
                  }}
                >
                  {sending ? '✨ Sending...' : '🔒 Send Anonymously'}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(245,243,255,0.2)', marginTop: '12px' }}>
                  100% anonymous — your identity is never revealed
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '20px 0' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  style={{ fontSize: '64px', marginBottom: '16px' }}
                >
                  ✅
                </motion.div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: '#f5f3ff', marginBottom: '8px' }}>
                  Message sent!
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.5)', marginBottom: '24px', lineHeight: 1.5 }}>
                  Your anonymous message was delivered to @{user.username}
                </p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleReset}
                  style={{
                    padding: '12px 28px', borderRadius: '14px',
                    background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
                    color: '#a855f7', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px', width: '100%',
                  }}>
                  Send another message
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ marginTop: '28px', textAlign: 'center', zIndex: 1 }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.4)', marginBottom: '12px' }}>
            Want your own anonymous Q&A link?
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(168,85,247,0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '13px 32px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              }}
            >
              Get ASKME+ for free 🚀
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
