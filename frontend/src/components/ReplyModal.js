import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ReplyModal({ message, user, onClose }) {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const cardRef = useRef(null);

  const handleGenerateCard = () => {
    if (!reply.trim()) { toast.error('Please write a reply'); return; }
    setCardReady(true);
  };

  const handleShare = async (platform) => {
    setLoading(true);
    try {
      await api.post('/analytics/track-share');
      const url = `${window.location.origin}/${user.username}`;
      const text = `💬 Someone asked me: "${message.message_text}"\n\n✨ My reply: "${reply}"\n\nAsk me anything anonymously at ${url}`;

      if (platform === 'copy') {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Card copied! Share it to your story 📸');
      }
    } catch { toast.error('Failed to share'); }
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'askme-reply.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Story card saved!');
    } catch {
      toast.error('Failed to generate image');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: '100%', maxWidth: '600px', background: '#13121a',
          borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          border: '1px solid rgba(255,255,255,0.08)', padding: '28px 24px 40px',
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.15)', margin: '0 auto 24px' }} />

        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '22px', color: '#f5f3ff', marginBottom: '20px', textAlign: 'center' }}>
          💬 Reply
        </h2>

        {/* Original message */}
        <div style={{
          background: 'rgba(168,85,247,0.1)', borderRadius: '16px', padding: '14px 16px',
          border: '1px solid rgba(168,85,247,0.2)', marginBottom: '20px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.4)', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Anonymous asked:</p>
          <p style={{ fontSize: '15px', color: '#f5f3ff', lineHeight: 1.55 }}>{message.message_text}</p>
        </div>

        {!cardReady ? (
          <>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(245,243,255,0.7)', marginBottom: '10px' }}>
              Your reply
            </label>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write your reply here..."
              maxLength={300}
              rows={4}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f5f3ff', fontSize: '15px', outline: 'none', resize: 'none',
                boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6,
                marginBottom: '6px',
              }}
            />
            <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.3)', textAlign: 'right', marginBottom: '20px' }}>
              {reply.length}/300
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose}
                style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,243,255,0.6)', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleGenerateCard}
                style={{ flex: 2, padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                Generate Story Card ✨
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Story card preview */}
            <div ref={cardRef} style={{
              background: 'linear-gradient(135deg, #1a0533, #2d0a5e, #1a0533)',
              borderRadius: '20px', padding: '32px 24px', marginBottom: '20px',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 20%, rgba(168,85,247,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.3), transparent 50%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '20px' }}>
                  ASKME+
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(245,243,255,0.4)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Someone asked:</p>
                  <p style={{ fontSize: '16px', color: '#f5f3ff', lineHeight: 1.5 }}>{message.message_text}</p>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))', borderRadius: '14px', padding: '16px', border: '1px solid rgba(168,85,247,0.3)', marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(245,243,255,0.5)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>My reply:</p>
                  <p style={{ fontSize: '18px', color: '#f5f3ff', lineHeight: 1.5, fontWeight: '600' }}>{reply}</p>
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(245,243,255,0.5)' }}>
                  Ask me at <span style={{ color: '#a855f7', fontWeight: '700' }}>askme.plus/{user?.username}</span>
                </p>
              </div>
            </div>

            {/* Share buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                style={{ padding: '13px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                💾 Save Image
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleShare('whatsapp')}
                style={{ padding: '13px', borderRadius: '14px', background: '#25D366', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                📱 WhatsApp
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleShare('twitter')}
                style={{ padding: '13px', borderRadius: '14px', background: '#1DA1F2', border: 'none', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                🐦 Twitter/X
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleShare('copy')}
                style={{ padding: '13px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f3ff', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                📋 Copy Text
              </motion.button>
            </div>
            <button onClick={() => setCardReady(false)}
              style={{ width: '100%', padding: '13px', borderRadius: '14px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,243,255,0.5)', fontSize: '14px', cursor: 'pointer' }}>
              ← Edit Reply
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
