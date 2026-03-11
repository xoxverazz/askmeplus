import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AVATARS = ['🐱', '🐶', '🦊', '🐸', '🐼', '🦁', '🐯', '🐺', '🦝', '🐻', '🐨', '🦄'];

function getAvatar(id) {
  return AVATARS[id % AVATARS.length];
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MessageCard({ message, index, onDelete, onReply, onRead, onReport }) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCardClick = () => {
    if (!message.is_read) onRead(message.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ delay: index * 0.04 }}
      onClick={handleCardClick}
      style={{ position: 'relative' }}
    >
      <div style={{
        background: message.is_read ? 'rgba(255,255,255,0.04)' : 'rgba(168,85,247,0.08)',
        border: `1px solid ${message.is_read ? 'rgba(255,255,255,0.08)' : 'rgba(168,85,247,0.2)'}`,
        borderRadius: '20px', padding: '18px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <div style={{
            width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))',
            border: '1px solid rgba(168,85,247,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          }}>
            {getAvatar(message.id)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(245,243,255,0.4)', fontWeight: '500' }}>
                Anonymous · {timeAgo(message.created_at)}
              </span>
              {!message.is_read && (
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  flexShrink: 0, boxShadow: '0 0 8px rgba(168,85,247,0.5)',
                }} />
              )}
            </div>

            <p style={{
              fontSize: '15px', color: '#f5f3ff', lineHeight: 1.55,
              wordBreak: 'break-word', marginBottom: '14px',
            }}>
              {message.message_text}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onReply(); }}
                style={{
                  padding: '7px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  border: 'none', color: 'white', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(168,85,247,0.25)',
                }}
              >
                💬 Reply
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                style={{
                  padding: '7px 14px', borderRadius: '10px', fontSize: '13px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(245,243,255,0.6)', cursor: 'pointer',
                }}
              >
                ···
              </motion.button>
            </div>
          </div>
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              style={{
                position: 'absolute', right: '16px', bottom: '60px', zIndex: 50,
                background: '#1a1825', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px', padding: '8px', minWidth: '160px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {!confirmDelete ? (
                <>
                  <button onClick={() => { setConfirmDelete(true); }}
                    style={{ display: 'block', width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'none', border: 'none', color: '#f87171', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                    🗑️ Delete
                  </button>
                  {!message.is_reported && (
                    <button onClick={() => { onReport(message.id, 'inappropriate'); setShowMenu(false); }}
                      style={{ display: 'block', width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'none', border: 'none', color: 'rgba(245,243,255,0.6)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                      🚩 Report
                    </button>
                  )}
                  <button onClick={() => setShowMenu(false)}
                    style={{ display: 'block', width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'none', border: 'none', color: 'rgba(245,243,255,0.4)', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                    Cancel
                  </button>
                </>
              ) : (
                <div style={{ padding: '4px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.6)', marginBottom: '10px', textAlign: 'center' }}>Delete this message?</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => { onDelete(message.id); setShowMenu(false); }}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#ef4444', border: 'none', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      Delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(245,243,255,0.6)', fontSize: '12px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
