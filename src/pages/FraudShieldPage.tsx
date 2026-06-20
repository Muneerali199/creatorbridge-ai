import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../lib/useLiveData';
import { formatFollowers, getFollowerTier } from '../data/creators';
import { AlertTriangle, AlertCircle, CheckCircle2, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function FraudShieldPage() {
  const { creators, loading } = useLiveData();

  const creator = creators[0];
  const riskData = creator?.fraudAnalysis || { risk: 'low', ratio: 0, reason: '', benchmark: 0 };

  const riskConfig = {
    low: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: CheckCircle2, label: 'LOW RISK' },
    moderate: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: AlertTriangle, label: 'MODERATE RISK' },
    high: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: AlertCircle, label: 'HIGH RISK' },
  };
  const config = riskConfig[riskData.risk as keyof typeof riskConfig] || riskConfig.low;
  const Icon = config.icon;
  const needleAngle = Math.min(180, Math.max(0, (riskData.ratio / 3) * 180));

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 rounded-full border-2 border-[#ff6b8a] border-t-transparent" /></div>;
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9b8ec7] text-sm">Search for a creator above to run fraud analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">FraudShield</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Detect fake followers, engagement pods, and suspicious activity patterns.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-4">{creator.name}</h3>
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#0a0718' }}>
            <img src={creator?.avatar || '/images/avatar-creator-1.jpg'} alt={creator?.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h4 className="font-semibold text-[#f0e6ff]">{creator?.name}</h4>
              <p className="text-xs text-[#9b8ec7]">{creator?.handle} &middot; {creator ? formatFollowers(creator.followers) : ''}</p>
              <span className="text-[11px] uppercase tracking-wider text-[#9b8ec7] bg-[#2a2348] px-2 py-0.5 rounded-full mt-1 inline-block">{creator?.niche}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-28">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#2a2348" strokeWidth="16" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 73.3 30.7" fill="none" stroke="#34d399" strokeWidth="16" strokeLinecap="round" opacity={0.4} />
                  <path d="M 73.3 30.7 A 80 80 0 0 1 153.3 47.4" fill="none" stroke="#fbbf24" strokeWidth="16" strokeLinecap="round" opacity={0.4} />
                  <path d="M 153.3 47.4 A 80 80 0 0 1 180 100" fill="none" stroke="#f87171" strokeWidth="16" strokeLinecap="round" opacity={0.4} />
                  <motion.line
                    x1="100" y1="100" x2="100" y2="30"
                    stroke={config.color} strokeWidth="3" strokeLinecap="round"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: needleAngle }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    style={{ transformOrigin: '100px 100px' }}
                  />
                  <circle cx="100" cy="100" r="6" fill={config.color} />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <span className="text-2xl font-bold" style={{ color: config.color }}>{riskData.ratio}x</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: config.bg, border: `1px solid ${config.color}40` }}>
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                  <span className="text-sm font-bold" style={{ color: config.color }}>{config.label}</span>
                </div>
                <h3 className="text-xl font-bold text-[#f0e6ff] mb-2">
                  {riskData.risk === 'low' ? 'Healthy Engagement Pattern' : riskData.risk === 'moderate' ? 'Review Recommended' : 'Significant Concerns Detected'}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9b8ec7' }}>{riskData.reason}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Engagement Rate', value: `${creator?.engagementRate || 0}%`, sub: `Benchmark: ${riskData.benchmark}%` },
              { icon: BarChart3, label: 'ER vs Benchmark', value: `${riskData.ratio}x`, sub: riskData.ratio >= 0.7 && riskData.ratio <= 2.5 ? 'Healthy' : riskData.ratio > 2.5 ? 'Elevated' : 'Low' },
              { icon: Users, label: 'Follower Tier', value: creator ? getFollowerTier(creator.followers) : '', sub: creator ? formatFollowers(creator.followers) : '' },
              { icon: Icon, label: 'ML Fraud Score', value: creator ? `${creator.mlFraudScore || 0}/100` : '0/100', sub: (creator?.mlFraudScore || 0) >= 70 ? 'High Risk' : (creator?.mlFraudScore || 0) >= 40 ? 'Moderate' : 'Low Risk' },
            ].map((metric, i) => (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-surface p-4 hover:scale-[1.02] transition-transform duration-200">
                <metric.icon className="w-5 h-5 text-[#9b8ec7] mb-2" />
                <div className="text-lg font-bold text-[#f0e6ff]">{metric.value}</div>
                <div className="text-xs text-[#9b8ec7] mt-0.5">{metric.label}</div>
                <div className="text-[11px] mt-1" style={{ color: config.color }}>{metric.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
