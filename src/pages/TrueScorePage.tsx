import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../lib/useLiveData';
import { formatFollowers } from '../data/creators';
import CircularGauge from '../components/CircularGauge';
import { BadgeCheck, TrendingUp, Users, Clock } from 'lucide-react';
import { recomputeScore } from '../lib/api';

export default function TrueScorePage() {
  const { creators, loading } = useLiveData();
  const [animKey, setAnimKey] = useState(0);
  const [recomputing, setRecomputing] = useState(false);

  const creator = creators[0];
  const score = creator?.scoreBreakdown || { total: 0, engagementQuality: 0, authenticity: 0, consistency: 0 };

  useEffect(() => {
    if (creator) setAnimKey((k) => k + 1);
  }, [creator?.id]);

  const scoreColor = score.total >= 80 ? '#34d399' : score.total >= 50 ? '#ff6b8a' : '#f87171';

  const handleRecompute = async () => {
    if (!creator || recomputing) return;
    setRecomputing(true);
    try {
      await recomputeScore(creator.id);
    } catch {}
    setRecomputing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 rounded-full border-2 border-[#ff6b8a] border-t-transparent" /></div>;
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9b8ec7] text-sm">Search for a creator above to see their TrueScore</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">TrueScore Engine</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          AI-powered creator quality scoring based on engagement, authenticity, and consistency.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-4">
            {creator.name}
          </h3>

          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#0a0718' }}>
            <div className="relative">
              <img src={creator?.avatar || '/images/avatar-creator-1.jpg'} alt={creator?.name} className="w-16 h-16 rounded-full object-cover" />
              {creator?.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#34d399] rounded-full p-0.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#0a0718]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#f0e6ff] truncate">{creator?.name}</h4>
              <p className="text-xs text-[#9b8ec7]">{creator?.handle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] uppercase tracking-wider text-[#9b8ec7] bg-[#2a2348] px-2 py-0.5 rounded-full">{creator?.niche}</span>
                <span className="text-xs text-[#9b8ec7]">{creator ? formatFollowers(creator.followers) : ''}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2a2348' }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Engagement Rate</span>
              </div>
              <span className="text-lg font-bold text-[#ff6b8a]">{creator?.engagementRate || 0}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2a2348' }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Followers</span>
              </div>
              <span className="text-sm font-semibold text-[#f0e6ff]">{(creator?.followers || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Posts/Week</span>
              </div>
              <span className="text-sm font-semibold text-[#f0e6ff]">{creator?.postsPerWeek || 0}</span>
            </div>
          </div>

          <button
            onClick={handleRecompute}
            disabled={recomputing || !creator}
            className="w-full mt-4 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: '#ff6b8a' }}
          >
            {recomputing ? 'Recomputing...' : 'Recompute Score from API'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card-surface p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <CircularGauge value={score.total} size={160} strokeWidth={12} color={scoreColor} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#f0e6ff] mb-1">
                  {score.total >= 80 ? 'Excellent Creator' : score.total >= 60 ? 'Good Creator' : score.total >= 40 ? 'Average Creator' : 'Needs Improvement'}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#9b8ec7' }}>
                  {creator?.name} scores {score.total}/100 — {score.total >= 80 ? 'a highly reliable partner for brand campaigns.' : score.total >= 60 ? 'a solid choice with room for optimization.' : 'proceed with additional verification.'}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#ff6b8a' }} /><span className="text-xs text-[#9b8ec7]">Engagement</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#9b8ec7' }} /><span className="text-xs text-[#9b8ec7]">Authenticity</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: '#34d399' }} /><span className="text-xs text-[#9b8ec7]">Consistency</span></div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="card-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-6">Score Breakdown</h3>
            <div className="space-y-6">
              {[
                { label: 'Engagement Quality', value: score.engagementQuality, max: 45, color: '#ff6b8a' },
                { label: 'Authenticity', value: score.authenticity, max: 40, color: '#9b8ec7' },
                { label: 'Consistency', value: score.consistency, max: 15, color: '#34d399' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#f0e6ff]">{item.label} ({item.max}%)</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}/{item.max}</span>
                  </div>
                  <div className="h-2 bg-[#2a2348] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.15 + 0.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
