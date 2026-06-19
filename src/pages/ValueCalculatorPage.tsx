import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { creators, allNiches, type Niche } from '../data/creators';
import { calculateCreatorValue } from '../lib/scoring';
import { Calculator, TrendingUp, BadgeCheck, Users } from 'lucide-react';

export default function ValueCalculatorPage() {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [selectedId, setSelectedId] = useState(creators[0].id);
  const [customFollowers, setCustomFollowers] = useState(50000);
  const [customER, setCustomER] = useState(3.5);
  const [customNiche, setCustomNiche] = useState<Niche>('Beauty');
  const [authenticity, setAuthenticity] = useState(75);

  const creator = mode === 'preset'
    ? creators.find((c) => c.id === selectedId) || creators[0]
    : {
        id: 'custom',
        name: 'Custom Creator',
        handle: '@custom',
        avatar: '/images/avatar-creator-1.jpg',
        niche: customNiche,
        followers: customFollowers,
        engagementRate: customER,
        authenticityScore: authenticity,
        postsPerWeek: 5,
        commentLikeRatio: 0.1,
        verified: false,
        growthCurve: 'smooth' as const,
        location: 'India',
      };

  const value = useMemo(() => calculateCreatorValue(creator), [creator]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">Creator Value Calculator</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Compute fair pricing based on followers, niche, engagement, and authenticity.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-3 card-surface p-6 space-y-6">
          {/* Mode Toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ background: '#2a2348' }}>
            <button
              onClick={() => setMode('preset')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === 'preset' ? 'text-white' : 'text-[#9b8ec7]'}`}
              style={mode === 'preset' ? { background: '#ff6b8a' } : {}}
            >
              Select Creator
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === 'custom' ? 'text-white' : 'text-[#9b8ec7]'}`}
              style={mode === 'custom' ? { background: '#ff6b8a' } : {}}
            >
              Custom Inputs
            </button>
          </div>

          {mode === 'preset' ? (
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Creator</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {creators.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all text-left ${
                      selectedId === c.id ? 'ring-2 ring-[#ff6b8a]' : ''
                    }`}
                    style={{ background: selectedId === c.id ? 'rgba(255,107,138,0.1)' : '#0a0718' }}
                  >
                    <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#f0e6ff] truncate">{c.name}</div>
                      <div className="text-[10px] text-[#9b8ec7]">{c.niche}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Followers</label>
                  <input
                    type="number"
                    value={customFollowers}
                    onChange={(e) => setCustomFollowers(Number(e.target.value))}
                    className="w-full card-surface px-4 py-3 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50"
                    min={100}
                    step={1000}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Engagement Rate (%)</label>
                  <input
                    type="number"
                    value={customER}
                    onChange={(e) => setCustomER(Number(e.target.value))}
                    className="w-full card-surface px-4 py-3 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50"
                    min={0.1}
                    max={100}
                    step={0.1}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Niche</label>
                <div className="flex flex-wrap gap-1.5">
                  {allNiches.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCustomNiche(n)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                        customNiche === n ? 'text-white' : 'text-[#9b8ec7]'
                      }`}
                      style={customNiche === n ? { background: '#ff6b8a' } : { background: '#2a2348' }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Authenticity Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Authenticity Score</label>
              <span className="text-sm font-bold text-[#ff6b8a]">{authenticity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={authenticity}
              onChange={(e) => setAuthenticity(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #ff6b8a 0%, #ff6b8a ${authenticity}%, #2a2348 ${authenticity}%, #2a2348 100%)`,
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#9b8ec7]">0</span>
              <span className="text-[10px] text-[#9b8ec7]">50</span>
              <span className="text-[10px] text-[#9b8ec7]">100</span>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <motion.div
          key={mode === 'preset' ? selectedId : `${customFollowers}-${customER}-${customNiche}-${authenticity}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 card-surface p-8 flex flex-col items-center justify-center text-center"
        >
          <Calculator className="w-8 h-8 text-[#ff6b8a] mb-4" />

          <div className="text-5xl font-bold text-[#ff6b8a] mb-2">
            ₹{value.basePrice.toLocaleString()}
          </div>
          <div className="text-sm text-[#9b8ec7] mb-8">
            Range: ₹{value.rangeLow.toLocaleString()} - ₹{value.rangeHigh.toLocaleString()}
          </div>

          <div className="w-full space-y-3">
            {[
              { icon: Users, label: 'Base Rate', value: `₹${value.nicheRate}/1K followers` },
              { icon: TrendingUp, label: 'Engagement Multiplier', value: `${value.engagementMultiplier}x` },
              { icon: BadgeCheck, label: 'Authenticity Multiplier', value: `${value.authenticityMultiplier}x` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: '#0a0718' }}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-[#9b8ec7]" />
                  <span className="text-xs text-[#9b8ec7]">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-[#f0e6ff]">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-[#9b8ec7]">
            Formula: (Followers/1000) × Niche Rate × ER Multiplier × Auth Multiplier
          </div>
        </motion.div>
      </div>
    </div>
  );
}
