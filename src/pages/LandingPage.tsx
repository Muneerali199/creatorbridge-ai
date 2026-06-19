import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, TrendingUp, Handshake, Calculator, ShoppingCart } from 'lucide-react';
import FluidBackground from '../components/FluidBackground';
import CircularGauge from '../components/CircularGauge';

const features = [
  { icon: Zap, title: 'TrueScore Engine', desc: 'AI-powered creator quality scoring from 0-100 based on engagement, authenticity, and consistency.' },
  { icon: Shield, title: 'FraudShield', desc: 'Detect fake followers and engagement pods with real-time risk analysis.' },
  { icon: TrendingUp, title: 'ROI Forecast', desc: 'Predict campaign performance with funnel-based revenue modeling.' },
  { icon: Handshake, title: 'DealMatch', desc: 'AI-ranked creator recommendations with auto-generated deal briefs.' },
  { icon: Calculator, title: 'Value Calculator', desc: 'Fair pricing based on followers, niche, engagement, and authenticity.' },
  { icon: ShoppingCart, title: 'Commerce Bridge', desc: 'Post-to-purchase attribution across Instagram, YouTube & TikTok.' },
];

const stats = [
  { value: '18+', label: 'Creator Niches' },
  { value: '6', label: 'AI Tools' },
  { value: '99.2%', label: 'Fraud Detection' },
  { value: '4.5x', label: 'Avg. ROAS' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen" style={{ background: '#0a0718' }}>
      {/* Hero Section with Shader */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FluidBackground isActive={true} />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CreatorBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Platform</a>
            <a href="#tools" className="text-sm text-white/70 hover:text-white transition-colors">Intelligence</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-medium text-white px-5 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ background: '#ff6b8a' }}
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(255,107,138,0.2)', border: '1px solid rgba(255,107,138,0.3)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff6b8a] animate-pulse" />
            <span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: '#ff6b8a' }}>
              AI-Powered Creator Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Score. Match.
            <br />
            <span className="bg-gradient-to-r from-[#ff6b8a] to-[#9b8ec7] bg-clip-text text-transparent">
              Grow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#9b8ec7' }}
          >
            The creator economy deserves better than gut feel. AI-powered analytics to score, verify, and match creators with brands in India & APAC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:scale-105"
              style={{ background: '#ff6b8a' }}
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="glass-panel text-[#f0e6ff] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              View Pricing
            </button>
          </motion.div>
        </div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 right-8 z-10 hidden lg:block"
        >
          <div className="glass-panel rounded-2xl p-5 w-[340px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9b8ec7' }}>
                Live Metrics
              </span>
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            </div>
            <div className="flex gap-4 justify-center">
              <CircularGauge value={84} size={80} strokeWidth={8} label="Score" color="#ff6b8a" />
              <CircularGauge value={92} size={80} strokeWidth={8} label="Trust" color="#34d399" />
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#34d399]">4.5x</span>
                <span className="text-[10px] uppercase tracking-wider text-[#9b8ec7] mt-1">ROAS</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <section id="features" className="relative z-10 py-20 px-4" style={{ background: '#0a0718' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#ff6b8a]">{stat.value}</div>
                <div className="mt-2 text-sm text-[#9b8ec7]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="tools" className="relative z-10 py-24 px-4" style={{ background: '#0a0718' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: '#ff6b8a' }}>
              Platform Tools
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Everything You Need to
              <br />
              <span className="text-[#9b8ec7]">Win in Creator Marketing</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-surface p-6 hover:border-[#ff6b8a]/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(255,107,138,0.15)' }}>
                  <feature.icon className="w-6 h-6 text-[#ff6b8a]" />
                </div>
                <h3 className="text-lg font-semibold text-[#f0e6ff] mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9b8ec7' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4" style={{ background: '#0a0718' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-surface p-12"
            style={{ background: 'linear-gradient(135deg, #14102a 0%, #1a1335 100%)' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#9b8ec7' }}>
              Join 500+ brands using CreatorBridge AI to find, verify, and partner with the perfect creators.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:opacity-90 hover:scale-105"
              style={{ background: '#ff6b8a' }}
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t" style={{ background: '#0a0718', borderColor: '#2a2348' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#f0e6ff]">CreatorBridge AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#9b8ec7' }}>
            <a href="#" className="hover:text-[#f0e6ff] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#f0e6ff] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#f0e6ff] transition-colors">Contact</a>
          </div>
          <p className="text-xs" style={{ color: '#9b8ec7' }}>
            &copy; 2026 CreatorBridge AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
