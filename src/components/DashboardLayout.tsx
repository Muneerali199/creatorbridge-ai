import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Gauge,
  ShieldCheck,
  TrendingUp,
  Handshake,
  Calculator,
  ShoppingCart,
  Settings,
  HelpCircle,
  Menu,
  X,
  Search,
  Bell,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { label: 'TrueScore', icon: Gauge, path: '/dashboard/truescore' },
  { label: 'FraudShield', icon: ShieldCheck, path: '/dashboard/fraudshield' },
  { label: 'ROI Forecast', icon: TrendingUp, path: '/dashboard/roi' },
  { label: 'DealMatch', icon: Handshake, path: '/dashboard/dealmatch' },
  { label: 'Value Calculator', icon: Calculator, path: '/dashboard/calculator' },
  { label: 'Commerce Bridge', icon: ShoppingCart, path: '/dashboard/commerce' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, path: '#' },
  { label: 'Help', icon: HelpCircle, path: '#' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#0a0718' }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col border-r transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: '#14102a', borderColor: '#2a2348' }}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center">
            <Gauge className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-[#f0e6ff]">CreatorBridge</span>
          <button
            className="lg:hidden ml-auto text-[#9b8ec7]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[#ff6b8a33] text-[#ff6b8a] border-l-[3px] border-[#ff6b8a]'
                    : 'text-[#9b8ec7] hover:bg-[#2a2348]/50 hover:text-[#f0e6ff]'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-6 space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9b8ec7] hover:bg-[#2a2348]/50 hover:text-[#f0e6ff] transition-all"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header
          className="flex items-center gap-4 px-4 lg:px-8 py-4 border-b"
          style={{ borderColor: '#2a2348' }}
        >
          <button
            className="lg:hidden text-[#9b8ec7] p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-[#9b8ec7] hover:text-[#f0e6ff] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-3 glass-panel rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-[#9b8ec7]" />
            <input
              type="text"
              placeholder="Search creators..."
              className="bg-transparent text-sm text-[#f0e6ff] placeholder-[#9b8ec7] outline-none w-48"
            />
          </div>

          <button className="relative p-2 text-[#9b8ec7] hover:text-[#f0e6ff] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff6b8a] rounded-full" />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b8a] to-[#9b8ec7] flex items-center justify-center text-white text-sm font-bold">
            B
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
