import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Handshake,
  Filter,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Star,
  Sparkles,
  Briefcase,
  Users,
  Tags,
} from 'lucide-react';
import type { Niche } from '../data/creators';

const allNiches: Niche[] = ['Tech', 'Beauty', 'Fitness', 'Food', 'Fashion', 'Travel', 'Finance', 'Gaming'];

interface CreatorResult {
  id: string;
  username: string;
  niche: string;
  keywords: string;
  followers: number;
  avatar: string | null;
  tier: string;
  engagementRate: number;
  trueScore: number;
  compositeScore: number;
  nicheFit: number;
  budgetFit: number;
  valueRange: { low: number; high: number };
  fraudRisk: string;
}

export default function CommerceBridgePage() {
  const [brandName, setBrandName] = useState('');
  const [brandNiche, setBrandNiche] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [minBudget, setMinBudget] = useState(10000);
  const [maxBudget, setMaxBudget] = useState(200000);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CreatorResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  const discoverCreators = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (brandNiche) params.set('niche', brandNiche);
      if (brandKeywords.trim()) params.set('keywords', brandKeywords.trim());
      params.set('minBudget', String(minBudget));
      params.set('maxBudget', String(maxBudget));
      if (brandName) params.set('brand', brandName);

      const res = await fetch(`/api/brands/discover?${params}`);
      const data = await res.json();
      setResults(data.creators || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (n: number) =>
    n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f0e6ff]">Brand Discovery</h1>
        <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>
          Find the perfect creators for your brand. Filter by industry, budget, and audience.
        </p>
      </div>

      {/* Brand Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9b8ec7' }}>
              <Briefcase className="w-3.5 h-3.5 inline mr-1.5" />
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Nike, L'Oreal..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#1a1535',
                border: '1px solid #2a2348',
                color: '#f0e6ff',
              }}
            />
          </div>

          {/* Niche Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9b8ec7' }}>
              <Filter className="w-3.5 h-3.5 inline mr-1.5" />
              Industry / Niche
            </label>
            <select
              value={brandNiche}
              onChange={(e) => setBrandNiche(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#1a1535',
                border: '1px solid #2a2348',
                color: brandNiche ? '#f0e6ff' : '#6b608c',
              }}
            >
              <option value="">All Industries</option>
              {allNiches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9b8ec7' }}>
              <Tags className="w-3.5 h-3.5 inline mr-1.5" />
              Keywords
            </label>
            <input
              type="text"
              value={brandKeywords}
              onChange={(e) => setBrandKeywords(e.target.value)}
              placeholder="e.g. shoes, cosmetics, engineering..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#1a1535',
                border: '1px solid #2a2348',
                color: '#f0e6ff',
              }}
            />
          </div>

          {/* Min Budget */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9b8ec7' }}>
              <DollarSign className="w-3.5 h-3.5 inline mr-1.5" />
              Min Budget
            </label>
            <input
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              min={0}
              step={5000}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#1a1535',
                border: '1px solid #2a2348',
                color: '#f0e6ff',
              }}
            />
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9b8ec7' }}>
              <DollarSign className="w-3.5 h-3.5 inline mr-1.5" />
              Max Budget
            </label>
            <input
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              min={0}
              step={5000}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#1a1535',
                border: '1px solid #2a2348',
                color: '#f0e6ff',
              }}
            />
          </div>
        </div>

        <button
          onClick={discoverCreators}
          disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
          style={{
            background: loading ? '#2a2348' : 'linear-gradient(135deg, #7c3aed, #ff6b6b)',
            color: '#fff',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Discovering...
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Find My Creators
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      {searched && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-surface p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full" style={{ background: '#2a2348' }} />
                    <div className="flex-1">
                      <div className="h-4 w-24 rounded" style={{ background: '#2a2348' }} />
                      <div className="h-3 w-16 rounded mt-2" style={{ background: '#2a2348' }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded-xl" style={{ background: '#2a2348' }} />
                    <div className="h-8 w-16 rounded-xl" style={{ background: '#2a2348' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" style={{ color: '#9b8ec7' }} />
                <span className="text-sm" style={{ color: '#9b8ec7' }}>
                  {results.length} creator{results.length !== 1 ? 's' : ''} found
                  {brandNiche ? ` in ${brandNiche}` : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((creator, idx) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-surface p-5 hover:border-[#7c3aed]/50 transition-all duration-200 cursor-pointer group"
                    style={{ borderColor: '#2a2348' }}
                    onClick={() => window.open(`https://instagram.com/${creator.username}`, '_blank')}
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #ff6b6b)' }}
                      >
                        {creator.avatar ? (
                          <img src={creator.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          creator.username[0].toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#f0e6ff] truncate">
                            @{creator.username}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-medium"
                            style={{
                              background: creator.fraudRisk === 'low' ? 'rgba(16,185,129,0.15)' :
                                creator.fraudRisk === 'moderate' ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)',
                              color: creator.fraudRisk === 'low' ? '#10b981' :
                                creator.fraudRisk === 'moderate' ? '#fbbf24' : '#ef4444',
                            }}
                          >
                            <ShieldCheck className="w-3 h-3 inline mr-0.5" />
                            {creator.fraudRisk}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color: '#7c3aed' }}>
                            {creator.niche}
                          </span>
                          <span className="text-xs" style={{ color: '#6b608c' }}>·</span>
                          <span className="text-xs" style={{ color: '#6b608c' }}>
                            {formatNumber(creator.followers)} followers
                          </span>
                        </div>
                        {creator.keywords && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {creator.keywords.split(',').slice(0, 3).map((kw) => (
                              <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
                                {kw.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4" style={{ color: '#fbbf24' }} />
                        <span className="text-lg font-bold text-[#f0e6ff]">{creator.compositeScore}</span>
                        <span className="text-xs" style={{ color: '#6b608c' }}>match</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#1a1535', color: '#9b8ec7', border: '1px solid #2a2348' }}>
                        {creator.tier}
                      </span>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="p-2 rounded-lg text-center" style={{ background: '#1a1535' }}>
                        <div className="text-xs font-semibold" style={{ color: '#10b981' }}>{creator.trueScore}</div>
                        <div className="text-[10px]" style={{ color: '#6b608c' }}>TrueScore</div>
                      </div>
                      <div className="p-2 rounded-lg text-center" style={{ background: '#1a1535' }}>
                        <div className="text-xs font-semibold" style={{ color: '#7c3aed' }}>{creator.nicheFit}%</div>
                        <div className="text-[10px]" style={{ color: '#6b608c' }}>Niche Fit</div>
                      </div>
                      <div className="p-2 rounded-lg text-center" style={{ background: '#1a1535' }}>
                        <div className="text-xs font-semibold" style={{ color: '#ff6b6b' }}>{creator.budgetFit}%</div>
                        <div className="text-[10px]" style={{ color: '#6b608c' }}>Budget Fit</div>
                      </div>
                    </div>

                    {/* Value Range */}
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#2a2348' }}>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                        <span className="text-sm font-semibold text-[#f0e6ff]">
                          ₹{formatNumber(creator.valueRange.low)} – ₹{formatNumber(creator.valueRange.high)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#7c3aed' }}>
                        <TrendingUp className="w-3 h-3" />
                        {creator.engagementRate}% eng.
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="card-surface p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: '#1a1535' }}>
                <Search className="w-7 h-7" style={{ color: '#6b608c' }} />
              </div>
              <h3 className="text-lg font-semibold text-[#f0e6ff] mb-2">No creators found</h3>
              <p className="text-sm" style={{ color: '#9b8ec7' }}>
                {brandNiche
                  ? `No creators in "${brandNiche}" match your criteria. Try different keywords or adjust your budget.`
                  : brandKeywords
                    ? `No creators match "${brandKeywords}". Try different keywords or browse all industries.`
                    : 'No creators in the database. Try syncing a creator first.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State (before first search) */}
      {!searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-surface p-16 text-center"
          style={{ borderStyle: 'dashed', borderWidth: '1px', borderColor: '#2a2348' }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <Handshake className="w-10 h-10" style={{ color: '#7c3aed' }} />
          </div>
          <h2 className="text-xl font-bold text-[#f0e6ff] mb-3">Discover Creators for Your Brand</h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: '#9b8ec7' }}>
            Tell us about your brand — your industry, budget, and goals. We'll find the perfect creators ranked by match score.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { icon: Briefcase, label: 'Your Industry', desc: 'Select your niche' },
              { icon: DollarSign, label: 'Your Budget', desc: 'Set your range' },
              { icon: Star, label: 'Ranked Matches', desc: 'Sorted by fit' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#1a1535' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                  <item.icon className="w-5 h-5" style={{ color: '#7c3aed' }} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#f0e6ff]">{item.label}</div>
                  <div className="text-xs" style={{ color: '#6b608c' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
