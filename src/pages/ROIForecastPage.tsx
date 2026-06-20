import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../lib/useLiveData';
import { formatFollowers, NICHE_CONVERSION_RATES, NICHE_AOV } from '../data/creators';
import { forecastROI } from '../lib/api';
import { IndianRupee, Target, Eye, MousePointer, ShoppingBag } from 'lucide-react';

export default function ROIForecastPage() {
  const { creators, loading } = useLiveData();
  const [objective, setObjective] = useState<'awareness' | 'conversion'>('conversion');
  const [budget, setBudget] = useState(50000);
  const [apiForecast, setAPIForecast] = useState<any>(null);
  const [fetching, setFetching] = useState(false);

  const creator = creators[0];

  useEffect(() => {
    if (!creator) return;
    setFetching(true);
    forecastROI({
      followers: creator.followers,
      engagementRate: creator.engagementRate,
      niche: creator.niche,
      budget,
      objective,
    }).then(setAPIForecast).catch(() => setAPIForecast(null))
      .finally(() => setFetching(false));
  }, [creator?.id, creator?.followers, budget, objective]);

  const forecast = apiForecast?.forecast || { reach: 0, engaged: 0, clicks: 0, conversions: 0, revenue: 0, cpa: 0, roas: 0 };
  const roasColor = forecast.roas >= 3 ? '#34d399' : forecast.roas >= 1 ? '#ff6b8a' : '#f87171';

  const funnelStages = [
    { label: 'Reach', value: forecast.reach, percent: 100, icon: Eye, color: '#ff6b8a' },
    { label: 'Engaged', value: forecast.engaged, percent: forecast.reach > 0 ? Math.round((forecast.engaged / forecast.reach) * 100) : 0, icon: Target, color: '#ff6b8a80' },
    { label: 'Clicks', value: forecast.clicks, percent: forecast.reach > 0 ? Math.round((forecast.clicks / forecast.reach) * 100) : 0, icon: MousePointer, color: '#9b8ec7' },
    { label: 'Conversions', value: forecast.conversions, percent: forecast.reach > 0 ? Math.round((forecast.conversions / forecast.reach) * 100) : 0, icon: ShoppingBag, color: '#34d39960' },
    { label: 'Revenue', value: forecast.revenue, percent: forecast.reach > 0 ? Math.round((forecast.conversions / forecast.reach) * 100) : 0, icon: IndianRupee, color: '#34d399' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 rounded-full border-2 border-[#ff6b8a] border-t-transparent" /></div>;
  }

  if (!creator) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9b8ec7] text-sm">Search for a creator above to see ROI forecast</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">ROI Forecast</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Predict campaign performance with a 5-stage funnel model — powered by live API.
        </p>
        {apiForecast && (
          <span className="text-[10px] text-[#34d399] mt-1 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            Using live API data for {creator.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Objective</label>
          <div className="flex rounded-lg overflow-hidden" style={{ background: '#2a2348' }}>
            <button onClick={() => setObjective('awareness')} className={`px-4 py-2.5 text-sm font-medium transition-all ${objective === 'awareness' ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`} style={objective === 'awareness' ? { background: '#ff6b8a' } : {}}>Awareness</button>
            <button onClick={() => setObjective('conversion')} className={`px-4 py-2.5 text-sm font-medium transition-all ${objective === 'conversion' ? 'text-white' : 'text-[#9b8ec7] hover:text-[#f0e6ff]'}`} style={objective === 'conversion' ? { background: '#ff6b8a' } : {}}>Conversion</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7] mb-2 block">Budget (₹)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="card-surface px-4 py-2.5 text-sm text-[#f0e6ff] outline-none focus:ring-2 focus:ring-[#ff6b8a]/50 w-40" min={1000} step={1000} />
        </div>
        {fetching && <div className="text-xs text-[#9b8ec7] animate-pulse">Computing...</div>}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9b8ec7] mb-6">Conversion Funnel</h3>
          <div className="space-y-4">
            {funnelStages.map((stage, i) => {
              const maxBarWidth = 100;
              const barWidth = i === 0 ? maxBarWidth : Math.max(15, (stage.value / Math.max(funnelStages[0].value, 1)) * maxBarWidth);
              return (
                <motion.div key={stage.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4">
                  <div className="w-24 flex items-center gap-2 text-xs text-[#9b8ec7]"><stage.icon className="w-4 h-4" />{stage.label}</div>
                  <div className="flex-1 h-10 bg-[#0a0718] rounded-lg overflow-hidden relative">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }} className="h-full rounded-lg flex items-center px-3" style={{ background: stage.color }}>
                      <span className="text-xs font-semibold text-white whitespace-nowrap">{stage.value.toLocaleString()}</span>
                    </motion.div>
                  </div>
                  <div className="w-16 text-right"><span className="text-xs font-medium" style={{ color: stage.color }}>{i === 0 ? '100%' : `${stage.percent}%`}</span></div>
                </motion.div>
              );
            })}
          </div>
          {creator && (
            <div className="mt-6 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid #2a2348' }}>
              <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="text-sm font-medium text-[#f0e6ff]">{creator.name}</span>
                <span className="text-xs text-[#9b8ec7] ml-2">{formatFollowers(creator.followers)} &middot; {creator.engagementRate}% ER &middot; {creator.niche}</span>
              </div>
              <div className="ml-auto text-xs text-[#9b8ec7]">Conv. Rate: {((NICHE_CONVERSION_RATES[creator.niche as keyof typeof NICHE_CONVERSION_RATES] || 0.03) * 100).toFixed(1)}% &middot; AOV: ₹{(NICHE_AOV[creator.niche as keyof typeof NICHE_AOV] || 2000).toLocaleString()}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card-surface p-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Est. CPA</span>
            <div className="mt-2 text-4xl font-bold text-[#f0e6ff]">₹{forecast.cpa.toLocaleString()}</div>
            <p className="text-xs text-[#9b8ec7] mt-2">Cost per acquisition</p>
          </div>
          <div className="card-surface p-6 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[#9b8ec7]">Est. ROAS</span>
            <div className="mt-2 text-4xl font-bold" style={{ color: roasColor }}>{forecast.roas}x</div>
            <p className="text-xs text-[#9b8ec7] mt-2">Return on ad spend</p>
          </div>
          <div className="card-surface p-6 space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #2a2348' }}><span className="text-sm text-[#9b8ec7]">Expected Conversions</span><span className="text-sm font-semibold text-[#f0e6ff]">{forecast.conversions.toLocaleString()}</span></div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #2a2348' }}><span className="text-sm text-[#9b8ec7]">Projected Revenue</span><span className="text-sm font-semibold text-[#f0e6ff]">₹{forecast.revenue.toLocaleString()}</span></div>
            <div className="flex justify-between items-center py-2"><span className="text-sm text-[#9b8ec7]">Campaign Budget</span><span className="text-sm font-semibold text-[#f0e6ff]">₹{budget.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
