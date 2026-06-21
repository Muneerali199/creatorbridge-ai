import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../lib/useLiveData';
import { allNiches, type Niche } from '../data/creators';
import { calculateCreatorValue } from '../lib/scoring';
import { Calculator, TrendingUp, BadgeCheck, Users } from 'lucide-react';

export default function ValueCalculatorPage() {
  const { creators, loading } = useLiveData();
  const [useCustom, setUseCustom] = useState(false);
  const [customFollowers, setCustomFollowers] = useState(50000);
  const [customER, setCustomER] = useState(3.5);
  const [customNiche, setCustomNiche] = useState<Niche>('Beauty');
  const [authenticity, setAuthenticity] = useState(75);

  const presetCreator = creators[0];

  const creator = useCustom || !presetCreator ? {
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
    trueScore: 0,
    fraudRisk: 0,
    mlFraudScore: 0,
    scoreBreakdown: { total: 0, engagementQuality: 0, authenticity: 0, consistency: 0 },
    fraudAnalysis: { risk: 'low', ratio: 0, reason: '', benchmark: 0 },
    valuation: { basePrice: 0, rangeLow: 0, rangeHigh: 0, engagementMultiplier: 0, authenticityMultiplier: 0, nicheRate: 0 },
  } : presetCreator;

  const value = useMemo(() => calculateCreatorValue(
    creator.followers, creator.engagementRate, creator.authenticityScore, creator.niche
  ), [creator]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 rounded-full border-2 border-[#ff6b8a] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">Creator Value Calculator</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>Compute fair pricing based on followers, niche, engagement, and authenticity.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card-surface p-6 space-y-6">
          <div className="flex rounded-lg overflow-hidden" style={{ background: '#2a2348' }}>
            <button onClick={() => setUseCustom(false)} className={`flex-1 py-2.5 text-sm font-medium transition-all ${!useCustom ? 'text-white' : 'text-[#9b8ec7]'}`} style={!useCustom ? { background: '#ff6b8a' } : {}}>Search Result</button>
            <button onClick={() => setUseCustom(true)} className={`flex-1 py-2.5 text-sm font-medium transition-all ${useCustom ? 'text-white' : 'text-[#9b8ec7]'}`} style={useCustom ? { background: '#ff6b8a' } : {}}>Custom Inputs</button>
          </div>

          {!useCustom && (
            <div>
              {presetCreator ? (
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#0a0718' }}>
                  <img src={presetCreator.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-[#f0e6ff]">{presetCreator.name}</h4>
                    <p className="text-xs text-[#9b8ec7]">{presetCreator.handle} &middot; {presetCreator.niche}</p>
                    <p className="text-xs text-[#9b8ec7] mt-0.5">{presetCreator.followers.toLocaleString()} followers &middot; {presetCreator.engagementRate}% ER</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#9b8ec7] text-center py-8">Search for a creator above to see their valuation</p>
              )}
            </div>
          )}

          {useCustom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Followers</label>
                  <input type="number" value={customFollowers} onChange={(e) => setCustomFollowers(Number(e.target.value))} className="w-full card-surface px-4 py-3 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50" min={100} step={1000} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Engagement Rate (%)</label>
                  <input type="number" value={customER} onChange={(e) => setCustomER(Number(e.target.value))} className="w-full card-surface px-4 py-3 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50" min={0.1} max={100} step={0.1} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Niche</label>
                <div className="flex flex-wrap gap-1.5">
                  {allNiches.map((n) => (
                    <button key={n} onClick={() => setCustomNiche(n)} className={`text-xs px-3 py-1.5 rounded-full transition-all ${customNiche === n ? 'text-white' : 'text-[#9b8ec7]'}`} style={customNiche === n ? { background: '#ff6b8a' } : { background: '#2a2348' }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Authenticity Score</label>
              <span className="text-sm font-bold text-[#ff6b8a]">{authenticity}%</span>
            </div>
            <input type="range" min={0} max={100} value={authenticity} onChange={(e) => setAuthenticity(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #ff6b8a 0%, #ff6b8a ${authenticity}%, #2a2348 ${authenticity}%, #2a2348 100%)` }} />
            <div className="flex justify-between mt-1"><span className="text-[10px] text-[#9b8ec7]">0</span><span className="text-[10px] text-[#9b8ec7]">50</span><span className="text-[10px] text-[#9b8ec7]">100</span></div>
          </div>
        </div>

        <motion.div key={useCustom ? `${customFollowers}-${customER}` : creator.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 card-surface p-8 flex flex-col items-center justify-center text-center">
          <Calculator className="w-8 h-8 text-[#ff6b8a] mb-4" />
          <div className="text-5xl font-bold text-[#ff6b8a] mb-2">₹{value.basePrice.toLocaleString()}</div>
          <div className="text-sm text-[#9b8ec7] mb-8">Range: ₹{value.rangeLow.toLocaleString()} - ₹{value.rangeHigh.toLocaleString()}</div>
          <div className="w-full space-y-3">
            {[
              { icon: Users, label: 'Base Rate', value: `₹${value.nicheRate}/1K followers` },
              { icon: TrendingUp, label: 'Engagement Multiplier', value: `${value.engagementMultiplier}x` },
              { icon: BadgeCheck, label: 'Authenticity Multiplier', value: `${value.authenticityMultiplier}x` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#0a0718' }}>
                <div className="flex items-center gap-2"><item.icon className="w-4 h-4 text-[#9b8ec7]" /><span className="text-xs text-[#9b8ec7]">{item.label}</span></div>
                <span className="text-sm font-semibold text-[#f0e6ff]">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xs text-[#9b8ec7]">Formula: (Followers/1000) × Niche Rate × ER Multiplier × Auth Multiplier</div>
        </motion.div>
      </div>
    </div>
  );
}
