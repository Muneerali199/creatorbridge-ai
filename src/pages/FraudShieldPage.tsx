import { useState } from 'react';
import { motion } from 'framer-motion';
import { creators, formatFollowers, getFollowerTier } from '../data/creators';
import { calculateFraudRisk } from '../lib/scoring';
import { ChevronDown, AlertTriangle, AlertCircle, CheckCircle2, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function FraudShieldPage() {
  const [selectedId, setSelectedId] = useState(creators[0].id);
  const creator = creators.find((c) => c.id === selectedId) || creators[0];
  const risk = calculateFraudRisk(creator);

  const riskConfig = {
    low: {
      color: '#34d399',
      bg: 'rgba(52,211,153,0.1)',
      icon: CheckCircle2,
      label: 'LOW RISK',
    },
    moderate: {
      color: '#fbbf24',
      bg: 'rgba(251,191,36,0.1)',
      icon: AlertTriangle,
      label: 'MODERATE RISK',
    },
    high: {
      color: '#f87171',
      bg: 'rgba(248,113,113,0.1)',
      icon: AlertCircle,
      label: 'HIGH RISK',
    },
  };

  const config = riskConfig[risk.risk];
  const Icon = config.icon;
  const needleAngle = Math.min(180, Math.max(0, (risk.ratio / 3) * 180));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">FraudShield</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Detect fake followers, engagement pods, and suspicious activity patterns.
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

          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#0a0718' }}>
            <img src={creator.avatar} alt={creator.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h4 className="font-semibold text-[#f0e6ff]">{creator.name}</h4>
              <p className="text-xs text-[#9b8ec7]">{creator.handle} &middot; {formatFollowers(creator.followers)}</p>
              <span className="text-[11px] uppercase tracking-wider text-[#9b8ec7] bg-[#2a2348] px-2 py-0.5 rounded-full mt-1 inline-block">
                {creator.niche}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Gauge + Verdict */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Semi-circle gauge */}
              <div className="relative w-48 h-28">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#2a2348"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Green zone */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 73.3 30.7"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity={0.4}
                  />
                  {/* Yellow zone */}
                  <path
                    d="M 73.3 30.7 A 80 80 0 0 1 153.3 47.4"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity={0.4}
                  />
                  {/* Red zone */}
                  <path
                    d="M 153.3 47.4 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity={0.4}
                  />
                  {/* Needle */}
                  <motion.line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="30"
                    stroke={config.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: needleAngle }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    style={{ transformOrigin: '100px 100px' }}
                  />
                  {/* Center dot */}
                  <circle cx="100" cy="100" r="6" fill={config.color} />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <span className="text-2xl font-bold" style={{ color: config.color }}>
                    {risk.ratio}x
                  </span>
                </div>
              </div>

              {/* Verdict */}
              <div className="flex-1">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ background: config.bg, border: `1px solid ${config.color}40` }}
                >
                  <Icon className="w-4 h-4" style={{ color: config.color }} />
                  <span className="text-sm font-bold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#f0e6ff] mb-2">
                  {risk.risk === 'low' ? 'Healthy Engagement Pattern' : risk.risk === 'moderate' ? 'Review Recommended' : 'Significant Concerns Detected'}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9b8ec7' }}>
                  {risk.reason}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Engagement Rate', value: `${creator.engagementRate}%`, sub: `Benchmark: ${risk.benchmark}%` },
              { icon: BarChart3, label: 'ER vs Benchmark', value: `${risk.ratio}x`, sub: risk.ratio >= 0.7 && risk.ratio <= 2.5 ? 'Healthy' : risk.ratio > 2.5 ? 'Elevated' : 'Low' },
              { icon: Users, label: 'Follower Tier', value: getFollowerTier(creator.followers), sub: formatFollowers(creator.followers) },
              { icon: Icon, label: 'Risk Score', value: `${risk.risk === 'low' ? 15 : risk.risk === 'moderate' ? 55 : 85}/100`, sub: config.label },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-surface p-4 hover:scale-[1.02] transition-transform duration-200"
              >
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
