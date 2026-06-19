import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { creators, formatFollowers, NICHE_CONVERSION_RATES, NICHE_AOV } from '../data/creators';
import { calculateROIForecast } from '../lib/scoring';
import { ChevronDown, IndianRupee, Target, Eye, MousePointer, ShoppingBag } from 'lucide-react';

export default function ROIForecastPage() {
  const [selectedId, setSelectedId] = useState(creators[0].id);
  const [objective, setObjective] = useState<'awareness' | 'conversion'>('conversion');
  const [budget, setBudget] = useState(50000);

  const creator = creators.find((c) => c.id === selectedId) || creators[0];
  const forecast = useMemo(
    () => calculateROIForecast(creator, budget, objective),
    [creator, budget, objective]
  );

  const roasColor = forecast.roas >= 3 ? '#34d399' : forecast.roas >= 1 ? '#ff6b8a' : '#f87171';

  const funnelStages = [
    { label: 'Reach', value: forecast.reach, percent: 100, icon: Eye, color: '#ff6b8a' },
    { label: 'Engaged', value: forecast.engaged, percent: Math.round((forecast.engaged / forecast.reach) * 100), icon: Target, color: '#ff6b8a80' },
    { label: 'Clicks', value: forecast.clicks, percent: Math.round((forecast.clicks / forecast.reach) * 100), icon: MousePointer, color: '#9b8ec7' },
    { label: 'Conversions', value: forecast.conversions, percent: Math.round((forecast.conversions / forecast.reach) * 100), icon: ShoppingBag, color: '#34d39960' },
    { label: 'Revenue', value: forecast.revenue, percent: Math.round((forecast.conversions / forecast.reach) * 100), icon: IndianRupee, color: '#34d399' },
  ];

  const maxBarWidth = 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">ROI Forecast</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Predict campaign performance with a 5-stage funnel model.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Creator</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="appearance-none card-surface px-4 py-2.5 pr-10 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50 cursor-pointer min-w-[200px]"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.niche})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b8ec7] pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Objective</label>
          <div className="flex rounded-lg overflow-hidden" style={{ background: '#2a2348' }}>
            <button
              onClick={() => setObjective('awareness')}
              className={`px-4 py-2.5 text-sm font-medium transition-all ${objective === 'awareness' ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`}
              style={objective === 'awareness' ? { background: '#ff6b8a' } : {}}
            >
              Awareness
            </button>
            <button
              onClick={() => setObjective('conversion')}
              className={`px-4 py-2.5 text-sm font-medium transition-all ${objective === 'conversion' ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`}
              style={objective === 'conversion' ? { background: '#ff6b8a' } : {}}
            >
              Conversion
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Budget (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="card-surface px-4 py-2.5 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50 w-40"
            min={1000}
            step={1000}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-3 card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-6">
            Conversion Funnel
          </h3>
          <div className="space-y-4">
            {funnelStages.map((stage, i) => {
              const barWidth = i === 0 ? maxBarWidth : Math.max(15, (stage.value / funnelStages[0].value) * maxBarWidth);
              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 flex items-center gap-2 text-xs text-[#9b8ec7]">
                    <stage.icon className="w-4 h-4" />
                    {stage.label}
                  </div>
                  <div className="flex-1 h-10 bg-[#0a0718] rounded-lg overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-lg flex items-center px-3"
                      style={{ background: stage.color }}
                    >
                      <span className="text-xs font-semibold text-white whitespace-nowrap">
                        {stage.value.toLocaleString()}
                      </span>
                    </motion.div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-medium" style={{ color: stage.color }}>
                      {i === 0 ? '100%' : `${stage.percent}%`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Creator Info */}
          <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid #2a2348' }}>
            <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <span className="text-sm font-medium text-[#f0e6ff]">{creator.name}</span>
              <span className="text-xs text-[#9b8ec7] ml-2">{formatFollowers(creator.followers)} &middot; {creator.engagementRate}% ER &middot; {creator.niche}</span>
            </div>
            <div className="ml-auto text-xs text-[#9b8ec7]">
              Conv. Rate: {(NICHE_CONVERSION_RATES[creator.niche] * 100).toFixed(1)}% &middot; AOV: ₹{NICHE_AOV[creator.niche].toLocaleString()}
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-surface p-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Est. CPA</span>
            <div className="mt-2 text-4xl font-bold text-[#f0e6ff]">
              ₹{forecast.cpa.toLocaleString()}
            </div>
            <p className="text-xs text-[#9b8ec7] mt-2">Cost per acquisition</p>
          </div>

          <div className="card-surface p-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Est. ROAS</span>
            <div className="mt-2 text-4xl font-bold" style={{ color: roasColor }}>
              {forecast.roas}x
            </div>
            <p className="text-xs text-[#9b8ec7] mt-2">Return on ad spend</p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #2a2348' }}>
              <span className="text-sm text-[#9b8ec7]">Expected Conversions</span>
              <span className="text-sm font-semibold text-[#f0e6ff]">{forecast.conversions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #2a2348' }}>
              <span className="text-sm text-[#9b8ec7]">Projected Revenue</span>
              <span className="text-sm font-semibold text-[#f0e6ff]">₹{forecast.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[#9b8ec7]">Campaign Budget</span>
              <span className="text-sm font-semibold text-[#f0e6ff]">₹{budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
