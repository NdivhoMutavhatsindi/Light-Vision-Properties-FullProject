import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from '../components/admin/DashboardSidebar';
import AdminSidebarContext from '../context/AdminSidebarContext';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/admin/login' });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-600">Checking admin session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="lg:flex lg:min-h-screen">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        <div className="flex-1 min-h-screen overflow-y-auto">
          <AdminSidebarContext.Provider value={{ toggleSidebar: () => setSidebarOpen(true) }}>
            <Outlet />
          </AdminSidebarContext.Provider>
        </div>
      </div>
    </div>
  );
}
