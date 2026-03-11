import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '24px',
      }}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          top: '20%', left: '30%', filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
          bottom: '20%', right: '25%', filter: 'blur(60px)',
        }}
      />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        style={{ position: 'relative' }}
      >
        <div style={{
          width: '100px', height: '100px', borderRadius: '28px',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 60px rgba(168,85,247,0.5)',
          fontSize: '48px',
        }}>
          💬
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '-6px',
            borderRadius: '34px', border: '2px solid transparent',
            background: 'linear-gradient(135deg, #7c3aed, transparent, #ec4899) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '48px',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '-1px',
        }}>
          ASKME+
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ color: 'rgba(245,243,255,0.5)', fontSize: '14px', marginTop: '4px', letterSpacing: '2px', textTransform: 'uppercase' }}
        >
          Ask Anything. Stay Anonymous.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ display: 'flex', gap: '6px' }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: i === 1 ? '#a855f7' : 'rgba(168,85,247,0.4)',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
