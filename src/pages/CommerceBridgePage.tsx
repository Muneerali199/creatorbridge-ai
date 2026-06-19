import { motion } from 'framer-motion';
import { ShoppingCart, Instagram, Youtube, Sparkles } from 'lucide-react';

const milestones = [
  { quarter: 'Q2 2026', title: 'Instagram Shopping Integration', status: 'planned' },
  { quarter: 'Q3 2026', title: 'YouTube Affiliate Tracking', status: 'planned' },
  { quarter: 'Q4 2026', title: 'Cross-Platform Attribution Model', status: 'next' },
];

export default function CommerceBridgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">Social Commerce Bridge</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Post-to-purchase attribution across Instagram, YouTube, and TikTok.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-12 text-center"
          style={{ borderStyle: 'dashed', borderWidth: '1px', borderColor: '#2a2348' }}
        >
          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}
          >
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-sm font-bold text-[#fbbf24]">COMING SOON</span>
          </div>

          {/* Platform Icons */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E1306C, #F77737)' }}>
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#FF0000' }}>
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#0a0718', border: '1px solid #2a2348' }}>
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#9b8ec7' }}>
            Track which creator content actually drives sales — not just likes. 
            Full post-to-purchase attribution across all major social platforms.
          </p>

          {/* Connection Visualization */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-3 h-3 rounded-full bg-[#ff6b8a]" />
            <div className="w-12 h-0.5 border-t border-dashed border-[#ff6b8a]/50" />
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(255,107,138,0.1)', border: '1px solid rgba(255,107,138,0.3)' }}>
              <ShoppingCart className="w-5 h-5 text-[#ff6b8a] inline mr-2" />
              <span className="text-sm font-medium text-[#ff6b8a]">Attribution Hub</span>
            </div>
            <div className="w-12 h-0.5 border-t border-dashed border-[#34d399]/50" />
            <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          </div>

          {/* Roadmap Timeline */}
          <div className="text-left">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-6">Roadmap</h4>
            <div className="relative pl-6 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5" style={{ background: '#2a2348' }} />

              {milestones.map((m, i) => (
                <motion.div
                  key={m.quarter}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative"
                >
                  <div
                    className="absolute left-[-19px] top-1 w-3 h-3 rounded-full"
                    style={{
                      background: m.status === 'next' ? '#ff6b8a' : '#2a2348',
                      border: m.status === 'next' ? '2px solid #ff6b8a' : '2px solid #9b8ec7',
                    }}
                  />
                  <div className="flex items-baseline gap-3">
                    <span className={`text-xs font-bold ${m.status === 'next' ? 'text-[#ff6b8a]' : 'text-[#9b8ec7]'}`}>
                      {m.quarter}
                    </span>
                    <span className={`text-sm ${m.status === 'next' ? 'text-[#f0e6ff] font-medium' : 'text-[#9b8ec7]'}`}>
                      {m.title}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
