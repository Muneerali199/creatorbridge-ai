import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Star, Building2, ArrowRight, Crown, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Sparkles,
    price: '₹99',
    period: '/month',
    description: 'For small brands & startups',
    features: [
      'TrueScore Engine — 50 creator scans/mo',
      'FraudShield basic detection',
      'Brand discovery (1 niche)',
      'ROI forecast (3 campaigns)',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: '₹299',
    period: '/month',
    description: 'For growing brands & marketing teams',
    features: [
      'Unlimited TrueScore scans',
      'FraudShield + ML deep analysis',
      'Full brand discovery + keywords',
      'Unlimited ROI forecasts',
      'DealMatch (50 creators/mo)',
      'Value calculator & price benchmarks',
      'Priority support',
    ],
    cta: 'Go Pro',
    featured: true,
    badge: 'BEST VALUE',
  },
  {
    name: 'Agency',
    icon: Building2,
    price: '₹999',
    period: '/month',
    description: 'For agencies & enterprise teams',
    features: [
      'Everything in Pro',
      'Unlimited creator matches',
      'API access (5K calls/mo)',
      'White-label reports',
      'Team accounts (5 seats)',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

const comparisons = [
  { feature: 'TrueScore Scans', starter: '50/mo', pro: 'Unlimited', agency: 'Unlimited' },
  { feature: 'Fraud Detection', starter: 'Basic', pro: 'ML + Heuristic', agency: 'ML + Heuristic' },
  { feature: 'Brand Discovery', starter: 'Basic', pro: 'Full + Keywords', agency: 'Full + Keywords' },
  { feature: 'Creator Matches', starter: '10/mo', pro: '50/mo', agency: 'Unlimited' },
  { feature: 'API Access', starter: '—', pro: '—', agency: '5K calls/mo' },
  { feature: 'Team Seats', starter: '1', pro: '1', agency: '5' },
  { feature: 'Support', starter: 'Email', pro: 'Priority', agency: 'Dedicated manager' },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#0a0718' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: '#2a2348' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-[#f0e6ff]">CreatorBridge</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[#9b8ec7] hover:text-[#f0e6ff] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium uppercase tracking-[0.15em]" style={{ color: '#ff6b8a' }}>
            Pricing Plans
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Built for India. Priced for India.
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: '#9b8ec7' }}>
            Brand intelligence tools starting at just ₹99/mo — less than a cup of chai ☕
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card-surface p-8 flex flex-col relative ${plan.featured ? 'md:-mt-4 md:mb-4' : ''}`}
              style={plan.featured ? { border: '2px solid #ff6b8a' } : { border: '1px solid #2a2348' }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: '#ff6b8a' }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: plan.featured ? 'rgba(255,107,138,0.15)' : '#0a0718' }}
                >
                  <plan.icon className={`w-6 h-6 ${plan.featured ? 'text-[#ff6b8a]' : 'text-[#9b8ec7]'}`} />
                </div>
                <h3 className="text-xl font-bold text-[#f0e6ff]">{plan.name}</h3>
                <p className="text-sm mt-1" style={{ color: '#9b8ec7' }}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-sm" style={{ color: '#9b8ec7' }}>{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#34d399] mt-0.5 shrink-0" />
                    <span className="text-sm text-[#f0e6ff]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/dashboard')}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 ${plan.featured ? 'text-white' : 'text-[#f0e6ff]'}`}
                style={plan.featured ? { background: '#ff6b8a' } : { background: '#2a2348' }}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-surface p-8"
        >
          <h2 className="text-xl font-bold text-[#f0e6ff] mb-6 text-center">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: '#2a2348' }}>
                  <th className="text-left py-3 pr-4 text-[#9b8ec7] font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-[#f0e6ff] font-semibold">Starter</th>
                  <th className="text-center py-3 px-4 text-[#ff6b8a] font-semibold">Pro</th>
                  <th className="text-center py-3 pl-4 text-[#f0e6ff] font-semibold">Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <tr key={row.feature} className="border-b" style={{ borderColor: '#2a2348' }}>
                    <td className="py-3 pr-4 text-[#f0e6ff]">{row.feature}</td>
                    <td className="text-center py-3 px-4 text-[#9b8ec7]">{row.starter}</td>
                    <td className="text-center py-3 px-4 text-white">{row.pro}</td>
                    <td className="text-center py-3 pl-4 text-[#9b8ec7]">{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm" style={{ color: '#9b8ec7' }}>
            All plans include a 7-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
