import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Star, Building2, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Brand SaaS',
    icon: Building2,
    price: '$49',
    period: '/mo',
    description: 'For brands scaling creator marketing',
    features: [
      'TrueScore Engine access',
      'FraudShield detection',
      'ROI Forecast (5 campaigns/mo)',
      'DealMatch (10 creators/mo)',
      'Email support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Creator Marketplace',
    icon: Star,
    price: 'Free',
    period: ' + $9/mo Pro',
    description: 'For creators seeking brand deals',
    features: [
      'Profile & analytics dashboard',
      'Brand discovery',
      'Deal negotiation tools',
      '3-5% deal fee',
      'Priority matching',
    ],
    cta: 'Join as Creator',
    featured: true,
    badge: 'POPULAR',
  },
  {
    name: 'Agency API',
    icon: Zap,
    price: '$299',
    period: '/mo',
    description: 'For agencies managing at scale',
    features: [
      'All Brand SaaS features',
      'API access (10K calls/mo)',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#0a0718' }}>
      {/* Header */}
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
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: '#9b8ec7' }}>
            Built for every player in the creator economy — brands, creators, and agencies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card-surface p-8 flex flex-col relative ${
                plan.featured ? 'md:-mt-4 md:mb-4 ring-2' : ''
              }`}
              style={plan.featured ? { outlineColor: '#ff6b8a', outlineWidth: '2px', outlineStyle: 'solid' } : {}}
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
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 ${
                  plan.featured ? 'text-white' : 'text-[#f0e6ff]'
                }`}
                style={plan.featured ? { background: '#ff6b8a' } : { background: '#2a2348' }}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ-style note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm" style={{ color: '#9b8ec7' }}>
            All plans include access to the core analytics dashboard. No credit card required for trial.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
