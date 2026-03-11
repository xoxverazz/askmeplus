import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

function StatCard({ icon, label, value, sub, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      style={{
        background: gradient || 'rgba(255,255,255,0.04)',
        borderRadius: '20px', padding: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#f5f3ff', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(245,243,255,0.7)', fontWeight: '600', marginBottom: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'rgba(245,243,255,0.3)' }}>{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1a1825', border: '1px solid rgba(168,85,247,0.3)',
      borderRadius: '12px', padding: '10px 14px',
    }}>
      <p style={{ color: 'rgba(245,243,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || '#a855f7', fontSize: '13px', fontWeight: '700' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);
  const [chartType, setChartType] = useState('area');

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get(`/analytics/chart?days=${range}`),
    ]).then(([s, c]) => {
      setSummary(s.data);
      setChartData(c.data.chart_data.map(d => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      })));
    }).catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) {
    return (
      <div style={{ padding: '24px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '20px' }} />)}
        </div>
        <div className="skeleton" style={{ height: '220px', borderRadius: '20px' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '28px', color: '#f5f3ff' }}>
          Insights
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(245,243,255,0.4)', marginTop: '4px' }}>
          Your analytics at a glance
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        <StatCard icon="💬" label="Total Messages" value={summary?.total_messages || 0} sub="all time" delay={0} />
        <StatCard icon="👆" label="Link Clicks" value={summary?.total_link_clicks || 0} sub="last 30 days" delay={0.1} />
        <StatCard icon="📱" label="Today's Messages" value={summary?.today_messages || 0} sub="today" gradient="rgba(124,58,237,0.15)" delay={0.2} />
        <StatCard icon="🔗" label="Story Shares" value={summary?.total_story_shares || 0} sub="last 30 days" gradient="rgba(236,72,153,0.1)" delay={0.3} />
      </div>

      {/* Chart controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '16px', color: '#f5f3ff' }}>
          Activity
        </h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setRange(d)}
              style={{
                padding: '5px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: range === d ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(255,255,255,0.06)',
                color: range === d ? 'white' : 'rgba(245,243,255,0.5)',
              }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)', padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {['area', 'bar'].map(t => (
            <button key={t} onClick={() => setChartType(t)}
              style={{
                padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                background: chartType === t ? 'rgba(168,85,247,0.2)' : 'transparent',
                color: chartType === t ? '#a855f7' : 'rgba(245,243,255,0.3)',
              }}
            >
              {t === 'area' ? '📈 Area' : '📊 Bar'}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: 'rgba(245,243,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(245,243,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="messages_received" name="Messages" stroke="#a855f7" strokeWidth={2} fill="url(#msgGrad)" />
              <Area type="monotone" dataKey="link_clicks" name="Clicks" stroke="#ec4899" strokeWidth={2} fill="url(#clickGrad)" />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: 'rgba(245,243,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(245,243,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="messages_received" name="Messages" fill="#a855f7" radius={[6,6,0,0]} />
              <Bar dataKey="link_clicks" name="Clicks" fill="#ec4899" radius={[6,6,0,0]} />
            </BarChart>
          )}
        </ResponsiveContainer>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }} />
            <span style={{ fontSize: '12px', color: 'rgba(245,243,255,0.5)' }}>Messages</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
            <span style={{ fontSize: '12px', color: 'rgba(245,243,255,0.5)' }}>Link Clicks</span>
          </div>
        </div>
      </motion.div>

      {/* 30-day summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.08))',
          borderRadius: '20px', border: '1px solid rgba(168,85,247,0.2)', padding: '20px',
        }}
      >
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '15px', color: '#f5f3ff', marginBottom: '14px' }}>
          📅 30-Day Summary
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { label: 'Messages', value: summary?.messages_last_30_days || 0, icon: '💬' },
            { label: 'Clicks', value: summary?.total_link_clicks || 0, icon: '👆' },
            { label: 'Shares', value: summary?.total_story_shares || 0, icon: '📤' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '22px', color: '#a855f7' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(245,243,255,0.4)', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
