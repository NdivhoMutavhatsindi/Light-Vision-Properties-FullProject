import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import AdminLayout from './layouts/AdminLayout';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import ValuationPage from './pages/ValuationPage';
import BondCalculatorPage from './pages/BondCalculatorPage';
import CompliancePage from './pages/CompliancePage';
import LegalPage from './pages/LegalPage';
import OfferToPurchasePage from './pages/OfferToPurchasePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminAgents from './pages/admin/AdminAgents';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminValuations from './pages/admin/AdminValuations';
import AdminCareers from './pages/admin/AdminCareers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AgentCompliance from './pages/admin/AgentCompliance';
import AgentLegal from './pages/admin/AgentLegal';
import AgentOffer from './pages/admin/AgentOffer';

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

    return (
      <AuthProvider>
        {!isAdminPath && <Navbar />}
        <Outlet />
        {!isAdminPath && <Footer />}
        {!isAdminPath && <WhatsAppButton />}
      </AuthProvider>
    );
  },
});

// Public Routes
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const propertiesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/properties', component: PropertiesPage });
const propertyDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/properties/$id', component: PropertyDetailPage });
const agentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/agents', component: AgentsPage });
const agentDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/agents/$id', component: AgentDetailPage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/services', component: ServicesPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage });
const careersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/careers', component: CareersPage });
const valuationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/valuation', component: ValuationPage });
const bondCalcRoute = createRoute({ getParentRoute: () => rootRoute, path: '/bond-calculator', component: BondCalculatorPage });
const complianceRoute = createRoute({ getParentRoute: () => rootRoute, path: '/compliance', component: CompliancePage });
const legalRoute = createRoute({ getParentRoute: () => rootRoute, path: '/legal', component: LegalPage });
const otpRoute = createRoute({ getParentRoute: () => rootRoute, path: '/offer-to-purchase', component: OfferToPurchasePage });

// Admin Login (public)
const adminLoginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin/login', component: AdminLogin });

// Admin Layout Route
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => {
    // Override root layout for admin
    return <AdminLayout />;
  },
});

// Admin Child Routes
const adminIndexRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/', component: AdminDashboard });
const adminPropertiesRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/properties', component: AdminProperties });
const adminAgentsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/agents', component: AdminAgents });
const adminInquiriesRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/inquiries', component: AdminInquiries });
const adminValuationsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/valuations', component: AdminValuations });
const adminCareersRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/careers', component: AdminCareers });
const adminComplianceRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/compliance', component: AgentCompliance });
const adminLegalRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/legal', component: AgentLegal });
const adminOffersRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/offers', component: AgentOffer });
const adminSettingsRoute = createRoute({ getParentRoute: () => adminLayoutRoute, path: '/settings', component: AdminSettings });

const routeTree = rootRoute.addChildren([
  homeRoute,
  propertiesRoute,
  propertyDetailRoute,
  agentsRoute,
  agentDetailRoute,
  aboutRoute,
  servicesRoute,
  contactRoute,
  careersRoute,
  valuationRoute,
  bondCalcRoute,
  complianceRoute,
  legalRoute,
  otpRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminPropertiesRoute,
    adminAgentsRoute,
    adminInquiriesRoute,
    adminValuationsRoute,
    adminCareersRoute,
    adminComplianceRoute,
    adminLegalRoute,
    adminOffersRoute,
    adminSettingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });
