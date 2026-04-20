/**
 * Hero.jsx — High-fidelity animated landing page.
 */
import { motion } from 'framer-motion';
import { Play, Camera, Sliders, Download, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const FEATURES = [
  {
    icon: <Camera size={24} />,
    title: "LIVE ASCII CAMERA",
    desc: "Transforms your real-time webcam feed into dynamic ASCII art instantly."
  },
  {
    icon: <Sliders size={24} />,
    title: "DEEP CUSTOMIZATION",
    desc: "Tweak zoom, brightness, contrast, and apply retro matrix-style filters."
  },
  {
    icon: <Download size={24} />,
    title: "SNAPSHOT & EXPORT",
    desc: "Freeze your perfect pose and download as PNG, JPG, vector SVG, or Text."
  },
  {
    icon: <Layers size={24} />,
    title: "DUAL RENDERING MODES",
    desc: "Seamlessly swap between classic ASCII characters and retro 8-bit Pixel blocks."
  }
];


export default function Hero() {
  const { enterStudio } = useAppStore();

  // Container animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(15px)',
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <motion.div
      className="hero-container custom-scrollbar"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4000,
        background: 'radial-gradient(circle at top, transparent 0%, #030305 100%)',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}>

        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 900,
            color: '#fff',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(255,255,255,0.1)'
          }}
        >
          <span style={{ color: 'var(--neon-green)', textShadow: '0 0 30px rgba(57, 255, 20, 0.4)' }}>ASCII</span>FACE<br />
          STUDIO
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            marginTop: '24px',
            marginBottom: '40px',
            lineHeight: 1.6,
            letterSpacing: '0.05em'
          }}
        >
          A creative workstation for live ASCII art encapsulation.
          Capture, design, and export in absolute high-fidelity.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(57, 255, 20, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={enterStudio}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--neon-green)',
            color: '#000',
            border: 'none',
            padding: '18px 40px',
            borderRadius: 100,
            fontFamily: 'var(--font-mono)',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.2)',
            transition: 'box-shadow 0.3s ease',
            marginBottom: 60
          }}
        >
          CREATE ASCII ART
          <Play size={18} fill="#000" />
        </motion.button>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            width: '100%',
            marginBottom: '40px'
          }}
        >
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </motion.div>

        {/* Footer Element */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: 'auto',
            paddingTop: '40px',
            width: '100%',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-dim)',
            letterSpacing: '0.05em',
            opacity: 0.8
          }}
        >
          <div style={{ marginBottom: '6px' }}>
            @<span style={{ color: 'var(--neon-green)' }}>ASCII</span><span style={{ color: 'var(--text-secondary)' }}>Face Studio</span>
          </div>
          Created by - <span style={{ color: 'var(--text-secondary)' }}>Shashi Kumar Sahu</span>
        </motion.div>

      </div>
    </motion.div>
  );
}

function FeatureCard({ feature }) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        borderColor: 'var(--neon-green)',
        boxShadow: '0 10px 30px rgba(57, 255, 20, 0.1)'
      }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-dim)',
        borderRadius: '16px',
        padding: '30px 24px',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default'
      }}
    >
      <div style={{
        background: 'rgba(57, 255, 20, 0.08)',
        color: 'var(--neon-green)',
        width: '48px', height: '48px',
        borderRadius: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {feature.icon}
      </div>
      <h3 style={{
        margin: 0, fontFamily: 'var(--font-mono)', fontSize: '15px', color: '#fff', letterSpacing: '0.05em'
      }}>
        {feature.title}
      </h3>
      <p style={{
        margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6
      }}>
        {feature.desc}
      </p>
    </motion.div>
  );
}
