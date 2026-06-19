import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { creators, formatFollowers } from '../data/creators';
import { calculateTrueScore } from '../lib/scoring';
import CircularGauge from '../components/CircularGauge';
import { BadgeCheck, ChevronDown, TrendingUp, Users, Clock } from 'lucide-react';

export default function TrueScorePage() {
  const [selectedId, setSelectedId] = useState(creators[0].id);
  const [animKey, setAnimKey] = useState(0);
  const creator = creators.find((c) => c.id === selectedId) || creators[0];
  const score = calculateTrueScore(creator);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [selectedId]);

  const scoreColor = score.total >= 80 ? '#34d399' : score.total >= 50 ? '#ff6b8a' : '#f87171';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">TrueScore Engine</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          AI-powered creator quality scoring based on engagement, authenticity, and consistency.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Creator Selector */}
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-4">
            Select Creator
          </h3>

          <div className="relative mb-4">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full appearance-none card-surface px-4 py-3 pr-10 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50 cursor-pointer"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.niche})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8ec7] pointer-events-none" />
          </div>

          {/* Creator Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#0a0718' }}>
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-[#34d399] rounded-full p-0.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#0a0718]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#f0e6ff] truncate">{creator.name}</h4>
              <p className="text-xs text-[#9b8ec7]">{creator.handle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[11px] uppercase tracking-wider text-[#9b8ec7] bg-[#2a2348] px-2 py-0.5 rounded-full">
                  {creator.niche}
                </span>
                <span className="text-xs text-[#9b8ec7]">{formatFollowers(creator.followers)}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2a2348' }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Engagement Rate</span>
              </div>
              <span className="text-lg font-bold text-[#ff6b8a]">{creator.engagementRate}%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#2a2348' }}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Followers</span>
              </div>
              <span className="text-sm font-semibold text-[#f0e6ff]">{creator.followers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9b8ec7]" />
                <span className="text-sm text-[#9b8ec7]">Posts/Week</span>
              </div>
              <span className="text-sm font-semibold text-[#f0e6ff]">{creator.postsPerWeek}</span>
            </div>
          </div>
        </div>

        {/* Score Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Score */}
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
                  {creator.name} scores {score.total}/100 — {score.total >= 80 ? 'a highly reliable partner for brand campaigns.' : score.total >= 60 ? 'a solid choice with room for optimization.' : 'proceed with additional verification.'}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ff6b8a' }} />
                    <span className="text-xs text-[#9b8ec7]">Engagement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#9b8ec7' }} />
                    <span className="text-xs text-[#9b8ec7]">Authenticity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#34d399' }} />
                    <span className="text-xs text-[#9b8ec7]">Consistency</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Breakdown */}
          <div className="card-surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-6">
              Score Breakdown
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Engagement Quality', value: score.engagementQuality, max: 45, color: '#ff6b8a', desc: 'Actual ER vs tier benchmark' },
                { label: 'Authenticity', value: score.authenticity, max: 40, color: '#9b8ec7', desc: 'Comment ratio, growth pattern, verification' },
                { label: 'Consistency', value: score.consistency, max: 15, color: '#34d399', desc: 'Posting frequency over 30 days' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-[#f0e6ff]">{item.label}</span>
                      <span className="text-xs ml-2" style={{ color: '#9b8ec7' }}>({item.max}%)</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: item.color }}>
                      {item.value}/{item.max}
                    </span>
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
                  <p className="text-xs mt-1" style={{ color: '#9b8ec7' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
