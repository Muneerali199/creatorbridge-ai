import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveData } from '../lib/useLiveData';
import { type Niche, type FollowerTier, getFollowerTier } from '../data/creators';
import { calculateDealMatchScore, calculateCreatorValue, getDeliverables, getTimeline } from '../lib/scoring';
import CreatorCard from '../components/CreatorCard';
import { Filter, X, FileText } from 'lucide-react';

const allNiches: Niche[] = ['Tech', 'Beauty', 'Fitness', 'Food', 'Fashion', 'Travel', 'Finance', 'Gaming'];
const allTiers: FollowerTier[] = ['Nano', 'Micro', 'Mid', 'Macro', 'Mega'];

export default function DealMatchPage() {
  const { creators, loading } = useLiveData();
  const [niches, setNiches] = useState<Niche[]>([]);
  const [tiers, setTiers] = useState<FollowerTier[]>([]);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(500000);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  useEffect(() => {
    if (results.length > 0 && !selectedCreatorId) {
      setSelectedCreatorId(results[0].creator.id);
    }
  }, [results, selectedCreatorId]);

  const filters = useMemo(() => ({ niches, minBudget, maxBudget, tiers }), [niches, minBudget, maxBudget, tiers]);

  const results = useMemo(() => {
    return creators
      .filter((c) => tiers.length === 0 || tiers.includes(getFollowerTier(c.followers)))
      .map((c) => calculateDealMatchScore(c, filters))
      .sort((a, b) => b.compositeScore - a.compositeScore);
  }, [creators, filters]);

  const selectedResult = results.find((r) => r.creator.id === selectedCreatorId);
  const selectedValue = selectedResult ? calculateCreatorValue(selectedResult.creator) : null;
  const selectedTier = selectedResult ? getFollowerTier(selectedResult.creator.followers) : null;

  const toggleNiche = (n: Niche) => setNiches((p) => p.includes(n) ? p.filter((x) => x !== n) : [...p, n]);
  const toggleTier = (t: FollowerTier) => setTiers((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 rounded-full border-2 border-[#ff6b8a] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">DealMatch</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>AI-ranked creator recommendations with auto-generated deal briefs. <span className="text-[#34d399] text-[10px]">Live data</span></p>
      </div>

      <div className="glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#9b8ec7]" />
          <span className="text-sm font-medium text-[#9b8ec7]">Filters</span>
          {(niches.length > 0 || tiers.length > 0 || minBudget > 0) && (
            <button onClick={() => { setNiches([]); setTiers([]); setMinBudget(0); setMaxBudget(500000); }} className="ml-auto text-xs text-[#ff6b8a] hover:text-[#ff6b8a]/80 flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-[#9b8ec7] mb-2 block">Niches</label>
            <div className="flex flex-wrap gap-1.5">
              {allNiches.map((n) => (
                <button key={n} onClick={() => toggleNiche(n)} className={`text-xs px-3 py-1.5 rounded-full transition-all ${niches.includes(n) ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`} style={niches.includes(n) ? { background: '#ff6b8a' } : { background: '#2a2348' }}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#9b8ec7] mb-2 block">Budget Range (₹)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={minBudget} onChange={(e) => setMinBudget(Number(e.target.value))} className="card-surface px-3 py-2 text-xs text-[#f0e6ff] outline-none w-24" placeholder="Min" />
              <span className="text-[#9b8ec7]">-</span>
              <input type="number" value={maxBudget} onChange={(e) => setMaxBudget(Number(e.target.value))} className="card-surface px-3 py-2 text-xs text-[#f0e6ff] outline-none w-24" placeholder="Max" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#9b8ec7] mb-2 block">Follower Tiers</label>
            <div className="flex flex-wrap gap-1.5">
              {allTiers.map((t) => (
                <button key={t} onClick={() => toggleTier(t)} className={`text-xs px-3 py-1.5 rounded-full transition-all ${tiers.includes(t) ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`} style={tiers.includes(t) ? { background: '#34d399', color: '#0a0718' } : { background: '#2a2348' }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7]">Ranked Results</h3>
            <span className="text-xs text-[#9b8ec7]">{results.length} creators</span>
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
            {results.map((r, i) => (
              <CreatorCard key={r.creator.id} creator={r.creator} score={r.compositeScore} rank={i + 1} selected={selectedCreatorId === r.creator.id} onClick={() => setSelectedCreatorId(r.creator.id)} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedResult && selectedValue && selectedTier ? (
              <motion.div key={selectedResult.creator.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="card-surface p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,107,138,0.15)' }}><FileText className="w-5 h-5 text-[#ff6b8a]" /></div>
                  <h3 className="font-semibold text-[#f0e6ff]">Deal Brief</h3>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#0a0718' }}>
                  <img src={selectedResult.creator.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <span className="text-sm font-medium text-[#f0e6ff]">{selectedResult.creator.name}</span>
                    <div className="text-xs text-[#9b8ec7]">{selectedResult.creator.niche} &middot; Score: {selectedResult.compositeScore}</div>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-[#9b8ec7]">Suggested Fee</span>
                  <div className="text-3xl font-bold text-[#ff6b8a]">₹{selectedValue.basePrice.toLocaleString()}</div>
                  <span className="text-xs text-[#9b8ec7]">Range: ₹{selectedValue.rangeLow.toLocaleString()} - ₹{selectedValue.rangeHigh.toLocaleString()}</span>
                </div>
                <div className="space-y-3 pt-3" style={{ borderTop: '1px solid #2a2348' }}>
                  {[
                    { label: 'Deliverables', value: getDeliverables(selectedTier) },
                    { label: 'Timeline', value: getTimeline(selectedTier) },
                    { label: 'Payment Terms', value: '50% upfront, 50% on delivery' },
                    { label: 'Usage Rights', value: '30-day digital usage, non-exclusive' },
                  ].map((item) => (
                    <div key={item.label}><span className="text-xs text-[#9b8ec7]">{item.label}</span><p className="text-sm font-medium text-[#f0e6ff] mt-0.5">{item.value}</p></div>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: '#ff6b8a' }}>Generate Contract</button>
              </motion.div>
            ) : (
              <div className="card-surface p-8 text-center"><FileText className="w-12 h-12 text-[#2a2348] mx-auto mb-4" /><p className="text-sm text-[#9b8ec7]">Select a creator to view their deal brief</p></div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
