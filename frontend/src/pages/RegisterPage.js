import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error('All fields required'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/inbox');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f5f3ff', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s',
  };

  const fields = [
    { key: 'username', label: 'Username', placeholder: '@yourusername', type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
    { key: 'password', label: 'Password', placeholder: '••••••••', type: showPass ? 'text' : 'password' },
    { key: 'confirm', label: 'Confirm Password', placeholder: '••••••••', type: showPass ? 'text' : 'password' },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0f, #130d1f, #0a0a0f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/">
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: '8px', textDecoration: 'none',
            }}>ASKME+</h1>
          </Link>
          <p style={{ color: 'rgba(245,243,255,0.5)', fontSize: '14px' }}>Create your free account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(245,243,255,0.7)', marginBottom: '8px' }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={update(field.key)}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                {(field.key === 'password') && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(245,243,255,0.4)', cursor: 'pointer', fontSize: '18px' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div style={{
            background: 'rgba(168,85,247,0.08)', borderRadius: '12px', padding: '12px 14px',
            marginBottom: '20px', marginTop: '4px',
            border: '1px solid rgba(168,85,247,0.15)',
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(245,243,255,0.5)', lineHeight: 1.5 }}>
              Your link will be: <span style={{ color: '#a855f7', fontWeight: '600' }}>
                askme.plus/{form.username || 'yourname'}
              </span>
            </p>
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
            {loading ? '✨ Creating account...' : 'Create Account 🚀'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(245,243,255,0.5)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a855f7', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
