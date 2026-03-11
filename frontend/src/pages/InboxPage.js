import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MessageCard from '../components/MessageCard';
import ReplyModal from '../components/ReplyModal';

export default function InboxPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyMessage, setReplyMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread

  const loadMessages = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get(`/messages/inbox?page=${currentPage}&per_page=20`);
      const newMessages = res.data.messages;
      setMessages(prev => reset ? newMessages : [...prev, ...newMessages]);
      setHasMore(currentPage < res.data.pages);
      if (!reset) setPage(p => p + 1);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadMessages(true);
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleRead = async (id) => {
    try {
      await api.put(`/messages/${id}/read`);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch {}
  };

  const handleReport = async (id, reason) => {
    try {
      await api.post(`/messages/${id}/report`, { reason });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_reported: true } : m));
      toast.success('Message reported');
    } catch { toast.error('Failed to report'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/messages/mark-all-read');
      setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
      toast.success('All messages marked as read');
    } catch {}
  };

  const displayed = filter === 'unread' ? messages.filter(m => !m.is_read) : messages;
  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#f5f3ff' }}>
            Inbox
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(245,243,255,0.4)', marginTop: '2px' }}>
            {messages.length} messages {unreadCount > 0 && `· ${unreadCount} unread`}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleMarkAllRead}
            style={{
              padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
              background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)',
              color: '#a855f7', cursor: 'pointer',
            }}
          >
            Mark all read
          </motion.button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'unread'].map(f => (
          <button
            key={f} onClick={() => setFilter(f)}
            style={{
              padding: '7px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.05)',
              color: filter === f ? 'white' : 'rgba(245,243,255,0.5)',
            }}
          >
            {f === 'all' ? 'All' : `Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
          </button>
        ))}
      </div>

      {/* Messages */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '20px' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '20px', color: '#f5f3ff', marginBottom: '8px' }}>
            {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
          </h3>
          <p style={{ color: 'rgba(245,243,255,0.4)', fontSize: '14px', lineHeight: 1.6 }}>
            Share your link to start receiving anonymous messages!
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {displayed.map((msg, i) => (
              <MessageCard
                key={msg.id}
                message={msg}
                index={i}
                onDelete={handleDelete}
                onReply={() => { setReplyMessage(msg); handleRead(msg.id); }}
                onRead={handleRead}
                onReport={handleReport}
              />
            ))}
          </AnimatePresence>

          {hasMore && (
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => loadMessages()}
              style={{
                width: '100%', padding: '14px', borderRadius: '16px', marginTop: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(245,243,255,0.7)', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              Load more messages
            </motion.button>
          )}
        </div>
      )}

      <AnimatePresence>
        {replyMessage && (
          <ReplyModal
            message={replyMessage}
            user={user}
            onClose={() => setReplyMessage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
