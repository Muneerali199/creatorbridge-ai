import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, TrendingUp, Handshake, Calculator, ShoppingCart, Search, BarChart3, Bot, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import FluidBackground from '../components/FluidBackground';
import CircularGauge from '../components/CircularGauge';
import { useSearch } from '../lib/SearchContext';

const features = [
  { icon: Zap, title: 'TrueScore Engine', desc: 'AI-powered creator quality scoring from 0-100 based on engagement, authenticity, and consistency across Indian creator ecosystem.' },
  { icon: Shield, title: 'FraudShield', desc: 'Two-layer bot detection: ML model (96% accuracy) + engagement ratio heuristic. Catch fake followers and engagement pods.' },
  { icon: TrendingUp, title: 'ROI Forecast', desc: 'Funnel-based revenue modeling with niche-specific conversion rates and average order values for Indian brands.' },
  { icon: Handshake, title: 'DealMatch', desc: 'AI-ranked creator recommendations scored by TrueScore, niche fit, and budget fit with auto-generated deal briefs.' },
  { icon: Calculator, title: 'Value Calculator', desc: 'Fair market pricing based on followers, niche benchmarks, engagement quality, and authenticity scores.' },
  { icon: ShoppingCart, title: 'Brand Discovery', desc: 'Find creators by industry + keywords (shoes, cosmetics, engineering). Matches creators with brand campaigns.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { query, setQuery } = useSearch();
  const [scanInput, setScanInput] = useState('');

  const handleScan = () => {
    if (scanInput.trim()) {
      setQuery(scanInput.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#0a0718' }}>
      {/* Hero Section with Shader */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FluidBackground isActive={true} />
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4" style={{ background: 'rgba(10,7,24,0.8)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CreatorBridge AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Platform</a>
            <a href="#demo" className="text-sm text-white/70 hover:text-white transition-colors">Demo</a>
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
            Detect Bots. Score Quality.
            <br />
            <span className="bg-gradient-to-r from-[#ff6b8a] to-[#9b8ec7] bg-clip-text text-transparent">
              Match Creators.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#9b8ec7' }}
          >
            ML-powered fraud detection (96% accuracy) + engagement analysis + brand-creator matching.
            Built for Indian creator economy.
          </motion.p>

          {/* Scan Creator CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2 p-1.5 rounded-2xl" style={{ background: '#1a1535', border: '1px solid #2a2348' }}>
              <Search className="w-5 h-5 ml-3" style={{ color: '#6b608c' }} />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Enter any Instagram handle..."
                className="flex-1 bg-transparent text-sm text-[#f0e6ff] placeholder-[#6b608c] outline-none py-3"
              />
              <button
                onClick={handleScan}
                className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ff6b6b)' }}
              >
                <Zap className="w-4 h-4" />
                Scan Creator
              </button>
            </div>
            <p className="text-xs mt-3" style={{ color: '#6b608c' }}>
              Try: muneer.exec, yungfilly, or any Instagram username
            </p>
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
                Live Demo
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

      {/* How It Works */}
      <section id="demo" className="relative z-10 py-20 px-4" style={{ background: '#0a0718' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: '#ff6b8a' }}>
              Two-Layer Detection
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              How CreatorBridge Catches Fraud
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-surface p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
                  <BarChart3 className="w-5 h-5 text-[#fbbf24]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#f0e6ff]">Layer 1: FraudShield</h3>
                  <p className="text-xs" style={{ color: '#6b608c' }}>Engagement Ratio Heuristic</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#9b8ec7' }}>
                Compares actual engagement rate against niche-specific benchmarks. 
                Accounts with 73% engagement at 500 followers (benchmark: 8%) get flagged immediately.
              </p>
              <div className="p-3 rounded-xl text-xs" style={{ background: '#1a1535' }}>
                <span className="text-[#fbbf24] font-semibold">muneer.exec</span>
                <span style={{ color: '#6b608c' }}>
                  : 501 followers, 73% ER → 9.16x benchmark → 
                </span>
                <span className="text-[#fbbf24] font-semibold"> MODERATE RISK</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-surface p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <Bot className="w-5 h-5 text-[#10b981]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#f0e6ff]">Layer 2: ML Model</h3>
                  <p className="text-xs" style={{ color: '#6b608c' }}>LogisticRegression (96% accuracy)</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#9b8ec7' }}>
                9 behavioral features trained on 5,000 real Instagram profiles. 
                Detects bots by profile patterns: numeric usernames, missing pics, empty bios.
              </p>
              <div className="p-3 rounded-xl text-xs" style={{ background: '#1a1535' }}>
                <span className="text-[#10b981] font-semibold">user8472</span>
                <span style={{ color: '#6b608c' }}>
                  : numeric username, no pic, 0 posts → 
                </span>
                <span className="text-[#ef4444] font-semibold">100% FRAUD</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="features" className="relative z-10 py-20 px-4" style={{ background: '#0a0718' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '96%', label: 'ML Detection Accuracy' },
              { value: '5K', label: 'Profiles Trained On' },
              { value: '9', label: 'Behavioral Features' },
              { value: '2', label: 'Detection Layers' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#ff6b8a]">{stat.value}</div>
                <div className="mt-2 text-sm" style={{ color: '#9b8ec7' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-4" style={{ background: '#0a0718' }}>
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
              Ready to Detect & Match?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#9b8ec7' }}>
              ML-powered creator intelligence built for Indian brands. Stop guessing — start scoring.
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
