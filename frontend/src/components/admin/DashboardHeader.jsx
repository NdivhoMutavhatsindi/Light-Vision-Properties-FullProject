import { Search, Menu } from 'lucide-react';
import { useContext } from 'react';
import AdminSidebarContext from '../../context/AdminSidebarContext';

export default function DashboardHeader({ title }) {
  const { toggleSidebar } = useContext(AdminSidebarContext) || {};
  

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20" style={{ boxShadow: '0 1px 8px rgba(15,27,61,0.06)' }}>
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex lg:hidden items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-2 text-navy hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-serif font-semibold text-navy-900">{title}</h1>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="Search..." className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full" />
        </div>
      </div>
    </header>
  );
}
