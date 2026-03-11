import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ShareLinkPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;
  const userLink = `${BASE_URL}/${user?.username}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(userLink);
      setCopied(true);
      toast.success('Link copied! 🔗');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const shareOptions = [
    {
      name: 'Instagram Story',
      icon: '📸',
      color: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      action: () => {
        navigator.clipboard.writeText(userLink);
        toast.success('Link copied! Open Instagram and paste in your story 📸');
      },
    },
    {
      name: 'WhatsApp',
      icon: '💚',
      color: '#25D366',
      action: () => {
        const text = `Send me anonymous messages! 👀\n${userLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      color: '#1DA1F2',
      action: () => {
        const text = `Ask me anything anonymously 👀✨\n${userLink}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      name: 'Snapchat',
      icon: '👻',
      color: '#FFFC00',
      textColor: '#000',
      action: () => {
        navigator.clipboard.writeText(userLink);
        toast.success('Link copied! Open Snapchat and paste in your story 👻');
      },
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      action: () => {
        const text = `Send me anonymous messages! 👀\n${userLink}`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(userLink)}&text=${encodeURIComponent('Send me anonymous messages! 👀')}`, '_blank');
      },
    },
    {
      name: 'Share via...',
      icon: '📤',
      color: 'linear-gradient(135deg, #7c3aed, #ec4899)',
      action: async () => {
        if (navigator.share) {
          await navigator.share({ title: 'Ask me anything!', text: 'Send me anonymous messages!', url: userLink });
        } else {
          copyLink();
        }
      },
    },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#f5f3ff' }}>
          Share Your Link
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.4)', marginTop: '4px' }}>
          Share it everywhere and watch the messages roll in
        </p>
      </div>

      {/* Link card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1))',
          borderRadius: '24px', border: '1px solid rgba(168,85,247,0.3)',
          padding: '28px 24px', marginBottom: '28px', textAlign: 'center',
          backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.1), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Profile preview */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 14px',
          background: user?.profile_picture
            ? `url(${user.profile_picture}) center/cover`
            : 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
          border: '3px solid rgba(168,85,247,0.3)',
        }}>
          {!user?.profile_picture && '😊'}
        </div>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: '#f5f3ff', marginBottom: '4px' }}>
          @{user?.username}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(245,243,255,0.5)', marginBottom: '20px' }}>
          {user?.bio || 'Send me anonymous messages!'}
        </p>

        {/* Link display */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '14px',
          padding: '12px 16px', marginBottom: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <span style={{
            fontSize: '14px', fontWeight: '600', color: '#a855f7',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {userLink.replace('https://', '')}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
            onClick={copyLink}
            style={{
              padding: '7px 16px', borderRadius: '10px', flexShrink: 0,
              background: copied ? '#10b981' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
              border: 'none', color: 'white', fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', transition: 'background 0.3s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </motion.button>
        </div>

        {/* QR-like placeholder */}
        <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.3)' }}>
          Share this link anywhere to get anonymous questions
        </p>
      </motion.div>

      {/* Share buttons */}
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: '#f5f3ff', marginBottom: '14px' }}>
        Share to
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '28px' }}>
        {shareOptions.map((option, i) => (
          <motion.button
            key={option.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={option.action}
            style={{
              padding: '16px', borderRadius: '18px', border: 'none', cursor: 'pointer',
              background: typeof option.color === 'string' && !option.color.includes('gradient')
                ? option.color : option.color,
              color: option.textColor || 'white',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <span style={{ fontSize: '28px' }}>{option.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{option.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Tips */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)', padding: '20px',
      }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: '#f5f3ff', marginBottom: '12px' }}>
          💡 Pro Tips
        </h3>
        {[
          '📱 Add your link to your Instagram bio for constant messages',
          '📸 Share your story replies to keep engagement going',
          '🔄 Post regularly to attract more anonymous questions',
        ].map((tip, i) => (
          <p key={i} style={{ fontSize: '13px', color: 'rgba(245,243,255,0.5)', lineHeight: 1.6, marginBottom: i < 2 ? '8px' : 0 }}>
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
}
