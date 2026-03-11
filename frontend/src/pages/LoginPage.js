import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(identifier, password);
      toast.success('Welcome back! 👋');
      navigate('/inbox');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f5f3ff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #130d1f, #0a0a0f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '420px', position: 'relative',
          background: 'rgba(255,255,255,0.04)', borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
          padding: '40px 36px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: '8px',
            }}>ASKME+</h1>
          </Link>
          <p style={{ color: 'rgba(245,243,255,0.5)', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(245,243,255,0.7)', marginBottom: '8px' }}>
              Email or Username
            </label>
            <input
              type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
              placeholder="you@email.com or @username"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(245,243,255,0.7)', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,243,255,0.4)', cursor: 'pointer', fontSize: '18px' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <motion.button
            type="submit" disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{
              width: '100%', padding: '15px', borderRadius: '14px',
              background: loading ? 'rgba(168,85,247,0.5)' : 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
              border: 'none', color: 'white', fontSize: '16px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '20px',
              boxShadow: loading ? 'none' : '0 8px 32px rgba(168,85,247,0.3)',
            }}
          >
            {loading ? '✨ Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(245,243,255,0.5)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#a855f7', fontWeight: '600', textDecoration: 'none' }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
