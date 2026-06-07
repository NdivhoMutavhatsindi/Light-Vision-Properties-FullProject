import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, Briefcase, MessageSquare,
  TrendingUp, Shield, Scale, FileText, Settings, ChevronLeft,
  ChevronRight, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Agents', href: '/admin/agents', icon: Users },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Valuations', href: '/admin/valuations', icon: TrendingUp },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Compliance', href: '/admin/compliance', icon: Shield },
  { label: 'Legal', href: '/admin/legal', icon: Scale },
  { label: 'Offers', href: '/admin/offers', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function DashboardSidebar({ mobile = false, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = mobile;

  return (
    <motion.aside
      initial={isMobile ? { x: -320 } : false}
      animate={isMobile ? { x: 0 } : { width: collapsed ? 72 : 260 }}
      exit={isMobile ? { x: -320 } : undefined}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`bg-navy-950 flex flex-col overflow-hidden ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'h-screen w-[260px] sticky top-0'} ${isMobile ? 'shadow-2xl' : ''}`}
    >
      {isMobile && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      )}

      <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <img src="/LOGO.png" alt="LVP" className="h-10 w-10 flex-shrink-0 brightness-0 invert" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white font-serif font-semibold text-sm leading-tight">Light Vision</p>
              <p className="text-gold-500 text-xs tracking-widest">PROPERTY ADMIN</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 mb-0.5 group ${
                active
                  ? 'bg-gold-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-2 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-sm">Back to Site</span>}
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className={`flex items-center gap-3 w-full px-2 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 hidden lg:flex -translate-y-1/2 w-6 h-6 bg-navy-900 border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
