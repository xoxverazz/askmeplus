import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: "🔒", title: "Fully Anonymous", desc: "No accounts needed to send messages" },
    { icon: "⚡", title: "Instant Delivery", desc: "Messages arrive in real-time" },
    { icon: "📱", title: "Story Ready", desc: "Share replies directly to your stories" },
    { icon: "🛡️", title: "Safe & Moderated", desc: "AI-powered content filtering" },
  ];

  const messages = [
    "Who's your celebrity crush? 😍",
    "What's your biggest secret? 🤫",
    "Rate me honestly 👀",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0f 0%, #130d1f 60%, #0a0a0f 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bg Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "24px",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ASKME+
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "transparent",
              color: "#a855f7",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Log in
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign up free
          </motion.button>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          textAlign: "center",
          padding: "80px 24px 60px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#a855f7",
              fontWeight: "500",
            }}
          >
            ✨ Anonymous Q&A Platform
          </div>

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 8vw, 80px)",
              lineHeight: 1.1,
              color: "#f5f3ff",
              marginBottom: "20px",
            }}
          >
            Ask Anything.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Stay Anonymous.
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "rgba(245,243,255,0.6)",
              maxWidth: "500px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Share your link. Get anonymous messages from friends. Reply as
            stunning story cards.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 60px rgba(168,85,247,0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              style={{
                padding: "16px 36px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                border: "none",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Get Your Link Free 🚀
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 36px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(245,243,255,0.8)",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Sign in
            </motion.button>
          </div>
        </motion.div>

        {/* Mock Phone */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ margin: "60px auto 0", maxWidth: "320px" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "24px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
            }}
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
                style={{
                  background: "rgba(168,85,247,0.1)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "rgba(245,243,255,0.8)",
                  border: "1px solid rgba(168,85,247,0.15)",
                }}
              >
                {msg}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}