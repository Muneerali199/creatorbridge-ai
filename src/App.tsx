import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import TrueScorePage from './pages/TrueScorePage';
import FraudShieldPage from './pages/FraudShieldPage';
import ROIForecastPage from './pages/ROIForecastPage';
import DealMatchPage from './pages/DealMatchPage';
import ValueCalculatorPage from './pages/ValueCalculatorPage';
import CommerceBridgePage from './pages/CommerceBridgePage';
import PricingPage from './pages/PricingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<TrueScorePage />} />
        <Route path="/dashboard/truescore" element={<TrueScorePage />} />
        <Route path="/dashboard/fraudshield" element={<FraudShieldPage />} />
        <Route path="/dashboard/roi" element={<ROIForecastPage />} />
        <Route path="/dashboard/dealmatch" element={<DealMatchPage />} />
        <Route path="/dashboard/calculator" element={<ValueCalculatorPage />} />
        <Route path="/dashboard/commerce" element={<CommerceBridgePage />} />
      </Route>
    </Routes>
  );
}

export default App;
